"use client";

/**
 * סגנון: BRIDAL GLASS - זכוכית יוקרתית לכלות
 * - רכות ואלגנטיות
 * - גוונים של רוז גולד, לבן וזהב
 * - אפקטי זכוכית עדינים
 * - רומנטיקה מודרנית
 */

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const wa = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export function HomeBridalGlass() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] text-[#2d2d2d] overflow-hidden">
      
      {/* Soft Floating Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-200/40 to-transparent blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-100/50 to-transparent blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-50/60 to-transparent blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Elegant Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-rose-100 shadow-lg shadow-rose-100/20">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-300 animate-pulse" />
              <span className="text-sm font-medium tracking-wide text-rose-400">Premium Wedding DJ</span>
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6"
            style={{ fontFamily: 'serif' }}
          >
            <span className="block text-[#2d2d2d]">Your Perfect</span>
            <span className="block bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Wedding Sound
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[#666] font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            יוצר חוויות מוזיקליות בלתי נשכחות ליום המיוחד שלכם.
            <br />
            <span className="text-rose-400">12 שנות ניסיון</span> בחתונות יוקרה.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={wa("היי אלמוג! אנחנו מתכננים חתונה ונשמח לשמוע פרטים 💍")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-5 rounded-full overflow-hidden"
            >
              {/* Gradient Background */}
              <span className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400" />
              {/* Shine Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {/* Glass Overlay */}
              <span className="absolute inset-[1px] rounded-full bg-gradient-to-b from-white/20 to-transparent" />
              <span className="relative z-10 flex items-center gap-3 text-white font-medium">
                <span>בואו נדבר על החתונה</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            
            <Link
              href="/weddings"
              className="group px-10 py-5 rounded-full bg-white/60 backdrop-blur-md border border-rose-100 text-[#2d2d2d] font-medium hover:bg-white/80 hover:border-rose-200 transition-all shadow-lg shadow-rose-100/10"
            >
              <span className="flex items-center gap-2">
                <span>גלריית חתונות</span>
                <span className="text-rose-400 group-hover:rotate-45 transition-transform">✦</span>
              </span>
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-rose-300"
          >
            <span className="text-2xl">✦</span>
            <span className="w-24 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <span className="text-2xl">♡</span>
            <span className="w-24 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <span className="text-2xl">✦</span>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - Glass Cards */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { num: "500+", label: "חתונות מאושרות", icon: "💍" },
              { num: "12", label: "שנות קסם", icon: "✨" },
              { num: "100%", label: "רחבות מלאות", icon: "💃" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-rose-100/20 text-center group"
              >
                {/* Glow on hover */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-200/50 to-amber-200/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{stat.icon}</span>
                  <div className="text-4xl md:text-5xl font-light bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent mb-2">
                    {stat.num}
                  </div>
                  <div className="text-sm text-[#888] tracking-wide">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Me - Elegant Grid */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-rose-400 text-sm tracking-[0.3em] uppercase mb-4 block">The Difference</span>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'serif' }}>
              למה זוגות בוחרים בי
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "התאמה אישית מלאה",
                desc: "כל חתונה מקבלת playlist מותאם אישית. פגישת ייעוץ, הכרת הסגנון שלכם, ויצירת מסע מוזיקלי מדויק.",
                icon: "🎵"
              },
              {
                title: "קריאת קהל מדויקת",
                desc: "מהרגע הראשון בחופה ועד השיר האחרון - אני יודע בדיוק מתי להרים ומתי לרגש.",
                icon: "✨"
              },
              {
                title: "ציוד יוקרה",
                desc: "מערכת סאונד מקצועית שמשדרגת כל אולם. איכות צליל ברמה הגבוהה ביותר.",
                icon: "🎧"
              },
              {
                title: "נוכחות מרגיעה",
                desc: "לא סתם DJ - שותף ליום הגדול. אני דואג שתוכלו ליהנות בלי דאגות.",
                icon: "💎"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white/40 backdrop-blur-lg border border-white hover:bg-white/70 hover:shadow-xl hover:shadow-rose-100/20 transition-all"
              >
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="text-xl font-medium mb-3 text-[#2d2d2d]">{item.title}</h3>
                <p className="text-[#666] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative p-10 md:p-14 rounded-[40px] bg-gradient-to-br from-white/80 to-rose-50/50 backdrop-blur-xl border border-white shadow-2xl shadow-rose-100/30">
            {/* Quote Mark */}
            <span className="absolute top-6 right-8 text-7xl text-rose-200 font-serif leading-none">"</span>
            
            <blockquote className="relative z-10 text-xl md:text-2xl font-light text-[#2d2d2d] leading-relaxed text-center mb-8" style={{ fontFamily: 'serif' }}>
              אלמוג הפך את החתונה שלנו לערב שנשאר. 
              כל האורחים לא ירדו מהרחבה עד 3 בלילה. 
              פשוט קסם!
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-300 to-amber-300 flex items-center justify-center text-white font-medium">
                ש+ד
              </div>
              <div className="text-center">
                <div className="font-medium text-[#2d2d2d]">שירה ודניאל</div>
                <div className="text-sm text-rose-400">חתונה בקיסריה, 2024</div>
              </div>
            </div>
            
            {/* Stars */}
            <div className="flex justify-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-xl">★</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Decorative */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-rose-200" />
            <span className="text-rose-300">♡</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-rose-200" />
          </div>

          <h2 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: 'serif' }}>
            בואו ניצור יחד
            <span className="block text-rose-400">את הרגע המושלם</span>
          </h2>
          
          <p className="text-lg text-[#666] mb-10 max-w-xl mx-auto">
            שיחה קצרה יכולה להפוך את החתונה שלכם לחוויה שתזכרו לנצח
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={wa("היי אלמוג! נשמח לשמוע פרטים על DJ לחתונה שלנו 💒")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-12 py-6 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 text-white text-lg font-medium shadow-xl shadow-rose-200/50 hover:shadow-2xl hover:shadow-rose-300/50 hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              <span>שלחו הודעה בוואטסאפ</span>
            </a>
            
            <a
              href="tel:+972502427616"
              className="inline-flex items-center justify-center gap-2 px-10 py-6 rounded-full bg-white/60 backdrop-blur-md border border-rose-100 text-[#2d2d2d] font-medium hover:bg-white hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>התקשרו עכשיו</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#999]">
            {["✓ ללא התחייבות", "✓ ייעוץ חינם", "✓ תשובה תוך שעות"].map((text, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-rose-400">{text.split(" ")[0]}</span>
                <span>{text.split(" ").slice(1).join(" ")}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default HomeBridalGlass;
