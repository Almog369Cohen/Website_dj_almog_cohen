"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gallery } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const item = gallery[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(1);
      if (e.key === "ArrowRight") onNav(-1);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const els = [...dialogRef.current.querySelectorAll<HTMLElement>("button")];
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.addEventListener("keydown", onKey);
    document.addEventListener("keydown", onTab);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keydown", onTab);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [onClose, onNav]);

  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
    setZoom((z) => (z > 1 ? 1 : 2.2));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0e0c0a]/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
    >
      <motion.div
        key={index}
                className={`relative h-[78vh] w-[92vw] max-w-6xl overflow-hidden rounded-3xl ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleZoom(e);
        }}
        drag={zoom === 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80) onNav(-1);
          else if (info.offset.x < -80) onNav(1);
        }}
      >
        <motion.div className="absolute inset-0" animate={{ scale: zoom }} transition={{ type: "spring", stiffness: 180, damping: 24 }} style={{ transformOrigin: origin }}>
          <Image src={item.src} alt={item.alt} fill sizes="(min-width:1280px) 1100px, 92vw" className="object-contain" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      </motion.div>

      <div className="glass-dark absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full p-1.5 text-[#f6f0e6]" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => onNav(-1)} aria-label="התמונה הקודמת">→</button>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => setZoom((z) => Math.max(z - 0.5, 1))} aria-label="הקטנה">−</button>
        <span className="min-w-14 text-center text-sm tabular-nums text-ink-dim" dir="ltr">{Math.round(zoom * 100)}%</span>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => setZoom((z) => Math.min(z + 0.5, 3))} aria-label="הגדלה">+</button>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => onNav(1)} aria-label="התמונה הבאה">←</button>
      </div>
      <button ref={closeRef} type="button" className="absolute left-5 top-5 h-12 w-12 rounded-full border border-white/20 bg-black/60 text-xl text-white" onClick={onClose} aria-label="סגירה">
        ✕
      </button>
      <div className="absolute right-6 top-7 text-sm text-ink-dim" dir="ltr">
        {index + 1} / {gallery.length}
      </div>
    </motion.div>
  );
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const nav = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + gallery.length) % gallery.length)), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="gallery" className="relative px-4 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 md:mb-16 md:flex md:items-end md:justify-between">
          <div>
            <SectionKicker>גלריה</SectionKicker>
            <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08]">רגעים שהפקנו</h2>
          </div>
          <p className="mt-4 text-[15px] text-ink-dim md:mt-0">לחצו על תמונה כדי לראות אותה בגדול</p>
        </Reveal>

        <div className="columns-2 gap-3 md:columns-3 md:gap-5">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={(i % 3) * 0.08} className="mb-3 break-inside-avoid md:mb-5">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="zoom-img group relative block w-full cursor-zoom-in overflow-hidden rounded-[6px]"
                aria-label={`הגדלת תמונה: ${g.alt}`}
              >
                <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="(min-width:768px) 31vw, 48vw" className="h-auto w-full" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10 text-right text-[13px] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {g.alt}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>{open !== null && <Lightbox key={open} index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  );
}
