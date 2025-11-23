"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

// Brand Colors
const COLORS = {
  blue: "#059cc0",
  green: "#03b28c",
  dark: "#1f1f21",
  white: "#ffffff",
};

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export const ModernHomeContent = () => {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <div className="w-full overflow-hidden bg-white font-sans">
      
      {/* =========================================================================
          A. HERO SECTION (Atmosphere: Exclusive & Emotional)
          ========================================================================= */}
      <section className="relative flex min-h-screen items-center justify-center bg-[#1f1f21] px-4 py-20 text-center">
        {/* Dark Overlay / Background Image Placeholder */}
        <div className="absolute inset-0 z-0 bg-[url('/assets/images/hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1f1f21] via-transparent to-[#1f1f21]" />

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl"
        >
          <motion.h1 variants={fadeInUp} className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            לא מחפש למלא יומן.
            <br />
            <span className="font-black text-[#059cc0]">מחפש ליצור רגעים.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-2xl">
            אני בוחר את האירועים שלי <span className="font-bold underline decoration-[#03b28c] underline-offset-8">בפינצטה</span>.
            <br />
            כי בסופו של דבר, ציוד זה רק טכניקה, אבל{" "}
            <span className="font-semibold italic text-gray-100">חיבור אנושי זה הקסם.</span>
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={waLink}
              className="rounded-full bg-[#059cc0] px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(5,156,192,0.4)] transition-transform hover:scale-105 hover:shadow-[0_0_50px_rgba(5,156,192,0.6)]"
            >
              בואו נבדוק התאמה
            </Link>
            <Link
              href="/music"
              className="rounded-full border-2 border-white/20 bg-transparent px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              לשמוע סטים
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================================
          B. "HOGEG MENAGEN" PRODUCT (Atmosphere: High Energy / The Show)
          ========================================================================= */}
      <section className="relative bg-[#03b28c] px-4 py-24 text-center overflow-hidden">
        {/* Background Noise Texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <motion.div variants={fadeInUp} className="mb-2">
            <span className="text-sm font-medium text-[#1f1f21]/70 line-through">לא עוד אטרקציה</span>
          </motion.div>
          
          <motion.h2 variants={fadeInUp} className="mb-6 text-6xl font-black tracking-tighter text-white md:text-8xl">
            הופעה.
          </motion.h2>

          <motion.div variants={fadeInUp} className="mb-10">
            <span className="inline-block -skew-x-6 transform rounded bg-white/30 px-4 py-2 text-xl font-black text-[#1f1f21] md:text-3xl">
              השואו נטו על החוגג!!
            </span>
          </motion.div>

          <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-3xl text-xl font-medium leading-relaxed text-[#1f1f21] md:text-2xl">
            בין אם זה חתונה, בר מצווה או אירוע פרטי – אנחנו מכינים את הרקע, ואתם הכוכבים.
            <br />
            זה <span className="border-b-4 border-[#1f1f21]">הרגע הכי חזק של הערב</span>, באחריות.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link
              href="/chogeg-menagen"
              className="inline-block rounded-full bg-[#1f1f21] px-10 py-5 text-xl font-bold text-white shadow-2xl transition-transform hover:scale-105"
            >
              לראות איך זה נראה ←
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================================
          C. "WHY ME" / TRUST (Atmosphere: Clean, Professional, Peace of Mind)
          ========================================================================= */}
      <section className="bg-white px-4 py-24 text-[#1f1f21]">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-12 md:grid-cols-3"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#059cc0]/10 text-[#059cc0]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold">12 שנות ניסיון</h3>
              <p className="text-gray-600 leading-relaxed">
                כשאתם בוחרים בי, אתם בוחרים <span className="font-bold text-[#059cc0]">שקט נפשי</span>. 
                הניסיון מאפשר לי לצפות רגעים לפני שהם קורים.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#059cc0]/10 text-[#059cc0]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold">קריאת קהל</h3>
              <p className="text-gray-600 leading-relaxed">
                אני <span className="italic font-semibold">לא מנגן לעצמי</span>. העיניים שלי תמיד על הרחבה, מרגיש את הדופק ומתאים את הקצב בדיוק לשנייה הנכונה.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#059cc0]/10 text-[#059cc0]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold">ציוד וגיבוי</h3>
              <p className="text-gray-600 leading-relaxed">
                סטנדרט טכנולוגי הגבוה ביותר. גיבוי כפול לכל רכיב. 
                <span className="font-semibold"> אצלי אין הפתעות</span> טכניות. נקודה.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          D. MUSIC SECTION (Atmosphere: The Artist)
          ========================================================================= */}
      <section className="relative bg-[#1f1f21] px-4 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold md:text-6xl tracking-tight">
              <span className="font-light text-gray-400">לא משמיע להיטים.</span>
              <br />
              יוצר אותם מחדש.
            </h2>
            <p className="mt-4 text-gray-400">
              כל סט הוא <span className="text-[#03b28c] font-bold">גרסה מיוחדת</span> וחד פעמית לאירוע שלכם.
            </p>
          </motion.div>

          {/* Glassmorphism Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#059cc0] text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">After Party Set 2025</h3>
                <p className="text-sm text-gray-400">אנרגיה גבוהה, האוס ומיינסטרים בגרסאות עריכה מיוחדות.</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/music" className="text-[#059cc0] hover:text-[#03b28c] font-bold transition-colors">
              לכל הסטים שלי ←
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          E. STORIES & SOCIAL PROOF (Atmosphere: Storytelling)
          ========================================================================= */}
      <section className="bg-white px-4 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 items-center md:grid-cols-2">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="mb-4 inline-block rounded bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-500">
              סיפור אמיתי
            </div>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-[#1f1f21] md:text-5xl">
              "חשבנו שאנחנו יודעים מה אנחנו רוצים, ואז <span className="text-[#059cc0]">התהפכו היוצרות</span>."
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              זוגות מגיעים אליי עם רשימה סגורה. זה טבעי. אבל הניסיון שלי הוא לא בללחוץ Play.
              הוא בלעבור <span className="font-bold text-[#059cc0]">מבחן על הרחבה</span> בזמן אמת.
            </p>
            <p className="text-xl font-black text-[#1f1f21]">
              "בסוף הערב, כשהרגליים כאבו והלב היה בעננים – קיבלתי את הציון הסופי."
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-gray-200 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
          >
            {/* Placeholder for Story Image */}
            <div className="absolute inset-0 bg-[url('/assets/images/crowd.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <div className="font-bold text-lg">עמית ונועה</div>
                <div className="text-sm opacity-80">חתונה ב'עלמה', אבן יהודה</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          F. QUALIFYING / FILTER (Atmosphere: Direct & Honest)
          ========================================================================= */}
      <section className="bg-gray-50 px-4 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 md:p-12 shadow-xl border border-gray-100">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-3xl font-black text-[#1f1f21]"
          >
            האם אנחנו מתאימים?
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#059cc0]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#059cc0]/10">✓</span>
                זה בשבילכם אם...
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#03b28c]" />
                  <span className="font-medium text-gray-700">אתם מחפשים <span className="text-[#059cc0] font-bold">שותף לדרך</span>, לא רק ספק.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#03b28c]" />
                  <span className="font-medium text-gray-700">מוזיקה היא הלב של האירוע עבורכם.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#03b28c]" />
                  <span className="font-medium text-gray-700">אתם סומכים על המקצועיות שלי להוביל.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="opacity-70 grayscale transition-all hover:grayscale-0 hover:opacity-100"
            >
               <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">✕</span>
                פחות מתאים אם...
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-300" />
                  <span className="font-medium text-gray-500 line-through decoration-red-500/50 decoration-2">אתם מחפשים את המחיר הכי זול בשוק.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-300" />
                  <span className="font-medium text-gray-500">אתם רוצים DJ שהוא רק "לחיצת כפתור".</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-300" />
                  <span className="font-medium text-gray-500">
                    האירוע הוא <span className="text-red-500/80 line-through decoration-2">עוד שורה באקסל</span> עבורכם.
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          G. FOOTER CTA (Atmosphere: Final Action)
          ========================================================================= */}
      <section className="bg-white px-4 py-24 text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-4 text-4xl font-black tracking-tight text-[#1f1f21] md:text-6xl">
            תפסיקו לגלול. <span className="text-[#059cc0]">מצאתם.</span>
          </h2>
          <p className="mb-10 text-gray-500">
            בלי התחייבות, ובלי לחץ. בואו נדבר ונראה אם יש קליק.
          </p>
          <Link
            href={waLink}
            className="inline-block rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-12 py-6 text-xl font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
          >
            דבר איתי בוואטסאפ ←
          </Link>
        </motion.div>
      </section>

    </div>
  );
};
