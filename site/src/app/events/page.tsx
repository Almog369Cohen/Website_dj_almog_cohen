"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { buildWhatsAppLink, getEventsWhatsAppMessage } from "@/utils/whatsapp";

export default function EventsPage() {
  const wa = (txt: string) => buildWhatsAppLink(txt);

  const eventTypes = [
    {
      title: "DJ חתונות",
      description: "מהחופה ועד הרקדון האחרון",
      highlights: [
        "ליווי מוזיקלי מלא לכל שלבי החתונה",
        "התאמה לסגנון המוזיקלי שלכם",
        "קריאת קהל מקצועית",
        "12 שנות ניסיון בחתונות יוקרה",
      ],
      link: "/events/weddings-dj",
      cta: "לפרטים על DJ לחתונה",
      color: "from-[#059cc0] to-[#03b28c]",
    },
    {
      title: "DJ בר מצווה",
      description: "מסיבה שהילד יזכור לנצח",
      highlights: [
        "מוזיקה שמתאימה לגילאי נוער ומבוגרים",
        "אינטראקציה עם הילדים",
        "משחקים ואטרקציות מוזיקליות",
        "ניסיון רב באירועי בני נוער",
      ],
      link: "/events/bar-mitzvah-dj",
      cta: "לפרטים על DJ לבר מצווה",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "DJ בת מצווה",
      description: "ערב קסום שמתאים לנסיכה",
      highlights: [
        "עיצוב מוזיקלי רגיש ומתאים לבנות",
        "מוזיקה עדכנית ופופולרית",
        "אווירה חגיגית ומרגשת",
        "רגישות מלאה לציבור הצעיר",
      ],
      link: "/events/bat-mitzvah-dj",
      cta: "לפרטים על DJ לבת מצווה",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "DJ חינה",
      description: "אירוע מסורתי עם טוויסט מודרני",
      highlights: [
        "שילוב מוזיקה מזרחית ומערבית",
        "התאמה מלאה למסורת המשפחתית",
        "מוזיקת רקע לחינה ומוזיקה לריקודים",
        "ניסיון בחתונות מעורבות ומסורתיות",
      ],
      link: "/events/henna-dj",
      cta: "לפרטים על DJ לחינה",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "אירועים עסקיים",
      description: "מוזיקה שמגבשת צוות",
      highlights: [
        "התאמה לאופי החברה",
        "ניסיון באירועי Startup",
        "גמישות מלאה",
        "שירות מקצועי",
      ],
      link: "/events/corporate-events",
      cta: "לפרטים על אירועים עסקיים",
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "חוגג מנגן",
      description: "המסיבה מתחילה עוד לפני שהגיעו",
      highlights: [
        "DJ + מוזיקאים חיים",
        "ליווי מלא מקבלת הפנים",
        "התאמה לכל סגנון",
        "חוויה מלאה 360°",
      ],
      link: "/events/chogeg-menagen",
      cta: "לפרטים על חוגג מנגן",
      color: "from-brand-green to-emerald-500",
    },
    {
      title: "LIVE ON DJ",
      description: "DJ + מוזיקאים חיים = קסם",
      highlights: [
        "שילוב תקליטנות עם נגנים/זמרים חיים",
        "הופעות מרהיבות ואינטראקטיביות",
        "חוויה מוזיקלית בלתי נשכחת",
        "אפשרות לשילוב עם אמנים אורחים",
      ],
      link: "/events/live-on-dj",
      cta: "לפרטים על LIVE ON DJ",
      color: "from-purple-500 to-violet-500",
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
            "@type": "Service",
            name: "שירותי DJ לאירועים",
            description: "DJ מקצועי לחתונות, בר/בת מצווה, חינה והופעות LIVE ON DJ",
            provider: {
              "@type": "Person",
              name: "Almog Cohen",
            },
            areaServed: {
              "@type": "Country",
              name: "Israel",
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
            <span className="text-foreground-heading">אירועים</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#03b28c]/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="inline-block rounded-full bg-brand-blue/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-brand-blue">
              אירועים
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-black leading-tight text-foreground-heading md:text-6xl lg:text-7xl"
          >
            כל אירוע הוא
            <br />
            <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
              פסקול ייחודי
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-foreground-secondary md:text-xl"
          >
            מחתונות יוקרה ועד בני/בנות מצווה, מחינה מסורתית ועד הופעות LIVE ON DJ – 
            <strong className="text-foreground-heading"> כל רגע מקבל את הפסקול המושלם</strong> שלו.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a
              href={wa(getEventsWhatsAppMessage("events_general"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
            >
              <span>בדיקת זמינות</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Event Types Grid */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center text-3xl font-black text-foreground-heading md:text-5xl">
            סוגי האירועים שלנו
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-background/50 p-8 backdrop-blur-xl transition hover:border-border/60"
              >
                <div className={`mb-6 h-2 w-16 rounded-full bg-gradient-to-r ${event.color}`} />
                
                <h3 className="mb-2 text-2xl font-black text-foreground-heading">{event.title}</h3>
                <p className="mb-6 text-sm text-foreground-secondary">{event.description}</p>

                <ul className="mb-8 space-y-3">
                  {event.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                      <span className="mt-0.5 text-brand-green">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={event.link}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r ${event.color} px-6 py-3 text-base font-bold text-white transition hover:scale-105`}
                >
                  <span>{event.cta}</span>
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
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground-heading md:text-5xl">
              רגעים מהאירועים שלנו
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground-secondary">
              תמונות מאירועים אמיתיים, אווירות אמיתיות
            </p>
          </div>
          
          {/* Image Carousel - Add your images here */}
          {/* Example usage:
          <ImageCarousel
            images={[
              "/assets/events/wedding-1.jpg",
              "/assets/events/bar-mitzvah-1.jpg",
              "/assets/events/henna-1.jpg",
            ]}
            alt="גלריית אירועים"
            autoPlay={true}
            interval={5000}
            showThumbnails={true}
          />
          */}
          <div className="rounded-2xl border border-border bg-muted/50 p-12 text-center">
            <p className="text-foreground-secondary">
              📸 מקום לגלריית תמונות - הוסף 4-20 תמונות מאירועים
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border bg-background/50 p-8 text-center backdrop-blur-xl md:p-12">
            <h2 className="mb-6 text-3xl font-black text-foreground-heading md:text-4xl">
              למה לבחור באלמוג כהן?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-green" />
                <h3 className="mb-2 font-bold text-foreground-heading">12 שנות ניסיון</h3>
                <p className="text-sm text-foreground-secondary">מאות אירועים מוצלחים בכל רחבי הארץ</p>
              </div>
              <div>
                <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#ffaa00] to-orange-500" />
                <h3 className="mb-2 font-bold text-foreground-heading">התאמה אישית</h3>
                <p className="text-sm text-foreground-secondary">כל אירוע מקבל פסקול ייחודי</p>
              </div>
              <div>
                <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <h3 className="mb-2 font-bold text-foreground-heading">Energy Architect</h3>
                <p className="text-sm text-foreground-secondary">יוצר חוויות מוזיקליות בלתי נשכחות</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-black text-foreground-heading md:text-5xl">
            מוכנים ליצור את האירוע המושלם?
          </h2>
          <p className="mb-8 text-lg text-foreground-secondary">
            בואו נדבר על האירוע שלכם ונבנה את הפסקול המושלם.
          </p>
          <a
            href={wa(getEventsWhatsAppMessage("events_general"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-10 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-105"
          >
            <span>בדיקת זמינות</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
