"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { RevEvent } from "@/content/events";
import { track } from "@/lib/analytics";
import { Pic, Todo } from "./ui";

type Props = { events: RevEvent[]; tabs?: boolean; meta?: boolean };

/** Tabs per event, columns that move at different speeds (driven by the scroll engine), and a lightbox that grows out of the photo. */
export function EventsGallery({ events, tabs = true, meta = true }: Props) {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lbImg = useRef<HTMLImageElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const from = useRef<HTMLButtonElement | null>(null);
  const ev = events[current];

  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  // tell the scroll engine the layout changed (new photos, new heights)
  useEffect(() => { window.dispatchEvent(new Event("rever:layout")); }, [current, expanded, desktop]);

  const n = desktop ? 3 : 2;
  const limit = desktop || expanded ? ev.photos.length : Math.min(6, ev.photos.length);
  const cols: { p: RevEvent["photos"][number]; k: number }[][] = Array.from({ length: n }, () => []);
  ev.photos.slice(0, limit).forEach((p, k) => cols[k % n].push({ p, k }));

  const select = (i: number, focus: boolean) => {
    setCurrent(i);
    setExpanded(false);
    if (focus) tabRefs.current[i]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    // right to left: ArrowLeft moves to the next tab
    const next = e.key === "ArrowLeft" ? i + 1 : e.key === "ArrowRight" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? events.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    select((next + events.length) % events.length, true);
  };

  const show = (k: number) => setOpen((k + ev.photos.length) % ev.photos.length);
  const openAt = (k: number, btn: HTMLButtonElement) => {
    from.current = btn;
    setOpen(k);
    track("open_photo", { event: ev.slug });
    const thumb = btn.querySelector("img")?.getBoundingClientRect();
    requestAnimationFrame(() => {
      const img = lbImg.current;
      closeBtn.current?.focus();
      if (!img || !thumb || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const grow = () => {
        const end = img.getBoundingClientRect();
        if (!end.width) return;
        img.animate(
          [
            { transform: `translate(${thumb.left - end.left}px,${thumb.top - end.top}px) scale(${thumb.width / end.width},${thumb.height / end.height})`, transformOrigin: "0 0" },
            { transform: "none", transformOrigin: "0 0" },
          ],
          { duration: 520, easing: "cubic-bezier(.2,.7,.1,1)" },
        );
      };
      if (img.complete && img.naturalWidth) grow(); else img.addEventListener("load", grow, { once: true });
    });
  };
  const close = () => { setOpen(null); from.current?.focus(); };

  useEffect(() => {
    if (open === null) return;
    const l = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    l?.stop();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show((open ?? 0) + 1);
      if (e.key === "ArrowRight") show((open ?? 0) - 1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); l?.start(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div data-wa={`ראיתי באתר את ${ev.title}`}>
      {tabs && events.length > 1 && (
        <div className="tabs" role="tablist" aria-label="אירועים">
          {events.map((e, i) => (
            <button
              key={e.slug}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`tab-${e.slug}`}
              className="tab"
              aria-selected={i === current}
              aria-controls="ev-panel"
              tabIndex={i === current ? 0 : -1}
              onClick={() => select(i, false)}
              onKeyDown={(k) => onKey(k, i)}
            >
              {e.tab}
            </button>
          ))}
        </div>
      )}
      <div id="ev-panel" role={tabs && events.length > 1 ? "tabpanel" : undefined} aria-labelledby={tabs && events.length > 1 ? `tab-${ev.slug}` : undefined}>
        {meta && (
          <div className="ev-meta">
            <h3>{ev.title}</h3>
            <p>{ev.text}</p>
            <p>
              <Todo>מקום וחודש</Todo> <Todo>מה הזוג רצה ומה עשינו</Todo>
            </p>
            <Link className="link-quiet" href={`/events/${ev.slug}/`}>לכל התמונות מהאירוע</Link>
          </div>
        )}
        <div className="cols" id="cols">
          {cols.map((col, c) => (
            <div className="col" key={c}>
              {col.map(({ p, k }) => (
                <button key={p.src} type="button" className="tile" aria-label={`פתיחת התמונה: ${p.alt}`} onClick={(e) => openAt(k, e.currentTarget)}>
                  <Pic name={p.src} alt={p.alt} sizes={desktop ? "30vw" : "46vw"} />
                  <span className="view" aria-hidden="true">צפו</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        {!desktop && !expanded && ev.photos.length > 6 && (
          <button className="link-quiet more" type="button" onClick={() => setExpanded(true)}>עוד מהאירוע</button>
        )}
      </div>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`תמונה מ${ev.title}`} onClick={(e) => e.target === e.currentTarget && close()}>
          <button ref={closeBtn} className="round close" type="button" aria-label="סגירה" onClick={close}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- the lightbox shows one processed size */}
          <img ref={lbImg} src={`/images/${ev.photos[open].src}-1600.webp`} alt={ev.photos[open].alt} />
          <div className="nav">
            <button className="round" type="button" aria-label="התמונה הקודמת" onClick={() => show(open - 1)}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
            <span className="count en" lang="en">{open + 1} / {ev.photos.length}</span>
            <button className="round" type="button" aria-label="התמונה הבאה" onClick={() => show(open + 1)}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
