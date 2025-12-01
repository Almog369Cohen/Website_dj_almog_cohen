"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { ContactFormLevel100 } from "@/components/ui/ContactFormLevel100";
import { TestimonialsSection } from "./TestimonialsSection";

/**
 * HomeSectionsLean - גרסה ממוקדת להמרות
 * מבנה: Social Proof → Split Decision → Final CTA
 */
export const HomeSectionsLean = () => {
  const isMobile = useIsMobile();
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  return (
    <>
      {/* === SECTION 1: SOCIAL PROOF (מהיר וחזק) === */}
      <section className="relative py-12 md:py-20 bg-depth-2">
        <div className="mx-auto max-w-6xl px-4">
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { num: "12+", label: "שנות ניסיון" },
              { num: "500+", label: "אירועים מוצלחים" },
              { num: "100%", label: "שביעות רצון" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-black text-brand-blue glow-blue">
                  {stat.num}
                </div>
                <div className="text-xs md:text-sm text-white/80 font-medium mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* === TESTIMONIALS - המלצות אמיתיות מוואטסאפ === */}
      <TestimonialsSection />

      {/* === SECTION 2: THE SPLIT (החלטה ברורה) === */}
      <section className="relative py-16 md:py-24 bg-depth-1">
        <div className="mx-auto max-w-6xl px-4">
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-5xl font-black text-white mb-12"
          >
            איך אני יכול <span className="text-brand-green">לעזור לך?</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Option 1: אירוע */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-8 text-center transition-all hover:border-brand-green/60 hover:shadow-[0_20px_60px_rgba(3,178,140,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  יש לי אירוע
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  חתונה, בר/בת מצווה, אירוע עסקי או מסיבה פרטית. 
                  אני מתאים את המוזיקה בדיוק לקהל שלך.
                </p>
                <motion.a
                  href={wa("היי אלמוג, יש לי אירוע ואשמח לשמוע פרטים")}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-neon touch-target inline-flex items-center gap-2 px-8 py-4 text-lg"
                >
                  <span>בוא נדבר על האירוע</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Option 2: ללמוד */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-transparent p-8 text-center transition-all hover:border-brand-blue/60 hover:shadow-[0_20px_60px_rgba(5,156,192,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  רוצה ללמוד DJ
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  מאפס ועד רחבה מלאה. קורסים פרטיים, 
                  מנטורינג אישי וליווי מקצועי.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/academy"
                    className="btn-neon-outline touch-target inline-flex items-center gap-2 px-8 py-4 text-lg"
                  >
                    <span>גלה את Compakt Academy</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === SECTION 3: FINAL CTA (לסגירה) === */}
      <section className="relative py-20 md:py-32 bg-depth-3">
        <div className="mx-auto max-w-4xl px-4 text-center">
          
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-8 rounded-full border border-brand-green/50 bg-brand-green/10 px-6 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
            </span>
            <span className="text-sm font-bold text-brand-green">זמין עכשיו לתיאום</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
          >
            מוכנים <span className="text-brand-green">להתחיל?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            שיחה קצרה של 5 דקות יכולה לחסוך לכם שעות של חיפושים. 
            ספרו לי על האירוע ואגיד לכם אם אני הבחירה הנכונה.
          </motion.p>

          {/* Big CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href={wa("היי אלמוג! אשמח לשיחה קצרה על האירוע שלי")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon touch-target w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-lg"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>שלחו הודעה בוואטסאפ</span>
            </motion.a>

            <motion.a
              href="tel:+972502427616"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon-outline touch-target w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>התקשרו עכשיו</span>
            </motion.a>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>ללא התחייבות</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>תשובה תוך שעות</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>ייעוץ חינם</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSectionsLean;
