"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/content/site";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

const SLIDE_MS = 6000;

function Words({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  return (
    <span className="block overflow-hidden pb-2">
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className={`ml-[0.25em] inline-block ${className}`}
          initial={{ y: "110%", rotate: 4 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ delay: delay + i * 0.07, duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Coloured moving-head beams for the dark "party" state. */
function PartyBeams() {
  const beams = [ // drawn above the darkness so the dance floor glows
    { left: "12%", color: "rgba(255,70,190,0.55)", dur: 5.5, from: -28, to: 22 },
    { left: "38%", color: "rgba(90,150,255,0.5)", dur: 4.2, from: 25, to: -30 },
    { left: "62%", color: "rgba(170,90,255,0.5)", dur: 6.3, from: -20, to: 30 },
    { left: "86%", color: "rgba(255,190,90,0.45)", dur: 4.8, from: 30, to: -18 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
      {beams.map((b, k) => (
        <motion.div
          key={k}
          className="absolute -top-[10%] h-[130%] w-[14vw] min-w-28 origin-top blur-xl"
          style={{ left: b.left, background: `linear-gradient(to bottom, ${b.color}, transparent 85%)`, clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)" }}
          animate={{ rotate: [b.from, b.to, b.from], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/**
 * Two-state hero.
 * Lights off = the party: dance-floor photos in the dark, cursor spotlight, coloured beams.
 * Lights on  = the reception: warm, designed, classy photos and copy.
 * Scroll or the switch turns the lights on; the switch can also turn them back off.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [lightsOn, setLightsOn] = useState(false);
  const [switched, setSwitched] = useState(false);
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const on = lightsOn || !!reduce;
  const mode = on ? hero.reception : hero.party;
  const images = mode.images;

  const toggle = (v: boolean) => {
    setLightsOn(v);
    setSwitched(true);
    setI(0);
  };

  useMotionValueEvent(scrollY, "change", (v) => {
    if (v > 60 && !lightsOn) toggle(true);
  });

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % images.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [images]);

  // Spotlight follows the mouse; on touch it sweeps by itself. Runs only while the lights are off and the hero is visible.
  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const set = (x: number, yy: number) => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${yy}px`);
    };
    let raf = 0;
    let lastMove = 0;
    let visible = true;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastMove = performance.now();
      const r = el.getBoundingClientRect();
      set(e.clientX - r.left, e.clientY - r.top);
    };
    const sweep = (t: number) => {
      if (visible && !document.hidden && t - lastMove > 2500) {
        const s = t / 1000;
        set(el.clientWidth * (0.5 + 0.36 * Math.sin(s * 0.7)), el.clientHeight * (0.42 + 0.2 * Math.sin(s * 1.3 + 1)));
      }
      raf = requestAnimationFrame(sweep);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    el.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(sweep);
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [on]);

  const textDelay = switched ? 0.15 : 1.9;
  const key = on ? "reception" : "party";

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "45%" }}
      aria-label={on ? "קבלת הפנים" : "הרחבה"}
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={`${key}-${i}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: switched && i === 0 ? 1.1 : 1.6, ease: "easeInOut" }}
          >
            <Image src={images[i]} alt="" fill priority={i === 0} sizes="100vw" className={`object-cover ${i % 2 === 0 ? "kb-a" : "kb-b"}`} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Party state: darkness with a spotlight hole, coloured beams and a halo */}
      <AnimatePresence>
        {!on && (
          <motion.div key="party-fx" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#040306]/90"
              style={{
                WebkitMaskImage: "radial-gradient(circle 260px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)",
                maskImage: "radial-gradient(circle 260px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{ background: "radial-gradient(circle 300px at var(--mx) var(--my), rgba(255,120,220,0.22), transparent 70%)" }}
            />
            <PartyBeams />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reception state: warm champagne wash */}
      <AnimatePresence>
        {on && (
          <motion.div
            key="reception-fx"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(243,217,164,0.25),transparent_60%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>

      {/* The switch moment: a warm flash */}
      <AnimatePresence>
        {switched && (
          <motion.div
            key={`flash-${key}`}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-[5] mix-blend-overlay ${on ? "bg-gold-hi" : "bg-[#7a3cff]"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, on ? 0.85 : 0.6, 0] }}
            transition={{ duration: 0.9, times: [0, 0.15, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/10 to-bg" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg/90 to-transparent" />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 md:px-8 md:pb-28">
        <motion.p
          key={`eyebrow-${key}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: switched ? 0.05 : 1.8, duration: 0.6 }}
          className={`mb-6 inline-flex w-fit items-center gap-3 rounded-full border px-4 py-2 text-xs tracking-[0.2em] backdrop-blur-md md:text-sm ${
            on ? "border-gold/40 bg-bg/40 text-gold-hi" : "border-[#ff5ec4]/40 bg-bg/50 text-[#ffb3e6]"
          }`}
        >
          <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${on ? "bg-gold" : "bg-[#ff5ec4]"}`} />
          {mode.eyebrow}
        </motion.p>

        <h1 key={`title-${key}`} className="font-display text-[clamp(2.4rem,7.5vw,7rem)] font-bold leading-[0.98]" aria-live="polite">
          <Words text={mode.titleTop} delay={textDelay} />
          <Words text={mode.titleBottom} delay={textDelay + 0.25} className="text-gold-grad" />
        </h1>

        <motion.p
          key={`sub-${key}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: textDelay + 0.5, duration: 0.7 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-ink md:text-lg"
        >
          {mode.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold transition-transform hover:scale-105">
            <WhatsAppIcon />
            {hero.ctaPrimary}
          </a>
          {!reduce && (
            <button
              type="button"
              onClick={() => toggle(!lightsOn)}
              aria-pressed={lightsOn}
              className="group inline-flex items-center gap-3 rounded-full border border-ink/25 bg-bg/30 px-5 py-3 font-medium backdrop-blur-sm transition-colors hover:border-gold"
            >
              <span className={`relative h-6 w-11 rounded-full transition-colors duration-500 ${lightsOn ? "bg-gold" : "bg-[#ff5ec4]/40"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink shadow transition-all duration-500 ${lightsOn ? "right-0.5" : "right-[1.375rem]"}`} />
              </span>
              {mode.toggle}
            </button>
          )}
        </motion.div>

        <div className="mt-12 flex items-center gap-3" aria-hidden="true">
          {images.map((_, k) => (
            <span key={k} className="relative h-[2px] w-12 overflow-hidden bg-ink/20">
              {k === i && (
                <motion.span key={`${key}-${i}`} className={`absolute inset-y-0 right-0 ${on ? "bg-gold" : "bg-[#ff5ec4]"}`} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {!on && (
          <motion.p
            className="pointer-events-none absolute inset-x-0 top-28 z-10 px-5 text-center text-sm tracking-[0.2em] text-[#ffb3e6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ repeat: Infinity, duration: 2.4 }}
          >
            {hero.party.hint}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
