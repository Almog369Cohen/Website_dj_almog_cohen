"use client";

import { motion } from "framer-motion";

export default function Home2026GlassMorph() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#059cc0]/10 via-transparent to-[#03b28c]/10" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#059cc0]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#03b28c]/20 rounded-full blur-3xl" />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span
                style={{
                  background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                DJ לאירועים
              </span>
              <br />
              <span className="text-white/90">שמרגישים אמיתיים</span>
            </h1>
            <p className="text-2xl text-white/70">מוזיקה שמחברת. אנרגיה שנשארת.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#059cc0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4">חתונות</h2>
                <p className="text-white/70 text-lg mb-6">
                  רחבה שלא עוצרת. ערב שנזכר.
                </p>
                <div className="inline-flex items-center gap-2 text-[#03b28c] font-bold">
                  <span>בדיקת זמינות</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#03b28c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4">Academy</h2>
                <p className="text-white/70 text-lg mb-6">
                  קורסים ומנטורינג לתקלוט מקצועי
                </p>
                <div className="inline-flex items-center gap-2 text-[#059cc0] font-bold">
                  <span>למידע נוסף</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 text-center">
              <div className="text-4xl mb-3">🎵</div>
              <h3 className="text-xl font-bold mb-2">מוזיקה</h3>
              <p className="text-white/60 text-sm">סטים ופלייליסטים</p>
            </div>

            <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 text-center">
              <div className="text-4xl mb-3">🎸</div>
              <h3 className="text-xl font-bold mb-2">חוגג מנגן</h3>
              <p className="text-white/60 text-sm">DJ + נגן חי</p>
            </div>

            <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-bold mb-2">בלוג</h3>
              <p className="text-white/60 text-sm">מדריכים וטיפים</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative p-12 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#059cc0]/10 to-[#03b28c]/10 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-6">מוכנים להתחיל?</h2>
              <p className="text-xl text-white/70 mb-8">
                הודעה קצרה עם תאריך ואולם — ואני עונה.
              </p>
              <div className="inline-flex px-10 py-5 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] font-bold text-lg shadow-2xl hover:scale-105 transition-transform">
                שלחו הודעה בוואטסאפ
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
