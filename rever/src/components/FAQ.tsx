"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { faq } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal className="mb-14 text-center">
          <SectionKicker>שאלות נפוצות</SectionKicker>
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            יש שאלות? <span className="text-gold-grad">יש תשובות.</span>
          </h2>
        </Reveal>
        <div className="divide-y divide-line border-y border-line">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-7 text-right"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className={`font-display text-xl font-bold transition-colors md:text-2xl ${isOpen ? "text-gold-hi" : ""}`}>{f.q}</span>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-gold bg-gold text-bg" : "border-line"}`}>+</span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 text-lg leading-relaxed text-ink-dim">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
