"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { services, servicesIntro } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

const ease = [0.2, 0.7, 0.1, 1] as const;

/** One sticky full-screen photo that crossfades per service, with a single glass card. */
export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(services.length - 1, Math.max(0, Math.floor(v * services.length)))));
  const s = services[active];

  return (
    <section id="services">
      <div className="theme-ivory px-4 pb-16 pt-24 md:px-10 md:pt-32">
        <Reveal className="mx-auto max-w-7xl md:flex md:items-end md:justify-between md:gap-10">
          <div>
            <SectionKicker>{servicesIntro.kicker}</SectionKicker>
            <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08]">{servicesIntro.title}</h2>
          </div>
          <p className="mt-6 max-w-md text-[17px] font-light leading-[1.8] text-ink-dim md:mt-0">{servicesIntro.text}</p>
        </Reveal>
      </div>

      <div ref={ref} className="relative" style={{ height: `${services.length * 100}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#0e0c0a]">
          {services.map((sv, i) => (
            <motion.div
              key={sv.id}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }}
              transition={{ duration: 1.2, ease }}
            >
              <Image src={sv.image} alt="" fill sizes="100vw" className="object-cover" />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a]/80 via-[#0e0c0a]/20 to-[#0e0c0a]/40" />

          <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-8 md:items-center md:px-10 md:pb-0">
            <div className="glass-dark w-full max-w-md rounded-[28px] p-7 md:p-10" aria-live="polite">
              <div className="mb-6 flex items-center gap-3 text-xs tracking-[0.3em] text-[#e8cfa0]" dir="ltr">
                <span>0{active + 1}</span>
                <span className="h-px w-10 bg-[#b08d57]/60" />
                <span className="text-[#f6f0e6]/50">0{services.length}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
                  <h3 className="font-display text-[clamp(1.7rem,3vw,2.6rem)] font-medium leading-[1.12] text-[#f6f0e6]">{s.title}</h3>
                  <p className="mt-5 text-[15px] font-light leading-[1.8] text-[#f6f0e6]/85 md:text-[16px]">{s.text}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex gap-2" aria-hidden="true">
                {services.map((_, i) => (
                  <span key={i} className={`h-px flex-1 transition-colors duration-700 ${i <= active ? "bg-[#d9b26f]" : "bg-[#f6f0e6]/20"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
