"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/content/site";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";
import { LightShow } from "./LightShow";

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

function useSlides(count: number, resetKey: string) {
  const [i, setI] = useState(0);
  const [prevKey, setPrevKey] = useState(resetKey);
  if (prevKey !== resetKey) {
    setPrevKey(resetKey);
    setI(0);
  }
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % count), SLIDE_MS);
    return () => clearInterval(t);
  }, [count, resetKey]);
  return i;
}

function Switch({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="inline-flex items-center gap-3 rounded-full border border-ink/25 bg-bg/40 px-5 py-3 font-medium backdrop-blur-sm transition-colors hover:border-gold"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors duration-500 ${on ? "bg-gold" : "bg-[#ff5ec4]/40"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink shadow transition-all duration-500 ${on ? "right-0.5" : "right-[1.375rem]"}`} />
      </span>
      {label}
    </button>
  );
}

function CTA() {
  return (
    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold transition-transform hover:scale-105">
      <WhatsAppIcon />
      {hero.ctaPrimary}
    </a>
  );
}

function Pillar({ side }: { side: "left" | "right" }) {
  const words = [...hero.party.pillars, ...hero.party.pillars];
  return (
    <div className="led-panel hidden w-24 shrink-0 self-stretch xl:block" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a0b3d] via-[#0b0620] to-[#2a0b3d]" />
      <div className={`led-pillar-track absolute inset-x-0 top-0 z-[2] flex flex-col items-center gap-6 py-6 ${side === "right" ? "[animation-direction:reverse]" : ""}`}>
        {words.map((w, k) => (
          <span key={k} className="led-text text-center font-display text-lg font-bold leading-tight text-[#ffd0f0]">
            {w}
          </span>
        ))}
      </div>
      <div className="eq absolute inset-x-3 bottom-3 z-[2] flex h-10 items-end gap-1">
        {[0.1, 0.35, 0.2, 0.5, 0.15].map((d, k) => (
          <span key={k} className="h-full flex-1 origin-bottom bg-gradient-to-t from-[#ff2ec4] to-[#5aa0ff]" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );
}

/** Lights off: laser show + LED wall that carries the headline. */
function PartyScene({ delay, onSwitch }: { delay: number; onSwitch: () => void }) {
  const p = hero.party;
  const i = useSlides(p.images.length, "party");
  return (
    <motion.div
      key="party"
      className="absolute inset-0 bg-[#030206]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <div className="absolute inset-0 opacity-30">
        <Image src={p.images[i]} alt="" fill sizes="100vw" priority className="kb-a object-cover blur-[2px]" />
      </div>
      <LightShow active />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-6 px-4 pb-24 pt-24 md:px-8 md:pb-32">
        <div className="flex w-full items-stretch justify-center gap-5" style={{ perspective: "1400px" }}>
          <Pillar side="left" />
          <motion.div
            className="led-panel flex min-h-[44vh] w-full max-w-5xl items-center"
            initial={{ scaleY: 0.02, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0.01, opacity: 0, transition: { duration: 0.35 } }}
            transition={{ delay: delay > 1 ? 1.6 : 0, duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          >
            <AnimatePresence initial={false}>
              <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
                <Image src={p.images[i]} alt="" fill sizes="(min-width:1024px) 64rem, 100vw" className={`object-cover ${i % 2 ? "kb-b" : "kb-a"}`} />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 z-[1] bg-gradient-to-l from-[#12051f]/90 via-[#12051f]/60 to-[#12051f]/20" />
            <div className="relative z-[2] flex w-full flex-col items-start gap-4 p-6 md:p-12">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.0, duration: 0.6 }}
                className="led-text inline-flex items-center gap-2 rounded-full border border-[#ff5ec4]/50 px-3 py-1 text-xs tracking-[0.2em] text-[#ffb3e6] md:text-sm"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff5ec4]" />
                {p.eyebrow}
              </motion.p>
              <h1 className="led-text font-display text-[clamp(2.2rem,6vw,5.6rem)] font-bold leading-[0.98]">
                <Words text={p.titleTop} delay={delay} />
                <Words text={p.titleBottom} delay={delay + 0.25} className="text-gold-grad" />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.5, duration: 0.7 }}
                className="max-w-xl text-base leading-relaxed text-ink md:text-lg"
              >
                {p.subtitle}
              </motion.p>
            </div>
          </motion.div>
          <Pillar side="right" />
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + 0.7, duration: 0.7 }} className="flex flex-wrap items-center justify-center gap-3">
          <CTA />
          <Switch on={false} label={p.toggle} onClick={onSwitch} />
        </motion.div>
        <motion.p
          className="text-center text-sm tracking-[0.15em] text-[#ffb3e6]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ delay: delay + 1, repeat: Infinity, duration: 2.4 }}
        >
          {p.hint}
        </motion.p>
      </div>
    </motion.div>
  );
}

/** Lights on: warm, designed, classy reception. */
function ReceptionScene({ onSwitch, showSwitch }: { onSwitch: () => void; showSwitch: boolean }) {
  const r = hero.reception;
  const i = useSlides(r.images.length, "reception");
  return (
    <motion.div key="reception" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} transition={{ duration: 1 }}>
      <AnimatePresence initial={false}>
        <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }}>
          <Image src={r.images[i]} alt="" fill sizes="100vw" priority={i === 0} className={`object-cover ${i % 2 ? "kb-b" : "kb-a"}`} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(243,217,164,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/10 to-bg" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg/90 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 md:px-8 md:pb-28">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-gold/40 bg-bg/40 px-4 py-2 text-xs tracking-[0.2em] text-gold-hi backdrop-blur-md md:text-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          {r.eyebrow}
        </motion.p>
        <h1 className="font-display text-[clamp(2.4rem,7.5vw,7rem)] font-bold leading-[0.98]">
          <Words text={r.titleTop} delay={0.2} />
          <Words text={r.titleBottom} delay={0.45} className="text-gold-grad" />
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }} className="mt-6 max-w-xl text-base leading-relaxed text-ink md:text-lg">
          {r.subtitle}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }} className="mt-9 flex flex-wrap items-center gap-3">
          <CTA />
          {showSwitch && <Switch on label={r.toggle} onClick={onSwitch} />}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Two-state hero.
 * Lights off = the party: laser show, moving heads, dancing crowd, and an LED wall
 * that shows the headline over dance-floor footage, flanked by LED pillars with the services.
 * Lights on  = the reception: warm, designed, classy photos and copy.
 * Scroll or the switch turns the lights on; the switch can turn them back off.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [lightsOn, setLightsOn] = useState(false);
  const [switched, setSwitched] = useState(false);
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const on = lightsOn || !!reduce;

  const toggle = (v: boolean) => {
    setLightsOn(v);
    setSwitched(true);
  };
  useMotionValueEvent(scrollY, "change", (v) => {
    if (v > 60 && !lightsOn) toggle(true);
  });

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-bg" aria-label={on ? "קבלת הפנים" : "הרחבה"}>
      <motion.div style={{ opacity: fade }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          {on ? (
            <ReceptionScene key="reception" onSwitch={() => toggle(false)} showSwitch={!reduce} />
          ) : (
            <PartyScene key="party" delay={switched ? 0.15 : 1.9} onSwitch={() => toggle(true)} />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {switched && (
          <motion.div
            key={`flash-${on}`}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-20 mix-blend-overlay ${on ? "bg-gold-hi" : "bg-[#7a3cff]"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, on ? 0.85 : 0.6, 0] }}
            transition={{ duration: 0.9, times: [0, 0.15, 1] }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
