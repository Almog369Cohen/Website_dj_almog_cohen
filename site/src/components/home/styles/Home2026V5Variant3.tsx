"use client";
import { motion } from "framer-motion";
export default function Home2026V5Variant3() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
      <div className="absolute top-10 md:top-20 left-5 md:left-20 w-48 h-48 md:w-[500px] md:h-[500px] bg-[#059cc0]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 md:bottom-20 right-5 md:right-20 w-48 h-48 md:w-[500px] md:h-[500px] bg-[#03b28c]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="mb-16 md:mb-24">
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 leading-none tracking-tight">
              <span style={{ background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 30px rgba(5, 156, 192, 0.6))" }}>DJ אלמוג כהן</span>
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/70 font-light max-w-3xl leading-relaxed">
              לאירועים שמרגישים אמיתיים
              <span className="block mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl text-white/50">מוזיקה שמחברת. אנרגיה שנשארת. ערב שנזכר.</span>
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
