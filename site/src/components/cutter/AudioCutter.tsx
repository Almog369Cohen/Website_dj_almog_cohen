"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

/* ─── Types ─── */
type ExportFormat = "wav" | "mp3" | "aiff";

type RegionLike = {
  id: string;
  start: number;
  end: number;
  setOptions: (opts: Partial<{ start: number; end: number; drag: boolean; resize: boolean; color: string }>) => void;
  play: () => void;
  remove: () => void;
};

type FileInfo = {
  name: string;
  sampleRate: number;
  channels: number;
  format: string;
};

const MAX_CLIP_SEC = 60;

/* ─── Icons (inline SVG, no extra dep) ─── */
function IconPlay({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconPause({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
function IconRepeat({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
function IconScissors({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}
function IconDownload({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconZoomIn({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}
function IconZoomOut({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}
function IconUpload({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconWaveform({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="24" x2="4" y2="24" /><line x1="8" y1="18" x2="8" y2="30" /><line x1="12" y1="12" x2="12" y2="36" />
      <line x1="16" y1="8" x2="16" y2="40" /><line x1="20" y1="14" x2="20" y2="34" /><line x1="24" y1="6" x2="24" y2="42" />
      <line x1="28" y1="10" x2="28" y2="38" /><line x1="32" y1="16" x2="32" y2="32" /><line x1="36" y1="8" x2="36" y2="40" />
      <line x1="40" y1="14" x2="40" y2="34" /><line x1="44" y1="20" x2="44" y2="28" />
    </svg>
  );
}
function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─── Utilities ─── */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function formatTime(sec: number, precise = false): string {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (precise) {
    return `${m}:${r.toFixed(1).padStart(4, "0")}`;
  }
  return `${m}:${Math.floor(r).toString().padStart(2, "0")}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function floatToInt16Sample(v: number): number {
  const c = Math.max(-1, Math.min(1, v));
  return c < 0 ? Math.round(c * 0x8000) : Math.round(c * 0x7fff);
}

function getBaseFilename(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "audio";
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) return trimmed;
  return trimmed.slice(0, dot);
}

function getFormatFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = { mp3: "MP3", wav: "WAV", m4a: "M4A/AAC", flac: "FLAC", aiff: "AIFF", aif: "AIFF", ogg: "OGG", wma: "WMA" };
  return map[ext] || ext.toUpperCase() || "—";
}

/* ─── WAV Encoder ─── */
function encodeWavFromBuffer(buf: AudioBuffer, startSec: number, endSec: number): Blob {
  const sr = buf.sampleRate;
  const ch = buf.numberOfChannels;
  const s0 = Math.floor(startSec * sr);
  const s1 = Math.floor(endSec * sr);
  const fc = Math.max(0, s1 - s0);
  const bps = 2;
  const ba = ch * bps;
  const br = sr * ba;
  const ds = fc * ba;
  const ab = new ArrayBuffer(44 + ds);
  const v = new DataView(ab);
  let o = 0;
  const ws = (s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); o += s.length; };
  ws("RIFF"); v.setUint32(o, 36 + ds, true); o += 4;
  ws("WAVE"); ws("fmt ");
  v.setUint32(o, 16, true); o += 4;
  v.setUint16(o, 1, true); o += 2;
  v.setUint16(o, ch, true); o += 2;
  v.setUint32(o, sr, true); o += 4;
  v.setUint32(o, br, true); o += 4;
  v.setUint16(o, ba, true); o += 2;
  v.setUint16(o, 16, true); o += 2;
  ws("data"); v.setUint32(o, ds, true); o += 4;
  for (let i = 0; i < fc; i++) {
    for (let c = 0; c < ch; c++) {
      v.setInt16(o, floatToInt16Sample(buf.getChannelData(c)[s0 + i] ?? 0), true);
      o += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

/* ─── AIFF Encoder (correct IEEE 754 Extended 80-bit) ─── */
function writeExtended80(view: DataView, offset: number, rate: number) {
  if (rate === 0) { for (let i = 0; i < 10; i++) view.setUint8(offset + i, 0); return; }
  let sign = 0;
  if (rate < 0) { sign = 1; rate = -rate; }
  let exp = Math.floor(Math.log2(rate));
  let mantissa = rate / Math.pow(2, exp);
  exp += 16383;
  if (exp >= 0x7fff) { exp = 0x7fff; mantissa = 1.0; }
  if (exp < 0) { exp = 0; mantissa = 0; }
  const hi = Math.round(mantissa * 0x80000000) >>> 0;
  const lo = 0;
  view.setUint16(offset, (sign << 15) | (exp & 0x7fff), false);
  view.setUint32(offset + 2, hi, false);
  view.setUint32(offset + 6, lo, false);
}

function encodeAiffFromBuffer(buf: AudioBuffer, startSec: number, endSec: number): Blob {
  const sr = buf.sampleRate;
  const ch = buf.numberOfChannels;
  const s0 = Math.floor(startSec * sr);
  const s1 = Math.floor(endSec * sr);
  const fc = Math.max(0, s1 - s0);
  const ds = fc * ch * 2;
  const hSize = 54;
  const ab = new ArrayBuffer(hSize + ds);
  const v = new DataView(ab);
  let o = 0;
  const ws = (s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); o += s.length; };
  const w32 = (val: number) => { v.setUint32(o, val, false); o += 4; };
  const w16 = (val: number) => { v.setUint16(o, val, false); o += 2; };
  ws("FORM"); w32(hSize + ds - 8); ws("AIFF");
  ws("COMM"); w32(18); w16(ch); w32(fc); w16(16);
  writeExtended80(v, o, sr); o += 10;
  ws("SSND"); w32(ds + 8); w32(0); w32(0);
  for (let i = 0; i < fc; i++) {
    for (let c = 0; c < ch; c++) {
      v.setInt16(o, floatToInt16Sample(buf.getChannelData(c)[s0 + i] ?? 0), false);
      o += 2;
    }
  }
  return new Blob([ab], { type: "audio/aiff" });
}

/* ─── MP3 Encoder (320 kbps via lamejs, lazy-loaded) ─── */
async function encodeMp3FromBuffer(buf: AudioBuffer, startSec: number, endSec: number): Promise<Blob> {
  const lame = await import("lamejs");
  const Mp3Encoder = (lame as unknown as { Mp3Encoder: new (ch: number, sr: number, kbps: number) => unknown }).Mp3Encoder;
  const sr = buf.sampleRate;
  const ch = buf.numberOfChannels;
  const s0 = Math.floor(startSec * sr);
  const s1 = Math.floor(endSec * sr);
  const fc = Math.max(0, s1 - s0);
  const enc = new (Mp3Encoder as any)(ch, sr, 320);
  const chunks: Uint8Array[] = [];
  const chData: Int16Array[] = [];
  for (let c = 0; c < ch; c++) {
    const src = buf.getChannelData(c);
    const dst = new Int16Array(fc);
    for (let i = 0; i < fc; i++) dst[i] = floatToInt16Sample(src[s0 + i] ?? 0);
    chData.push(dst);
  }
  const bs = 1152;
  for (let i = 0; i < fc; i += bs) {
    const n = Math.min(bs, fc - i);
    const l = chData[0].subarray(i, i + n);
    const r = ch > 1 ? chData[1].subarray(i, i + n) : undefined;
    const b: Uint8Array = r ? enc.encodeBuffer(l, r) : enc.encodeBuffer(l);
    if (b.length) chunks.push(Uint8Array.from(b));
  }
  const tail: Uint8Array = enc.flush();
  if (tail.length) chunks.push(Uint8Array.from(tail));
  return new Blob(chunks as unknown as BlobPart[], { type: "audio/mpeg" });
}

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
export function AudioCutter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<any>(null);
  const regionRef = useRef<RegionLike | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const audioBufferCacheRef = useRef<AudioBuffer | null>(null);
  const zoomRef = useRef(50);

  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [durationSec, setDurationSec] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);
  const [selStartSec, setSelStartSec] = useState(0);
  const [selEndSec, setSelEndSec] = useState(0);

  const [zoomPxPerSec, setZoomPxPerSec] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  const [exportFormat, setExportFormat] = useState<ExportFormat>("wav");
  const [isExporting, setIsExporting] = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);

  const selectedDuration = Math.max(0, selEndSec - selStartSec);
  const canExport = !!file && durationSec > 0 && selectedDuration > 0 && selectedDuration <= MAX_CLIP_SEC && !isDecoding && !isExporting;

  const selectionLabel = useMemo(() => {
    if (!durationSec) return "";
    return `${formatTime(selStartSec, true)} – ${formatTime(selEndSec, true)}  (${formatTime(selectedDuration, true)})`;
  }, [durationSec, selStartSec, selEndSec, selectedDuration]);

  /* ── Helpers ── */
  const ensureLimit = useCallback((start: number, end: number) => {
    if (end - start <= MAX_CLIP_SEC) return { start, end };
    return { start, end: start + MAX_CLIP_SEC };
  }, []);

  const syncRegion = useCallback((reg: RegionLike) => {
    const lim = ensureLimit(reg.start, reg.end);
    if (lim.start !== reg.start || lim.end !== reg.end) {
      reg.setOptions({ start: lim.start, end: lim.end });
    }
    setSelStartSec(lim.start);
    setSelEndSec(lim.end);
  }, [ensureLimit]);

  /* ── Cleanup ── */
  const clearWavesurfer = useCallback(() => {
    regionRef.current = null;
    regionsPluginRef.current = null;
    if (wavesurferRef.current) { wavesurferRef.current.destroy(); wavesurferRef.current = null; }
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    audioBufferCacheRef.current = null;
    setDurationSec(0);
    setCurrentSec(0);
    setSelStartSec(0);
    setSelEndSec(0);
    setIsPlaying(false);
    setFileInfo(null);
    setStatusMsg(null);
  }, []);

  /* ── Load file ── */
  const loadFile = useCallback(async (nextFile: File) => {
    setError(null);
    setIsDecoding(true);
    setStatusMsg("מפענח אודיו…");
    clearWavesurfer();
    setFile(nextFile);

    const url = URL.createObjectURL(nextFile);
    objectUrlRef.current = url;

    try {
      const ws = WaveSurfer.create({
        container: containerRef.current as HTMLDivElement,
        waveColor: "rgba(255,255,255,0.25)",
        progressColor: "rgba(5,156,192,0.85)",
        cursorColor: "#fff",
        cursorWidth: 2,
        height: 140,
        normalize: true,
        autoScroll: true,
        minPxPerSec: zoomRef.current,
      });

      const regions = ws.registerPlugin(RegionsPlugin.create() as any) as any;
      wavesurferRef.current = ws;
      regionsPluginRef.current = regions;

      ws.on("ready", () => {
        const dur = ws.getDuration();
        setDurationSec(dur);

        const reg = regions.addRegion({
          start: 0,
          end: Math.min(dur, MAX_CLIP_SEC),
          color: "rgba(5,156,192,0.22)",
          drag: true,
          resize: true,
        }) as RegionLike;
        regionRef.current = reg;
        syncRegion(reg);
        setIsDecoding(false);
        setStatusMsg(null);

        setFileInfo({
          name: nextFile.name,
          sampleRate: 0,
          channels: 0,
          format: getFormatFromName(nextFile.name),
        });

        const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetch(url).then(r => r.arrayBuffer()).then(ab => actx.decodeAudioData(ab.slice(0))).then(decoded => {
          audioBufferCacheRef.current = decoded;
          setFileInfo(prev => prev ? { ...prev, sampleRate: decoded.sampleRate, channels: decoded.numberOfChannels } : prev);
          void actx.close();
        }).catch(() => { /* non-critical */ });
      });

      ws.on("error", (e: unknown) => {
        setError(typeof e === "string" ? e : "שגיאה בטעינת הקובץ");
        setIsDecoding(false);
        setStatusMsg(null);
      });

      ws.on("timeupdate", (t: number) => setCurrentSec(t));
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => setIsPlaying(false));

      regions.on("region-created", (reg: RegionLike) => {
        if (regionRef.current && regionRef.current.id !== reg.id) {
          reg.remove();
        }
      });

      regions.on("region-updated", (reg: RegionLike) => {
        if (regionRef.current?.id === reg.id) syncRegion(reg);
      });

      regions.on("region-update-end", (reg: RegionLike) => {
        if (regionRef.current?.id === reg.id) syncRegion(reg);
      });

      ws.load(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה ביצירת הנגן");
      setIsDecoding(false);
      setStatusMsg(null);
    }
  }, [clearWavesurfer, syncRegion]);

  /* ── Zoom sync (via ref to avoid stale closure) ── */
  useEffect(() => { zoomRef.current = zoomPxPerSec; }, [zoomPxPerSec]);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (ws) ws.setOptions({ minPxPerSec: zoomPxPerSec });
  }, [zoomPxPerSec]);

  useEffect(() => () => { clearWavesurfer(); }, [clearWavesurfer]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const ws = wavesurferRef.current;
      if (!ws || !durationSec) return;

      if (e.code === "Space") { e.preventDefault(); ws.playPause(); }
      else if (e.key === "Enter") { e.preventDefault(); regionRef.current?.play(); setIsPlaying(true); }
      else if (e.key === "r" || e.key === "R" || e.key === "ר") { e.preventDefault(); resetSelection(); }
      else if (e.key === "Escape") { e.preventDefault(); if (ws.isPlaying()) ws.playPause(); setIsPlaying(false); }
      else if (e.key === "=" || e.key === "+") { e.preventDefault(); setZoomPxPerSec(z => Math.min(300, z + 20)); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); setZoomPxPerSec(z => Math.max(10, z - 20)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [durationSec]);

  /* ── Actions ── */
  const handlePickFile = useCallback((f: File | null | undefined) => {
    if (f) void loadFile(f);
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void loadFile(f);
  }, [loadFile]);

  const togglePlay = useCallback(() => { wavesurferRef.current?.playPause(); }, []);

  const playSelection = useCallback(() => {
    regionRef.current?.play();
    setIsPlaying(true);
  }, []);

  const resetSelection = useCallback(() => {
    const ws = wavesurferRef.current;
    const reg = regionRef.current;
    if (!ws || !reg) return;
    const dur = ws.getDuration();
    reg.setOptions({ start: 0, end: Math.min(dur, MAX_CLIP_SEC) });
    setSelStartSec(0);
    setSelEndSec(Math.min(dur, MAX_CLIP_SEC));
    ws.setTime(0);
  }, []);

  const exportSelection = useCallback(async () => {
    if (!file) return;
    setIsExporting(true);
    setError(null);
    setStatusMsg("מייצא…");

    try {
      let audioBuffer = audioBufferCacheRef.current;
      if (!audioBuffer) {
        const url = objectUrlRef.current;
        if (!url) throw new Error("קובץ לא נטען");
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioBuffer = await ctx.decodeAudioData(arrayBuf.slice(0));
        audioBufferCacheRef.current = audioBuffer;
        void ctx.close();
      }

      const start = clamp(selStartSec, 0, audioBuffer.duration);
      const end = clamp(selEndSec, start, Math.min(audioBuffer.duration, start + MAX_CLIP_SEC));
      const base = getBaseFilename(file.name);
      const filename = `${base}_trimmed.${exportFormat}`;

      if (exportFormat === "wav") {
        downloadBlob(encodeWavFromBuffer(audioBuffer, start, end), filename);
      } else if (exportFormat === "aiff") {
        downloadBlob(encodeAiffFromBuffer(audioBuffer, start, end), filename);
      } else if (exportFormat === "mp3") {
        setStatusMsg("מקודד MP3 (320kbps)…");
        downloadBlob(await encodeMp3FromBuffer(audioBuffer, start, end), filename);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בייצוא");
    } finally {
      setIsExporting(false);
      setStatusMsg(null);
    }
  }, [exportFormat, file, selEndSec, selStartSec]);

  /* ── Zoom helpers ── */
  const zoomIn = useCallback(() => setZoomPxPerSec(z => Math.min(300, z + 20)), []);
  const zoomOut = useCallback(() => setZoomPxPerSec(z => Math.max(10, z - 20)), []);

  /* ═══════ Render ═══════ */
  const hasFile = !!file;

  return (
    <section className="flex flex-col gap-4" role="application" aria-label="חותך אודיו">
      {/* ── Upload Zone ── */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-6 transition-all duration-200 ${isDragOver
          ? "border-brand-blue bg-brand-blue/10 scale-[1.01]"
          : "border-white/15 bg-white/[0.03] hover:border-white/25"
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        role="group"
        aria-label="אזור העלאת קובץ"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className={`transition-transform duration-200 ${isDragOver ? "scale-110" : ""}`}>
            <IconUpload className="mx-auto w-8 h-8 text-white/40" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground-heading">
              {isDragOver ? "שחררו כדי להעלות" : "גררו קובץ אודיו לכאן"}
            </div>
            <div className="mt-1 text-xs text-foreground-secondary">
              mp3 / wav / m4a / flac / aiff — עד 400MB
            </div>
          </div>
          <label className="glass-button mt-1 inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 text-sm font-bold text-foreground-heading">
            <IconUpload className="w-4 h-4" />
            בחירת קובץ
            <input
              type="file"
              className="sr-only"
              accept="audio/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                handlePickFile(f);
              }}
            />
          </label>
        </div>

        {file && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-foreground-secondary" dir="ltr">
            <span className="font-medium text-white/80">{file.name}</span>
            {fileInfo?.format && <span>{fileInfo.format}</span>}
            {fileInfo && fileInfo.sampleRate > 0 && <span>{fileInfo.sampleRate / 1000}kHz</span>}
            {fileInfo && fileInfo.channels > 0 && <span>{fileInfo.channels === 1 ? "Mono" : fileInfo.channels === 2 ? "Stereo" : `${fileInfo.channels}ch`}</span>}
          </div>
        )}

        {error && (
          <div className="mt-3 text-center text-sm font-medium" style={{ color: "#ff4466" }} role="alert">
            {error}
          </div>
        )}
      </div>

      {/* ── Waveform + Controls ── */}
      <div className="glass-panel rounded-2xl p-3 md:p-5">
        <div className="flex flex-col gap-3">

          {/* Info bar */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs" dir="ltr">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
                <span className="text-white/50">אורך</span>
                <span className="font-mono font-medium text-white">{durationSec ? formatTime(durationSec) : "—"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
                <span className="text-white/50">מיקום</span>
                <span className="font-mono font-medium text-white">{durationSec ? formatTime(currentSec, true) : "—"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1">
                <IconScissors className="w-3 h-3 text-brand-blue" />
                <span className="font-mono font-medium text-white">{durationSec ? selectionLabel : "—"}</span>
              </span>
              {durationSec > 0 && selectedDuration > MAX_CLIP_SEC && (
                <span className="text-[11px] font-medium" style={{ color: "#ffaa00" }} role="alert">
                  מקסימום {MAX_CLIP_SEC} שניות
                </span>
              )}
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={zoomOut} className="rounded-lg bg-white/5 p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition" aria-label="הקטן זום">
                <IconZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range" min={10} max={300} value={zoomPxPerSec}
                onChange={(e) => setZoomPxPerSec(Number(e.target.value))}
                className="w-24 md:w-36 accent-brand-blue h-1"
                aria-label="רמת זום"
              />
              <button type="button" onClick={zoomIn} className="rounded-lg bg-white/5 p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition" aria-label="הגדל זום">
                <IconZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Waveform */}
          <div className="relative rounded-xl border border-white/10 bg-black/50 overflow-hidden" style={{ minHeight: hasFile ? undefined : 160 }}>
            {!hasFile && !isDecoding && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20">
                <IconWaveform className="w-16 h-16 opacity-40" />
                <span className="text-sm">העלו קובץ כדי לראות את הגל</span>
              </div>
            )}
            {isDecoding && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60">
                <Spinner className="w-6 h-6 text-brand-blue" />
                <span className="text-sm text-white/70">{statusMsg || "טוען…"}</span>
              </div>
            )}
            <div ref={containerRef} className="w-full" />
          </div>

          {/* Playback + Export controls */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button" onClick={togglePlay}
                disabled={!durationSec || isDecoding}
                aria-label={isPlaying ? "השהה ניגון" : "נגן את כל השיר"}
                className="glass-button inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-sm font-bold text-foreground-heading disabled:opacity-40"
              >
                {isPlaying ? <IconPause className="w-4 h-4" /> : <IconPlay className="w-4 h-4" />}
                {isPlaying ? "השהה" : "נגן"}
              </button>
              <button
                type="button" onClick={playSelection}
                disabled={!durationSec || isDecoding}
                aria-label="נגן את הקטע הנבחר"
                className="glass-button inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-sm font-bold text-foreground-heading disabled:opacity-40"
              >
                <IconScissors className="w-4 h-4" />
                נגן קטע
              </button>
              <button
                type="button" onClick={resetSelection}
                disabled={!durationSec || isDecoding}
                aria-label="איפוס בחירה לתחילת השיר"
                className="glass-button inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-sm font-bold text-foreground-heading disabled:opacity-40"
              >
                <IconRepeat className="w-4 h-4" />
                איפוס
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                id="export-format" value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                aria-label="פורמט ייצוא"
                className="min-h-[44px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                dir="ltr"
              >
                <option value="wav">WAV (Lossless)</option>
                <option value="mp3">MP3 320kbps</option>
                <option value="aiff">AIFF (Lossless)</option>
              </select>

              <button
                type="button"
                onClick={() => void exportSelection()}
                disabled={!canExport}
                aria-label={`הורד קובץ חתוך בפורמט ${exportFormat.toUpperCase()}`}
                className="btn-neon inline-flex min-h-[44px] items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isExporting ? <Spinner className="w-4 h-4" /> : <IconDownload className="w-4 h-4" />}
                {isExporting ? (statusMsg || "מייצא…") : "הורד"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between text-[11px] text-white/40">
            <span>הכל רץ בדפדפן — לא מעלים קבצים לשרת.</span>
            <span dir="ltr" className="hidden md:inline">
              Space = נגן · Enter = נגן קטע · R = איפוס · +/- = זום
            </span>
          </div>

          {/* ARIA live status */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {statusMsg}
          </div>
        </div>
      </div>
    </section>
  );
}
