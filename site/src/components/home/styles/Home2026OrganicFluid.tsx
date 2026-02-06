"use client";

import { motion } from "framer-motion";

export default function Home2026OrganicFluid() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,300 Q360,100 720,300 T1440,300 L1440,0 L0,0 Z"
            fill="url(#gradient1)"
            initial={{ d: "M0,300 Q360,100 720,300 T1440,300 L1440,0 L0,0 Z" }}
            animate={{ d: "M0,250 Q360,150 720,250 T1440,250 L1440,0 L0,0 Z" }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.path
            d="M0,600 Q360,500 720,600 T1440,600 L1440,900 L0,900 Z"
            fill="url(#gradient2)"
            initial={{ d: "M0,600 Q360,500 720,600 T1440,600 L1440,900 L0,900 Z" }}
            animate={{ d: "M0,650 Q360,550 720,650 T1440,650 L1440,900 L0,900 Z" }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059cc0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#03b28c" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#03b28c" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#059cc0" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-[#059cc0]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-[#03b28c]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <motion.span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                DJ לאירועים
              </motion.span>
              <br />
              <span className="text-white/90">שמרגישים אמיתיים</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-white/70 max-w-3xl mx-auto"
            >
              מוזיקה שמחברת. אנרגיה שנשארת. ערב שנזכר.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative rounded-[2rem] bg-[#1f1f21] p-10 border border-white/10">
                <h2 className="text-4xl font-black mb-4">חתונות</h2>
                <p className="text-white/70 text-lg mb-6">
                  רחבה שלא עוצרת. ערב שנזכר. מוזיקה שמחברת.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] font-bold">
                  <span>בדיקת זמינות</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#03b28c] to-[#059cc0] rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative rounded-[2rem] bg-[#1f1f21] p-10 border border-white/10">
                <h2 className="text-4xl font-black mb-4">Academy</h2>
                <p className="text-white/70 text-lg mb-6">
                  קורסים ומנטורינג לתקלוט מקצועי. למי שרוצה ללמוד.
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: "🎵", title: "מוזיקה", desc: "סטים ופלייליסטים" },
              { icon: "🎸", title: "חוגג מנגן", desc: "DJ + נגן חי" },
              { icon: "📝", title: "בלוג", desc: "מדריכים וטיפים" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#059cc0]/30 to-[#03b28c]/30 rounded-[3rem] blur-2xl" />
            <div className="relative rounded-[3rem] bg-[#1f1f21] p-12 border border-white/10">
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
