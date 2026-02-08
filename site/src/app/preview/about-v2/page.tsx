"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { buildWhatsAppLink } from "@/utils/whatsapp";

const waLink = buildWhatsAppLink("היי אלמוג, נכנסתי לאתר ואשמח לשמוע עוד!");

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const duration = 2000;
          const start = Date.now();
          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { value: 14, suffix: "", label: "שנות ניסיון" },
  { value: 1000, suffix: "+", label: "אירועים" },
  { value: 30, suffix: "+", label: "תלמידים" },
  { value: 1, suffix: "", label: "גישה — ליווי אישי" },
];

const differentiators = {
  events: [
    "ליווי אישי מהתכנון ועד הרחבה",
    "XP2 + נגינת מידי בלייב",
    "קריאת קהל בזמן אמת",
    "14 שנות ניסיון על כל סוגי הרחבות",
  ],
  academy: [
    "כלים חדשניים + AI",
    "גישה מעשית — לא תיאוריה",
    "לא קורס — מסלול כניסה לעולם האירועים",
    "ליווי אישי + יציאה לשטח",
  ],
};

export default function AboutV2() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#000", color: "#fff" }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#000!important;color:#fff!important}` }} />

      {/* Hero — Split */}
      <section className="relative px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-right"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#03b28c]">
                אודות
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-4">
                אלמוג כהן
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-bold">
                DJ. מנטור. ירושלמי.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[3/4] max-w-sm mx-auto md:mx-0 overflow-hidden rounded-2xl"
            >
              <Image
                src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
                alt="DJ אלמוג כהן"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="px-4 py-16 md:py-24 border-y border-white/10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/50 text-sm font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* One Paragraph */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg md:text-xl leading-relaxed text-white/80">
              התחלתי בגיל 14 עם 2 דיסקים צרובים ושיעור בבית ספר.
              היום אני על הבמה ב-1,000+ אירועים, מלמד את הדור הבא,
              ומביא לכל רחבה את מה שאף פלייליסט לא יכול —
              <strong className="text-white"> נוכחות, תזמון, ואנרגיה בלייב.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Different — Two Columns */}
      <section className="px-4 py-16 md:py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-black mb-4 text-white"
          >
            מה שונה אצלי
          </motion.h2>
          <div className="h-1 w-16 mx-auto mb-12 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full" />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Events Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#059cc0]/20 bg-[#059cc0]/5 p-6"
            >
              <h3 className="text-lg font-black text-[#059cc0] mb-4">באירועים</h3>
              <ul className="space-y-3">
                {differentiators.events.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 text-[#059cc0] flex-shrink-0">✓</span>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Academy Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#03b28c]/20 bg-[#03b28c]/5 p-6"
            >
              <h3 className="text-lg font-black text-[#03b28c] mb-4">באקדמיה</h3>
              <ul className="space-y-3">
                {differentiators.academy.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 text-[#03b28c] flex-shrink-0">✓</span>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="px-4 py-12 border-t border-white/10">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-white/30 mb-6">עבדתי עם</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            <Image src="/assets/clients/DHL.png" alt="DHL" width={60} height={30} className="h-8 w-auto object-contain invert" />
            <Image src="/assets/clients/logoapril.jpeg" alt="April" width={60} height={30} className="h-8 w-auto object-contain invert rounded" />
            <Image src="/assets/clients/אריאל .jpeg" alt="Ariel" width={60} height={30} className="h-8 w-auto object-contain invert rounded" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">מעניין אתכם?</h2>
            <p className="text-white/60 mb-8 text-sm">שיחה קצרה, בלי התחייבות.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 font-black text-white hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                שלחו הודעה
              </a>
              <Link
                href="/weddings"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-8 py-4 font-bold text-white hover:bg-white/5 transition"
              >
                לעמוד חתונות
              </Link>
              <Link
                href="/academy"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-8 py-4 font-bold text-white hover:bg-white/5 transition"
              >
                לאקדמיה
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
