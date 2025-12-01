"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ContactFormLevel100 } from "@/components/ui/ContactFormLevel100";
import { SectionTransition } from "@/components/ui/SectionTransition";

export const WeddingsLevel100 = () => {
  return (
    <section id="weddings-level-100" className="relative overflow-hidden bg-white py-12 md:py-20 lg:py-32">
      
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
            className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-black leading-tight text-gray-900 drop-shadow-lg md:text-6xl lg:text-7xl"
            style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            לא כל זוג מתאים אליי.
            <br />
            <span className="drop-shadow-xl" style={{ color: '#059cc0' }}>וזה בסדר.</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-gray-800 font-medium drop-shadow-sm md:text-xl">
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
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative overflow-hidden rounded-3xl border border-[#059cc0]/20 bg-gradient-to-br from-white/95 to-slate-50/95 p-4 backdrop-blur-sm transition-all duration-500 hover:border-[#059cc0]/40 hover:shadow-[0_20px_60px_rgba(5,156,192,0.15)] md:p-6 lg:p-8"
          >
            {/* Top Gradient Border */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#059cc0] via-cyan-400 to-[#03b28c] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Side Color Indicator */}
            <div className="absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-[#059cc0] via-cyan-400 to-[#03b28c] shadow-lg shadow-[#059cc0]/50 transition-all duration-500 group-hover:h-32" />
            <div className="brand-noise absolute inset-0 opacity-5" aria-hidden="true" />
            <div className="relative z-10">
              <h3 className="mb-3 text-lg font-black drop-shadow-md md:text-xl" style={{ fontWeight: 900, color: '#059cc0' }}>
                למי זה מתאים?
              </h3>
              <ul className="space-y-2">
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
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold drop-shadow-sm" style={{ backgroundColor: 'rgba(5, 156, 192, 0.25)', color: '#059cc0' }}>
                      ✓
                    </span>
                    <span className="flex-1 text-sm text-gray-900 font-medium leading-snug md:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 border-t border-slate-200 pt-3 md:mt-6 md:pt-4">
                <h4 className="mb-3 text-base font-bold uppercase tracking-wider text-gray-700 drop-shadow-sm md:text-lg">
                  מי לא מתאים?
                </h4>
                <ul className="space-y-2 text-sm text-gray-800 font-medium md:text-base">
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
          whileHover={{ y: -4 }}
          className="group relative mt-16 overflow-hidden rounded-3xl border border-[#059cc0]/30 bg-gradient-to-br from-[#059cc0]/8 via-white/95 to-[#059cc0]/5 p-10 text-center backdrop-blur-sm transition-all duration-500 hover:border-[#059cc0]/50 hover:shadow-[0_30px_80px_rgba(5,156,192,0.2)] md:p-16"
        >
          {/* Glow Effect */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-[#059cc0]/0 via-[#059cc0]/10 to-[#03b28c]/0 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
          
          {/* Top Gradient Border */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-[#059cc0] via-cyan-400 to-[#03b28c] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
          
          {/* Side Indicators (Dual) */}
          <div className="absolute left-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#059cc0] via-cyan-400 to-[#03b28c] shadow-lg shadow-[#059cc0]/50 transition-all duration-600 group-hover:h-48" />
          <div className="absolute right-0 top-1/2 h-0 w-1.5 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-[#03b28c] via-cyan-400 to-[#059cc0] shadow-lg shadow-[#03b28c]/50 transition-all duration-600 group-hover:h-48" />
          <div className="brand-noise absolute inset-0 opacity-5" aria-hidden="true" />
          
          <div className="relative z-10">
            <h3 className="mb-6 text-3xl font-black text-gray-900 drop-shadow-md md:text-5xl" style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
              תפסיקו לגלול. <span className="drop-shadow-lg" style={{ color: '#059cc0' }}>מצאתם.</span>
            </h3>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-700 font-medium drop-shadow-sm md:text-xl">
              האירוע שלכם הוא לא "עוד תאריך" ביומן. אני יודע כמה השקעתם בערב הזה. 
              האחריות שלי היא לוודא שהכול יעבוד מושלם – מהשיר הראשון ועד אחרון הרוקדים. 
              <br />
              <br />
              <strong className="text-gray-900 drop-shadow-md">בואו נכיר, נתאם ציפיות, ונבנה לכם ראש שקט ומסיבה מנצחת.</strong>
            </p>

            <motion.a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616"}?text=${encodeURIComponent("היי אלמוג, אשמח לבדוק זמינות לחתונה שלנו")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon touch-target inline-flex items-center gap-3 px-10 py-5 text-lg"
            >
              <span>לבדיקת זמינות ב-WhatsApp</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </motion.a>

            {/* Cross-Sell: Groom DJ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 rounded-2xl border border-pink-400/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">💍</div>
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-bold text-gray-900">רוצים אטרקציה בלתי נשכחת?</h4>
                  <p className="mb-3 text-sm text-gray-700">
                    <strong>חתן מתקלט</strong> - החתן (או הכלה) עולה לעמדה, מתקלט 15-20 דקות ומרעיד את הרחבה. האורחים לא יאמינו למראה עיניהם.
                  </p>
                  <Link
                    href="/academy/groom-dj"
                    className="inline-flex items-center gap-2 text-sm font-bold text-pink-400 transition hover:text-pink-300"
                  >
                    <span>גלו את האטרקציה המיוחדת</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
