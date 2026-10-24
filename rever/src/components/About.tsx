"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { about } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";
import { StringLights } from "./StringLights";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section id="about" data-scene="dawn" className="relative pb-24 md:pb-36">
      <StringLights className="mb-10 md:mb-16" />
      <div ref={ref} className="relative mx-auto grid max-w-7xl items-center gap-0 px-4 md:grid-cols-12 md:px-10">
        <div className="relative md:col-span-6 md:col-start-7 md:row-start-1">
          <div className="lit arch relative mx-auto aspect-[3/4] w-full max-w-[520px] overflow-hidden" style={{ "--glow": "rgba(242,184,102,.7)" } as React.CSSProperties}>
            <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0">
              <Image src={about.image} alt="כלה בשמלה ארוכה בין קשתות לבנות" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
            </motion.div>
          </div>
        </div>
        <Reveal className="relative z-10 -mt-24 md:col-span-6 md:col-start-2 md:row-start-1 md:mt-0 md:-ml-24">
          <div className="glass-ivory rounded-[28px] p-7 md:p-12">
            <SectionKicker>{about.kicker}</SectionKicker>
            <h2 className="font-display text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.1]">{about.title}</h2>
            <div className="hairline my-6 w-24" />
            {about.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-[17px] font-light leading-[1.8] text-ink-dim">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
