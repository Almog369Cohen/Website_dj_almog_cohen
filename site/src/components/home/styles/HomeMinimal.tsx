"use client";

/**
 * סגנון 1: MINIMAL / CLEAN
 * - הרבה מרווח לבן
 * - טיפוגרפיה פשוטה וברורה
 * - ללא אפקטים מיוחדים
 */

import { motion } from "framer-motion";
import Link from "next/link";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const wa = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export function HomeMinimal() {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      
      {/* Hero - Super Clean */}
      <section className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400"
          >
            DJ & Music Producer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-light tracking-tight"
          >
            Almog Cohen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed"
          >
            יוצר חוויות מוזיקליות בלתי נשכחות. 
            מחתונות בוטיק ועד מסיבות טכנו.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <a
              href={wa("היי אלמוג, אשמח לשמוע פרטים")}
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-sm tracking-wide hover:opacity-80 transition"
            >
              בואו נדבר
            </a>
            <Link
              href="/academy"
              className="px-8 py-4 border border-gray-300 dark:border-gray-700 text-sm tracking-wide hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              הקורסים שלי
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats - Simple Grid */}
      <section className="border-t border-gray-100 dark:border-gray-800 py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: "500+", label: "אירועים" },
            { num: "12", label: "שנות ניסיון" },
            { num: "100%", label: "שביעות רצון" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-light">{stat.num}</div>
              <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services - Two Columns */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-xs tracking-[0.2em] text-gray-400">01</span>
            <h3 className="text-2xl font-light">אירועים</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              חתונות, בר מצוות, אירועים עסקיים. 
              כל אירוע מקבל יחס אישי והתאמה מדויקת.
            </p>
            <Link href="/weddings" className="inline-block text-sm underline underline-offset-4 hover:no-underline">
              למידע נוסף →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-xs tracking-[0.2em] text-gray-400">02</span>
            <h3 className="text-2xl font-light">לימוד DJ</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              קורסים פרטיים ומנטורינג אישי. 
              מאפס ועד לרמה מקצועית.
            </p>
            <Link href="/academy" className="inline-block text-sm underline underline-offset-4 hover:no-underline">
              למידע נוסף →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA - Simple */}
      <section className="border-t border-gray-100 dark:border-gray-800 py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-6"
        >
          <h2 className="text-3xl font-light">בואו ניצור משהו יחד</h2>
          <a
            href={wa("היי אלמוג!")}
            className="inline-block px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-sm tracking-wide hover:opacity-80 transition"
          >
            צור קשר
          </a>
        </motion.div>
      </section>
    </div>
  );
}

export default HomeMinimal;
