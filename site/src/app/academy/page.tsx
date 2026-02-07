"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FAQSection, FinalCTASection } from "@/components/sections";
import dynamic from "next/dynamic";

const AcademyTestimonials = dynamic(() => import("@/components/academy/AcademyTestimonials"), { ssr: false });

export default function AcademyPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const packages = [
    {
      name: "חבילת בסיס",
      subtitle: "היכרות עם עולם התקלוט",
      price: "1,500",
      priceNote: "כולל מע״מ",
      color: "brand-blue",
      borderClass: "border-brand-blue/40",
      bgClass: "from-brand-blue/10 to-transparent",
      badge: null,
      features: [
        { text: "3 מפגשי תקלוט (90 דק׳ כל אחד)", included: true },
        { text: "תרגילי בית לכל מפגש", included: true },
        { text: "עבודה על ציוד מקצועי", included: true },
        { text: "ליווי טלפוני + וואטסאפ (3 חודשים)", included: true },
        { text: "יציאה לשטח", included: false },
        { text: "ליווי אירוע", included: false },
        { text: "זומי תקלוט", included: false },
        { text: "זומי עסקי-מנטלי", included: false },
        { text: "הגברה ותאורה", included: false },
      ],
      cta: "מתאים למי שרוצה לבדוק אם זה בשבילו",
      whatsappText: "היי אלמוג, מעוניין בחבילת הבסיס ללימודי DJ",
    },
    {
      name: "התמחות שטח",
      subtitle: "מסלול DJ מעשי + חשיפה לאירועים",
      price: "3,800",
      priceNote: "+ מע״מ",
      color: "brand-green",
      borderClass: "border-brand-green/40",
      bgClass: "from-brand-green/10 to-transparent",
      badge: "פופולרי",
      features: [
        { text: "6 מפגשי תקלוט (90 דק׳ כל אחד)", included: true },
        { text: "תרגילי בית לכל מפגש", included: true },
        { text: "עבודה על ציוד מקצועי", included: true },
        { text: "ליווי טלפוני + וואטסאפ (חצי שנה)", included: true },
        { text: "יציאה לאירוע בשטח (צפייה)", included: true },
        { text: "ליווי אירוע", included: false },
        { text: "זומי תקלוט", included: false },
        { text: "זומי עסקי-מנטלי", included: false },
        { text: "הגברה ותאורה", included: false },
      ],
      cta: "המסלול הכי חכם למי שרוצה להתקדם באמת",
      whatsappText: "היי אלמוג, מעוניין במסלול התמחות שטח ללימודי DJ",
    },
    {
      name: "מסלול PRO",
      subtitle: "כניסה מלאה לעולם האירועים",
      price: "7,000",
      priceNote: "+ מע״מ",
      color: "brand-blue",
      borderClass: "border-[#ffaa00]/50",
      bgClass: "from-[#ffaa00]/10 via-background to-background",
      badge: "הכי שווה",
      features: [
        { text: "8 מפגשי תקלוט (90 דק׳) – 6 מעשי, 2 עיוני", included: true },
        { text: "תרגילי בית לכל מפגש", included: true },
        { text: "עבודה על ציוד מקצועי", included: true },
        { text: "ליווי טלפוני + וואטסאפ (שנה)", included: true },
        { text: "2 יציאות לאירועים בשטח (צפייה)", included: true },
        { text: "ליווי לאירוע אחד (אני איתך)", included: true },
        { text: "3 זומי תקלוט (90 דק׳)", included: true },
        { text: "2 זומי עסקי-מנטלי (90 דק׳)", included: true },
        { text: "סשן הגברה ותאורה", included: true },
      ],
      cta: "מספר המקומות מוגבל – למי שרוצה מקצוע",
      whatsappText: "היי אלמוג, מעוניין במסלול PRO ללימודי DJ",
    },
  ];

  const equipment = [
    { name: "XDJ-RX3", type: "קונטרולר" },
    { name: "DDJ-1000", type: "קונטרולר" },
    { name: "מחשבי Apple", type: "מחשב" },
    { name: "אוזניות מקצועיות", type: "שמע" },
    { name: "מיקסר", type: "שמע" },
    { name: "רמקולים", type: "שמע" },
  ];

  const [openPkg, setOpenPkg] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#000', color: '#fff' }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#000!important;color:#fff!important}` }} />
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "EducationalOrganization",
                name: "Compaktt School",
                description: "לימודי DJ מקצועיים – מסלולי תקלוט, שטח, וכניסה לעולם האירועים",
                url: "https://www.compaktt.com/academy",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "ישראל",
                  addressCountry: "IL",
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  { "@type": "Question", name: "צריך ניסיון קודם?", acceptedAnswer: { "@type": "Answer", text: "בכלל לא. היה לי תלמיד שהגיע עם אפס ניסיון על פלטה, ובשיעור השלישי כבר סגר אירוע ב-1,000 ₪. המסלולים בנויים מאפס מוחלט." } },
                  { "@type": "Question", name: "מה הציוד הנדרש?", acceptedAnswer: { "@type": "Answer", text: "כלום. בשיעורים אתם עובדים על XDJ-RX3, DDJ-1000, מחשבי Apple, מיקסר ורמקולים – הכל מסופק. לתרגול בבית מספיק תוכנת DJ חינמית ואוזניות." } },
                  { "@type": "Question", name: "כמה זמן עד שאוכל לנגן באירועים?", acceptedAnswer: { "@type": "Answer", text: "תלוי בך. יש תלמידים שכבר אחרי 3 שיעורים מתחילים לקבל הזדמנויות. במסלול PRO, אתה יוצא לאירועים אמיתיים כחלק מהתכנית." } },
                  { "@type": "Question", name: "מה ההבדל בין החבילות?", acceptedAnswer: { "@type": "Answer", text: "חבילת בסיס (1,500 ₪) – 3 מפגשים, היכרות עם תקלוט. התמחות שטח (3,800 ₪) – 6 מפגשים + יציאה לאירוע. מסלול PRO (7,000 ₪) – 8 מפגשים + שטח + ליווי + זומים עסקיים." } },
                  { "@type": "Question", name: "יש ליווי אחרי הלימודים?", acceptedAnswer: { "@type": "Answer", text: "במסלול PRO יש ליווי מלא כולל זומים עסקיים-מנטליים, יציאות לשטח, וליווי באירוע הראשון שלך. אפשר גם להוסיף ליוויים נוספים." } },
                ],
              },
              {
                "@type": "Course",
                name: "חבילת בסיס – היכרות עם עולם התקלוט",
                description: "3 מפגשי תקלוט של 90 דקות, עבודה על ציוד מקצועי, תרגילי בית, ליווי טלפוני ווואטסאפ ל-3 חודשים",
                provider: { "@type": "Organization", name: "Compaktt School", url: "https://www.compaktt.com/academy" },
                offers: { "@type": "Offer", price: "1500", priceCurrency: "ILS", availability: "https://schema.org/InStock" },
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", duration: "P3W", instructor: { "@type": "Person", name: "אלמוג כהן" } },
              },
              {
                "@type": "Course",
                name: "התמחות שטח – ליווי אישי ויציאה לשטח",
                description: "6 מפגשי תקלוט של 90 דקות, יציאה לאירוע בשטח, ליווי טלפוני ווואטסאפ לחצי שנה",
                provider: { "@type": "Organization", name: "Compaktt School", url: "https://www.compaktt.com/academy" },
                offers: { "@type": "Offer", price: "3800", priceCurrency: "ILS", availability: "https://schema.org/InStock" },
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", duration: "P6W", instructor: { "@type": "Person", name: "אלמוג כהן" } },
              },
              {
                "@type": "Course",
                name: "מסלול PRO – כניסה מלאה לעולם האירועים",
                description: "8 מפגשי תקלוט, 2 יציאות לשטח, ליווי לאירוע, 3 זומי תקלוט, 2 זומי עסקי-מנטלי, הגברה ותאורה, ליווי שנה",
                provider: { "@type": "Organization", name: "Compaktt School", url: "https://www.compaktt.com/academy" },
                offers: { "@type": "Offer", price: "7000", priceCurrency: "ILS", availability: "https://schema.org/InStock" },
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", duration: "P8W", instructor: { "@type": "Person", name: "אלמוג כהן" } },
              },
            ],
          }),
        }}
      />

      {/* ═══════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-brand-blue/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 bg-brand-green/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block"
          >
            <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-brand-blue">
              Compaktt School
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl"
            style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            מ-0 ל
            <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
              עמדה מקצועית
            </span>
            <br />
            עם ציוד, ליווי ואירוע אמיתי
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl"
          >
            לא קורס DJ. <strong className="text-white">מסלול כניסה לעולם האירועים.</strong>
            <br />
            לא מלמדים רק ללחוץ פליי – מלמדים לחשוב כמו DJ מקצועי, לעבוד נכון מול קהל, ולהפוך ידע לכסף.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="#packages"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#03b28c] to-[#059cc0] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
            >
              <span>בחרו מסלול</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <a
              href={wa("היי אלמוג, מעוניין לשמוע על לימודי DJ ב-Compaktt School")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              <span>שיחה עם אלמוג</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* EQUIPMENT */}
      {/* ═══════════════════════════════════════════ */}
      <section className="border-y border-white/10 bg-white/[0.02] px-4 py-4">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 mr-2">ציוד:</span>
          {equipment.map((item, idx) => (
            <span key={idx} className="text-[11px] text-white/50">{item.name}{idx < equipment.length - 1 ? ' •' : ''}</span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PACKAGES */}
      {/* ═══════════════════════════════════════════ */}
      <section id="packages" className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
              בחרו את המסלול שלכם
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/70">
              כל המסלולים כוללים ציוד מקצועי, סשנים של 90 דקות, ותרגילי בית.
            </p>
          </div>

          {/* Package Accordion */}
          <div className="space-y-3">
            {packages.map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  onClick={() => setOpenPkg(openPkg === idx ? null : idx)}
                  className={`w-full flex items-center justify-between gap-4 rounded-2xl border ${
                    openPkg === idx ? 'border-[#03b28c]/50' : 'border-white/10'
                  } bg-white/5 px-5 py-4 text-right transition-all hover:border-[#03b28c]/40`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {pkg.badge && (
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        pkg.badge === "הכי שווה"
                          ? "bg-[#ffaa00]/20 text-[#ffaa00]"
                          : "bg-[#03b28c]/20 text-[#03b28c]"
                      }`}>{pkg.badge}</span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-white">{pkg.name}</h3>
                      <p className="text-xs text-white/60">{pkg.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xl font-black text-white">{pkg.price} ₪</span>
                    <svg
                      className={`w-5 h-5 text-white/50 transition-transform ${openPkg === idx ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence>
                  {openPkg === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-4 border border-t-0 border-white/10 rounded-b-2xl bg-white/[0.02]">
                        <p className="text-xs text-white/50 mb-3">{pkg.priceNote}</p>
                        <ul className="space-y-2 mb-5">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              {feature.included ? (
                                <>
                                  <span className="mt-0.5 flex-shrink-0 text-[#03b28c]">✓</span>
                                  <span className="text-white/80">{feature.text}</span>
                                </>
                              ) : (
                                <>
                                  <span className="mt-0.5 flex-shrink-0 text-white/20">—</span>
                                  <span className="text-white/30">{feature.text}</span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={wa(pkg.whatsappText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] ${
                            pkg.badge === "הכי שווה"
                              ? "bg-gradient-to-r from-[#ffaa00] to-[#ff8800]"
                              : "bg-gradient-to-r from-[#059cc0] to-[#03b28c]"
                          }`}
                        >
                          אני רוצה להתחיל
                        </a>
                        <p className="mt-2 text-center text-[11px] text-white/40">{pkg.cta}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Single Lesson */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-white/70">
              שיעור בודד (90 דק׳): <strong className="text-white">330 ₪ + מע״מ</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ADD-ONS */}
      {/* ═══════════════════════════════════════════ */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-1">
            {/* ליווי נוסף */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border-2 border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
            >
              <div className="mb-4 inline-block rounded-full bg-[#03b28c]/20 px-3 py-1 text-xs font-bold text-[#03b28c]">
                שדרוגים
              </div>
              <h3 className="mb-2 text-2xl font-black text-white">תוספות ושדרוגים</h3>
              <p className="mb-4 text-sm text-white/60">ניתן להוסיף לכל מסלול:</p>
              <ul className="space-y-3">
                <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm font-medium text-white/70">חבילת תדמית ושיווק</span>
                  <span className="text-sm font-bold text-white">1,000 ₪ + מע״מ</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FOR WHO / NOT FOR */}
      {/* ═══════════════════════════════════════════ */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-[#03b28c]/30 bg-[#03b28c]/5 p-6 md:p-8"
            >
              <h3 className="mb-6 text-2xl font-black text-white">מתאים למי ש...</h3>
              <ul className="space-y-4">
                {[
                  "רוצה להיכנס לתחום האירועים",
                  "מבין שתקלוט זה לא רק מוזיקה",
                  "רוצה ללמוד על ציוד מקצועי אמיתי",
                  "מוכן להשקיע בעצמו ולתרגל",
                  "רוצה לנגן מול אנשים – לא רק בבית",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <span className="mt-0.5 text-[#03b28c]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
            >
              <h3 className="mb-6 text-2xl font-black text-white">פחות מתאים למי ש...</h3>
              <ul className="space-y-4">
                {[
                  "מחפש תחביב בלי כוונה להתפתח",
                  "מחפש ״נוסחה קסומה״ בלי עבודה",
                  "לא מוכן להשקיע זמן בתרגול",
                  "רוצה תוצאות בלי סבלנות",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/40">
                    <span className="mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* TESTIMONIALS */}
      {/* ═══════════════════════════════════════════ */}
      <AcademyTestimonials />

      {/* ═══════════════════════════════════════════ */}
      {/* GROOM DJ BANNER */}
      {/* ═══════════════════════════════════════════ */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/academy/groom-dj"
            className="group block rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl transition hover:border-[#059cc0]/50 md:p-8"
          >
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white/60">אטרקציה לחתונה</p>
            <h3 className="mb-2 text-2xl font-black text-white">חתן מתקלט</h3>
            <p className="mb-4 text-white/70">
              האטרקציה המרגשת ביותר לחתונה – החתן עולה לעמדה ומרעיד את הרחבה.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition group-hover:gap-3">
              <span>למידע נוסף</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection type="academy" />

      {/* Final CTA */}
      <FinalCTASection
        title="מוכנים להתחיל?"
        subtitle="בואו נדבר ונראה איזה מסלול מתאים לכם."
        primaryCTA={{
          text: "בואו נדבר בוואטסאפ",
          href: wa("היי אלמוג, אשמח לשמוע פרטים על לימודי DJ ב-Compaktt School"),
          isWhatsApp: true,
        }}
      />
    </div>
  );
}
