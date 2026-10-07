"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
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

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % hero.images.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
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
            <Image
              src={hero.images[i]}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${i % 2 === 0 ? "kb-a" : "kb-b"}`}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/30 to-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,6,10,0.75)_100%)]" />

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
          className="mt-9 flex flex-wrap gap-3"
        >
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold group inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold transition-transform hover:scale-105"
          >
            <WhatsAppIcon />
            {hero.ctaPrimary}
          </a>
          <a href="#gallery" className="inline-flex items-center rounded-full border border-ink/25 px-7 py-4 font-medium backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-hi">
            {hero.ctaSecondary}
          </a>
        </motion.div>

        <div className="mt-12 flex items-center gap-3" aria-hidden="true">
          {hero.images.map((_, k) => (
            <span key={k} className="relative h-[2px] w-12 overflow-hidden bg-ink/20">
              {k === i && (
                <motion.span
                  key={i}
                  className="absolute inset-y-0 right-0 bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="גללו למטה"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="flex h-12 w-7 justify-center rounded-full border border-ink/30 pt-2">
          <span className="h-2 w-px bg-gold" />
        </span>
      </motion.a>
    </section>
  );
}
