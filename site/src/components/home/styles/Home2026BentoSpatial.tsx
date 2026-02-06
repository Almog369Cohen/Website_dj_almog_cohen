"use client";

/**
 * Home 2026 V1: Bento Grid + Spatial 3D
 * Trend: Modular asymmetric cards with depth, Z-axis hierarchy, mobile-first
 */

import { motion } from "framer-motion";

export default function Home2026BentoSpatial() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-hidden">
      {/* Hero with 3D depth */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#059cc0]/20 via-transparent to-[#03b28c]/20" />
        
        {/* 3D floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-[#059cc0]/30 to-[#03b28c]/30 backdrop-blur-xl"
          animate={{ 
            y: [0, -20, 0],
            rotateY: [0, 15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        />
        
        <motion.div
          className="absolute bottom-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-[#03b28c]/40 to-[#059cc0]/40 backdrop-blur-xl"
          animate={{ 
            y: [0, 30, 0],
            rotateX: [0, -15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            style={{
              background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DJ לאירועים
            <br />
            שמרגישים אמיתיים
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 mb-10"
          >
            מוזיקה שמחברת. אנרגיה שנשארת.
          </motion.p>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px]">
          {/* Large card - Weddings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-7 md:row-span-2 rounded-3xl bg-gradient-to-br from-[#059cc0]/10 to-[#03b28c]/10 backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#059cc0]/0 to-[#03b28c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-3">חתונות</h3>
              <p className="text-white/70 text-lg">רחבה שלא עוצרת. ערב שנזכר.</p>
            </div>
            <div className="relative z-10 flex items-center gap-3 text-[#03b28c] font-bold">
              <span>בדיקת זמינות</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </motion.div>

          {/* Medium card - Academy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 md:row-span-1 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between"
          >
            <h3 className="text-2xl font-black mb-2">Academy</h3>
            <p className="text-white/60">קורסים ומנטורינג לתקלוט</p>
          </motion.div>

          {/* Small card - Music */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 md:row-span-1 rounded-3xl bg-gradient-to-br from-[#03b28c]/20 to-[#059cc0]/20 backdrop-blur-xl border border-white/10 p-6 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎵</div>
              <p className="font-bold">מוזיקה</p>
            </div>
          </motion.div>

          {/* Medium card - Chogeg Menagen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-5 md:row-span-1 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between"
          >
            <h3 className="text-2xl font-black mb-2">חוגג מנגן</h3>
            <p className="text-white/60">DJ + נגן חי באירוע אחד</p>
          </motion.div>

          {/* Wide card - About */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-7 md:row-span-1 rounded-3xl bg-gradient-to-r from-[#059cc0]/10 to-[#03b28c]/10 backdrop-blur-xl border border-white/10 p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-black mb-1">אלמוג כהן</h3>
              <p className="text-white/60">DJ, מפיק, מנטור</p>
            </div>
            <div className="text-white/40">→</div>
          </motion.div>
        </div>
      </section>

      {/* Spatial CTA */}
      <section className="px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#059cc0]/20 to-[#03b28c]/20 blur-3xl" />
          <div className="relative z-10 p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h2 className="text-4xl font-black mb-6">מוכנים להתחיל?</h2>
            <p className="text-white/70 text-lg mb-8">הודעה קצרה עם תאריך ואולם — ואני עונה.</p>
            <div className="inline-flex gap-4">
              <div className="px-8 py-4 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] font-bold text-lg">
                שלחו הודעה
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
