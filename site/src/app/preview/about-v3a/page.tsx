"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { buildWhatsAppLink } from "@/utils/whatsapp";

const waLink = buildWhatsAppLink("היי אלמוג, נכנסתי לאתר ואשמח לשמוע עוד!");

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        const dur = 1800;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / dur, 1);
          setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const djFeatures = [
  "ליווי אישי מהפגישה הראשונה ועד סוף הרחבה",
  "XP2 + נגינת מידי בלייב — אפקטים ייחודיים",
  "קריאת קהל בזמן אמת, לא סט מוכן",
  "14 שנה על כל סוגי הרחבות והאירועים",
];

const academyFeatures = [
  "כלים חדשניים + AI לתהליך הלמידה",
  "גישה מעשית — יציאה לשטח מהיום הראשון",
  "מסלול כניסה לעולם האירועים, לא רק קורס",
  "ליווי אישי + בניית זהות אמנותית",
];

export default function AboutV3a() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#0a0a0a", color: "#fff" }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#0a0a0a!important;color:#fff!important}` }} />

      {/* Hero — Cinematic Full Bleed */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/almog/מסיבת רחוב יד למעלה מעלה.jpg"
            alt="DJ אלמוג כהן על הבמה"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#059cc0]/10 via-transparent to-[#03b28c]/10" />
        </div>

        <div className="relative z-10 w-full px-4 pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6">
                אלמוג
                <br />
                <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">כהן</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white font-bold max-w-xl">
                על הבמה — בונה רחבות.
                <br />
                מחוץ לבמה — בונה DJ-ים.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Numbers Strip */}
      <section className="border-y border-white/10 px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: 14, suffix: "", label: "שנות ניסיון" },
            { val: 1000, suffix: "+", label: "אירועים" },
            { val: 30, suffix: "+", label: "תלמידים" },
            { val: 5, suffix: "", label: "קבוצות לימוד" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                <CountUp target={s.val} suffix={s.suffix} />
              </div>
              <div className="text-xs text-white/50 font-bold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">הסיפור בקצרה</h2>
            <div className="h-1 w-12 mx-auto mb-8 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full" />
            <p className="text-base md:text-lg leading-[1.8] text-white/80">
              בגיל 14 נכנסתי לשיעור DJ ראשון. המורה אמר ״תצרוב 2 דיסקים ותבוא שבוע הבא.״
              בגיל 15 כבר הייתי על במות במסיבות הכי שוות בירושלים — יחצן, מפיק, ועל העמדה.
            </p>
            <p className="text-base md:text-lg leading-[1.8] text-white/80 mt-4">
              היום, אחרי 14 שנה ו-1,000+ אירועים, אני עדיין על הרחבה.
              ובמקביל — הקמתי את <strong className="text-[#03b28c] font-black">Compakt Academy</strong> כדי
              לתת לדור הבא את הידע והכלים בדרך הכי חדשנית שאני הייתי רוצה לקבל.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Worlds — Immersive Cards */}
      <section className="px-4 py-8 md:py-16">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* DJ Card — Full Width Horizontal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl overflow-hidden border border-[#059cc0]/15 min-h-[400px] md:min-h-[360px]"
          >
            <div className="absolute inset-0">
              <Image
                src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
                alt="DJ אלמוג כהן באירוע"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/80 to-black/30 md:bg-gradient-to-l md:from-black/90 md:via-black/70 md:to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col justify-end md:justify-center md:items-end h-full p-8 md:p-12">
              <div className="md:max-w-md md:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#059cc0]/30 bg-[#059cc0]/10 px-3 py-1.5 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#059cc0] animate-pulse" />
                  <span className="text-[11px] font-black text-[#059cc0] uppercase tracking-wider">DJ לאירועים</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">בונה רחבות</h2>

                <ul className="space-y-2.5 mb-8">
                  {djFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="text-[#059cc0] mt-0.5 flex-shrink-0">▸</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#059cc0] px-7 py-3.5 font-black text-sm text-white hover:scale-105 transition-transform"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  בואו נדבר על האירוע
                </a>
              </div>
            </div>
          </motion.div>

          {/* Academy Card — Full Width Horizontal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl overflow-hidden border border-[#03b28c]/15 min-h-[400px] md:min-h-[360px]"
          >
            <div className="absolute inset-0">
              <Image
                src="/assets/almog/מיקרופון מעלה אדומים.jpg"
                alt="Compakt Academy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30 md:bg-gradient-to-r md:from-black/90 md:via-black/70 md:to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col justify-end md:justify-center h-full p-8 md:p-12">
              <div className="md:max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#03b28c]/30 bg-[#03b28c]/10 px-3 py-1.5 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#03b28c] animate-pulse" />
                  <span className="text-[11px] font-black text-[#03b28c] uppercase tracking-wider">Compakt Academy</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">בונה DJ-ים</h2>

                <ul className="space-y-2.5 mb-8">
                  {academyFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="text-[#03b28c] mt-0.5 flex-shrink-0">▸</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/academy"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#03b28c] px-7 py-3.5 font-black text-sm text-white hover:scale-105 transition-transform"
                >
                  רוצה ללמוד? →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] mb-8">
              <span className="text-2xl font-black text-white">״</span>
            </div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-black leading-relaxed text-white mb-6">
              לתת לדור הבא את הידע והכלים
              <br className="hidden sm:block" />
              בדרך הכי חדשנית —
              <br className="hidden sm:block" />
              זה מה שמניע אותי.
            </blockquote>
            <p className="text-white/50 text-sm font-bold">— אלמוג כהן, ירושלים</p>
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="px-4 py-10 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">עבדתי עם</p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
            <Image src="/assets/clients/DHL.png" alt="DHL" width={60} height={30} className="h-7 w-auto object-contain invert" />
            <Image src="/assets/clients/logoapril.jpeg" alt="April" width={60} height={30} className="h-7 w-auto object-contain invert rounded" />
            <Image src="/assets/clients/אריאל .jpeg" alt="Ariel" width={60} height={30} className="h-7 w-auto object-contain invert rounded" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">בואו נדבר</h2>
            <p className="text-white/60 mb-10 text-sm">שיחה קצרה, בלי התחייבות. ספרו לי מה אתם מחפשים.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-10 py-4 font-black text-white hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                שלחו הודעה בוואטסאפ
              </a>
              <Link
                href="/weddings"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/15 px-8 py-4 font-bold text-white hover:bg-white/5 transition"
              >
                לעמוד חתונות
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
