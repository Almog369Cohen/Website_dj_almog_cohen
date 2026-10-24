"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { events } from "@/content/site";
import { track } from "@/lib/analytics";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useMedia } from "@/lib/use-media";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

const MOBILE_COUNT = 6;
type Photo = (typeof events)[number]["photos"][number];

function Lightbox({ list, index, onClose, onNav }: { list: Photo[]; index: number; onClose: () => void; onNav: (d: number) => void }) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const [shown, setShown] = useState(index);
  if (shown !== index) {
    setShown(index);
    setZoom(1);
  }
  const item = list[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useMedia("(pointer: coarse)");

  // preload the neighbours so swiping feels instant
  useEffect(() => {
    [1, -1].forEach((d) => {
      const n = list[(index + d + list.length) % list.length];
      const img = new window.Image();
      img.src = n.src.replace(/\.jpg$/, "-1600.webp");
    });
  }, [index, list]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(1);
      if (e.key === "ArrowRight") onNav(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const els = [...dialogRef.current.querySelectorAll<HTMLElement>("button, a")];
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
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
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-center justify-center overscroll-contain bg-[#0e0c0a]/96 text-[#f6f0e6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
    >
      <motion.div
        className={`relative h-[100dvh] w-screen touch-none overflow-hidden md:h-[80vh] md:w-[92vw] md:max-w-6xl md:rounded-[8px] ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleZoom(e);
        }}
        drag={zoom === 1}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 && Math.abs(info.offset.y) > Math.abs(info.offset.x)) return onClose();
          // RTL: the next photo sits to the left, so dragging right brings it in
          if (info.offset.x > 80) onNav(1);
          else if (info.offset.x < -80) onNav(-1);
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: zoom }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.25 }, scale: { type: "spring", stiffness: 180, damping: 24 } }}
            style={{ transformOrigin: origin }}
            drag={zoom > 1}
            dragMomentum={false}
          >
            <Image src={item.src} alt={item.alt} fill sizes="(min-width:1280px) 1100px, 100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3 px-4" onClick={(e) => e.stopPropagation()}>
        <a
          href={waLink(`היי REVER, ראיתי באתר את "${item.alt}" ואשמח לשמוע עוד.`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_whatsapp", { location: "lightbox" })}
          className="btn-gold inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium"
        >
          <WhatsAppIcon className="h-4 w-4" /> אהבתי את זה, בואו נדבר
        </a>
        <div className="glass-dark flex items-center gap-1 rounded-full p-1.5">
          <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" onClick={() => onNav(-1)} aria-label="התמונה הקודמת">→</button>
          {!touch && (
            <>
              <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" onClick={() => setZoom((z) => Math.max(z - 0.5, 1))} aria-label="הקטנה">−</button>
              <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" onClick={() => setZoom((z) => Math.min(z + 0.5, 3))} aria-label="הגדלה">+</button>
            </>
          )}
          <span className="min-w-14 text-center text-[13px] tabular-nums text-[#f6f0e6]/85" dir="ltr">
            {index + 1} / {list.length}
          </span>
          <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10" onClick={() => onNav(1)} aria-label="התמונה הבאה">←</button>
          <button type="button" className="h-11 w-11 rounded-full hover:bg-white/10 md:hidden" onClick={onClose} aria-label="סגירה">✕</button>
        </div>
      </div>
      <button
        ref={closeRef}
        type="button"
        className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] hidden h-12 w-12 rounded-full border border-white/20 bg-black/60 text-xl md:block"
        onClick={onClose}
        aria-label="סגירה"
      >
        ✕
      </button>
    </motion.div>
  );
}

/** The events we produced: REVER's photos grouped by the real event they come from. */
export function Gallery() {
  const [ev, setEv] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const event = events[ev];
  const list = event.photos;
  const nav = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)), [list.length]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="gallery" data-scene="day" className="relative px-4 pb-10 pt-16 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-6 md:mb-10">
          <SectionKicker>אירועים</SectionKicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08]">אירועים שהפקנו</h2>
        </Reveal>

        <div role="tablist" aria-label="בחרו אירוע" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          {events.map((e, i) => (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={i === ev}
              aria-controls="event-panel"
              onClick={() => {
                setEv(i);
                setExpanded(false);
                track("open_gallery", { event: e.id });
              }}
              className={`min-h-11 shrink-0 rounded-full border px-5 text-[15px] transition-colors ${
                i === ev ? "border-[#2a2118] bg-[#2a2118] text-[#f6f0e6]" : "border-[#2a2118]/25 bg-white/50 hover:border-[#2a2118]/60"
              }`}
            >
              {e.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={event.id} id="event-panel" role="tabpanel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="mb-6 mt-6 max-w-2xl md:mb-10 md:mt-8">
              <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-[1.15]">{event.title}</h3>
              <p className="mt-2 text-[16px] leading-[1.7] text-ink-dim">{event.text}</p>
              <p className="mt-2 text-[14px]">
                <Todo>מקום ותאריך: להשלים</Todo>
              </p>
            </div>
            <div className="columns-2 gap-3 md:columns-3 md:gap-6">
              {list.map((g, i) => (
                <div key={g.src} className={`mb-3 break-inside-avoid md:mb-6 ${!expanded && i >= MOBILE_COUNT ? "hidden md:block" : ""}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(i);
                      track("open_gallery", { photo: g.alt });
                    }}
                    className="zoom-img lit group relative block w-full cursor-zoom-in overflow-hidden rounded-[14px]"
                    aria-label={`הגדלת תמונה: ${g.alt}`}
                  >
                    <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="(min-width:768px) 31vw, 48vw" className="h-auto w-full" />
                  </button>
                </div>
              ))}
            </div>
            {!expanded && list.length > MOBILE_COUNT && (
              <div className="mt-4 text-center md:hidden">
                <button type="button" onClick={() => setExpanded(true)} className="inline-flex min-h-12 items-center rounded-full border border-[#2a2118]/30 px-6 text-[15px]">
                  עוד מהאירוע ({list.length - MOBILE_COUNT})
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>{open !== null && <Lightbox list={list} index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  );
}
