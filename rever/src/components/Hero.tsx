"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
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
          transition={{ delay: delay + i * 0.09, duration: 1, ease: [0.2, 0.7, 0.1, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * "Lights on" hero: the venue starts dark and the visitor's cursor (or an
 * automatic sweeping beam on touch screens) is a stage spotlight. Scrolling
 * or pressing the switch turns all the lights on with a flash and beam sweep.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [lightsOn, setLightsOn] = useState(false);
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useMotionValueEvent(scrollY, "change", (v) => {
    if (v > 60) setLightsOn(true);
  });

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % hero.images.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  // Spotlight position: pointer on desktop, automatic sweep on touch / no pointer.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const set = (x: number, yy: number) => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${yy}px`);
    };
    let raf = 0;
    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastMove = performance.now();
      const r = el.getBoundingClientRect();
      set(e.clientX - r.left, e.clientY - r.top);
    };
    const sweep = (t: number) => {
      if (t - lastMove > 2500) {
        const r = el.getBoundingClientRect();
        const s = t / 1000;
        set(r.width * (0.5 + 0.36 * Math.sin(s * 0.7)), r.height * (0.42 + 0.2 * Math.sin(s * 1.3 + 1)));
      }
      raf = requestAnimationFrame(sweep);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(sweep);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "45%" }}
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <Image src={hero.images[i]} alt="" fill priority={i === 0} sizes="100vw" className={`object-cover ${i % 2 === 0 ? "kb-a" : "kb-b"}`} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Darkness with a spotlight hole */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#040306] motion-reduce:hidden"
        style={{
          WebkitMaskImage: "radial-gradient(circle 260px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)",
          maskImage: "radial-gradient(circle 260px at var(--mx) var(--my), transparent 0%, rgba(0,0,0,0.35) 45%, #000 100%)",
        }}
        initial={{ opacity: 0.96 }}
        animate={{ opacity: lightsOn ? 0 : 0.96 }}
        transition={{ duration: lightsOn ? 1.4 : 0.6, ease: [0.7, 0, 0.2, 1], delay: lightsOn ? 0.15 : 0 }}
      />
      {/* Warm halo that follows the spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen motion-reduce:hidden"
        style={{ background: "radial-gradient(circle 300px at var(--mx) var(--my), rgba(243,217,164,0.28), transparent 70%)" }}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Lights-on moment: flash + sweeping beams */}
      <AnimatePresence>
        {lightsOn && (
          <>
            <motion.div
              key="flash"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5] bg-gold-hi mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.9, times: [0, 0.15, 1] }}
            />
            {[-1, 1].map((dir) => (
              <motion.div
                key={`beam-${dir}`}
                aria-hidden="true"
                className="pointer-events-none absolute -top-[20%] left-1/2 z-[5] h-[160%] w-[18vw] min-w-40 origin-top -translate-x-1/2 bg-gradient-to-b from-gold-hi/70 via-gold/20 to-transparent blur-2xl mix-blend-screen"
                initial={{ rotate: dir * 70, opacity: 0 }}
                animate={{ rotate: dir * -35, opacity: [0, 1, 0] }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg" />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 md:px-8 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-gold/30 bg-bg/40 px-4 py-2 text-xs tracking-[0.2em] text-gold-hi backdrop-blur-md md:text-sm"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          {hero.eyebrow}
        </motion.p>

        <h1 className="font-display text-[clamp(2.6rem,8vw,7.5rem)] font-bold leading-[0.95]">
          <Words text={hero.titleTop} delay={1.9} />
          <Words text={hero.titleBottom} delay={2.2} className="text-gold-grad" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.8 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-ink-dim md:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.8 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold transition-transform hover:scale-105">
            <WhatsAppIcon />
            {hero.ctaPrimary}
          </a>
          <button
            type="button"
            onClick={() => setLightsOn((v) => !v)}
            aria-pressed={lightsOn}
            className="group inline-flex items-center gap-3 rounded-full border border-ink/25 px-5 py-3 font-medium backdrop-blur-sm transition-colors hover:border-gold"
          >
            <span className={`relative h-6 w-11 rounded-full transition-colors duration-500 ${lightsOn ? "bg-gold" : "bg-ink/20"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink shadow transition-all duration-500 ${lightsOn ? "right-0.5" : "right-[1.375rem]"}`} />
            </span>
            {lightsOn ? "האורות דולקים" : "הדליקו את האורות"}
          </button>
        </motion.div>

        <div className="mt-12 flex items-center gap-3" aria-hidden="true">
          {hero.images.map((_, k) => (
            <span key={k} className="relative h-[2px] w-12 overflow-hidden bg-ink/20">
              {k === i && (
                <motion.span key={i} className="absolute inset-y-0 right-0 bg-gold" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {!lightsOn && (
          <motion.p
            className="pointer-events-none absolute left-1/2 top-28 z-10 -translate-x-1/2 text-xs tracking-[0.3em] text-gold-hi/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.4 }}
          >
            הזיזו את הפנס · גללו כדי להדליק
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
