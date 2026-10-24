"use client";

import { motion } from "framer-motion";
import { services, servicesIntro } from "@/content/site";
import { LitImage } from "./LitImage";
import { Reveal, SectionKicker } from "./Reveal";

const GLOWS = ["rgba(233,170,150,.75)", "rgba(170,190,130,.75)", "rgba(240,160,64,.7)", "rgba(240,160,64,.7)"];

/** How it works: the four services in the order a couple lives them, strung on a light wire. Each bulb lights as its step arrives. */
export function Services() {
  return (
    <section id="services" data-scene="day" className="theme-ivory px-4 py-16 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-2xl">
          <SectionKicker>{servicesIntro.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05] [text-wrap:balance]">{servicesIntro.title}</h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-ink-dim">{servicesIntro.text}</p>
        </Reveal>

        <ol className="relative mt-12 md:mt-20">
          <span aria-hidden="true" className="absolute bottom-6 right-[11px] top-2 w-px bg-[#2a2118]/25 md:right-[15px]" />
          {services.map((s, i) => (
            <li key={s.id} className="relative pb-14 pr-12 last:pb-0 md:grid md:grid-cols-12 md:gap-10 md:pb-24 md:pr-16">
              <motion.span
                aria-hidden="true"
                className="absolute right-0 top-1 flex h-6 w-6 items-center justify-center md:h-8 md:w-8"
                initial="off"
                whileInView="on"
                viewport={{ once: true, margin: "0px 0px -45% 0px" }}
              >
                <motion.span
                  className="bulb-halo absolute h-20 w-20 rounded-full"
                  variants={{ off: { opacity: 0, scale: 0.4 }, on: { opacity: 1, scale: 1 } }}
                  transition={{ duration: 0.7 }}
                />
                <motion.span
                  className="relative h-4 w-4 rounded-full border border-[#2a2118]/30 md:h-5 md:w-5"
                  variants={{ off: { backgroundColor: "#e6dccb" }, on: { backgroundColor: "#fff1d6" } }}
                  transition={{ duration: 0.4 }}
                />
              </motion.span>

              <Reveal className="md:col-span-6">
                <p className="text-[13px] font-medium tracking-[0.12em] text-[#8d6b2c]">
                  שלב {i + 1} · {s.step}
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium leading-[1.12] [text-wrap:balance]">{s.title}</h3>
                <p className="mt-4 text-[16px] leading-[1.8] text-ink-dim md:text-[17px]">{s.text}</p>
              </Reveal>
              <Reveal delay={0.1} className="mt-6 md:col-span-6 md:mt-0">
                <LitImage src={s.image} alt="" fill sizes="(min-width:768px) 45vw, 85vw" glow={GLOWS[i]} className="aspect-[3/2] rounded-[20px]" />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
