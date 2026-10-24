"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { track } from "@/lib/analytics";
import { useMedia } from "@/lib/use-media";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

const ease = [0.2, 0.7, 0.1, 1] as const;

/**
 * Hero: their gold lotus booth clip.
 * Phones: one light 540p clip in the top of the screen, copy on a glass card at the bottom.
 * Desktop: the clip in an arch over a blurred, dimmed copy of itself (the ambient copy is desktop only).
 * Videos pause when the hero is off screen or the tab is hidden.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vids = () => [...el.querySelectorAll("video")];
    let visible = true;
    const sync = () => vids().forEach((v) => (visible && !document.hidden && !reduce ? v.play().catch(() => {}) : v.pause()));
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduce, desktop]);

  const mp4 = desktop ? hero.video : hero.videoMobile;
  const webm = desktop ? hero.videoWebm : hero.videoMobileWebm;
  const common = { poster: hero.poster, muted: true, loop: true, playsInline: true, autoPlay: !reduce, "aria-hidden": true } as const;

  return (
    <section id="top" ref={ref} data-scene="night" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#0e0c0a] md:min-h-[640px]">
      {desktop && (
        <>
          <video key="ambient" {...common} preload="metadata" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-55 blur-2xl saturate-[.8]">
            <source src={hero.videoWebm} type="video/webm" />
            <source src={hero.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_0%,rgba(14,12,10,0.5)_70%)]" />
        </>
      )}

      {/* main clip: top 78% of the screen on phones, an arch on desktop */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-x-0 top-0 h-[78%] overflow-hidden md:inset-auto md:left-[6%] md:top-[9vh] md:aspect-[9/16] md:h-[84vh] md:[clip-path:inset(0_round_999px_999px_8px_8px)]"
      >
        <video key={mp4} {...common} preload={desktop ? "auto" : "metadata"} className="h-full w-full object-cover saturate-[.85] contrast-[1.05]">
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/10 to-[#0e0c0a]/50 md:from-[#0e0c0a]/40 md:via-transparent md:to-transparent" />
      </motion.div>
      {/* hairline arch border drawn separately so the clip stays round */}
      <div aria-hidden="true" className="pointer-events-none absolute hidden md:left-[6%] md:top-[9vh] md:block md:aspect-[9/16] md:h-[84vh] md:rounded-[999px_999px_8px_8px] md:border md:border-[rgba(232,207,160,0.4)]" />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-24 md:items-center md:px-10 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="glass-dark w-full max-w-[34rem] rounded-[20px] p-5 md:-mr-4 md:rounded-[24px] md:p-10"
        >
          <p className="mb-3 text-[11px] font-medium tracking-[0.24em] text-[#e8cfa0] md:mb-5 md:text-xs" dir="ltr">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-[14ch] font-display text-[clamp(1.85rem,7.6vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#f6f0e6] [text-wrap:balance] md:max-w-none md:text-[clamp(2.4rem,3.8vw,3.7rem)]">
            {hero.titleTop}
            <span className="block text-[#d9b26f]">{hero.titleBottom}</span>
          </h1>
          <div className="hairline my-6 hidden w-20 sm:block" />
          <p className="hidden max-w-md text-[17px] leading-[1.75] text-[#f6f0e6]/90 sm:block">{hero.subtitle}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-8 md:gap-4">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("click_whatsapp", { location: "hero" })}
              className="btn-gold inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-transform hover:scale-[1.03] sm:flex-none"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {hero.ctaPrimary}
            </a>
            <a href="#gallery" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#e8cfa0]/40 px-5 text-[15px] text-[#e8cfa0] transition-colors hover:border-[#e8cfa0] hover:text-[#f6f0e6]">
              {hero.ctaSecondary}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
