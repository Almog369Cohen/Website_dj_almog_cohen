"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { zoomFeature } from "@/content/site";

/** Sticky scroll-zoom: a small framed photo grows to full screen as you scroll. */
export function ZoomReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["inset(30% 32% 30% 32% round 2.5rem)", "inset(0% 0% 0% 0% round 0rem)"],
  );
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const textTopX = useTransform(scrollYProgress, [0, 0.6], ["-30%", "0%"]);
  const textBottomX = useTransform(scrollYProgress, [0, 0.6], ["30%", "0%"]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0, 1]);
  const outlineOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section ref={ref} className="relative h-[260vh]" aria-label={`${zoomFeature.lineTop} ${zoomFeature.lineBottom}`}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={zoomFeature.image} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-bg/35" />
        </motion.div>

        <motion.p
          style={{ opacity: outlineOpacity }}
          className="pointer-events-none absolute font-display text-[16vw] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(217,178,111,0.35)]"
          aria-hidden="true"
        >
          REVER
        </motion.p>

        <motion.h2 style={{ opacity: textOpacity }} className="relative z-10 px-5 text-center font-display text-[clamp(2.5rem,8vw,8rem)] font-bold leading-[0.95]">
          <motion.span style={{ x: textTopX }} className="block">
            {zoomFeature.lineTop}
          </motion.span>
          <motion.span style={{ x: textBottomX }} className="block text-gold-grad">
            {zoomFeature.lineBottom}
          </motion.span>
        </motion.h2>
      </div>
    </section>
  );
}
