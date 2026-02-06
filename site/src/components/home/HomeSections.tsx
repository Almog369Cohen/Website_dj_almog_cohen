"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useEnergy } from "@/context/EnergyContext";
import { RevealText } from "@/components/ui/RevealText";
import { SmoothScrollLink } from "@/components/ui/SmoothScrollLink";
import { TagsPills } from "@/components/ui/TagsPills";
import { WeddingsLevel100 } from "./sections/WeddingsLevel100";
import { ChogegMenagenLevel100 } from "./sections/ChogegMenagenLevel100";

export const HomeSections = () => {
  const { isRaveMode } = useEnergy();
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const isMobile = useIsMobile();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const animationConfig = isMobile || prefersReducedMotion ? {
    duration: 0.3,
    ease: "easeOut"
  } : {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94]
  };

  const brandGlowAnimation = !isMobile && !prefersReducedMotion ? {
    animate: {
      boxShadow: [
        "0 0 20px rgba(5, 156, 192, 0.3)",
        "0 0 30px rgba(3, 178, 140, 0.5)",
        "0 0 20px rgba(5, 156, 192, 0.3)"
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  } : {};

  const carouselImages = [
    "/assets/almog/IMG_6561.jpg",
    "/assets/almog/מסיבת רחוב יד למעלה מעלה .jpg",
    "/assets/almog/מיקרופון מעלה אדומים.jpg",
    "/assets/almog/ידיים של מלך מעלה אדומים.jpg",
  ];

  const nextImage = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  return (
    <>
      {/* --- 1. STORIES (MOVED UP) --- */}
      <section id="stories" className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24 bg-depth-2">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-right"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          >
            יותר ממוזיקה. סיפורים.
          </motion.h2>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-brand-green/30 hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(3,178,140,0.2)] md:grid-cols-2 md:p-8"
          >
            {/* Top Gradient Border */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-green via-emerald-400 to-brand-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Side Color Indicator */}
            <div className="absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-brand-green via-emerald-400 to-brand-blue shadow-lg shadow-brand-green/50 transition-all duration-500 group-hover:h-40" />
            
            <div className="brand-noise opacity-10" aria-hidden="true" />
            <div className="relative space-y-4 text-right">
              <h3 className="text-2xl font-black text-white drop-shadow-md transition-transform duration-300 group-hover:scale-105">כשהמרצים שלי הפכו לקהל שלי.</h3>
              <div className="mt-6 space-y-4">
                <p className="text-base font-medium leading-relaxed text-white/95 drop-shadow-md">
                  בקורונה נרשמתי ללמוד שיווק אצל גל ודימה. כשהם ביקשו שאנגן בחתונה שלהם, התהפכו היוצרות. זה כבר לא היה מבחן על הנייר, אלא מבחן על הרחבה.
                </p>
                <p className="text-base font-medium leading-relaxed text-white/95 drop-shadow-md">
                  כשהם לא הפסיקו לרקוד, ידעתי שקיבלתי את הציון הסופי.
                </p>
              </div>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-lg shadow-black/60 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
              <div className="brand-noise opacity-10" aria-hidden="true" />
              <Image src="/assets/almog/wedding-1.jpg" alt="החתונה של גל ודימה" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              
              {/* Photo label */}
              <div className="absolute bottom-4 left-4 rounded-full border border-brand-green/40 bg-black/80 px-3 py-1 backdrop-blur-sm">
                <span className="text-xs font-semibold text-brand-green">גל ודימה • 2020</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-brand-blue/30 hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(5,156,192,0.2)] md:grid-cols-2 md:p-8"
          >
            {/* Top Gradient Border */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-cyan-400 to-brand-green opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Side Color Indicator */}
            <div className="absolute left-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-blue via-cyan-400 to-brand-green shadow-lg shadow-brand-blue/50 transition-all duration-500 group-hover:h-40" />
            
            <div className="relative space-y-4 text-right order-first md:order-last">
              <h3 className="text-2xl font-black text-white drop-shadow-md transition-transform duration-300 group-hover:scale-105">רגעים שהפכו למזכרת.</h3>
              <p className="text-sm font-medium text-white/95 drop-shadow-sm">גלריית תמונות מהרחבה</p>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:col-span-2">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full"
              >
                <Image src={carouselImages[carouselIndex]} alt={`מסיבת רחוב מעלה אדומים ${carouselIndex + 1}`} fill className="object-cover" />
                <div className="image-fade-premium" />
              </motion.div>

              <button
                onClick={prevImage}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 md:p-3 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="תמונה קודמת"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 md:p-3 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="תמונה הבאה"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. VALUE PROPOSITION (BENTO GRID) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-12 md:py-24 bg-depth-1">
        <div className="mb-12 text-center">
          <h2 className="text-fluid-h2 font-bold text-white">למה דווקא אלמוג?</h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-blue to-brand-green" />
        </div>
        <div className="bento-grid">
          {[
            {
              title: "12 שנות ניסיון",
              desc: "כשאתם בוחרים בי, אתם בוחרים בשקט נפשי. אין הפתעות, אין 'שכחתי', יש רק מקצוענות נטו.",
              icon: (
                <svg className="h-8 w-8 text-brand-blue drop-shadow-[0_0_8px_rgba(5,156,192,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              title: "קריאת קהל מדויקת",
              desc: "לדעת מתי להרים ומתי להוריד זה המפתח. אני לא מנגן לעצמי, אני מנגן לרחבה שלכם.",
              icon: (
                <svg className="h-8 w-8 text-brand-green drop-shadow-[0_0_8px_rgba(3,178,140,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            },
            {
              title: "ציוד וגיבוי מלא",
              desc: "ציוד קצה ברמה הגבוהה ביותר, ותמיד עם מערכת גיבוי מלאה. שום דבר לא יעצור את המסיבה.",
              icon: (
                <svg className="h-8 w-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bento-item touch-target group relative overflow-hidden p-6 text-center"
            >
              {/* Top Gradient Border */}
              <div className={`absolute left-0 right-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                i === 0 ? 'bg-gradient-to-r from-brand-blue to-cyan-400' :
                i === 1 ? 'bg-gradient-to-r from-brand-green to-emerald-400' :
                'bg-gradient-to-r from-white to-gray-300'
              }`} />
              
              {/* Side Color Indicator */}
              <div className={`absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-l-full shadow-lg transition-all duration-500 group-hover:h-24 ${
                i === 0 ? 'bg-gradient-to-b from-brand-blue to-cyan-400 shadow-brand-blue/50' :
                i === 1 ? 'bg-gradient-to-b from-brand-green to-emerald-400 shadow-brand-green/50' :
                'bg-gradient-to-b from-white to-gray-300 shadow-white/50'
              }`} />
              
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                i === 0 ? 'bg-brand-blue/10 border-brand-blue/30 group-hover:shadow-brand-blue/30' :
                i === 1 ? 'bg-brand-green/10 border-brand-green/30 group-hover:shadow-brand-green/30' :
                'bg-white/10 border-white/30 group-hover:shadow-white/30'
              }`}>
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-black text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-105">{item.title}</h3>
              <p className="text-white/85 font-medium leading-relaxed drop-shadow-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 2.5 SPECIAL MOMENT SECTION (NEW) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, y: -4 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="group relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-teal-900/20 p-8 text-center backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_30px_80px_rgba(0,188,212,0.3)] md:p-12"
        >
          {/* Animated Glow Background */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
          
          {/* Top Gradient Border */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
          
          {/* Side Indicators */}
          <div className="absolute left-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-400 via-blue-400 to-teal-400 shadow-lg shadow-cyan-400/50 transition-all duration-600 group-hover:h-48" />
          <div className="absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-teal-400 via-blue-400 to-cyan-400 shadow-lg shadow-teal-400/50 transition-all duration-600 group-hover:h-48" />

          {/* Highlight Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 rounded-full border border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 backdrop-blur-md shadow-lg shadow-cyan-500/25"
          >
            <motion.div 
              animate={!isMobile && !prefersReducedMotion ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
              transition={!isMobile && !prefersReducedMotion ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
              className="flex h-6 w-6 items-center justify-center"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                  fill="url(#starBrandGradient)" 
                  stroke="url(#starBrandStroke)" 
                  strokeWidth="1"
                />
                <defs>
                  <linearGradient id="starBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059cc0" />
                    <stop offset="100%" stopColor="#03b28c" />
                  </linearGradient>
                  <linearGradient id="starBrandStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#03b28c" />
                    <stop offset="100%" stopColor="#059cc0" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-white drop-shadow-lg" style={{ color: '#059cc0' }}>חדש</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-3xl font-black md:text-5xl"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,188,212,0.5)]">
              הרגע שגונב את ההצגה
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white font-semibold drop-shadow-md"
          >
            12 שנים בתחום לימדו אותי דבר אחד: מוזיקה טובה זה הבסיס, אבל חיבור אנושי זה הקסם.
            <br />
            אני בוחר את האירועים שלי והאנשים שלצידי בפינצטה, ככה אני מוודא שכל ערב הוא לא סתם עבודה אלא הצגה.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <SmoothScrollLink
              href="#chogeg-menagen"
              ariaLabel="מעבר לסקשן חוגג מנגן"
              className="btn-neon touch-target group relative inline-flex items-center gap-3 overflow-hidden px-8 py-4 text-lg"
            >
              <span className="relative z-10">בואו לראות איך זה נראה</span>
              <motion.svg 
                className="relative z-10 h-5 w-5"
                animate={!isMobile && !prefersReducedMotion ? { x: [0, 5, 0] } : {}}
                transition={!isMobile && !prefersReducedMotion ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
              
              {!isMobile && !prefersReducedMotion && (
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              )}
            </SmoothScrollLink>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 3. THE SPLIT (WHO IS THIS FOR) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-32 bg-depth-1">
        {/* Animated brand element - Desktop Only */}
        {!isMobile && (
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -left-10 top-4 h-24 w-24 opacity-30"
          >
            <Image src="/assets/brand/arrows-color.png" alt="אלמנט חצים מותגי" fill className="object-contain" />
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-right"
        >
          <RevealText delay={0.1}>
            <h2 
              style={{
                fontSize: "var(--font-fluid-h2)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                background: "linear-gradient(90deg, #03b28c 0%, #66f4d9 50%, #059cc0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              className="text-center"
            >
              אז, לשם מה התכנסנו?
            </h2>
          </RevealText>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
          {/* Card 1 - Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-right backdrop-blur-xl transition-all duration-500 hover:border-brand-green/40 hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(3,178,140,0.25)] md:p-8"
          >
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-brand-green/0 via-brand-green/10 to-brand-blue/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Top gradient border */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-green via-emerald-400 to-brand-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Color indicator line */}
            <div className="absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-green via-emerald-400 to-brand-blue shadow-lg shadow-brand-green/50 transition-all duration-500 group-hover:h-32" />
            
            <div className="relative">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-brand-green"
              >
                לאירוע שלכם
              </motion.p>
              <h3 className="mt-3 text-2xl font-black text-white md:text-3xl lg:text-4xl">באנו לחגוג</h3>
              <p className="mt-4 leading-relaxed text-white/85">
                האירוע שלכם מתקרב ואתם מחפשים "ראש שקט". מישהו שיקרא את הקהל, יעיף את האנרגיות, ויתן לכם להיות אורחים באירוע של עצמכם. 
                התמחות ב<strong className="text-white">חתונות בוטיק</strong> ואפטר פארטי של <strong className="text-white">טכנו והאוס</strong>.
              </p>
              <div className="mt-6 flex justify-end">
                <motion.div whileHover={!isMobile ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/weddings"
                    className="btn-neon touch-target group/btn relative inline-flex items-center gap-2 overflow-hidden px-6 py-3 text-sm"
                  >
                    <span className="relative z-10">DJ לחתונות ואירועים ←</span>
                    <svg className="relative z-10 h-4 w-4 transition group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {!isMobile && (
                      <motion.div
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />
                    )}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - School */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-right backdrop-blur-xl transition-all duration-500 hover:border-brand-blue/40 hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(5,156,192,0.25)] md:p-8"
          >
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-brand-blue/0 via-brand-blue/10 to-brand-green/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* Top gradient border */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-cyan-400 to-brand-green opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Color indicator line */}
            <div className="absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-blue via-cyan-400 to-brand-green shadow-lg shadow-brand-blue/50 transition-all duration-500 group-hover:h-32" />
            
            <div className="relative">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue"
              >
                לעתיד שלך כדיג'יי
              </motion.p>
              <h3 className="mt-3 text-2xl font-black text-white md:text-3xl lg:text-4xl">באתי ללמוד</h3>
              <p className="mt-4 leading-relaxed text-white/85">
                החלום הוא לא רק לרקוד, אלא לשלוט בקצב. אם אתם רוצים להפוך את האהבה למוזיקה למקצוע אמיתי (ולא סתם חוג) – הכירו את <strong className="text-brand-blue">Compakt Academy</strong>.
              </p>
              <div className="mt-6 flex justify-end">
                <motion.div whileHover={!isMobile ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/academy"
                    className="btn-neon-outline touch-target group/btn relative inline-flex items-center gap-2 overflow-hidden px-6 py-3 text-sm"
                  >
                    <span className="relative z-10">גלו את Compakt Academy ←</span>
                    <svg className="relative z-10 h-4 w-4 transition group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {/* Color indicator line */}
                    <div className="absolute right-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-blue to-brand-green transition-all duration-300 group-hover/btn:h-8" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* --- 4. QUICK ACTIONS --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 bg-depth-2">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-between text-sm text-white/85 drop-shadow-sm"
        >
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px flex-1 bg-gradient-to-l from-white/20 via-white/10 to-transparent"
          />
          <span className="px-4 font-bold uppercase tracking-[0.3em]">פעולות מהירות</span>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent"
          />
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {/* WhatsApp */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={wa("שלום אלמוג, אשמח לשוחח בוואטסאפ לגבי אירוע / חתונה / קורס.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="פתיחת שיחה בוואטסאפ עם אלמוג"
            className="touch-target group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 -z-10 rounded-full bg-brand-green/20 blur-xl"
              />
              <div className="glass-panel relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-green/30 transition group-hover:border-brand-green group-hover:shadow-[0_0_30px_rgba(3,178,140,0.6)]">
                <svg className="h-8 w-8 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/95 drop-shadow-sm transition group-hover:text-brand-green">וואטסאפ</span>
          </motion.a>

          {/* Phone */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="tel:+972502427616"
            aria-label="התקשרות טלפונית לאלמוג"
            className="touch-target group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -inset-2 rounded-full bg-white/10 blur-xl"
              />
              <div className="glass-panel relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 transition group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                <svg className="h-8 w-8 text-white/95 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/95 drop-shadow-sm transition group-hover:text-white">טלפון</span>
          </motion.a>

          {/* Instagram */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/dj_almog_cohen/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="מעבר לעמוד האינסטגרם של אלמוג"
            className="touch-target group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -inset-2 -z-10 rounded-full bg-brand-blue/20 blur-xl"
              />
              <div className="glass-panel relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-blue/30 transition group-hover:border-brand-blue group-hover:shadow-[0_0_30px_rgba(5,156,192,0.6)]">
                <svg className="h-8 w-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/95 drop-shadow-sm transition group-hover:text-brand-blue">אינסטגרם</span>
          </motion.a>

          {/* Email */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:almogmusiccohen@gmail.com"
            aria-label="שליחת מייל לאלמוג"
            className="touch-target group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="absolute -inset-2 rounded-full bg-white/10 blur-xl"
              />
              <div className="glass-panel relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 transition group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                <svg className="h-8 w-8 text-white/95 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/95 drop-shadow-sm transition group-hover:text-white">מייל</span>
          </motion.a>
        </div>
      </section>


      {/* --- 5. MUSIC (MOVED UP) --- */}
      <section id="music-section" className="relative py-16 md:py-24 bg-depth-1">
        {!isMobile && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -60, 0],
                borderRadius: ["50% 50%", "40% 60%", "50% 50%"]
              }}
              transition={{ duration: 22, repeat: Infinity }}
              className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 bg-brand-blue/10 blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 60, 0],
                borderRadius: ["50% 50%", "60% 40%", "50% 50%"]
              }}
              transition={{ duration: 18, repeat: Infinity }}
              className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-96 w-96 bg-brand-green/10 blur-3xl"
            />
          </>
        )}

        <div className="relative mx-auto w-full max-w-6xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-right"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-2xl font-bold text-transparent md:text-4xl lg:text-5xl"
            >
              לא משמיע להיטים. יוצר אותם מחדש.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-lg text-white/95 font-medium drop-shadow-sm"
            >
              ההבדל בין שיר טוב לרגע שנשאר נמצא בגרסה המיוחדת שלא שמעתם בשום מקום אחר. קבלו הצצה לאדיטים ולחומרים בלעדיים.
            </motion.p>
          </motion.div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="snap-x-container md:grid md:gap-6 md:grid-cols-3 md:overflow-visible">
            <a
              href="https://youtu.be/cLZaotSdbAg"
              target="_blank"
              rel="noopener noreferrer"
              className="snap-x-item md:w-auto touch-target group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl shadow-black/40 backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                <Image
                  src="https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg"
                  alt="תמונה ממוזערת של סרטון יוטיוב"
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-lg transition group-hover:scale-110">
                    <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-brand-blue font-bold drop-shadow-sm">לייב</p>
                <h3 className="mt-1 text-base font-semibold">Live Set - ים המלח</h3>
                <p className="mt-2 text-xs text-white/95 font-medium drop-shadow-sm">סט מהרחבה - אנרגיה חיה מתחילה עד סוף.</p>
              </div>
            </a>

            <a
              href="https://youtu.be/Y0j0n9UopIg"
              target="_blank"
              rel="noopener noreferrer"
              className="snap-x-item md:w-auto touch-target group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl shadow-black/40 backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                <Image
                  src="https://img.youtube.com/vi/Y0j0n9UopIg/maxresdefault.jpg"
                  alt="תמונה ממוזערת של סרטון יוטיוב"
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-lg transition group-hover:scale-110">
                    <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-brand-blue font-bold drop-shadow-sm">New Release</p>
                <h3 className="mt-1 text-base font-semibold">Remix - הסוד שלי ממך</h3>
                <p className="mt-2 text-xs text-white/85">רמיקס רשמי לשיר הקלאסי, בגרסת רחבות מחשמלת.</p>
              </div>
            </a>

            <a
              href="https://youtu.be/IlXhyfptrX8"
              target="_blank"
              rel="noopener noreferrer"
              className="snap-x-item md:w-auto touch-target group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl shadow-black/40 backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                <Image
                  src="https://img.youtube.com/vi/IlXhyfptrX8/maxresdefault.jpg"
                  alt="תמונה ממוזערת של סרטון יוטיוב"
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-lg transition group-hover:scale-110">
                    <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-brand-blue/80">Mix Tape</p>
                <h3 className="mt-1 text-base font-semibold">Mainstream Vol. 1</h3>
                <p className="mt-2 text-xs text-white/85">אוסף להיטים ורגעים נבחרים במיקס אחד זורם.</p>
              </div>
            </a>
          </div>
        </div>
      </section>


      {/* --- 6. WEDDINGS (DEEP DIVE) --- */}
      <WeddingsLevel100 />


      {/* --- 7. CHOGEG MENAGEN (DEEP DIVE) --- */}
      <ChogegMenagenLevel100 />


      {/* --- 8. SCHOOL (DEEP DIVE) --- */}
      <section id="school-section" className="relative mx-auto w-full max-w-6xl px-4 py-12 bg-depth-2">
        <button
          onClick={() => setSchoolOpen(!schoolOpen)}
          className="group w-full glass-panel px-6 py-5 text-right hover:border-brand-blue/50"
          aria-expanded={schoolOpen}
          aria-controls="school-content"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <motion.div
                  animate={!isMobile && !prefersReducedMotion ? { 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={!isMobile && !prefersReducedMotion ? { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  } : { duration: 0.3 }}
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                      fill="url(#starGradient)" 
                      stroke="url(#starStroke)" 
                      strokeWidth="1"
                    />
                    <defs>
                      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#03b28c" />
                        <stop offset="100%" stopColor="#059cc0" />
                      </linearGradient>
                      <linearGradient id="starStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#059cc0" />
                        <stop offset="100%" stopColor="#03b28c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white bg-brand-blue/20 px-3 py-1 rounded-full border border-brand-blue/40 drop-shadow-lg">
                  למי שרוצה ללמוד לתקלט
                </span>
              </div>
              <h2 className="text-2xl font-bold md:text-3xl text-white drop-shadow-md">בית הספר של אלמוג – מאפס ועד רחבה מלאה</h2>
              <p className="mt-2 text-sm text-white/95 font-medium drop-shadow-sm">10+ שנים מלמד • עשרות תלמידים מופיעים היום • מתחילים ועד מתקדמים</p>
            </div>
            <motion.div
              animate={{ rotate: schoolOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-brand-blue"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        <motion.div
          id="school-content"
          initial={false}
          animate={{
            height: schoolOpen ? "auto" : 0,
            opacity: schoolOpen ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-2 pt-8 pb-4">
            <div className="mb-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3 md:grid-cols-3">
              <div className="glass-panel px-4 py-3">
                <div className="text-2xl font-bold text-brand-blue">10+</div>
                <div className="text-xs text-foreground-secondary">שנים מלמד DJ&apos;ים</div>
              </div>
              <div className="glass-panel px-4 py-3">
                <div className="text-2xl font-bold text-brand-blue">50+</div>
                <div className="text-xs text-foreground-secondary">תלמידים הופיעו ברחבות</div>
              </div>
              <div className="glass-panel px-4 py-3">
                <div className="text-2xl font-bold text-brand-blue">100%</div>
                <div className="text-xs text-foreground-secondary">ליווי אישי מותאם</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="glass-card glass-card-glow glass-card-corner p-6 text-center"
              >
                <h3 className="mb-2 text-xl font-semibold">קורס מתחילים</h3>
                <p className="mb-4 text-sm text-white/90 drop-shadow-sm">מאפס מוחלט ועד המיקס הראשון שלך. כל מה שצריך כדי להתחיל נכון.</p>
                <Link className="font-medium text-brand-blue hover:underline" href="/courses">פרטים נוספים →</Link>
                <TagsPills 
                  tags={['קורס DJ', 'לימודי תקלוט', 'ציוד DJ', 'מתחילים', 'איך להיות DJ', 'Pioneer DJ', 'Serato DJ', 'בית ספר DJ', 'קורס בתל אביב', 'DJ מאפס']}
                  variant="blue"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="glass-card glass-card-glow glass-card-corner p-6 text-center"
              >
                <h3 className="mb-2 text-xl font-semibold">קורס מתקדמים</h3>
                <p className="mb-4 text-sm text-white/90 drop-shadow-sm">טכניקות מתקדמות, בניית סט מקצועי והבנת דינמיקת רחבה.</p>
                <Link className="font-medium text-brand-blue hover:underline" href="/courses">פרטים נוספים →</Link>
                <TagsPills 
                  tags={['טכניקות מיקס', 'בניית קריירה', 'מנטורינג DJ', 'הפקה', 'Harmonic mixing', 'קריאת קהל', 'שיווק לאמנים', 'מיתוג אישי', 'DJ מקצועי']}
                  variant="blue"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="glass-card glass-card-glow glass-card-corner p-6 text-center"
              >
                <h3 className="mb-2 text-xl font-semibold">ליווי אישי</h3>
                <p className="mb-4 text-sm text-white/90 drop-shadow-sm">Artist Development מלא - מיתוג, שיווק, הפקה ובניית קריירה.</p>
                <a href={wa("היי, אשמח לפרטים על ליווי אישי")} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-blue hover:underline">קבע פגישת ייעוץ →</a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>


      {/* --- 9. BLOG --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24" aria-labelledby="home-blog-heading">

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="text-right">
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue"
            >
              מהבלוג
            </motion.p>
            <motion.h2 
              id="home-blog-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-2xl font-bold text-transparent md:text-4xl lg:text-5xl"
            >
              מדריכים וטיפים לאירוע המושלם
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 max-w-2xl text-lg text-white/85 drop-shadow-sm"
            >
              תוכן מקצועי לזוגות, מפיקים ו-DJ&apos;ים – בחירת DJ, פלייליסט לחופה, קורסים ועוד.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/blog" 
              className="btn-neon-outline touch-target inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              לכל המאמרים
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
          >
            <div className="space-y-3">
              <p className="text-xs text-brand-blue/80">חתונות</p>
              <h3 className="text-lg font-semibold">איך לבחור DJ לחתונה: 5 שאלות חובה לפני שסוגרים</h3>
              <p className="text-sm text-white/75">המדריך לזוגות שמחפשים DJ ברמה הגבוהה ביותר – עם 5 שאלות מפתח לפגישת הייעוץ.</p>
            </div>
            <div className="mt-4">
              <Link href="/blog/how-to-choose-wedding-dj" className="text-sm font-semibold text-brand-blue hover:underline">
                לקריאת המאמר →
              </Link>
            </div>
          </motion.article>

          <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
          >
            <div className="space-y-3">
              <p className="text-xs text-brand-blue/80">חופה</p>
              <h3 className="text-lg font-semibold">20 שירי כניסה לחופה שישברו את הרשת</h3>
              <p className="text-sm text-white/75">פלייליסט חופה מחולק לקטגוריות – קלאסיים, בחירות פחות צפויות ושירים לכניסת הורים וסבים.</p>
            </div>
            <div className="mt-4">
              <Link href="/blog/chuppah-20-songs" className="text-sm font-semibold text-brand-blue hover:underline">
                לקריאת המאמר →
              </Link>
            </div>
          </motion.article>

          <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
          >
            <div className="space-y-3">
              <p className="text-xs text-brand-blue/80">החלטות מוזיקליות</p>
              <h3 className="text-lg font-semibold">DJ או להקה? המדריך המאוזן שיעזור לכם להחליט</h3>
              <p className="text-sm text-white/75">סקירה של היתרונות, החסרונות והפתרון המנצח – DJ עם נגנים חיים.</p>
            </div>
            <div className="mt-4">
              <Link href="/blog/dj-or-band-guide" className="text-sm font-semibold text-brand-blue hover:underline">
                לקריאת המאמר →
              </Link>
            </div>
          </motion.article>
        </div>
      </section>


      {/* --- 10. ABOUT --- */}
      <section className="relative overflow-hidden py-20 md:py-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-32 bg-gradient-to-b from-brand-dark to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-brand-dark to-transparent" />
        
        <motion.div 
          className="absolute inset-0"
          animate={!isMobile ? {
            background: [
              "radial-gradient(circle at 20% 50%, rgba(5,156,192,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(3,178,140,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(5,156,192,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(3,178,140,0.15) 0%, transparent 50%)",
            ]
          } : {
             background: "radial-gradient(circle at 50% 50%, rgba(5,156,192,0.1) 0%, transparent 70%)"
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="brand-noise opacity-20" aria-hidden="true" />
        
        {!isMobile && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 0.8, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-32 top-20 h-96 w-96 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 0.8, 1.2, 1],
                rotate: [360, 270, 180, 90, 0],
                borderRadius: ["70% 30% 30% 70% / 30% 70% 70% 30%", "30% 70% 70% 30% / 70% 30% 30% 70%", "70% 30% 30% 70% / 30% 70% 70% 30%"]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 bg-gradient-to-br from-brand-green/20 to-brand-blue/20 blur-3xl"
            />
          </>
        )}

        {!isMobile && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="pointer-events-none absolute h-2 w-2 rounded-full bg-brand-green/40"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}

        <div className="relative mx-auto w-full max-w-7xl px-4">
          <div className="grid items-center gap-8 md:gap-16 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -80, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative"
            >
              <div className="absolute -inset-2 animate-pulse rounded-[40px] bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue opacity-60 blur-2xl" />
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-brand-green via-brand-blue to-brand-green opacity-40 blur-3xl" />
              
              <motion.div 
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative overflow-hidden rounded-[32px] border-2 border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                <Image 
                  src="/assets/almog/IMG_6561.jpg" 
                  alt="DJ Almog Cohen" 
                  width={700} 
                  height={900} 
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-brand-blue/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-blue/10 opacity-0 transition duration-500 group-hover:opacity-100" />
                
                <motion.div
                  animate={!isMobile ? { 
                    y: [0, -12, 0],
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-4 right-4 md:bottom-8 md:right-8 overflow-hidden rounded-full border-2 border-brand-green/60 bg-black/90 backdrop-blur-xl"
                >
                  {!isMobile && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-brand-green/20 to-brand-blue/20" />
                  )}
                  <div className="relative flex items-center gap-2 px-4 py-2 md:gap-3 md:px-5 backdrop-blur-md">
                    <span className="relative flex h-4 w-4">
                      {!isMobile && (
                        <>
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-brand-green opacity-75" style={{ animationDelay: "0.5s" }} />
                        </>
                      )}
                      <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-green shadow-[0_0_15px_rgba(3,178,140,0.8)]" />
                    </span>
                    <span className="text-xs md:text-base font-bold text-brand-green">זמין לאירועים</span>
                  </div>
                </motion.div>

                {!isMobile && (
                  <motion.div
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-brand-green/10 to-transparent"
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative z-10 space-y-8 text-right"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-brand-blue/40 bg-gradient-to-r from-brand-blue/15 to-brand-green/15 px-5 py-2 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/60 hover:shadow-[0_0_20px_rgba(5,156,192,0.3)]"
              >
                {/* Side color indicator */}
                <div className="absolute right-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-brand-blue to-brand-green shadow-sm shadow-brand-blue/50 transition-all duration-300 group-hover:h-4" />
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(5,156,192,0.8)]"
                />
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-brand-blue">About The Artist</span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.h2 
                  className="text-5xl font-bold leading-tight md:text-7xl"
                  style={{ 
                    background: "linear-gradient(135deg, #059cc0 0%, #ffffff 50%, #03b28c 100%)",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {["המוזיקה", "זה", "אני."].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.6 + i * 0.15,
                        ease: "easeOut"
                      }}
                      className="inline-block mr-2 sm:mr-3"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br />
                  {["האנשים", "זה", "אתם."].map((word, i) => (
                    <motion.span
                      key={i + 3}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 1.1 + i * 0.15,
                        ease: "easeOut"
                      }}
                      className="inline-block mr-2 sm:mr-3"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 }}
                className="relative z-10 text-xl leading-relaxed text-white/95"
              >
                שמי{" "}
                <span className="font-bold text-brand-green">
                  אלמוג כהן
                </span>
                , ואני לא סתם DJ.{" "}
                אני{" "}
                <span className="relative inline-block">
                  <motion.span 
                    className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-brand-blue/40 to-brand-green/40"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2, duration: 0.8 }}
                  />
                  <span className="relative font-bold">מנהל מוזיקלי</span>
                </span>{" "}
                שמאמין שכל אירוע זה סיפור –{" "}
                ואני כאן כדי לתת לו את{" "}
                <span className="font-bold text-brand-blue">
                  הפסקול המושלם
                </span>
                .
              </motion.p>

              <div className="grid grid-cols-3 gap-4 py-6">
                {[
                  { num: "10+", label: "שנים", color: "blue", delay: 1.8 },
                  { num: "500+", label: "אירועים", color: "green", delay: 1.9 },
                  { num: "100%", label: "מחויבות", color: "white", delay: 2 },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotateX: -45 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: stat.delay, type: "spring" }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 10,
                      z: 50
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm ${
                      stat.color === "blue" ? "border-brand-blue/30 bg-brand-blue/10" :
                      stat.color === "green" ? "border-brand-green/30 bg-brand-green/10" :
                      "border-white/30 bg-white/10"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative p-5 text-center">
                      <div className={`text-4xl font-black ${
                        stat.color === "blue" ? "text-brand-blue" :
                        stat.color === "green" ? "text-brand-green" :
                        "text-foreground-heading"
                      }`}>
                        {stat.num}
                      </div>
                      <div className="mt-1 text-xs font-medium text-foreground-secondary">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.1, type: "spring" }}
                className="relative z-10"
              >
                <Link 
                  href="/about"
                  className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue px-10 py-5 text-xl font-black text-white shadow-[0_0_60px_rgba(3,178,140,0.6)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_80px_rgba(3,178,140,0.9)]"
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <span className="relative z-10">הסיפור המלא שלי</span>
                  <motion.svg 
                    className="relative z-10 h-6 w-6"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                  
                  <motion.div
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* --- 11. FAQ --- */}
      <section id="faq" className="relative mx-auto w-full max-w-4xl px-4 pb-20">
        <button
          onClick={() => setFaqOpen(!faqOpen)}
          className="group w-full rounded-2xl border border-border bg-background/40 px-6 py-5 text-right backdrop-blur-sm transition hover:border-border hover:bg-background/50"
          aria-expanded={faqOpen}
          aria-controls="faq-content"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-foreground-secondary">FAQ</p>
              <h2 className="text-xl font-bold text-foreground-heading md:text-2xl">שאלות נפוצות – לפני שסוגרים תאריך</h2>
              <p className="mt-2 text-sm text-foreground-secondary">
                8 שאלות שתעזרנה לכם להחליט • לחצו להרחבה
              </p>
            </div>
            <motion.div
              animate={{ rotate: faqOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background/10 text-foreground"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        <motion.div
          id="faq-content"
          initial={false}
          animate={{
            height: faqOpen ? "auto" : 0,
            opacity: faqOpen ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-background/40">
          {[
            {
              q: "איך אנחנו בוחרים את המוזיקה לאירוע?",
              a: "אנחנו בונים יחד את ה-DNA המוזיקלי שלכם. בפגישת האפיון נצלול לטעמים שלכם, נגדיר 'שחורים' (מה לא לנגן) ו'לבנים' (שירי חובה), ואני אדאג לחבר את הכל לזרימה מדויקת בזמן אמת.",
            },
            {
              q: "מה קורה אם חלילה אתה חולה ביום האירוע?",
              a: "אני מגיע עם רשת ביטחון מלאה. כחלק מהחוזה, ישנו DJ גיבוי ברמה שלי שנמצא בכוננות ומכיר את התיק המוזיקלי שלכם, כך שהאירוע שלכם מבוטח ב-100%.",
            },
            {
              q: "האם אפשר לשלב נגנים חיים?",
              a: "בהחלט. זהו אחד הבידולים שלי. אני עובד קבוע עם סקסופוניסטים, כנרים ומתופפים שיודעים להשתלב על הסט שלי בדיוק ברגעים הנכונים ולהרים את האנרגיה.",
            },
            {
              q: "כמה אתה מעורב בבניית לוח הזמנים של הערב?",
              a: "אני מעורב ממש בבנייה של הערב. מעבר למוזיקה, נעבור יחד על לוח הזמנים – מתי נכון לפתוח את הרחבה, איפה למקם נאומים וברכות, ואיך לתכנן רגעי שיא כך שהערב יהיה זורם, רגוע ומדויק לכם.",
            },
            {
              q: "מה ההבדל בין DJ 'טכני' לבין DJ שמנהל את הרחבה?",
              a: "DJ טכני בא, מנגן והולך – לפעמים בלי גיבוי ובלי לחשוב על סיכונים באירוע. DJ שמנהל רחבה מסתכל על כל הערב: קורא אנשים, שולט באנרגיה, מתכונן מראש לתקלות וגם מגיע עם תוכנית גיבוי. אני מתייחס לכל ערב כמו להופעה חיה שאתם במרכז שלה, לא כעוד סט ברשימה.",
            },
            {
              q: "איך אתה מתמודד עם בקשות בזמן אמת מהמשפחה והחברים?",
              a: "בקשות הן חלק מהכיף. התפקיד שלי הוא לסנן בעדינות מה מתאים עכשיו ומה ישבור את הווייב – כך שכולם ירגישו שקיבלו מקום, והרחבה עדיין תישאר מלאה.",
            },
            {
              q: "האם אתה נפגש איתנו לפני האירוע או שהכול בטלפון?",
              a: "אפשר להיפגש, לדבר בטלפון או זום – מה שנוח לכם. היו לי זוגות שכל כך סמכו עליי שעשינו זום ראשון, ורק חודש לפני החתונה נפגשנו פיזית לבחור יחד שירי חופה, סלואו ושירים לרגעים המיוחדים שלכם.",
            },
            {
              q: "מה חשוב שתדע עלינו לפני שאתה בונה את הסט?",
              a: "חשוב לי לדעת את ההעדפות המוזיקליות שלכם: מי חמשת הזמרים או האמנים שאתם הכי אוהבים, מה אתם ממש לא רוצים לשמוע באירוע, ואיך אתם מדמיינים את האנרגיה ברחבה. את כל השאר נשאיר לפגישה – שם נרכיב את התמונה המלאה ונבנה את הסט.",
            },
          ].map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                key={item.q}
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                className="w-full text-right transition-colors hover:bg-background/5"
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground-heading md:text-base">{item.q}</h3>
                    {isOpen && <p className="mt-2 text-xs text-foreground-secondary md:text-sm">{item.a}</p>}
                  </div>
                  <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/5 text-foreground">
                    <span className={`inline-block text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      ˅
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 px-2 pb-2 text-center">
            <p className="text-xs text-foreground-secondary md:text-sm">
              עברנו על השאלות? אם זה מרגיש מתאים, בואו נבדוק ביחד תאריך פנוי.
            </p>
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={wa("היי אלמוג, עברנו על השאלות באתר ורוצים לבדוק אם אתה פנוי לתאריך שלנו.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-green bg-transparent px-6 py-2 text-xs font-semibold text-brand-green shadow-sm shadow-brand-green/30 transition hover:bg-brand-green/10 md:text-sm"
            >
              <span>בדיקת תאריך ב־WhatsApp</span>
            </motion.a>
          </div>
        </motion.div>
      </section>


      {/* --- 12. FINAL CTA --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        
        {!isMobile && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360],
                borderRadius: ["40% 60%", "60% 40%", "40% 60%"]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="pointer-events-none absolute -left-32 -top-20 -z-10 h-96 w-96 bg-brand-green/15 blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [360, 180, 0],
                borderRadius: ["60% 40%", "40% 60%", "60% 40%"]
              }}
              transition={{ duration: 25, repeat: Infinity }}
              className="pointer-events-none absolute -bottom-20 -right-32 -z-10 h-96 w-96 bg-brand-blue/15 blur-3xl"
            />
          </>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          {/* Gradient Glow Background */}
          {!isMobile && (
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-brand-green/20 via-brand-blue/20 to-brand-green/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
          )}
          
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-background/80 p-8 text-center shadow-2xl backdrop-blur-2xl md:p-16">
            
            {/* Top Gradient Border - Always Visible */}
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-brand-green via-emerald-400 via-brand-blue to-brand-green opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Side Indicators - Always Visible */}
            <div className="absolute left-0 top-1/2 h-40 w-2 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-green via-emerald-400 to-brand-blue shadow-lg shadow-brand-green/50 transition-all duration-500 group-hover:h-64" />
            <div className="absolute right-0 top-1/2 h-40 w-2 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-brand-blue via-cyan-400 to-brand-green shadow-lg shadow-brand-blue/50 transition-all duration-500 group-hover:h-64" />
            
            {/* Noise Overlay */}
            <div className="brand-noise pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-brand-green/30 bg-brand-green/10 px-6 py-2 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-brand-green">זמין עכשיו</span>
            </motion.div>
            
            <div className="relative">
              {/* Main Headline */}
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-4 text-4xl font-black leading-tight text-foreground-heading md:text-6xl md:leading-tight"
                style={{ fontWeight: 900 }}
              >
                תפסיקו לגלול.
                <br />
                <span className="bg-gradient-to-l from-brand-green via-emerald-400 to-brand-blue bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(3,178,140,0.3)]">
                  מצאתם.
                </span>
              </motion.h2>
              
              {/* Description */}
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-foreground-secondary md:text-lg md:leading-relaxed"
              >
                אני זמין לשאלות, להתייעצויות, או סתם כדי להבין אם יש בינינו קליק.
                <br />
                <strong className="text-foreground">בלי התחייבות, ובלי לחץ. פשוט דברו איתי.</strong>
              </motion.p>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-10 flex flex-wrap items-center justify-center gap-6"
              >
                {[
                  { icon: "⚡", text: "תשובה תוך דקות" },
                  { icon: "🎯", text: "ייעוץ ללא עלות" },
                  { icon: "✨", text: "אפס התחייבות" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-medium text-foreground-secondary md:text-sm">{item.text}</span>
                  </div>
                ))}
              </motion.div>
              
              {/* CTA Button */}
              <motion.a
                href={wa("שלום אלמוג, אשמח לבדוק זמינות לאירוע שלי")}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={!isMobile ? { scale: 1.05, y: -2 } : {}}
                whileTap={{ scale: 0.95 }}
                className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-brand-green via-emerald-500 to-brand-blue px-12 py-6 text-lg font-bold text-white shadow-[0_0_50px_rgba(3,178,140,0.6)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(3,178,140,1)] md:text-xl"
              >
                {/* Shimmer Effect */}
                {!isMobile && (
                  <motion.div
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 z-10 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                )}
                
                {/* WhatsApp Icon */}
                <span className="relative z-20">
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                
                <span className="relative z-20 flex items-center gap-2">
                  בדיקת זמינות ב-WhatsApp
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ←
                  </motion.span>
                </span>
              </motion.a>

              {/* Bottom Text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-xs text-foreground-secondary"
              >
                💬 תשובה מהירה בדרך כלל תוך 5-10 דקות
              </motion.p>
            </div>
          </div>
        </motion.div>
      </section>


      {/* --- STICKY ELEMENTS --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] md:hidden">
        <div className="mx-auto flex w-full max-w-6xl gap-3 px-4">
          <a
            href={wa("היי אלמוג, חתונה בתאריך ____. אולם/אזור: ____. כמות אורחים: ____. אפשר לבדוק זמינות?")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="פתיחת שיחה בוואטסאפ עם אלמוג"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#03b28c] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/40"
          >
            <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
              <Image src="/assets/icons/whatsapp.png" alt="אייקון וואטסאפ" width={24} height={24} />
            </span>
            <span>וואטסאפ ישיר</span>
          </a>
          <a
            href={wa("היי אלמוג, חתונה בתאריך ____. אולם/אזור: ____. כמות אורחים: ____. אפשר לבדוק זמינות?")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="בדיקת תאריך פנוי בוואטסאפ"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#059cc0] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/40"
          >
            <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
              <Image src="/assets/icons/whatsapp.png" alt="אייקון לוח שנה" width={24} height={24} />
            </span>
            <span>בדיקת תאריך</span>
          </a>
        </div>
      </div>

    </>
  );
}
