"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

export default function DJCoursePage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const curriculum = [
    {
      title: "היכרות עם הציוד",
      topics: [
        "Pioneer CDJ-3000: הפלטה המקצועית",
        "DJM-900NXS2: המיקסר הכי מתקדם",
        "קונטרולרים: DDJ-400, DDJ-1000",
        "Rekordbox: התוכנה שמנהלת הכל",
      ],
    },
    {
      title: "ביט-מיקס (Beat Matching)",
      topics: [
        "זיהוי BPM: איך לדעת מה הקצב",
        "התאמת קצב: סנכרון בין שני שירים",
        "Cueing: הכנת השיר הבא",
        "EQ: איזון תדרים בעת המעבר",
      ],
    },
    {
      title: "מבנה מוזיקלי",
      topics: [
        "Intro / Outro: איך להכיר את מבנה השיר",
        "Drop / Build-up: מתי לעבור שיר",
        "Phrasing: מעברים מוזיקליים נכונים",
        "Key Matching: התאמת מפתחות (Camelot)",
      ],
    },
    {
      title: "קריאת קהל",
      topics: [
        "מתי להרים ומתי להוריד",
        "איך לזהות שהקהל מתחיל להשתעמם",
        "כלים לעליית אנרגיה: Acapellas, Loops, Effects",
        "Recovery: איך לצאת משיר שלא עבד",
      ],
    },
    {
      title: "תרגול מעשי",
      topics: [
        "בניית סט של 30 דקות",
        "תרגול על ציוד אמיתי",
        "הקלטה ושיפור",
        "הכנה להופעה ראשונה",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "קורס DJ למתחילים",
            description: "קורס DJ מקצועי למתחילים - תקלוט מהבסיס על ציוד Pioneer עם אלמוג כהן",
            provider: {
              "@type": "EducationalOrganization",
              name: "Compakt Academy",
              url: "https://www.compaktt.com/academy",
            },
            instructor: {
              "@type": "Person",
              name: "Almog Cohen",
              description: "DJ מקצועי עם 12 שנות ניסיון",
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-background/50 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Link href="/" className="hover:text-foreground-heading">בית</Link>
            <span>›</span>
            <Link href="/academy" className="hover:text-foreground-heading">Academy</Link>
            <span>›</span>
            <span className="text-foreground-heading">קורס DJ למתחילים</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Left: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <span className="inline-block rounded-full bg-brand-blue/20 px-4 py-1 text-sm font-bold text-brand-blue">
                  למתחילים
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 text-4xl font-black text-foreground-heading md:text-6xl"
              >
                קורס DJ למתחילים
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 text-lg text-foreground-secondary"
              >
                מהתחלנים לפרופסיונלים: תקלוט מהבסיס על ציוד Pioneer מקצועי. 
                <strong className="text-foreground-heading"> 80% תרגול מעשי</strong> – 
                תצאו מכאן יודעים לתקלט באירועים אמיתיים.
              </motion.p>

              {/* Key Points */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 space-y-3"
              >
                {[
                  "משך: 8 מפגשים (שבועיים)",
                  "ציוד: Pioneer CDJ-3000 + DJM-900NXS2",
                  "גישה לחומרי לימוד דיגיטליים",
                  "תמיכה בקבוצת WhatsApp אחרי הקורס",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                      ✓
                    </div>
                    <span className="text-foreground-secondary">{item}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href={wa("היי אלמוג, מעוניין בקורס DJ למתחילים")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-8 py-4 text-lg font-bold text-white transition hover:scale-105"
                >
                  <span>הרשמה למחזור הקרוב</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <Link
                  href="/academy"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-background/50 px-8 py-4 text-lg font-medium text-foreground backdrop-blur-sm transition hover:bg-background/70"
                >
                  ראה מסלולים אחרים
                </Link>
              </motion.div>
            </div>

            {/* Right: Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-blue/20 to-brand-green/20"
            >
              <div className="flex h-full items-center justify-center text-6xl">
                🎧
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-black text-foreground-heading md:text-5xl">
            מה לומדים בקורס?
          </h2>

          <div className="space-y-6">
            {curriculum.map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-lg font-bold text-brand-blue">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-foreground-heading">{module.title}</h3>
                </div>
                <ul className="space-y-2 pr-14">
                  {module.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground-secondary">
                      <span className="mt-1 text-brand-green">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Course */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background/50 p-8 backdrop-blur-xl">
              <h3 className="mb-4 text-2xl font-black text-foreground-heading">למי זה מתאים?</h3>
              <ul className="space-y-3">
                {[
                  "מתחילים מוחלטים ללא ידע קודם",
                  "מי שרוצה להפוך את התחביב למקצוע",
                  "דיג'ייז חובבנים שרוצים להתקדם",
                  "מי שמוכן להשקיע ולתרגל",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-brand-green">✓</span>
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-background/50 p-8 backdrop-blur-xl">
              <h3 className="mb-4 text-2xl font-black text-foreground-heading">מה תוציאו מהקורס?</h3>
              <ul className="space-y-3">
                {[
                  "יכולת לתקלט באירועים אמיתיים",
                  "סט מוכן של 30-60 דקות",
                  "בטחון לעמוד על הבמה",
                  "קשרים ותמיכה מקהילת הבוגרים",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-brand-blue">→</span>
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Up-Sell: Premium Track */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border-2 border-[#ffaa00]/30 bg-background/50 p-8 text-center backdrop-blur-xl">
            <div className="mb-4 inline-block rounded-full bg-[#ffaa00]/20 px-4 py-1 text-sm font-bold text-[#ffaa00]">
              💎 רוצים יותר?
            </div>
            <h3 className="mb-4 text-2xl font-black text-foreground-heading md:text-3xl">
              מתכנן קריירה רצינית בתחום?
            </h3>
            <p className="mb-6 text-foreground-secondary">
              אחרי הקורס הבסיסי, אפשר להמשיך ל<strong className="text-foreground-heading">תכנית הפרמיום</strong> – 
              מנטורינג אישי שילמד אותך לא רק לתקלט, אלא גם לבנות מותג, למכור את עצמך ולמלא יומן הופעות.
            </p>
            <Link
              href="/academy/premium"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffaa00] to-[#ff8800] px-8 py-4 font-bold text-white transition hover:scale-105"
            >
              <span>למידע על תכנית הפרמיום</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-black text-foreground-heading md:text-5xl">
            מוכנים להתחיל?
          </h2>
          <p className="mb-8 text-lg text-foreground-secondary">
            המחזור הקרוב מתחיל בקרוב. המקומות מוגבלים.
          </p>
          <a
            href={wa("היי אלמוג, אשמח לשמוע פרטים על קורס DJ למתחילים")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-10 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-105"
          >
            <span>שיחה עם אלמוג</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
