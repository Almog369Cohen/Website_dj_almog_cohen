"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionTransition } from "@/components/ui/SectionTransition";

export const ChogegMenagenLevel100 = () => {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  
  return (
    <section id="chogeg-menagen-level-100" className="relative overflow-hidden bg-[#1f1f21] py-12 md:py-20 lg:py-32">
      
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#03b28c]/20 blur-[150px]" />
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] bg-[#03b28c]/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] bg-[#03b28c]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
            לא עוד אטרקציה.
            <br />
            <span className="text-[#03b28c]">הופעה.</span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-white">
            אתם רגילים לזיקוקים או מגנטים? תשכחו מזה. ב'חוגג מנגן' אתם הכוכבים האמיתיים.
            <br className="hidden md:block" />
            לא משנה אם זו <strong className="text-[#03b28c]">חתונה, בר מצווה או אירוע פרטי</strong> – אנחנו מכינים את הרקע, והשואו נטו עליכם!
            <br className="hidden md:block" />
            הרגע שבו החתן, הכלה או בעל השמחה עולים לעמדה ומרעידים את הרחבה. זה הרגע הכי חזק של הערב, באחריות.
          </p>

          {/* Price Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-card relative mx-auto max-w-2xl overflow-hidden rounded-3xl p-4 md:p-6 lg:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(3,178,140,0.15) 0%, rgba(31,31,33,0.8) 50%, rgba(3,178,140,0.1) 100%)',
              borderColor: 'rgba(3, 178, 140, 0.5)',
              borderWidth: '2px',
              boxShadow: '0 0 60px rgba(3,178,140,0.4), inset 0 0 40px rgba(3,178,140,0.05)'
            }}
          >
            <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="text-2xl font-bold text-white/60 line-through md:text-3xl">₪ 2800</span>
                <svg className="h-8 w-8 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-4xl font-black text-[#03b28c] drop-shadow-[0_0_20px_rgba(3,178,140,0.8)] md:text-5xl" style={{ fontWeight: 900 }}>
                  ₪ 2300
                </span>
              </div>
              <p className="mb-2 text-sm text-[#03b28c]/90 font-semibold">
                מחיר השקה
              </p>
              <p className="mb-8 text-xs text-white/70">
                מספר המקומות מוגבל
              </p>

              <Link
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("היי אלמוג, רציתי לשמוע על 'חוגג מנגן'")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full rounded-full bg-gradient-to-r from-[#03b28c] to-[#03b28c]/80 px-8 py-4 text-center text-lg font-bold text-black shadow-[0_0_50px_rgba(3,178,140,0.7)] transition hover:scale-105 hover:shadow-[0_0_80px_rgba(3,178,140,1)]"
              >
                בואו נשמע איך זה עובד ←
              </Link>
              
              <p className="mt-6 text-xs text-white/85">
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
