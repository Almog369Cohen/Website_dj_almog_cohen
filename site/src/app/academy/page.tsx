"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Compaktt School",
            description: "לימודי DJ מקצועיים – מסלולי תקלוט, שטח, וכניסה לעולם האירועים",
            url: "https://www.compaktt.com/academy",
            address: {
              "@type": "PostalAddress",
              addressLocality: "ישראל",
              addressCountry: "IL",
            },
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
            className="mb-6 text-3xl font-black leading-tight text-foreground-heading md:text-5xl lg:text-6xl"
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
            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-foreground-secondary md:text-xl"
          >
            לא קורס DJ. <strong className="text-foreground-heading">מסלול כניסה לעולם האירועים.</strong>
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-background/50 px-8 py-4 text-lg font-medium text-foreground backdrop-blur-sm transition hover:bg-background/70"
            >
              <span>שיחה עם אלמוג</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* EQUIPMENT */}
      {/* ═══════════════════════════════════════════ */}
      <section className="border-y border-border bg-background/50 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-foreground-secondary">
            ציוד הלימוד בכל המסלולים
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {equipment.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2">
                <span className="text-sm font-bold text-foreground-heading">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PACKAGES */}
      {/* ═══════════════════════════════════════════ */}
      <section id="packages" className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground-heading md:text-5xl">
              בחרו את המסלול שלכם
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground-secondary">
              כל המסלולים כוללים ציוד מקצועי, סשנים של 90 דקות, ותרגילי בית.
            </p>
          </div>

          {/* Package Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`relative flex flex-col overflow-hidden rounded-3xl border-2 ${pkg.borderClass} bg-gradient-to-br ${pkg.bgClass} p-6 backdrop-blur-xl transition-all hover:shadow-xl md:p-8`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                    pkg.badge === "הכי שווה"
                      ? "bg-[#ffaa00]/20 text-[#ffaa00]"
                      : "bg-brand-green/20 text-brand-green"
                  }`}>
                    {pkg.badge}
                  </div>
                )}

                {/* Header */}
                <div className="mb-6 mt-4">
                  <h3 className="mb-1 text-2xl font-black text-foreground-heading">{pkg.name}</h3>
                  <p className="text-sm text-foreground-secondary">{pkg.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground-heading">{pkg.price}</span>
                    <span className="text-lg font-bold text-foreground-heading">₪</span>
                  </div>
                  <p className="text-sm text-foreground-secondary">{pkg.priceNote}</p>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <>
                          <span className="mt-0.5 flex-shrink-0 text-brand-green">✓</span>
                          <span className="text-foreground-secondary">{feature.text}</span>
                        </>
                      ) : (
                        <>
                          <span className="mt-0.5 flex-shrink-0 text-foreground-secondary/30">—</span>
                          <span className="text-foreground-secondary/40">{feature.text}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={wa(pkg.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-white transition hover:scale-105 ${
                    pkg.badge === "הכי שווה"
                      ? "bg-gradient-to-r from-[#ffaa00] to-[#ff8800] shadow-lg"
                      : "bg-gradient-to-r from-brand-blue to-brand-green"
                  }`}
                >
                  <span>אני רוצה להתחיל</span>
                </a>
                <p className="mt-3 text-center text-xs text-foreground-secondary">
                  {pkg.cta}
                </p>
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
            <p className="text-foreground-secondary">
              שיעור בודד (90 דק׳): <strong className="text-foreground-heading">330 ₪ + מע״מ</strong>
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
              className="rounded-2xl border-2 border-border bg-background/50 p-6 backdrop-blur-xl md:p-8"
            >
              <div className="mb-4 inline-block rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold text-brand-green">
                שדרוגים
              </div>
              <h3 className="mb-2 text-2xl font-black text-foreground-heading">תוספות ושדרוגים</h3>
              <p className="mb-4 text-sm text-foreground-secondary">ניתן להוסיף לכל מסלול:</p>
              <ul className="space-y-3">
                <li className="flex items-center justify-between rounded-xl border border-border bg-background/30 px-4 py-3">
                  <span className="text-sm font-medium text-foreground-secondary">חבילת תדמית ושיווק</span>
                  <span className="text-sm font-bold text-foreground-heading">1,000 ₪ + מע״מ</span>
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
              className="rounded-2xl border-2 border-brand-green/30 bg-brand-green/5 p-6 md:p-8"
            >
              <h3 className="mb-6 text-2xl font-black text-foreground-heading">מתאים למי ש...</h3>
              <ul className="space-y-4">
                {[
                  "רוצה להיכנס לתחום האירועים",
                  "מבין שתקלוט זה לא רק מוזיקה",
                  "רוצה ללמוד על ציוד מקצועי אמיתי",
                  "מוכן להשקיע בעצמו ולתרגל",
                  "רוצה לנגן מול אנשים – לא רק בבית",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground-secondary">
                    <span className="mt-0.5 text-brand-green">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-background/30 p-6 md:p-8"
            >
              <h3 className="mb-6 text-2xl font-black text-foreground-heading">פחות מתאים למי ש...</h3>
              <ul className="space-y-4">
                {[
                  "מחפש תחביב בלי כוונה להתפתח",
                  "מחפש ״נוסחה קסומה״ בלי עבודה",
                  "לא מוכן להשקיע זמן בתרגול",
                  "רוצה תוצאות בלי סבלנות",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground-secondary/60">
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
            className="group block rounded-2xl border border-border bg-background/50 p-6 text-center backdrop-blur-xl transition hover:border-brand-blue/50 md:p-8"
          >
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground-secondary">אטרקציה לחתונה</p>
            <h3 className="mb-2 text-2xl font-black text-foreground-heading">חתן מתקלט</h3>
            <p className="mb-4 text-foreground-secondary">
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
