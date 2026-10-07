"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { gallery } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

const spanClass: Record<string, string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  "": "",
};

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const item = gallery[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(1);
      if (e.key === "ArrowRight") onNav(-1);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNav]);

  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
    setZoom((z) => (z > 1 ? 1 : 2.2));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
    >
      <motion.div
        key={index}
        layoutId={`g-${index}`}
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
          <Image src={item.src} alt={item.alt} fill sizes="92vw" className="object-cover" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-bg/80 p-1.5 backdrop-blur" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => onNav(-1)} aria-label="התמונה הקודמת">→</button>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => setZoom((z) => Math.max(z - 0.5, 1))} aria-label="הקטנה">−</button>
        <span className="min-w-14 text-center text-sm tabular-nums text-ink-dim" dir="ltr">{Math.round(zoom * 100)}%</span>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => setZoom((z) => Math.min(z + 0.5, 3))} aria-label="הגדלה">+</button>
        <button type="button" className="h-10 w-10 rounded-full hover:bg-ink/10" onClick={() => onNav(1)} aria-label="התמונה הבאה">←</button>
      </div>
      <button type="button" className="absolute left-5 top-5 h-12 w-12 rounded-full border border-line bg-bg/70 text-xl" onClick={onClose} aria-label="סגירה">
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
    <section id="gallery" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionKicker>גלריה</SectionKicker>
            <h2 className="font-display text-4xl font-bold md:text-6xl">
              רגעים <span className="text-gold-grad">שהפקנו</span>
            </h2>
          </div>
          <p className="text-ink-dim">לחצו על תמונה כדי להגדיל ⤢</p>
        </Reveal>

        <div className="grid grid-flow-dense auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4 md:gap-4">
          {gallery.map((g, i) => (
            <Reveal key={i} delay={(i % 4) * 0.08} y={60} className={`${spanClass[g.span]} ${i === 0 ? "col-span-2" : ""}`}>
              <motion.button
                type="button"
                layoutId={`g-${i}`}
                onClick={() => setOpen(i)}
                className="zoom-img group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-3xl border border-line"
                aria-label={`הגדלת תמונה: ${g.alt}`}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-4 right-4 translate-y-4 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.alt}
                </span>
                <span className="absolute left-4 top-4 flex h-10 w-10 scale-50 items-center justify-center rounded-full bg-gold text-bg opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  ⤢
                </span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>{open !== null && <Lightbox key={open} index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  );
}
