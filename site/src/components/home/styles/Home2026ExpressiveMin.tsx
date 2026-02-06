"use client";

import { motion } from "framer-motion";

export default function Home2026ExpressiveMin() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-24"
          >
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none tracking-tight">
              <span
                style={{
                  background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                DJ
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-3xl md:text-4xl text-white/60 font-light max-w-2xl"
            >
              לאירועים שמרגישים אמיתיים
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="space-y-6"
          >
            <div className="group">
              <div className="flex items-center justify-between py-8 border-b border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                <div>
                  <h2 className="text-4xl font-black mb-2 group-hover:text-[#03b28c] transition-colors">חתונות</h2>
                  <p className="text-white/60">רחבה שלא עוצרת. ערב שנזכר.</p>
                </div>
                <svg className="w-8 h-8 text-white/40 group-hover:text-[#03b28c] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between py-8 border-b border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                <div>
                  <h2 className="text-4xl font-black mb-2 group-hover:text-[#059cc0] transition-colors">Academy</h2>
                  <p className="text-white/60">קורסים ומנטורינג לתקלוט מקצועי</p>
                </div>
                <svg className="w-8 h-8 text-white/40 group-hover:text-[#059cc0] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between py-8 border-b border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                <div>
                  <h2 className="text-4xl font-black mb-2 group-hover:text-[#03b28c] transition-colors">חוגג מנגן</h2>
                  <p className="text-white/60">DJ + נגן חי באירוע אחד</p>
                </div>
                <svg className="w-8 h-8 text-white/40 group-hover:text-[#03b28c] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between py-8 border-b border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                <div>
                  <h2 className="text-4xl font-black mb-2 group-hover:text-[#059cc0] transition-colors">מוזיקה</h2>
                  <p className="text-white/60">סטים ופלייליסטים</p>
                </div>
                <svg className="w-8 h-8 text-white/40 group-hover:text-[#059cc0] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-8">
            מוכנים
            <br />
            להתחיל?
          </h2>
          <p className="text-2xl text-white/60 mb-12 max-w-2xl">
            הודעה קצרה עם תאריך ואולם — ואני עונה.
          </p>
          <div className="inline-flex px-12 py-6 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform">
            שלחו הודעה
          </div>
        </motion.div>
      </section>
    </div>
  );
}
