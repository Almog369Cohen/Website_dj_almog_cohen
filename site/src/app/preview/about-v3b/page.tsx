"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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

const worlds = {
  dj: {
    tag: "DJ לאירועים",
    tagColor: "#059cc0",
    title: "בונה רחבות",
    description: "ליווי אישי מהפגישה הראשונה ועד סוף הרחבה. XP2 + נגינת מידי בלייב. קריאת קהל בזמן אמת — לא סט מוכן, אלא תהליך.",
    features: [
      { icon: "🤝", text: "ליווי אישי מהתכנון ועד הרחבה" },
      { icon: "🎛️", text: "XP2 + נגינת מידי בלייב" },
      { icon: "👁️", text: "קריאת קהל בזמן אמת" },
      { icon: "🎵", text: "14 שנה על כל סוגי הרחבות" },
    ],
    stats: [
      { val: 14, suffix: "", label: "שנות ניסיון" },
      { val: 1000, suffix: "+", label: "אירועים" },
    ],
    cta: { text: "בואו נדבר על האירוע", href: waLink, external: true },
    image: "/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG",
  },
  academy: {
    tag: "Compakt Academy",
    tagColor: "#03b28c",
    title: "בונה DJ-ים",
    description: "לתת לדור הבא את הידע והכלים בדרך הכי חדשנית. כלים חכמים, AI, וגישה מעשית — מסלול כניסה לעולם האירועים.",
    features: [
      { icon: "🤖", text: "כלים חדשניים + AI" },
      { icon: "🎯", text: "גישה מעשית — יציאה לשטח מיום 1" },
      { icon: "🚀", text: "מסלול כניסה, לא רק קורס" },
      { icon: "💡", text: "בניית זהות אמנותית ייחודית" },
    ],
    stats: [
      { val: 30, suffix: "+", label: "תלמידים" },
      { val: 5, suffix: "", label: "קבוצות" },
    ],
    cta: { text: "רוצה ללמוד?", href: "/academy", external: false },
    image: "/assets/almog/מיקרופון מעלה אדומים.jpg",
  },
};

type WorldKey = keyof typeof worlds;

export default function AboutV3b() {
  const [activeWorld, setActiveWorld] = useState<WorldKey>("dj");
  const world = worlds[activeWorld];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#0a0a0a", color: "#fff" }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#0a0a0a!important;color:#fff!important}` }} />

      {/* Hero — Clean & Bold */}
      <section className="relative px-4 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#059cc0]/8 to-[#03b28c]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Avatar */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-8 rounded-full overflow-hidden border-2 border-white/10">
              <Image
                src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
                alt="אלמוג כהן"
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-4">
              אלמוג כהן
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 font-bold max-w-lg mx-auto mb-10">
              על הבמה — בונה רחבות.
              <br />
              מחוץ לבמה — בונה DJ-ים.
            </p>

            {/* Mini Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12">
              {[
                { val: 14, suffix: "", label: "שנות ניסיון" },
                { val: 1000, suffix: "+", label: "אירועים" },
                { val: 30, suffix: "+", label: "תלמידים" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white">
                    <CountUp target={s.val} suffix={s.suffix} />
                  </div>
                  <div className="text-[10px] text-white/40 font-bold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm md:text-base leading-[1.9] text-white/70"
          >
            בגיל 14 נכנסתי לשיעור DJ ראשון. המורה אמר ״תצרוב 2 דיסקים ותבוא שבוע הבא.״
            בגיל 15 כבר הייתי על במות במסיבות הכי שוות בירושלים.
            היום, אחרי 1,000+ אירועים, אני עדיין על הרחבה —
            <strong className="text-white"> ומלמד את הדור הבא לעשות את אותו הדבר.</strong>
          </motion.p>
        </div>
      </section>

      {/* Two Worlds — Tab Switcher */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              {(["dj", "academy"] as WorldKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveWorld(key)}
                  className={`relative rounded-full px-6 py-2.5 text-sm font-black transition-all duration-300 ${
                    activeWorld === key
                      ? "text-white"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  {activeWorld === key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: key === "dj"
                          ? "linear-gradient(135deg, #059cc0, #059cc0)"
                          : "linear-gradient(135deg, #03b28c, #03b28c)",
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    {key === "dj" ? "DJ לאירועים" : "Compakt Academy"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorld}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={world.image}
                    alt={world.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Stats overlay */}
                  <div className="absolute bottom-4 right-4 flex gap-4">
                    {world.stats.map((s, i) => (
                      <div key={i} className="rounded-xl bg-black/60 backdrop-blur-sm px-4 py-2 text-center">
                        <div className="text-lg font-black text-white">{s.val.toLocaleString()}{s.suffix}</div>
                        <div className="text-[9px] text-white/50 font-bold">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5"
                    style={{
                      borderColor: `${world.tagColor}30`,
                      backgroundColor: `${world.tagColor}10`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: world.tagColor }} />
                    <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: world.tagColor }}>
                      {world.tag}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{world.title}</h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">{world.description}</p>

                  <div className="space-y-3 mb-8">
                    {world.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg">{f.icon}</span>
                        <span className="text-sm text-white/80">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {world.cta.external ? (
                    <a
                      href={world.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-black text-sm text-white hover:scale-105 transition-transform"
                      style={{ backgroundColor: world.tagColor }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      {world.cta.text}
                    </a>
                  ) : (
                    <Link
                      href={world.cta.href}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-black text-sm text-white hover:scale-105 transition-transform"
                      style={{ backgroundColor: world.tagColor }}
                    >
                      {world.cta.text} →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Quote */}
      <section className="px-4 py-16 md:py-20 border-t border-white/5">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-lg md:text-xl lg:text-2xl font-black leading-relaxed text-white mb-4">
              ״לתת לדור הבא את הידע והכלים בדרך הכי חדשנית
              שאני הייתי רוצה לקבל — זה מה שמניע אותי.״
            </blockquote>
            <p className="text-white/40 text-xs font-bold">— אלמוג כהן</p>
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
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">בואו נדבר</h2>
            <p className="text-white/60 mb-10 text-sm">שיחה קצרה, בלי התחייבות.</p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-10 py-4 font-black text-white hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              שלחו הודעה בוואטסאפ
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
