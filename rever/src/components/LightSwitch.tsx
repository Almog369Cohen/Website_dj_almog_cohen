"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { contrast } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

/**
 * The difference, as a light switch. Off: what a couple runs alone, in the dark, with vendors' messages piling up
 * on a phone. On: one contact person, the room lit, a quiet phone. It switches on once by itself when first seen;
 * the visitor can flip it. Lists are the couple's own tasks from REVER's service copy; the phone is an illustration.
 */
function Phone({ on }: { on: boolean }) {
  return (
    <div
      className={`relative mx-auto h-[24.5rem] w-[13.5rem] overflow-hidden rounded-[2.2rem] border p-3 transition-colors duration-700 md:h-[26rem] md:w-[15rem] ${
        on ? "border-[#b08d57]/50 bg-[#fffaf0]" : "border-white/20 bg-[#0b0a0c]"
      }`}
      role="img"
      aria-label={on ? "טלפון שקט: REVER על זה" : "טלפון עם הודעות שנערמות מהספקים"}
    >
      <div className={`mx-auto mb-3 h-1.5 w-14 rounded-full ${on ? "bg-[#2a2118]/20" : "bg-white/20"}`} />
      <AnimatePresence mode="wait">
        {on ? (
          <motion.div key="on" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} exit={{ opacity: 0 }} className="mt-20 rounded-2xl border border-[#b08d57]/40 bg-white p-4 shadow-[0_14px_40px_-14px_rgba(240,160,64,.7)]">
            <p className="text-[12px] text-[#6b4e1b]">{contrast.onPhone}</p>
            <div className="mt-2 h-2 w-4/5 rounded-full bg-[#2a2118]/15" />
            <div className="mt-2 h-2 w-3/5 rounded-full bg-[#2a2118]/10" />
          </motion.div>
        ) : (
          <motion.ul key="off" exit={{ opacity: 0 }} className="flex flex-col gap-2">
            {contrast.vendors.map((v, i) => (
              <motion.li
                key={v}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.18 } }}
                className="rounded-2xl border border-white/15 bg-white/[0.07] p-3"
              >
                <p className="text-[12px] font-medium text-[#f6f0e6]">{v} · הודעה חדשה</p>
                <div className="mt-2 h-1.5 w-11/12 rounded-full bg-white/20" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/10" />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <p className={`absolute inset-x-0 bottom-2 text-center text-[11px] ${on ? "text-[#2a2118]/55" : "text-white/50"}`}>{contrast.phoneNote}</p>
    </div>
  );
}

export function LightSwitch() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    if (!seen || touched.current) return;
    const t = setTimeout(() => !touched.current && setOn(true), reduce ? 0 : 2400);
    return () => clearTimeout(t);
  }, [seen, reduce]);

  const state = on ? contrast.on : contrast.off;

  return (
    <section id="difference" data-scene="day" data-wa="ראיתי באתר איך אתם לוקחים על עצמכם את הניהול" className="theme-ivory px-4 py-16 md:px-10 md:py-28">
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
          className={`relative mt-8 grid items-center gap-8 overflow-hidden rounded-[28px] p-6 transition-[background-color,box-shadow] duration-700 md:mt-12 md:grid-cols-2 md:p-12 ${
            on ? "bg-[#fdf3e4] shadow-[0_40px_100px_-40px_rgba(240,150,60,.8)]" : "bg-[#15120f] shadow-[0_30px_80px_-40px_rgba(0,0,0,.6)]"
          }`}
        >
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_0%,rgba(242,170,80,.55),transparent_70%)] transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} />

          <div className="relative md:order-2">
            <Phone on={on} />
          </div>

          <div className="relative">
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
                <p className={`mt-8 font-display text-[1.6rem] font-medium leading-[1.2] md:text-[1.8rem] ${on ? "text-[#2a2118]" : "text-[#f6f0e6]"}`}>{state.label}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {state.items.map((it) => (
                    <li key={it} className={`flex items-start gap-3 text-[16px] leading-[1.6] md:text-[17px] ${on ? "text-[#2a2118]" : "text-[#f6f0e6]/85"}`}>
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
