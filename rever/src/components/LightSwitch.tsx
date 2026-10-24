"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { contrast } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

/**
 * The difference, as a light switch. Off: the seven things a couple runs alone, a phone piling up with vendors'
 * messages on the wedding day, a budget that leaks. On: the tasks fold into one card, one contact person,
 * a quiet phone, a budget inside its limit. It switches on once by itself when first seen; the visitor can flip it.
 * The phone and the budget bar are illustrations: no numbers, no invented messages.
 */
function Phone({ on }: { on: boolean }) {
  return (
    <div
      className={`relative mx-auto h-[24.5rem] w-[13.5rem] overflow-hidden rounded-[2.2rem] border p-3 transition-colors duration-700 md:h-[26rem] md:w-[15rem] ${
        on ? "border-[#c9a227]/60 bg-[#fffaf0]" : "border-white/20 bg-[#0b0a0c]"
      }`}
      role="img"
      aria-label={on ? "טלפון שקט: REVER על זה" : "טלפון ביום החתונה עם הודעות שנערמות מהספקים"}
    >
      <div className={`mx-auto mb-2 h-1.5 w-14 rounded-full ${on ? "bg-[#2a2118]/20" : "bg-white/20"}`} />
      <p className={`mb-3 text-center text-[12px] font-medium ${on ? "text-[#6b4e1b]" : "text-[#f0d68a]"}`}>{contrast.phoneTitle}</p>
      <AnimatePresence mode="wait">
        {on ? (
          <motion.div key="on" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} exit={{ opacity: 0 }} className="mt-16 rounded-2xl border border-[#c9a227]/50 bg-white p-4 shadow-[0_14px_40px_-14px_rgba(212,175,55,.7)]">
            <p className="text-[12px] text-[#6b4e1b]">{contrast.onPhone}</p>
            <div className="mt-2 h-2 w-4/5 rounded-full bg-[#2a2118]/15" />
            <div className="mt-2 h-2 w-3/5 rounded-full bg-[#2a2118]/10" />
          </motion.div>
        ) : (
          <motion.ul key="off" exit={{ opacity: 0 }} className="flex flex-col gap-2">
            {contrast.vendors.map((v, i) => (
              <motion.li key={v} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.18 } }} className="rounded-2xl border border-white/15 bg-white/[0.07] p-3">
                <p className="text-[12px] font-medium text-[#f6f0e6]">{v} · הודעה חדשה</p>
                <div className="mt-2 h-1.5 w-11/12 rounded-full bg-white/20" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/10" />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <p className={`absolute inset-x-0 bottom-2 text-center text-[11px] ${on ? "text-[#2a2118]/55" : "text-white/50"}`}>{contrast.illustration}</p>
    </div>
  );
}

/** A budget bar against a dashed limit: no numbers, only whether it stays inside. */
function Budget({ on }: { on: boolean }) {
  return (
    <div className="relative md:order-3 md:col-span-2">
      <div className="flex items-center justify-between gap-4 text-[13px]">
        <span className={`font-medium ${on ? "text-[#6b4e1b]" : "text-[#f0d68a]"}`}>{on ? contrast.on.budget : contrast.off.budget}</span>
        <span className={on ? "text-[#2a2118]/55" : "text-white/50"}>{contrast.illustration}</span>
      </div>
      <div className={`relative mt-3 h-3 rounded-full ${on ? "bg-[#2a2118]/10" : "bg-white/10"}`} role="img" aria-label={on ? "התקציב בתוך המסגרת" : "התקציב חורג מהמסגרת"}>
        <motion.span
          className={`absolute inset-y-0 right-0 rounded-full ${on ? "gold-metal-bg" : "bg-[#8b8070]"}`}
          initial={false}
          animate={{ width: on ? "62%" : "96%" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
        />
        <span aria-hidden="true" className={`absolute -inset-y-1.5 right-[28%] w-px border-r border-dashed ${on ? "border-[#2a2118]/50" : "border-white/60"}`} />
      </div>
    </div>
  );
}

const chip = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.4, y: 22 },
};

export function LightSwitch() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    if (!seen || touched.current) return;
    const t = setTimeout(() => !touched.current && setOn(true), reduce ? 0 : 2800);
    return () => clearTimeout(t);
  }, [seen, reduce]);

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
            on ? "bg-[#fbf3d9] shadow-[0_40px_100px_-40px_rgba(212,175,55,.75)]" : "bg-[#15120f] shadow-[0_30px_80px_-40px_rgba(0,0,0,.6)]"
          }`}
        >
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_0%,rgba(224,185,74,.5),transparent_70%)] transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} />

          <div className="relative md:order-2">
            <Phone on={on} />
          </div>

          <div className="relative md:order-1">
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
              <span className={`relative h-12 w-[5.5rem] rounded-full border transition-colors duration-500 ${on ? "border-[#b8902a] gold-metal-bg" : "border-white/20 bg-[#2a241e]"}`}>
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className={`absolute top-1 h-10 w-10 rounded-full ${on ? "left-1 bg-[#fffbe6] shadow-[0_0_24px_6px_rgba(255,236,170,.95)]" : "right-1 bg-[#5a5045]"}`}
                />
              </span>
              <span className={`text-[15px] font-medium transition-colors duration-500 ${on ? "text-[#6b4e1b]" : "text-[#f0d68a]"}`}>{on ? "האור דולק" : "האור כבוי"}</span>
            </button>

            <AnimatePresence mode="wait">
              {on ? (
                <motion.div key="on" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.45 } }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                  <p className="mt-8 font-display text-[1.6rem] font-medium leading-[1.2] text-[#2a2118] md:text-[1.8rem]">{contrast.on.label}</p>
                  <div className="mt-4 rounded-2xl border border-[#c9a227]/55 bg-white/80 p-4 shadow-[0_14px_40px_-16px_rgba(212,175,55,.7)]">
                    <p className="text-[14px] font-medium text-[#6b4e1b]">{contrast.on.card}</p>
                    <p className="mt-1 text-[16px] leading-[1.6] text-[#2a2118]">{contrast.on.cardText}</p>
                  </div>
                  <ul className="mt-4 flex flex-col gap-3">
                    {contrast.on.noMore.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[16px] leading-[1.6] text-[#2a2118] md:text-[17px]">
                        <span aria-hidden="true" className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full gold-metal-bg shadow-[0_0_10px_2px_rgba(212,175,55,.8)]" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} exit={{ opacity: 1 }}>
                  <p className="mt-8 font-display text-[1.6rem] font-medium leading-[1.2] text-[#f6f0e6] md:text-[1.8rem]">{contrast.off.label}</p>
                  <motion.ul className="mt-4 flex flex-wrap gap-2" initial="hidden" animate="show" exit="exit" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } }, exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } } }}>
                    {contrast.tasks.map((t) => (
                      <motion.li key={t} variants={chip} className="rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-[15px] text-[#f6f0e6]">
                        {t}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Budget on={on} />
        </div>
      </div>
    </section>
  );
}
