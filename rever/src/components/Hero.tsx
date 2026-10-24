"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { hero } from "@/content/site";
import { track } from "@/lib/analytics";
import { useMedia } from "@/lib/use-media";
import { waLink, waContext } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";
import { StringLights } from "./StringLights";

const ease = [0.2, 0.7, 0.1, 1] as const;
// The clip fades into the section's own night colour instead of being covered by an overlay.
const fadeOut = "[mask-image:linear-gradient(#000_62%,transparent)] md:[mask-image:none]";

/**
 * Hero: the lights come on in the first second. String lights switch on across the top,
 * then the copy rises in. Phones: the lotus clip fills the top and fades into the night,
 * copy sits on the solid night below it (no glass, no seam). Desktop: the clip in an arch.
 * Videos pause when the hero is off screen or the tab is hidden.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "8%"]);
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

  return (
    <section id="top" ref={ref} data-wa="הגעתי מהאתר" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#0e0c0a] md:min-h-[520px]">
      {desktop && (
        // ambient light from the poster, blurred once (no second video decode)
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-[40px] saturate-[.8]" />
      )}

      <motion.div
        style={{ y }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        className={`absolute inset-x-0 top-0 h-[72%] overflow-hidden ${fadeOut} md:inset-auto md:left-[10%] md:top-[9vh] md:aspect-[9/16] md:h-[84vh] md:[clip-path:inset(0_round_999px_999px_8px_8px)]`}
      >
        <video
          key={mp4}
          poster={hero.poster}
          muted
          loop
          playsInline
          autoPlay={!reduce}
          aria-hidden="true"
          preload={desktop ? "auto" : "metadata"}
          className="h-full w-full object-cover object-[50%_30%]"
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
        {/* the arch's hairline moves with the clip, so it can never drift off it */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden rounded-[999px_999px_8px_8px] border border-[rgba(232,207,160,0.45)] md:block" />
      </motion.div>

      {/* The signature: the lights come on as the page opens */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+64px)] z-10 md:top-[86px]">
        <StringLights dark onMount />
      </div>

      {/* warm light spilling from the bottom, the dawn that the next section opens into */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#14100a]" />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 md:items-center md:justify-end md:px-10 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4, ease }}
          className="hero-card w-full md:mr-[6%] md:max-w-[34rem] md:rounded-[24px] md:p-10"
        >
          <p className="mb-5 hidden text-xs font-medium tracking-[0.24em] text-[#f0d68a] md:block [@media(max-height:560px)]:hidden" dir="ltr">
            {hero.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(1.75rem,7.2vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.01em] text-[#f6f0e6] [text-wrap:balance] md:text-[clamp(2.4rem,3.8vw,3.7rem)]">
            {hero.titleTop}
            <span className="block gold-text">{hero.titleBottom}</span>
          </h1>
          <div className="hairline my-5 hidden w-20 md:block [@media(max-height:560px)]:hidden" />
          {/* REVER's own line, right under the headline */}
          <p className="mt-3 text-[16px] leading-[1.6] text-[#f6f0e6]/90 md:mt-0 md:text-[17px]">{hero.tagline}</p>
          <p className="mt-3 hidden max-w-md text-[15px] leading-[1.7] text-[#f6f0e6]/75 md:block [@media(max-height:560px)]:hidden">{hero.subtitle}</p>
          <div className="mt-5 flex flex-col items-stretch gap-2 md:mt-8 md:flex-row md:items-center md:gap-5">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { waContext(e); track("click_whatsapp", { location: "hero" }); }}
              className="btn-gold inline-flex min-h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-[16px] font-medium transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {hero.ctaPrimary}
            </a>
            <a href="#gallery" className="inline-flex min-h-11 items-center justify-center text-[15px] text-[#f0d68a] underline-offset-[6px] hover:underline">
              {hero.ctaSecondary}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
