"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// Images removed - using gradients instead
import Link from "next/link";
import { FinalCTASection } from "@/components/sections";

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
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/30 via-brand-dark to-brand-blue/30" />
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
            className="mb-8 font-bold text-white"
          >
            הקונספט שהופך את <span className="text-brand-green">בעלי השמחה</span> ל<span className="text-brand-blue">כוכבי הערב</span>
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white">
            זה לא עוד אירוע שבו אתם רק צופים. זה הרגע שבו אתם עולים לעמדה, שולטים במוזיקה, ויוצרים זיכרון שהאורחים לא ישכחו.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.a
              href={wa("היי אלמוג, רוצים לשמוע עוד על חוגג מנגן!")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-10 py-4 text-lg font-bold text-white shadow-[0_0_40px_rgba(3,178,140,0.6)]"
            >
              <span className="relative z-10">בואו נדבר</span>
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* 3 שלבים פשוטים */}
      <section className="bg-brand-dark py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">3 שלבים פשוטים</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 rounded-2xl border border-white/10">
              <div className="text-4xl font-black text-brand-green mb-3">1</div>
              <h3 className="font-bold text-lg mb-2">שיחה קצרה</h3>
              <p className="text-white text-sm">מספרים לי על האירוע</p>
            </div>
            <div className="text-center p-6 rounded-2xl border border-white/10">
              <div className="text-4xl font-black text-brand-blue mb-3">2</div>
              <h3 className="font-bold text-lg mb-2">תכנון הרגע</h3>
              <p className="text-white text-sm">בוחרים שירים וטיימינג</p>
            </div>
            <div className="text-center p-6 rounded-2xl border border-white/10">
              <div className="text-4xl font-black text-brand-green mb-3">3</div>
              <h3 className="font-bold text-lg mb-2">עולים לעמדה</h3>
              <p className="text-white text-sm">ויוצרים זיכרון לכל החיים</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href={wa("היי אלמוג, אשמח לשמוע עוד על חוגג מנגן")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-green to-brand-blue rounded-full text-lg font-bold hover:scale-105 transition-transform"
            >
              רוצה לשמוע עוד פרטים
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </a>
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
              <h3 className="mb-3 text-xl font-bold text-brand-green">נוכחות אישית</h3>
              <p className="text-white">האורחים רואים אתכם במרכז ומרגישים שזה באמת הערב שלכם</p>
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
              <p className="text-white">תיעוד שמעלה את האווירה ברשתות ומייצר זיכרון דיגיטלי</p>
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
              <h3 className="mb-3 text-xl font-bold text-brand-green">סיפור שנשאר</h3>
              <p className="text-white">זה האירוע שכולם יזכרו ויספרו עליו</p>
            </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* CTA סופי */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-green/30 via-brand-dark to-brand-blue/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/80 to-black/50" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold md:text-6xl">מוכנים להיות הכוכבים?</h2>
            <p className="mx-auto max-w-2xl text-xl text-white">
              בואו ניצור יחד את הרגע שהאורחים לא ישכחו
            </p>
            <motion.a
              href={wa("היי אלמוג, מעוניינים בחוגג מנגן - בואו נדבר!")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-12 py-5 text-xl font-bold text-white shadow-[0_0_50px_rgba(3,178,140,0.7)]"
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
