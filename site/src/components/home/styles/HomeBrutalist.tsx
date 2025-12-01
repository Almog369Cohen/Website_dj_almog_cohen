"use client";

/**
 * סגנון 3: BRUTALIST
 * - עיצוב גס ואמיץ
 * - קונטרסט גבוה
 * - טיפוגרפיה דרמטית
 * - גבולות עבים
 */

import { motion } from "framer-motion";
import Link from "next/link";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const wa = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export function HomeBrutalist() {
  return (
    <div className="min-h-screen bg-[#fffef5] text-black selection:bg-black selection:text-[#fffef5]">
      
      {/* Hero - Raw & Bold */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 border-b-8 border-black">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 bg-black text-[#fffef5] text-sm font-mono uppercase tracking-wider mb-8">
              DJ / Producer / Mentor
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[15vw] md:text-[12vw] font-black leading-[0.85] tracking-tighter uppercase"
          >
            ALMOG<br />COHEN
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <a
              href={wa("היי אלמוג")}
              className="group relative px-8 py-5 bg-black text-[#fffef5] text-lg font-bold uppercase tracking-wide border-4 border-black hover:bg-[#fffef5] hover:text-black transition-colors"
            >
              לאירוע →
            </a>
            <Link
              href="/academy"
              className="px-8 py-5 bg-transparent text-black text-lg font-bold uppercase tracking-wide border-4 border-black hover:bg-black hover:text-[#fffef5] transition-colors"
            >
              ללמוד DJ →
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute bottom-8 right-8 text-9xl font-black text-black/5 pointer-events-none hidden md:block">
          ★
        </div>
      </section>

      {/* Stats - Grid */}
      <section className="border-b-8 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { num: "500+", label: "אירועים", bg: "bg-[#ff4d4d]" },
            { num: "12Y", label: "ניסיון", bg: "bg-[#4dff4d]" },
            { num: "100%", label: "מחויבות", bg: "bg-[#4d4dff]" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bg} p-12 text-center border-b-4 md:border-b-0 md:border-l-4 first:border-l-0 border-black`}
            >
              <div className="text-6xl md:text-8xl font-black">{stat.num}</div>
              <div className="text-xl font-bold uppercase tracking-wider mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16"
          >
            WHAT I DO_
          </motion.h2>
          
          <div className="space-y-6">
            {[
              { num: "01", title: "חתונות ואירועים", desc: "מחתונות בוטיק ועד מסיבות ענק" },
              { num: "02", title: "קורסי DJ", desc: "מאפס לרחבה - שיטה מוכחת" },
              { num: "03", title: "מנטורינג", desc: "ליווי אישי לקריירה במוזיקה" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-start gap-6 p-6 border-4 border-black hover:bg-black hover:text-[#fffef5] transition-colors cursor-pointer"
              >
                <span className="text-4xl font-black">{item.num}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase">{item.title}</h3>
                  <p className="text-lg mt-1 font-medium">{item.desc}</p>
                </div>
                <span className="mr-auto text-4xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-[#fffef5] py-20 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8">
            LET'S<br />TALK
          </h2>
          <a
            href={wa("היי אלמוג, בואו נדבר!")}
            className="inline-block px-12 py-6 bg-[#fffef5] text-black text-xl font-black uppercase tracking-wide border-4 border-[#fffef5] hover:bg-black hover:text-[#fffef5] transition-colors"
          >
            WHATSAPP NOW →
          </a>
        </motion.div>
      </section>
    </div>
  );
}

export default HomeBrutalist;
