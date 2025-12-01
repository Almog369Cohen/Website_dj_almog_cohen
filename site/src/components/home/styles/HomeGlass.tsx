"use client";

/**
 * סגנון 2: GLASSMORPHISM
 * - אפקט זכוכית מט
 * - רקעים מטושטשים
 * - שקיפויות וגרדיאנטים
 */

import { motion } from "framer-motion";
import Link from "next/link";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const wa = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export function HomeGlass() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden">
      
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 max-w-2xl text-center shadow-2xl"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs tracking-wider uppercase bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              Energy Architect
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
          >
            Almog Cohen
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/70 mb-10 leading-relaxed"
          >
            DJ מקצועי לאירועים ומדריך DJ. <br />
            יוצר רגעים בלתי נשכחים דרך מוזיקה.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={wa("היי אלמוג!")}
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all hover:bg-white/20 hover:scale-105"
            >
              <span className="relative z-10">יש לי אירוע</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <Link
              href="/academy"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl font-medium transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            >
              רוצה ללמוד
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features - Glass Cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent"
          >
            למה לבחור בי?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎵", title: "12 שנות ניסיון", desc: "מאות אירועים מוצלחים" },
              { icon: "🎧", title: "ציוד מקצועי", desc: "Pioneer CDJ-3000 & DJM-900" },
              { icon: "⚡", title: "אנרגיה ייחודית", desc: "קריאת קהל מושלמת" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">מוכנים להתחיל?</h2>
          <p className="text-white/60 mb-8">שיחה קצרה יכולה לשנות הכל</p>
          <a
            href={wa("היי אלמוג, רציתי לשמוע פרטים")}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl text-lg font-medium transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
          >
            <span>דברו איתי בוואטסאפ</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
          </a>
        </motion.div>
      </section>
    </div>
  );
}

export default HomeGlass;
