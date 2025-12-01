"use client";

/**
 * סגנון 5: ELEGANT / LUXURY
 * - זהב ושחור
 * - טיפוגרפיה מעודנת
 * - אנימציות עדינות
 * - תחושת יוקרה
 */

import { motion } from "framer-motion";
import Link from "next/link";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const wa = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export function HomeElegant() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      
      {/* Subtle Pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="text-center max-w-3xl">
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-12"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#d4af37] text-sm tracking-[0.4em] uppercase mb-8"
          >
            Premium DJ Experience
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-light tracking-wide mb-6"
            style={{ fontFamily: 'serif' }}
          >
            Almog Cohen
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl mx-auto"
          >
            יוצר חוויות מוזיקליות יוקרתיות לאירועים בלתי נשכחים
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a
              href={wa("היי אלמוג, אשמח לשמוע על שירותי DJ לאירוע")}
              className="group relative px-10 py-4 bg-[#d4af37] text-black font-medium tracking-wide overflow-hidden"
            >
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">הזמינו עכשיו</span>
            </a>
            <Link
              href="/academy"
              className="px-10 py-4 border border-[#d4af37]/30 text-[#d4af37] font-medium tracking-wide hover:bg-[#d4af37]/10 transition-colors"
            >
              האקדמיה
            </Link>
          </motion.div>
          
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-12"
          />
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 py-8">
        <div className="w-32 h-px bg-gradient-to-r from-transparent to-[#d4af37]/30" />
        <span className="text-[#d4af37]/50">✦</span>
        <div className="w-32 h-px bg-gradient-to-l from-transparent to-[#d4af37]/30" />
      </div>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-light tracking-wide mb-16"
            style={{ fontFamily: 'serif' }}
          >
            השירותים שלנו
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "חתונות יוקרה", 
                desc: "אירועים אינטימיים ועד הפקות גדולות. כל חתונה מקבלת יחס מלכותי.",
                icon: "◇"
              },
              { 
                title: "אירועים פרטיים", 
                desc: "ימי הולדת, מסיבות VIP ואירועים עסקיים ברמה הגבוהה ביותר.",
                icon: "◆"
              },
              { 
                title: "Academy", 
                desc: "לימודי DJ פרטיים עם מנטור אישי. הדרך שלך לבמה.",
                icon: "◇"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-10 border border-[#d4af37]/20 bg-[#d4af37]/[0.02] hover:bg-[#d4af37]/[0.05] transition-colors"
              >
                <span className="text-3xl text-[#d4af37] mb-6 block">{item.icon}</span>
                <h3 className="text-xl font-light tracking-wide mb-4" style={{ fontFamily: 'serif' }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-6xl text-[#d4af37]/20 block mb-4">"</span>
          <blockquote className="text-2xl md:text-3xl font-light text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'serif' }}>
            המוזיקה היא השפה של הנשמה. אני מתרגם את הרגש לצליל.
          </blockquote>
          <cite className="text-[#d4af37] text-sm tracking-widest uppercase">— Almog Cohen</cite>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-[#d4af37]/10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center px-6">
          {[
            { num: "500+", label: "אירועים" },
            { num: "12", label: "שנות ניסיון" },
            { num: "VIP", label: "שירות" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-light text-[#d4af37]">{stat.num}</div>
              <div className="text-xs tracking-widest uppercase text-gray-500 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-wide mb-6" style={{ fontFamily: 'serif' }}>
            מוכנים לחוויה?
          </h2>
          <p className="text-gray-400 mb-10">צרו קשר ונתחיל לתכנן את האירוע המושלם</p>
          <a
            href={wa("שלום אלמוג, אשמח לתאם שיחה")}
            className="inline-flex items-center gap-4 px-12 py-5 bg-[#d4af37] text-black font-medium tracking-wide hover:bg-[#c9a431] transition-colors"
          >
            <span>צרו קשר</span>
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </section>

      {/* Footer Decoration */}
      <div className="flex items-center justify-center gap-4 py-12">
        <div className="w-16 h-px bg-[#d4af37]/20" />
        <span className="text-[#d4af37]/30 text-xs tracking-[0.3em]">AC</span>
        <div className="w-16 h-px bg-[#d4af37]/20" />
      </div>
    </div>
  );
}

export default HomeElegant;
