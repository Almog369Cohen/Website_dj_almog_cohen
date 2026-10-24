"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

const ease = [0.2, 0.7, 0.1, 1] as const;

/**
 * Hero: their gold lotus booth clip. On phones it fills the screen; on desktop it
 * sits in an arch (the arches of their venues) over a blurred, dimmed copy of itself.
 * The copy sits on one glass slab.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videos = useRef<HTMLVideoElement[]>([]);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    videos.current.forEach((v) => {
      if (!v) return;
      if (reduce) v.pause();
      else v.play().catch(() => {});
    });
  }, [reduce]);

  const sources = (
    <>
      <source src={hero.video} type="video/mp4" />
      <source src={hero.videoWebm} type="video/webm" />
    </>
  );
  const videoProps = {
    poster: hero.poster,
    muted: true,
    loop: true,
    playsInline: true,
    autoPlay: !reduce,
    preload: "auto" as const,
    "aria-hidden": true,
  };

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#0e0c0a]">
      {/* ambient: the same clip, blurred and dimmed, fills the frame on desktop */}
      <video
        ref={(el) => { if (el) videos.current[0] = el; }}
        {...videoProps}
        className="absolute inset-0 hidden h-full w-full scale-125 object-cover opacity-45 blur-3xl saturate-[.8] md:block"
      >
        {sources}
      </video>
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_30%_50%,transparent_0%,rgba(14,12,10,0.55)_70%)] md:block" />

      {/* main clip: full screen on phones, an arch on desktop */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-0 overflow-hidden md:inset-auto md:left-[7%] md:top-[12vh] md:aspect-[9/16] md:h-[78vh] md:rounded-[999px_999px_6px_6px] md:border md:border-[rgba(232,207,160,0.4)] md:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
      >
        <video
          ref={(el) => { if (el) videos.current[1] = el; }}
          {...videoProps}
          className="h-full w-full object-cover saturate-[.85] contrast-[1.05]"
        >
          {sources}
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/10 to-[#0e0c0a]/40 md:from-[#0e0c0a]/40 md:to-transparent" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-6 pt-28 md:items-center md:px-10 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="glass-dark w-full max-w-xl rounded-[28px] p-6 md:p-10"
        >
          <p className="mb-5 text-[11px] font-medium tracking-[0.32em] text-[#e8cfa0] md:text-xs" dir="ltr">
            {hero.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2.1rem,4.6vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.01em] text-[#f6f0e6]">
            {hero.titleTop}
            <span className="block text-[#d9b26f]">{hero.titleBottom}</span>
          </h1>
          <div className="hairline my-6 w-24" />
          <p className="max-w-md text-[15px] font-light leading-[1.75] text-[#f6f0e6]/85 md:text-[17px]">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-transform hover:scale-[1.03]">
              <WhatsAppIcon className="h-4 w-4" />
              {hero.ctaPrimary}
            </a>
            <a href="#gallery" className="text-[15px] text-[#e8cfa0] underline decoration-[#b08d57]/50 underline-offset-8 transition-colors hover:text-[#f6f0e6]">
              {hero.ctaSecondary}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
