"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

export default function AcademyPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const courses = [
    {
      title: "קורס DJ למתחילים",
      icon: "🎧",
      description: "מאפס לבמה",
      features: [
        "ציוד: Pioneer CDJ, מיקסר, קונטרולר",
        "ביט-מיקס: התאמת קצב בין שירים",
        "מבנה מוזיקלי: איך לבנות סט",
        "קריאת קהל: מתי להרים ומתי להוריד",
        "תרגול מעשי: 80% practice",
      ],
      link: "/academy/dj-course",
      cta: "לפרטים על הקורס",
      level: "למתחילים",
      badge: null,
    },
    {
      title: "תכנית פרמיום",
      icon: "💎",
      description: "מנטורינג אישי",
      features: [
        "מיתוג ופוזישנינג: בניית brand אישי",
        "עסקים בתחום הלילה: תמחור, משא ומתן",
        "שיווק דיגיטלי: אינסטגרם, TikTok, לידים",
        "ניהול קריירה: מיומן ללוח שנתי",
        "ליווי אישי: שיחות 1-on-1 + קבוצה סגורה",
      ],
      link: "/academy/premium",
      cta: "בדיקת התאמה",
      level: "למתקדמים / רציניים",
      badge: "🔥 VIP",
    },
    {
      title: "חתן מתקלט",
      icon: "💍",
      description: "אטרקציה לחתונה",
      features: [
        "3-5 שיעורים פרטיים",
        "בחירת שירים מותאמת",
        "הכנת סט של 15-20 דקות",
        "ריפרוף לפני האירוע",
        "ליווי ביום החתונה",
      ],
      link: "/academy/groom-dj",
      cta: "רוצים להפתיע?",
      level: "אטרקציה",
      badge: "💝 מתנה מושלמת",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema for Academy Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Compakt Academy",
            description: "בית ספר לדיג'ייז ואמנים בתל אביב",
            url: "https://www.compaktt.com/academy",
            address: {
              "@type": "PostalAddress",
              addressLocality: "תל אביב",
              addressCountry: "IL",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#03b28c]/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block"
          >
            <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-brand-blue">
              Compakt Academy
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl font-black leading-tight text-foreground-heading md:text-6xl lg:text-7xl"
            style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            מהתחלנים ל
            <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
              בעלי עסק מצליחים
            </span>
            <br />
            בתחום הלילה
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-foreground-secondary md:text-xl"
          >
            לא עוד קורסים שמלמדים רק "איך ללחוץ על כפתורים". 
            <br />
            כאן אתם לומדים איך לבנות <strong className="text-foreground-heading">קריירה אמיתית</strong> ו
            <strong className="text-foreground-heading">מותג חזק</strong> בעולם המוזיקה.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="#courses"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
            >
              <span>בחרו את המסלול שלכם</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <a
              href={wa("היי אלמוג, מעוניין לשמוע על Compakt Academy")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-background/50 px-8 py-4 text-lg font-medium text-foreground backdrop-blur-sm transition hover:bg-background/70"
            >
              <span>שיחה עם אלמוג</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="courses" className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Title */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground-heading md:text-5xl">
              המסלולים שלנו
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground-secondary">
              כל מסלול מותאם לרמה ולמטרה שלכם. בחרו את המסלול המתאים ותתחילו את המסע.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {courses.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-3xl border p-8 ${
                  course.badge
                    ? "border-[#ffaa00]/50 bg-gradient-to-br from-[#ffaa00]/10 via-background to-background"
                    : "border-border bg-background/50"
                } backdrop-blur-xl transition hover:border-brand-blue/50 hover:shadow-[0_0_40px_rgba(var(--brand-blue-rgb),0.3)]`}
              >
                {/* Badge */}
                {course.badge && (
                  <div className="absolute left-4 top-4 rounded-full bg-[#ffaa00]/20 px-3 py-1 text-xs font-bold text-[#ffaa00] dark:bg-[#ffaa00]/30 dark:text-[#ffaa00]">
                    {course.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6 text-6xl">{course.icon}</div>

                {/* Title */}
                <h3 className="mb-2 text-2xl font-black text-foreground-heading">{course.title}</h3>
                <p className="mb-6 text-sm text-foreground-secondary">{course.description}</p>

                {/* Level */}
                <div className="mb-6 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {course.level}
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {course.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                      <span className="mt-0.5 text-brand-green">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={course.link}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-6 py-3 text-base font-bold text-white transition hover:scale-105"
                >
                  <span>{course.cta}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground-heading md:text-5xl">
              האקדמיה שלנו
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground-secondary">
              הציוד, הסטודיו, והאווירה שמחכים לכם
            </p>
          </div>
          
          {/* Image Carousel - Add your images here */}
          {/* Example usage:
          <ImageCarousel
            images={[
              "/assets/academy/studio-1.jpg",
              "/assets/academy/equipment-1.jpg",
              "/assets/academy/students-1.jpg",
            ]}
            alt="גלריית Compakt Academy"
            autoPlay={true}
            interval={5000}
            showThumbnails={true}
          />
          */}
          <div className="rounded-2xl border border-border bg-muted/50 p-12 text-center">
            <p className="text-foreground-secondary">
              📸 מקום לגלריית תמונות - הוסף 4-20 תמונות של האקדמיה
            </p>
          </div>
        </div>
      </section>

      {/* Why Compakt Academy */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-border bg-background/50 p-8 backdrop-blur-xl md:p-12">
            <h2 className="mb-8 text-center text-3xl font-black text-foreground-heading md:text-4xl">
              למה Compakt Academy?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "12 שנות ניסיון בשטח",
                  desc: "אלמוג כהן הוא לא רק מורה - הוא DJ פעיל שמנגן בחתונות ואירועי יוקרה כל שבוע.",
                },
                {
                  title: "הכשרה מעשית",
                  desc: "80% מהזמן זה תרגול על ציוד אמיתי. לא רק תיאוריה - אתם תוצאים מכאן יודעים לתקלט.",
                },
                {
                  title: "ציוד מקצועי",
                  desc: "Pioneer CDJ-3000, DJM-900NXS2 ועוד. אותו ציוד שתמצאו באירועים אמיתיים.",
                },
                {
                  title: "תמיכה אחרי הקורס",
                  desc: "קבוצת WhatsApp סגורה, ייעוץ והמלצות על הופעות ראשונות.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-brand-blue">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-foreground-heading">{item.title}</h3>
                    <p className="text-foreground-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-black text-foreground-heading md:text-5xl">
            מוכנים להתחיל?
          </h2>
          <p className="mb-8 text-lg text-foreground-secondary">
            בואו נדבר ונראה איזה מסלול מתאים לכם.
          </p>
          <a
            href={wa("היי אלמוג, אשמח לשמוע פרטים על הקורסים ב-Compakt Academy")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-10 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-105"
          >
            <span>בואו נדבר בוואטסאפ</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
