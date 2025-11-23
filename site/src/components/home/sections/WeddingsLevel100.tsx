"use client";

import { motion } from "framer-motion";
import { ContactFormLevel100 } from "@/components/ui/ContactFormLevel100";

export const WeddingsLevel100 = () => {
  return (
    <section id="weddings-level-100" className="relative overflow-hidden bg-white py-12 md:py-20 lg:py-32">
      {/* Top Fade: Dark to White */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1f1f21] via-[#1f1f21]/50 to-transparent" />
      
      {/* Bottom Fade: White to Dark */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1f1f21] via-[#1f1f21]/50 to-transparent" />
      
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-slate-100 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Headline - MASSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h2 
            className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-black leading-tight text-slate-900 md:text-6xl lg:text-7xl"
            style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            לא כל זוג מתאים אליי.
            <br />
            <span className="text-[#059cc0]">וזה בסדר.</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-slate-700 md:text-xl">
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
            className="glass-card relative overflow-hidden rounded-3xl p-8"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              borderColor: 'rgba(5, 156, 192, 0.2)'
            }}
          >
            <div className="brand-noise absolute inset-0 opacity-5" aria-hidden="true" />
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
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#059cc0]/20 text-[#059cc0]">
                      ✓
                    </span>
                    <span className="flex-1 text-slate-800">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                  מי לא מתאים?
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
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

        {/* Call to Action Section - "תפסיקו לגלול" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card relative mt-16 overflow-hidden rounded-3xl p-10 text-center md:p-16"
          style={{
            background: 'linear-gradient(135deg, rgba(5,156,192,0.08) 0%, rgba(255,255,255,0.95) 50%, rgba(5,156,192,0.05) 100%)',
            borderColor: 'rgba(5, 156, 192, 0.3)'
          }}
        >
          <div className="brand-noise absolute inset-0 opacity-5" aria-hidden="true" />
          
          <div className="relative z-10">
            <h3 className="mb-6 text-3xl font-black text-slate-900 md:text-5xl" style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
              תפסיקו לגלול. <span className="text-[#059cc0]">מצאתם.</span>
            </h3>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
              האירוע שלכם הוא לא "עוד תאריך" ביומן. אני יודע כמה השקעתם בערב הזה. 
              האחריות שלי היא לוודא שהכול יעבוד מושלם – מהשיר הראשון ועד אחרון הרוקדים. 
              <br />
              <br />
              <strong className="text-slate-900">בואו נכיר, נתאם ציפיות, ונבנה לכם ראש שקט ומסיבה מנצחת.</strong>
            </p>

            <motion.a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616"}?text=${encodeURIComponent("היי אלמוג, אשמח לבדוק זמינות לחתונה שלנו")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-10 py-5 text-lg font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.6)] transition hover:shadow-[0_0_60px_rgba(3,178,140,0.8)]"
            >
              <span>לבדיקת זמינות ב-WhatsApp</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
