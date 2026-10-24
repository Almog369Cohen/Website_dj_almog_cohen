"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { services, servicesIntro } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

const ease = [0.2, 0.7, 0.1, 1] as const;

/** Desktop: one sticky full-screen photo that crossfades per service, with one glass card. */
function StickyServices() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(services.length - 1, Math.max(0, Math.floor(v * services.length)))));
  const s = services[active];

  return (
    <div ref={ref} className="relative hidden md:block" style={{ height: `${services.length * 70}vh` }}>
      <div className="sticky top-0 h-[100vh] overflow-hidden bg-[#0e0c0a]">
        {services.map((sv, i) => (
          <motion.div
            key={sv.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.04 }}
            transition={{ duration: 1.2, ease }}
          >
            <Image src={sv.image} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(14,12,10,0.65),transparent_60%)]" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-10">
          <div className="glass-dark w-full max-w-md rounded-[20px] p-10">
            <p className="mb-6 font-display text-5xl text-[#d9b26f]/80" dir="ltr">0{active + 1}</p>
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
                <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium leading-[1.15] text-[#f6f0e6]">{s.title}</h3>
                <p className="mt-5 text-[17px] leading-[1.75] text-[#f6f0e6]">{s.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Phones: a horizontal swipe carousel, the next card peeking in. */
function SwipeServices() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const w = el.firstElementChild?.clientWidth ?? 1;
    setActive(Math.min(services.length - 1, Math.round(Math.abs(el.scrollLeft) / (w + 12))));
  };
  return (
    <div className="md:hidden">
      <div ref={track} onScroll={onScroll} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="ארבעת התחומים, החליקו לצד">
        {services.map((sv, i) => (
          <article key={sv.id} className="relative w-[86%] shrink-0 snap-center overflow-hidden rounded-[18px] bg-[#0e0c0a] text-[#f6f0e6]">
            <div className="relative aspect-[4/3]">
              <Image src={sv.image} alt="" fill sizes="86vw" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="font-display text-2xl text-[#d9b26f]/80" dir="ltr">0{i + 1}</p>
              <h3 className="mt-2 font-display text-[1.6rem] font-medium leading-[1.15]">{sv.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#f6f0e6]/90">{sv.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="flex justify-center gap-2 pb-2" aria-hidden="true">
        {services.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-[#8d6b2c]" : "w-1.5 bg-[#2a2118]/25"}`} />
        ))}
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services">
      <div className="theme-ivory pb-8 pt-20 md:pb-16 md:pt-32">
        <Reveal className="mx-auto max-w-7xl px-4 md:flex md:items-end md:justify-between md:gap-10 md:px-10">
          <div>
            <SectionKicker>{servicesIntro.kicker}</SectionKicker>
            <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08] [text-wrap:balance]">{servicesIntro.title}</h2>
          </div>
          <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-ink-dim md:mt-0">{servicesIntro.text}</p>
        </Reveal>
        <div className="mt-8 md:mt-0">
          <SwipeServices />
        </div>
      </div>
      <StickyServices />
    </section>
  );
}
