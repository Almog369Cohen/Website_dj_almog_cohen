"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ContactFormLevel100 } from "@/components/ui/ContactFormLevel100";

export const CoursesLevel100 = () => {
  return (
    <section id="academy-level-100" className="relative overflow-hidden bg-[#0b1120] py-12 md:py-20 lg:py-32">
      {/* Gradient transition from previous dark section */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1f1f21] to-[#0b1120]" />
      
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-[#059cc0]/10 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-[#059cc0]/10 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-[#059cc0]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 
            className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl"
            style={{ fontWeight: 900 }}
          >
            כאן לא לומדים לנגן.
            <br />
            <span className="text-[#059cc0]">לומדים להיות מישהו ששמים עליו את האירוע.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/85">
            אם אתה מחפש "קורס מגניב", תמשיך הלאה. 
            אם אתה רוצה לשלוט באווירה — תשאיר תירוצים בחוץ.
          </p>
        </motion.div>

        {/* 3 Packages */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Package 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="glass-card relative overflow-hidden rounded-3xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(5,156,192,0.12) 0%, rgba(10,14,26,0.9) 50%, rgba(5,156,192,0.08) 100%)',
              borderColor: 'rgba(5, 156, 192, 0.3)',
              boxShadow: '0 8px 32px rgba(5,156,192,0.15), inset 0 0 30px rgba(5,156,192,0.03)'
            }}
          >
            <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative z-10">
              <div className="mb-4 inline-block rounded-full bg-white/5 px-4 py-1 text-sm font-bold text-white/80">
                חבילה 1
              </div>
              <h3 className="mb-3 text-3xl font-black text-white" style={{ fontWeight: 900 }}>
                ₪ 1,250
              </h3>
              <p className="mb-6 text-white/90">
                טעימה שמראה אם זה בשבילך. בוא תגלה אם יש לך את זה.
              </p>
              <ul className="mb-8 space-y-3 text-sm text-white/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>היכרות עם הציוד</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>המיקס הראשון</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>הבנה אם זה בשבילך</span>
                </li>
              </ul>
              <Link
                href="/courses"
                className="block w-full rounded-full border-2 border-[#059cc0] bg-[#059cc0]/10 px-6 py-3 text-center font-bold text-[#059cc0] transition hover:bg-[#059cc0]/20"
              >
                פרטים נוספים
              </Link>
            </div>
          </motion.div>

          {/* Package 2 - FEATURED */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="relative overflow-hidden rounded-3xl border-2 border-[#03b28c] bg-[#1f1f21] p-8 shadow-[0_0_40px_rgba(3,178,140,0.3)]"
          >
            <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="absolute right-4 top-4 rounded-full bg-[#03b28c] px-3 py-1 text-xs font-bold text-black">
              הכי פופולרי
            </div>
            <div className="relative z-10">
              <div className="mb-4 inline-block rounded-full bg-[#03b28c]/20 px-4 py-1 text-sm font-bold text-[#03b28c]">
                חבילה 2
              </div>
              <h3 className="mb-3 text-3xl font-black text-white" style={{ fontWeight: 900 }}>
                ₪ 3,500
              </h3>
              <p className="mb-6 text-white/90">
                השלב שבו מפסיקים להיראות כמו תלמיד ומתחילים להישמע כמו מקצוען.
              </p>
              <ul className="mb-8 space-y-3 text-sm text-white/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>טכניקות מיקס מתקדמות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>קריאת קהל</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>בניית סט מקצועי</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>ציוד מומלץ</span>
                </li>
              </ul>
              <Link
                href="/courses"
                className="block w-full rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-6 py-3 text-center font-bold text-black shadow-[0_0_30px_rgba(3,178,140,0.5)] transition hover:shadow-[0_0_50px_rgba(3,178,140,0.8)]"
              >
                שריין מקום
              </Link>
            </div>
          </motion.div>

          {/* Package 3 - PRO */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="glass-card relative overflow-hidden rounded-3xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(5,156,192,0.12) 0%, rgba(10,14,26,0.9) 50%, rgba(5,156,192,0.08) 100%)',
              borderColor: 'rgba(5, 156, 192, 0.3)',
              boxShadow: '0 8px 32px rgba(5,156,192,0.15), inset 0 0 30px rgba(5,156,192,0.03)'
            }}
          >
            <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative z-10">
              <div className="mb-4 inline-block rounded-full bg-white/5 px-4 py-1 text-sm font-bold text-white/80">
                PRO
              </div>
              <h3 className="mb-3 text-3xl font-black text-white" style={{ fontWeight: 900 }}>
                ₪ 6,000-7,000
              </h3>
              <p className="mb-6 text-white/90">
                מי שבקצה הזה לא שואל כמה זה עולה. הוא שואל איך נכנסים.
              </p>
              <ul className="mb-8 space-y-3 text-sm text-white/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>מנטורינג אישי 1:1</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>בניית מיתוג אישי</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>הפקה מוזיקלית</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>ליווי קריירה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#03b28c]">✓</span>
                  <span>גישה לרשת קשרים</span>
                </li>
              </ul>
              <Link
                href="/courses"
                className="block w-full rounded-full border-2 border-[#059cc0] bg-[#059cc0]/10 px-6 py-3 text-center font-bold text-[#059cc0] transition hover:bg-[#059cc0]/20"
              >
                בואו נדבר
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Form */}
        <div className="mt-16">
          <ContactFormLevel100 context="course" />
        </div>
      </div>
    </section>
  );
};
