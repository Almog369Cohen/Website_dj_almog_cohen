"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { about } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(18% 12% 18% 12% round 2rem)", "inset(0% 0% 0% 0% round 2rem)"]);

  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <SectionKicker>{about.kicker}</SectionKicker>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">{about.title}</h2>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p className="mt-6 text-lg leading-relaxed text-ink-dim">{p}</p>
            </Reveal>
          ))}
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {about.bullets.map((b, i) => (
              <Reveal key={b} delay={0.2 + i * 0.08}>
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-bg-soft/60 px-4 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">✓</span>
                  <span className="font-medium">{b}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div ref={ref} className="relative">
          <motion.div style={{ clipPath: clip }} className="relative aspect-[4/5] overflow-hidden">
            <motion.div style={{ scale }} className="absolute inset-0">
              <Image src={about.image} alt="צוות Rever בהפקת אירוע" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" />
          </motion.div>
          <div className="absolute -bottom-8 -right-4 rounded-3xl border border-gold/30 bg-bg/80 px-6 py-5 backdrop-blur-xl md:-right-10">
            <div className="font-display text-4xl font-bold text-gold-grad">A–Z</div>
            <div className="text-sm text-ink-dim">הפקה מקצה לקצה</div>
          </div>
        </div>
      </div>
    </section>
  );
}
