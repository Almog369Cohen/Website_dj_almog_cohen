"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home2026KineticScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-[400vh] bg-[#0e0e0e] text-white">
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="sticky top-0 h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <motion.span
                className="inline-block"
                animate={{ 
                  rotateX: [0, 5, 0],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  transformStyle: "preserve-3d"
                }}
              >
                DJ
              </motion.span>
              {" "}
              <motion.span
                className="inline-block"
                animate={{ 
                  rotateY: [0, -5, 0],
                  y: [0, 10, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                לאירועים
              </motion.span>
              <br />
              <motion.span
                className="inline-block text-white/90"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                שמרגישים אמיתיים
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-white/70"
          >
            גלול למטה לגלות את הסיפור
          </motion.p>
        </div>
      </motion.section>

      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#059cc0]/10 to-[#03b28c]/10 backdrop-blur-xl border border-white/10 p-12">
            <h2 className="text-5xl font-black mb-6">חתונות</h2>
            <p className="text-xl text-white/80 mb-8">
              רחבה שלא עוצרת. ערב שנזכר. מוזיקה שמחברת.
            </p>
            <div className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] font-bold text-lg">
              בדיקת זמינות
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6"
        >
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
            <h3 className="text-3xl font-black mb-4">Academy</h3>
            <p className="text-white/70">קורסים ומנטורינג לתקלוט מקצועי</p>
          </div>
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
            <h3 className="text-3xl font-black mb-4">חוגג מנגן</h3>
            <p className="text-white/70">DJ + נגן חי באירוע אחד</p>
          </div>
        </motion.div>
      </section>

      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-white/10">
            <h2 className="text-5xl font-black mb-6">מוכנים להתחיל?</h2>
            <p className="text-xl text-white/70 mb-8">
              הודעה קצרה עם תאריך ואולם — ואני עונה.
            </p>
            <div className="inline-flex px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform">
              שלחו הודעה בוואטסאפ
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
