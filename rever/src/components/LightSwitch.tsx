"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { about, contrast } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

/**
 * The difference, as a light switch. Off: the same event without a producer, in the dark.
 * On: with REVER, lit. It switches on by itself once when first seen; the visitor can flip it.
 * Text never changes colour in place: the old list fades out, the room lights, the new list fades in.
 */
export function LightSwitch() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    if (!seen || touched.current) return;
    const t = setTimeout(() => !touched.current && setOn(true), reduce ? 0 : 1600);
    return () => clearTimeout(t);
  }, [seen, reduce]);

  const state = on ? contrast.on : contrast.off;

  return (
    <section id="difference" data-scene="day" className="theme-ivory px-4 py-16 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionKicker>{contrast.kicker}</SectionKicker>
            <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05]">{contrast.title}</h2>
          </div>
          <p className="text-[14px] text-ink-dim">{contrast.hint}</p>
        </Reveal>

        <div
          ref={ref}
          className={`relative mt-8 grid overflow-hidden rounded-[28px] transition-[background-color,box-shadow] duration-700 md:mt-12 md:grid-cols-2 ${
            on ? "bg-[#fdf3e4] shadow-[0_40px_100px_-40px_rgba(240,150,60,.8)]" : "bg-[#15120f] shadow-[0_30px_80px_-40px_rgba(0,0,0,.6)]"
          }`}
        >
          {/* the room's light */}
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_0%,rgba(242,170,80,.55),transparent_70%)] transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} />

          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[460px]">
            <Image
              src={about.image}
              alt="זוג בין קשתות לבנות"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className={`object-cover transition-[filter] duration-1000 ${on ? "" : "brightness-[.22] grayscale"}`}
            />
          </div>

          <div className="relative p-6 md:p-12">
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label="הדלקת האור: בלי הפקה או עם REVER"
              onClick={() => {
                touched.current = true;
                setOn((v) => !v);
              }}
              className="group flex min-h-12 items-center gap-4"
            >
              <span className={`relative h-12 w-[5.5rem] rounded-full border transition-colors duration-500 ${on ? "border-[#b08d57]/50 bg-[#f2c27a]" : "border-white/20 bg-[#2a241e]"}`}>
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className={`absolute top-1 h-10 w-10 rounded-full ${on ? "left-1 bg-[#fff6e6] shadow-[0_0_24px_6px_rgba(255,214,150,.9)]" : "right-1 bg-[#5a5045]"}`}
                />
              </span>
              <span className={`text-[15px] font-medium transition-colors duration-500 ${on ? "text-[#6b4e1b]" : "text-[#e8cfa0]"}`}>{on ? "האור דולק" : "האור כבוי"}</span>
            </button>

            <AnimatePresence mode="wait">
              <motion.div key={on ? "on" : "off"} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                <p className={`mt-8 font-display text-[1.8rem] font-medium ${on ? "text-[#2a2118]" : "text-[#f6f0e6]"}`}>{state.label}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {state.items.map((it) => (
                    <li key={it} className={`flex items-start gap-3 text-[17px] leading-[1.6] ${on ? "text-[#2a2118]" : "text-[#f6f0e6]/85"}`}>
                      <span aria-hidden="true" className={`mt-[0.55em] h-2 w-2 shrink-0 rounded-full ${on ? "bg-[#f0a040] shadow-[0_0_10px_2px_rgba(240,160,64,.8)]" : "bg-white/25"}`} />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
