"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { services, servicesIntro } from "@/content/site";
import { waLink } from "@/lib/whatsapp";
import { ArrowIcon } from "./Icons";
import { Reveal, SectionKicker } from "./Reveal";

type Service = (typeof services)[number];

function Card({ s, index, total, progress }: { s: Service; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.04]);
  const brightness = useTransform(progress, [start, 1], [1, 0.55 + index * 0.1]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div className="sticky top-20 flex min-h-[78svh] items-start justify-center md:top-28 md:h-[78vh] md:min-h-[520px]" style={{ paddingTop: index * 18 }}>
      <motion.article
        style={{ scale, filter }}
        className="zoom-img group relative grid min-h-full w-full origin-top overflow-hidden rounded-[2rem] border border-line bg-bg-soft md:h-full md:grid-cols-2"
      >
        <div className="relative h-40 overflow-hidden sm:h-56 md:order-2 md:h-full">
          <Image src={s.image} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-soft via-transparent to-transparent md:bg-gradient-to-l" />
        </div>
        <div className="relative flex flex-col justify-between p-7 md:p-12">
          <div>
            <span className="font-display text-6xl font-bold text-transparent [-webkit-text-stroke:1px_var(--gold)] md:text-8xl">0{index + 1}</span>
            <h3 className="mt-4 font-display text-3xl font-bold md:text-5xl">{s.title}</h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-dim md:text-lg">{s.text}</p>
          </div>
          <div>
            <div className="mt-6 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-hi">
                  {t}
                </span>
              ))}
            </div>
            <a
              href={waLink(`היי REVER! אשמח לשמוע על: ${s.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 font-bold text-gold transition-all hover:gap-4"
            >
              לבדיקת זמינות <ArrowIcon />
            </a>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionKicker>מה אנחנו עושים</SectionKicker>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              {servicesIntro.title}
              <br />
              <span className="text-gold-grad">{servicesIntro.titleAccent}</span>
            </h2>
          </div>
          <p className="max-w-sm text-ink-dim">{servicesIntro.text}</p>
        </Reveal>
        <div ref={ref} className="relative">
          {services.map((s, i) => (
            <Card key={s.id} s={s} index={i} total={services.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
