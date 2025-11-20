"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setRotateX((y - 0.5) * 10);
    setRotateY((x - 0.5) * -10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function ChogegMenagenPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <>
      {/* Fluid Typography */}
      <style jsx global>{`
        :root {
          --font-fluid-h1: clamp(3.5rem, 8vw + 1rem, 8rem);
          --font-fluid-h2: clamp(2.5rem, 5vw + 1rem, 5rem);
          --font-fluid-h3: clamp(1.75rem, 3vw + 1rem, 3rem);
          --font-fluid-p: clamp(1rem, 1.5vw + 0.5rem, 1.5rem);
        }
      `}</style>

    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HERO WITH PARALLAX */}
      <section ref={heroRef} className="relative flex h-screen min-h-[700px] flex-col items-center justify-center overflow-hidden">
        {/* Background with Parallax */}
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 -z-20"
        >
          <Image src="/assets/almog/hero-poster.jpg" alt="חוגג מנגן" fill className="object-cover brightness-50" priority />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="brand-noise opacity-30" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 mx-auto max-w-5xl px-4 text-center"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-5 py-2"
          >
            {/* Custom SVG Star Icon */}
            <motion.svg
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="h-6 w-6 text-brand-green"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </motion.svg>
            <span className="text-sm font-bold uppercase tracking-wider text-brand-green">שירות חדש ובלעדי</span>
          </motion.div>

          <h1 
            style={{
              fontSize: "var(--font-fluid-h1)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.95
            }}
            className="mb-6 bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-transparent"
          >
            חוגג מנגן
          </h1>

          <p 
            style={{ fontSize: "var(--font-fluid-h3)" }}
            className="mb-8 font-bold text-white/90"
          >
            הקונספט שהופך את <span className="text-brand-green">בעלי השמחה</span> ל<span className="text-brand-blue">כוכבי הערב</span>
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            זה לא עוד אירוע שבו אתם רק צופים. זה הרגע שבו אתם עולים לעמדה, שולטים במוזיקה, ויוצרים זיכרון שהאורחים לא ישכחו.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.a
              href={wa("היי אלמוג, רוצים לשמוע עוד על חוגג מנגן!")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-10 py-4 text-lg font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.6)]"
            >
              <span className="relative z-10">בואו נדבר</span>
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* איך זה עובד - 3 שלבים */}
      <section className="bg-brand-dark py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">איך זה עובד?</h2>
          </div>

          <div className="space-y-16">
            {/* שלב 1 - תמונה 2: פגישת תכנון */}
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image src="/assets/almog/hero-poster.jpg" alt="תכנון" fill className="object-cover" />
              </div>
              <div className="space-y-4 text-right">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-2xl font-bold text-black">1</div>
                <h3 className="text-3xl font-bold text-brand-green">תכנון מותאם אישית</h3>
                <p className="text-lg text-white/80">נפגשים מראש ומתכננים את הרגע המושלם. בוחרים יחד את השיר, הטיימינג, והסגנון.</p>
              </div>
            </div>

            {/* שלב 2 - תמונה 3: בעל שמחה על העמדה */}
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="order-2 space-y-4 text-right md:order-1">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-green text-2xl font-bold text-black">2</div>
                <h3 className="text-3xl font-bold text-brand-blue">הרגע הגדול</h3>
                <p className="text-lg text-white/80">ברגע הנכון, אתם עולים לעמדה. האורחים רואים, הקהל מתלהב, והאנרגיה עולה.</p>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative aspect-video overflow-hidden rounded-2xl">
                  <Image src="/assets/almog/IMG_6561.jpg" alt="על העמדה" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* שלב 3 - תמונה 4: קהל מצלם */}
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image src="/assets/almog/hero-poster.jpg" alt="זיכרון" fill className="object-cover" />
              </div>
              <div className="space-y-4 text-right">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-blue text-2xl font-bold text-black">3</div>
                <h3 className="text-3xl font-bold text-brand-green">זיכרון לכל החיים</h3>
                <p className="text-lg text-white/80">הקטע מצולם, נשמר, ומשותף ברשתות. אתם נשארים עם הסיפור: "תיקלטנו בחתונה שלנו".</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* למה זה מיוחד - WITH 3D CARDS */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue/10 via-[#0a0a0a] to-brand-green/10 py-24">
        <div className="brand-noise opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "var(--font-fluid-h2)",
              fontWeight: 900,
              letterSpacing: "-0.05em"
            }}
            className="mb-16 text-center"
          >
            למה זה מיוחד?
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Benefit 1 - Microphone Icon */}
            <TiltCard className="group">
            <motion.div 
              whileHover={{ y: -10, scale: 1.03 }} 
              className="group rounded-2xl border border-brand-green/20 bg-black/50 p-8 text-center backdrop-blur-sm"
            >
              <motion.div
                className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-green/20 to-brand-blue/20"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <svg className="h-10 w-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-brand-green">חוויה אישית</h3>
              <p className="text-white/70">האורחים רואים אתכם במרכז ומרגישים שזה באמת הערב שלכם</p>
            </motion.div>
            </TiltCard>

            {/* Benefit 2 - Mobile Icon */}
            <TiltCard className="group">
            <motion.div 
              whileHover={{ y: -10, scale: 1.03 }} 
              className="group rounded-2xl border border-brand-blue/20 bg-black/50 p-8 text-center backdrop-blur-sm"
            >
              <motion.div
                className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-green/20"
                whileHover={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.4 }}
              >
                <svg className="h-10 w-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-brand-blue">רגע וירלי</h3>
              <p className="text-white/70">תיעוד שמעלה את האווירה ברשתות ומייצר זיכרון דיגיטלי</p>
            </motion.div>
            </TiltCard>

            {/* Benefit 3 - Sparkle Icon */}
            <TiltCard className="group">
            <motion.div 
              whileHover={{ y: -10, scale: 1.03 }} 
              className="group rounded-2xl border border-brand-green/20 bg-black/50 p-8 text-center backdrop-blur-sm"
            >
              <motion.div
                className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-green/20 to-brand-blue/20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                <svg className="h-10 w-10 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.708 8.292L24 12l-8.292 3.708L12 24l-3.708-8.292L0 12l8.292-3.708z" />
                </svg>
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-brand-green">סיפור ייחודי</h3>
              <p className="text-white/70">זה האירוע שכולם יזכרו ויספרו עליו</p>
            </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* וידאו דמו - תמונה 5: וידאו thumbnail */}
      <section className="bg-brand-dark py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">חוגג מנגן בפעולה</h2>
          <div className="group relative aspect-video overflow-hidden rounded-3xl border-2 border-brand-green/30">
            <Image src="/assets/almog/hero-poster.jpg" alt="וידאו" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <motion.div whileHover={{ scale: 1.2 }} className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-brand-green to-brand-blue">
                <svg className="h-12 w-12 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* גלריה - תמונות 6-11: רגעים מאירועים */}
      <section className="relative bg-gradient-to-br from-black via-brand-dark to-black py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-16 text-center text-4xl font-bold">רגעים מהאירועים</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src="/assets/almog/hero-poster.jpg" alt={`רגע ${i}`} fill className="object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA סופי - תמונה 12: רקע דרמטי */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 -z-10">
          <Image src="/assets/almog/hero-poster.jpg" alt="" fill className="object-cover brightness-50" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/80 to-black/50" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold md:text-6xl">מוכנים להיות הכוכבים?</h2>
            <p className="mx-auto max-w-2xl text-xl text-white/80">
              בואו ניצור יחד את הרגע שהאורחים לא ישכחו
            </p>
            <motion.a
              href={wa("היי אלמוג, מעוניינים בחוגג מנגן - בואו נדבר!")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-12 py-5 text-xl font-bold text-black shadow-[0_0_50px_rgba(3,178,140,0.7)]"
            >
              <span className="relative z-10">בואו נדבר על חוגג מנגן</span>
              <svg className="relative z-10 h-6 w-6 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
