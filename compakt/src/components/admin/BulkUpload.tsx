"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, FolderOpen, CheckCircle2, AlertCircle, Loader2, Music } from "lucide-react";
import type { SongCategory } from "@/lib/types";

interface ParsedFile {
  file: File;
  artist: string;
  title: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  resultUrl?: string;
}

const categories: { value: SongCategory; label: string; emoji: string }[] = [
  { value: "reception", label: "קבלת פנים", emoji: "🥂" },
  { value: "ceremony", label: "טקס", emoji: "💍" },
  { value: "food", label: "אוכל", emoji: "🍽️" },
  { value: "dancing", label: "רחבה", emoji: "💃" },
];

/**
 * Parse artist + title from filename.
 * Common patterns:
 *   "Artist - Title.mp3"
 *   "01 - Artist - Title.mp3"
 *   "01. Artist - Title.mp3"
 *   "Title.mp3" (fallback — title only)
 */
function parseFilename(filename: string): { artist: string; title: string } {
  // Remove extension
  const name = filename.replace(/\.\w{2,4}$/, "").trim();

  // Remove leading track numbers: "01 - ", "01. ", "1 ", "01 "
  const withoutTrackNum = name.replace(/^\d{1,3}[\s.\-–—]+/, "").trim();

  // Split on " - " or " – " or " — "
  const parts = withoutTrackNum.split(/\s[-–—]\s/);

  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(" - ").trim(),
    };
  }

  // Fallback: entire name is the title
  return { artist: "", title: withoutTrackNum };
}

interface BulkUploadProps {
  onAdd: (song: {
    title: string;
    artist: string;
    category: SongCategory;
    previewUrl: string;
    tags: string[];
    energy: number;
    language: string;
    coverUrl: string;
    isSafe: boolean;
    isActive: boolean;
  }) => void;
  onClose: () => void;
}

export function BulkUpload({ onAdd, onClose }: BulkUploadProps) {
  const [category, setCategory] = useState<SongCategory>("dancing");
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folderElRef = useRef<HTMLInputElement | null>(null);
  const folderRef = useCallback((el: HTMLInputElement | null) => {
    if (el) el.setAttribute("webkitdirectory", "");
    folderElRef.current = el;
  }, []);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const audioFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("audio/") ||
      /\.(mp3|wav|m4a|aac|ogg|flac|aiff|wma)$/i.test(f.name)
    );

    const parsed: ParsedFile[] = audioFiles.map((file) => {
      const { artist, title } = parseFilename(file.name);
      return { file, artist, title, status: "pending" };
    });

    setFiles((prev) => [...prev, ...parsed]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateFile = useCallback((idx: number, data: Partial<ParsedFile>) => {
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, ...data } : f)));
  }, []);

  const uploadSingleFile = async (file: File): Promise<string> => {
    // Try signed URL first
    const signRes = await fetch("/api/uploads/signed", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "audio",
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });

    if (!signRes.ok) throw new Error("Upload prepare failed");

    const signed = (await signRes.json()) as {
      fallback?: boolean;
      uploadUrl?: string;
      url?: string;
    };

    if (signed.fallback) {
      const form = new FormData();
      form.set("kind", "audio");
      form.set("file", file);
      const postRes = await fetch("/api/uploads", { method: "POST", body: form });
      if (!postRes.ok) throw new Error("Upload failed");
      const data = (await postRes.json()) as { url?: string };
      if (!data.url) throw new Error("No URL returned");
      return data.url;
    } else {
      if (!signed.uploadUrl || !signed.url) throw new Error("Upload prepare failed");
      const putRes = await fetch(signed.uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");
      return signed.url;
    }
  };

  const handleUploadAll = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (pending.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;

      updateFile(i, { status: "uploading" });

      try {
        const url = await uploadSingleFile(files[i].file);
        updateFile(i, { status: "done", resultUrl: url });

        // Add the song to the store
        onAdd({
          title: files[i].title || files[i].file.name,
          artist: files[i].artist || "לא ידוע",
          category,
          previewUrl: url,
          tags: [],
          energy: 3,
          language: "hebrew",
          coverUrl: "",
          isSafe: true,
          isActive: true,
        });
      } catch (e) {
        updateFile(i, {
          status: "error",
          error: e instanceof Error ? e.message : "שגיאה",
        });
      }
    }

    setIsUploading(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-5 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-brand-blue" />
              העלאה מרובה
            </h3>
            <p className="text-xs text-muted">גררו תיקייה או בחרו קבצי אודיו</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category selector */}
        <div>
          <label className="block text-xs text-muted mb-1.5">קטגוריה לכל השירים</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`chip text-sm px-3 py-1.5 ${category === c.value ? "active" : ""}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragOver
            ? "border-brand-blue bg-brand-blue/5 scale-[1.01]"
            : "border-glass hover:border-brand-blue/50"
            }`}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragOver ? "text-brand-blue" : "text-muted"}`} />
          <p className="text-sm font-medium">
            {isDragOver ? "שחררו כדי להעלות" : "גררו קבצי אודיו לכאן"}
          </p>
          <p className="text-xs text-muted mt-1">MP3, WAV, M4A, FLAC, AIFF</p>

          <div className="flex gap-2 justify-center mt-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              בחר קבצים
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); folderElRef.current?.click(); }}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5 inline mr-1" />
              בחר תיקייה
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
          />
          <input
            ref={folderRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between text-xs text-muted px-1">
              <span>{files.length} קבצים</span>
              <span>
                {doneCount > 0 && <span className="text-brand-green">{doneCount} הועלו</span>}
                {errorCount > 0 && <span className="text-accent-danger mr-2">{errorCount} שגיאות</span>}
              </span>
            </div>

            {files.map((f, i) => (
              <div
                key={`${f.file.name}-${i}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-glass/50 text-sm"
              >
                {/* Status icon */}
                {f.status === "pending" && <Music className="w-4 h-4 text-muted flex-shrink-0" />}
                {f.status === "uploading" && <Loader2 className="w-4 h-4 text-brand-blue animate-spin flex-shrink-0" />}
                {f.status === "done" && <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />}
                {f.status === "error" && <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent-danger)" }} />}

                {/* Editable artist/title */}
                <div className="flex-1 min-w-0">
                  {f.status === "pending" ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={f.artist}
                        onChange={(e) => updateFile(i, { artist: e.target.value })}
                        placeholder="אמן"
                        className="w-[35%] px-1.5 py-0.5 text-xs rounded bg-transparent border border-glass/50 focus:outline-none focus:border-brand-blue"
                      />
                      <input
                        type="text"
                        value={f.title}
                        onChange={(e) => updateFile(i, { title: e.target.value })}
                        placeholder="שם השיר"
                        className="flex-1 px-1.5 py-0.5 text-xs rounded bg-transparent border border-glass/50 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  ) : (
                    <span className="text-xs truncate block">
                      {f.artist ? `${f.artist} — ${f.title}` : f.title}
                    </span>
                  )}
                  {f.error && (
                    <span className="text-[10px] block" style={{ color: "var(--accent-danger)" }}>{f.error}</span>
                  )}
                </div>

                {/* Remove button (only pending) */}
                {f.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-0.5 text-muted hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleUploadAll}
            disabled={isUploading || pendingCount === 0}
            className={`btn-primary flex-1 flex items-center justify-center gap-2 ${isUploading || pendingCount === 0 ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                מעלה...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                העלה {pendingCount > 0 ? `${pendingCount} קבצים` : ""}
              </>
            )}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary px-4">
            {doneCount > 0 ? "סגור" : "ביטול"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
