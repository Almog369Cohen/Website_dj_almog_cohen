"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionTransition } from "@/components/ui/SectionTransition";

export const ChogegMenagenLevel100 = () => {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  
  return (
    <section id="chogeg-menagen-level-100" className="relative overflow-hidden bg-background py-12 md:py-20 lg:py-32">
      
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#03b28c]/20 blur-[150px]" />
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] bg-[#03b28c]/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] bg-[#03b28c]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#03b28c]/30 bg-[#03b28c]/10 px-6 py-2 backdrop-blur-sm"
          >
<span className="text-2xl">🎤</span>
            <span className="text-sm font-bold uppercase tracking-wider text-[#03b28c]">חוגג מנגן</span>
            <span className="rounded-full bg-[#03b28c] px-2 py-0.5 text-[10px] font-black uppercase text-white">NEW</span>
          </motion.div>

          {/* Headline */}
          <h2 
            className="mb-6 text-4xl font-black leading-tight text-foreground-heading md:text-6xl"
            style={{ fontWeight: 900 }}
          >
            לא עוד אטרקציה.
            <br />
            <span className="bg-gradient-to-r from-[#03b28c] via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(3,178,140,0.5)]">
              הופעה.
            </span>
          </h2>
          
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-foreground">
            אתם רגילים לזיקוקים או מגנטים? תשכחו מזה. ב'חוגג מנגן' <strong className="text-[#03b28c]">אתם הכוכבים האמיתיים.</strong>
            <br className="hidden md:block" />
            לא משנה אם זו <strong className="text-[#03b28c]">חתונה, בר מצווה או אירוע פרטי</strong> – אנחנו מכינים את הרקע, והשואו נטו עליכם!
          </p>

          {/* Features Grid */}
          <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { title: "ציוד מקצועי", desc: "הכל מסופק" },
              { title: "מוזיקה מותאמת", desc: "לפי הטעם שלכם" },
              { title: "רגע בלתי נשכח", desc: "משאיר חותם" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background/50 p-4 backdrop-blur-sm transition-all hover:border-[#03b28c]/50 hover:shadow-[0_10px_40px_rgba(3,178,140,0.2)]"
              >
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#03b28c] to-emerald-400 transition-all duration-300 group-hover:w-full" />
                <h4 className="mb-1 text-sm font-bold text-foreground-heading">{feature.title}</h4>
                <p className="text-xs text-foreground-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Price Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group relative mx-auto max-w-2xl overflow-hidden rounded-3xl border-2 border-[#03b28c]/50 bg-gradient-to-br from-[#03b28c]/15 via-[#1f1f21]/80 to-[#03b28c]/10 p-4 backdrop-blur-xl transition-all duration-500 hover:border-[#03b28c]/70 hover:shadow-[0_30px_80px_rgba(3,178,140,0.3)] md:p-6 lg:p-8"
          >
            {/* Glow Effect */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-[#03b28c]/0 via-[#03b28c]/20 to-[#03b28c]/0 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
            
            {/* Top Gradient Border - Always Visible & Sexy */}
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-[#03b28c] via-emerald-400 to-teal-400 opacity-60 transition-opacity duration-400 group-hover:opacity-100" />
            
            {/* Side Indicators (Dual) - Always Visible */}
            <div className="absolute left-0 top-1/2 h-32 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#03b28c] via-emerald-400 to-teal-400 shadow-lg shadow-[#03b28c]/50 transition-all duration-600 group-hover:h-48" />
            <div className="absolute right-0 top-1/2 h-32 w-1.5 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-teal-400 via-emerald-400 to-[#03b28c] shadow-lg shadow-teal-400/50 transition-all duration-600 group-hover:h-48" />
            <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />
            
            {/* Limited Badge */}
            <div className="absolute right-4 top-4 z-20 rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-4 py-1.5 shadow-lg shadow-brand-green/50">
              <span className="text-xs font-black uppercase text-white">מוגבל</span>
            </div>
            
            <div className="relative z-10">
              {/* Pricing */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-center gap-4">
                  <span className="relative text-xl font-bold text-foreground-secondary md:text-2xl">
                    <span className="line-through">₪ 2800</span>
                    <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-[-5deg] bg-brand-green" />
                  </span>
                  <motion.svg 
                    className="h-8 w-8 text-[#03b28c]"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </div>
                
                <div className="relative inline-block">
                  <div className="absolute -inset-2 animate-pulse rounded-full bg-[#03b28c]/20 blur-xl" />
                  <span className="relative text-5xl font-black text-[#03b28c] drop-shadow-[0_0_30px_rgba(3,178,140,1)] md:text-6xl" style={{ fontWeight: 900 }}>
                    ₪ 2,300
                  </span>
                </div>
                
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#03b28c]/20 px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#03b28c] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#03b28c]" />
                  </span>
                  <span className="text-sm font-bold text-[#03b28c]">מחיר השקה מיוחד</span>
                </div>
              </div>
              
              <div className="mb-8 text-center text-xs text-foreground-secondary">
                <span>נותרו מספר מקומות בלבד</span>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent("היי אלמוג, רציתי לשמוע על 'חוגג מנגן'")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block w-full overflow-hidden rounded-full bg-gradient-to-r from-[#03b28c] to-emerald-500 px-8 py-5 text-center text-lg font-bold text-white shadow-[0_0_50px_rgba(3,178,140,0.7)] transition hover:shadow-[0_0_80px_rgba(3,178,140,1)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    בואו נשמע איך זה עובד
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                      ←
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </Link>
              </motion.div>
              
              <div className="mt-6 text-center text-xs text-foreground-secondary">
                <span>תשובה מהירה ב-WhatsApp</span>
              </div>

              {/* What's Included */}
              <div className="mt-8 rounded-2xl border border-border bg-background/30 p-6 backdrop-blur-sm">
                <h5 className="mb-4 text-sm font-bold text-foreground-heading">
                  מה כלול בחבילה?
                </h5>
                <ul className="space-y-2.5 text-xs text-foreground-secondary">
                  {[
                    "ציוד DJ מקצועי מלא",
                    "הדרכה אישית של 30 דקות",
                    "מוזיקה מותאמת אישית",
                    "תמיכה טכנית באירוע",
                    "הקלטת הרגע לזיכרון",
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#03b28c]/20 text-[10px] text-[#03b28c]">✓</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {[
              { stat: "100+", label: "זוגות מרוצים" },
              { stat: "5.0", label: "דירוג ממוצע" },
              { stat: "200+", label: "אירועים מוצלחים" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background/30 p-6 text-center backdrop-blur-sm transition-all hover:border-[#03b28c]/50 hover:bg-background/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#03b28c]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-1 text-3xl font-black text-[#03b28c]">{item.stat}</div>
                  <div className="text-xs text-foreground-secondary">{item.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="mt-12 mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background/80 to-background/40 p-8 backdrop-blur-xl">
              <div className="absolute right-6 top-6 text-6xl text-[#03b28c]/20">"</div>
              <div className="relative">
                <p className="mb-4 text-base italic leading-relaxed text-foreground md:text-lg">
                  החתן שלנו עלה לעמדה והרחבה השתגעה! זה היה הרגע הכי מרגש של הערב. כל האורחים דיברו על זה בימים שאחרי.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#03b28c] to-emerald-400" />
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground-heading">שרה ויוסי</div>
                    <div className="text-xs text-foreground-secondary">חתונה, יוני 2024</div>
                  </div>
                  <div className="mr-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
