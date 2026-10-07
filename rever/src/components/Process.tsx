"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { process } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <section id="process" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Reveal className="mb-20 text-center">
          <SectionKicker>איך זה עובד</SectionKicker>
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            ארבעה צעדים <span className="text-gold-grad">לאירוע מושלם</span>
          </h2>
        </Reveal>

        <ol ref={ref} className="relative">
          <span className="absolute right-6 top-0 h-full w-px bg-line md:right-1/2" aria-hidden="true" />
          <motion.span
            className="absolute right-6 top-0 h-full w-px origin-top bg-gradient-to-b from-gold-hi to-gold-lo md:right-1/2"
            style={{ scaleY: scrollYProgress }}
            aria-hidden="true"
          />
          {process.map((p, i) => (
            <li key={p.n} className={`relative mb-16 flex last:mb-0 md:w-1/2 ${i % 2 ? "md:mr-auto md:pr-16" : "md:pl-16"}`}>
              <span
                className={`absolute right-6 top-2 z-10 h-4 w-4 translate-x-1/2 rounded-full border-2 border-gold bg-bg shadow-[0_0_20px_rgba(217,178,111,0.7)] ${
                  i % 2 ? "md:right-0" : "md:right-auto md:left-0 md:-translate-x-1/2"
                }`}
                aria-hidden="true"
              />
              <Reveal delay={0.05} className="pr-16 md:pr-0">
                <span className="font-display text-6xl font-bold text-transparent [-webkit-text-stroke:1px_var(--gold)]">{p.n}</span>
                <h3 className="mt-2 font-display text-3xl font-bold">{p.title}</h3>
                <p className="mt-3 text-ink-dim">{p.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
