"use client";

import { motion } from "framer-motion";
import { ContactFormLevel100 } from "@/components/ui/ContactFormLevel100";

export const WeddingsLevel100 = () => {
  return (
    <section id="weddings-level-100" className="relative overflow-hidden bg-[#1f1f21] py-20 md:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#03b28c]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Headline - MASSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 
            className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
            style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            לא כל זוג מתאים אליי.
            <br />
            <span className="text-[#03b28c]">וזה בסדר.</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
            אם אתם רוצים חוויה שמייצגת מי שאתם באמת — אז בואו נבדוק אם זה הדדי. 
            <br className="hidden md:inline" />
            אני לא מנגן כדי לעשות בלגן. אני מנגן כדי לעשות רושם שנשאר גם כשהשמפניה נגמרת.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left: Who Fits? */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
          >
            <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="relative z-10">
              <h3 className="mb-6 text-2xl font-black text-[#059cc0]" style={{ fontWeight: 900 }}>
                למי זה מתאים?
              </h3>
              <ul className="space-y-4">
                {[
                  "זוגות שיודעים להעריך איכות",
                  "אנשים שמאמינים שמוזיקה היא החלטה",
                  "כאלה שלא מתנצלים על הטעם שלהם",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3 text-right"
                  >
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#03b28c]/20 text-[#03b28c]">
                      ✓
                    </span>
                    <span className="flex-1 text-white/90">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
                  מי לא מתאים?
                </h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• מי שמחפש "שיבוא, ינגן, ונראה מה יהיה"</li>
                  <li>• מי שבוחרים לפי מחיר, לא לפי התאמה</li>
                  <li>• מי שלא אכפת לו מה הוא משאיר לאורחים</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <ContactFormLevel100 context="wedding" />
        </div>
      </div>
    </section>
  );
};
