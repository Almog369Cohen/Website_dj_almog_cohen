"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const ChogegMenagenLevel100 = () => {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  
  return (
    <section id="chogeg-menagen-level-100" className="relative overflow-hidden bg-[#1f1f21] py-20 md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#03b28c]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Headline */}
          <h2 
            className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl"
            style={{ fontWeight: 900 }}
          >
            חוגג מנגן:
            <br />
            <span className="text-[#03b28c]">זה לא מתנה. זה הישג.</span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-white/80">
            הילד לא מקבל "הזדמנות לנגן". הוא מקבל רגע בספוטלייט שמראה שיש לו אומץ ורצינות. 
            <br className="hidden md:inline" />
            לא עוד גימיק — הצגה.
          </p>

          {/* Price Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#03b28c]/30 bg-white/5 p-8 backdrop-blur-md md:p-12"
          >
            <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="text-2xl font-bold text-white/40 line-through md:text-3xl">2800 ₪</span>
                <svg className="h-8 w-8 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-4xl font-black text-[#03b28c] md:text-5xl" style={{ fontWeight: 900 }}>
                  2300 ₪
                </span>
              </div>
              <p className="mb-8 text-sm text-white/60">
                מחיר היכרות מיוחד
              </p>

              <Link
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("היי אלמוג, רציתי לשמוע על 'חוגג מנגן'")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-center text-lg font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.5)] transition hover:shadow-[0_0_60px_rgba(3,178,140,0.8)]"
              >
                תנו להם רגע שמגיע רק למי שעובד עליו
              </Link>
              
              <p className="mt-6 text-xs text-white/40">
                יצירת קשר ישירה ב-WhatsApp
              </p>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-white/50">
              הזמינות מוגבלת. ככה זה עובד ברמה הזו.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
