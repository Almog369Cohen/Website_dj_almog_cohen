"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { Play, Pause, RotateCcw } from "lucide-react";

type RegionLike = {
  id: string;
  start: number;
  end: number;
  setOptions: (opts: Partial<{ start: number; end: number }>) => void;
  play: () => void;
  remove: () => void;
};

interface ClipTrimmerProps {
  audioUrl: string;
  clipStartSec: number;
  clipEndSec: number;
  maxClipDuration?: number;
  onChange: (start: number, end: number) => void;
  onDurationDetected?: (duration: number) => void;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
}

export function ClipTrimmer({
  audioUrl,
  clipStartSec,
  clipEndSec,
  maxClipDuration = 60,
  onChange,
  onDurationDetected,
}: ClipTrimmerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const regionRef = useRef<RegionLike | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clipDuration = Math.max(0, clipEndSec - clipStartSec);

  // Sync region from external props when they change
  const syncFromProps = useCallback((start: number, end: number) => {
    const reg = regionRef.current;
    if (!reg) return;
    if (Math.abs(reg.start - start) > 0.05 || Math.abs(reg.end - end) > 0.05) {
      reg.setOptions({ start, end });
    }
  }, []);

  useEffect(() => {
    syncFromProps(clipStartSec, clipEndSec);
  }, [clipStartSec, clipEndSec, syncFromProps]);

  // Init wavesurfer
  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    setIsLoading(true);
    setIsReady(false);
    setError(null);
    setIsPlaying(false);

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(255,255,255,0.18)",
      progressColor: "rgba(5,156,192,0.6)",
      cursorColor: "#fff",
      cursorWidth: 1,
      height: 64,
      normalize: true,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      interact: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regions = ws.registerPlugin(RegionsPlugin.create() as any) as any;
    wsRef.current = ws;

    ws.on("ready", () => {
      const dur = ws.getDuration();
      setDuration(dur);
      setIsLoading(false);
      setIsReady(true);
      onDurationDetected?.(dur);

      const start = Math.min(clipStartSec, Math.max(0, dur - 1));
      const end = Math.min(clipEndSec, dur, start + maxClipDuration);

      const reg = regions.addRegion({
        start,
        end: Math.max(end, start + 0.5),
        color: "rgba(5,156,192,0.18)",
        drag: true,
        resize: true,
      }) as RegionLike;
      regionRef.current = reg;
      onChangeRef.current(reg.start, reg.end);
    });

    ws.on("error", () => {
      setError("שגיאה בטעינת הקובץ");
      setIsLoading(false);
    });

    ws.on("timeupdate", (t: number) => setCurrentTime(t));
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));

    // Prevent creating extra regions
    regions.on("region-created", (reg: RegionLike) => {
      if (regionRef.current && regionRef.current.id !== reg.id) {
        reg.remove();
      }
    });

    // Sync region changes back to parent
    const handleRegionChange = (reg: RegionLike) => {
      if (regionRef.current?.id !== reg.id) return;
      const { start } = reg;
      let { end } = reg;
      // Enforce max clip duration
      if (end - start > maxClipDuration) {
        end = start + maxClipDuration;
        reg.setOptions({ start, end });
      }
      onChangeRef.current(start, end);
    };

    regions.on("region-updated", handleRegionChange);
    regions.on("region-update-end", handleRegionChange);

    ws.load(audioUrl);

    return () => {
      regionRef.current = null;
      ws.destroy();
      wsRef.current = null;
    };
    // Only re-init when URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  const playClip = useCallback(() => {
    const reg = regionRef.current;
    if (!reg) return;
    reg.play();
    setIsPlaying(true);
  }, []);

  const resetRegion = useCallback(() => {
    const ws = wsRef.current;
    const reg = regionRef.current;
    if (!ws || !reg) return;
    const dur = ws.getDuration();
    const start = 0;
    const end = Math.min(dur, maxClipDuration);
    reg.setOptions({ start, end });
    onChangeRef.current(start, end);
    ws.setTime(0);
  }, [maxClipDuration]);

  if (error) {
    return (
      <div className="p-3 rounded-xl border border-glass/50 text-center text-xs" style={{ color: "var(--accent-danger)" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl border border-glass/50 space-y-2.5" style={{ background: "rgba(3,178,140,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-brand-green">
          חיתוך קטע
        </span>
        <span className="text-[11px] text-muted font-mono" dir="ltr">
          {formatTime(clipStartSec)} – {formatTime(clipEndSec)}
          <span className="mr-1 text-brand-green">({clipDuration.toFixed(1)}s)</span>
        </span>
      </div>

      {/* Waveform */}
      <div className="relative rounded-lg overflow-hidden border border-glass/30" style={{ background: "rgba(0,0,0,0.25)" }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <svg className="w-5 h-5 animate-spin text-brand-blue" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        <div ref={containerRef} className="w-full" />
        {/* Time labels */}
        {isReady && (
          <>
            <div className="absolute bottom-0.5 left-1.5 text-[8px] font-mono text-white/30">0:00</div>
            <div className="absolute bottom-0.5 right-1.5 text-[8px] font-mono text-white/30">{formatTime(duration)}</div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={playClip}
          disabled={!isReady}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, rgba(255,68,102,0.12), rgba(255,68,102,0.04))"
              : "linear-gradient(135deg, rgba(5,156,192,0.12), rgba(3,178,140,0.04))",
            color: isPlaying ? "var(--accent-danger)" : "var(--accent-primary, #059cc0)",
          }}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? "עצור" : "נגן קטע"}
        </button>
        <button
          type="button"
          onClick={resetRegion}
          disabled={!isReady}
          className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors disabled:opacity-40"
          title="איפוס בחירה"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-muted text-center">
        גררו את הידיות של האזור הצבעוני כדי לבחור טווח (עד {maxClipDuration} שניות)
      </p>
    </div>
  );
}
