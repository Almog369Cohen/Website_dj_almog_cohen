"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AfterPartyPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const genres = [
    {
      name: "Melodic Techno",
      description: "טכנו מלודי עם אנרגיה גבוהה",
      artists: "Tale Of Us, Adriatique, Ben Böhmer",
    },
    {
      name: "Afro House",
      description: "קצבים אפריקאיים שמרימים את הרחבה",
      artists: "Black Coffee, Shimza, Keinemusik",
    },
    {
      name: "Progressive House",
      description: "האוס פרוגרסיבי שבונה אנרגיה",
      artists: "Solomun, Guy J, Yotto",
    },
    {
      name: "Techno",
      description: "טכנו קלאסי לרחבות שלא עוצרות",
      artists: "Charlotte de Witte, Amelie Lens",
    },
  ];

  const whatIncluded = [
    "סט של 2-4 שעות - אנרגיה לא עוצרת",
    "מערכת סאונד מקצועית (ניתן לשדרג)",
    "תאורה ואפקטים (בתיאום)",
    "מעברים מוזיקליים חלקים",
    "גמישות מלאה - מתאים לסגנון האירוע",
  ];

  return (
    <div className="min-h-screen bg-[#1f1f21]">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "אפטר פארטי טכנו לחתונה",
            description: "סטים של טכנו מלודי, אפרו האוס והאוס פרוגרסיבי לאפטר פארטי בחתונות",
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
      <div className="border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-white">
            <Link href="/" className="hover:text-white">בית</Link>
            <span>›</span>
            <Link href="/weddings" className="hover:text-white">חתונות</Link>
            <span>›</span>
            <span className="text-white">אפטר פארטי</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-purple-500/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-pink-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <span className="inline-block rounded-full bg-purple-500/20 px-4 py-1 text-sm font-bold text-purple-400">
                  🔥 אפטר פארטי
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 text-4xl font-black text-white md:text-6xl"
              >
                הרגע שבו החתונה
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  הופכת לפסטיבל
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 text-lg text-white"
              >
                סטים של <strong className="text-white">Melodic Techno, Afro House ו-Progressive</strong> 
                שיחזיקו את הרחבה עד אור הבוקר. זה לא סתם "מוזיקה חזקה" – 
                זה מסע מוזיקלי שבונה אנרגיה ומשאיר את כולם על הרגליים.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href={wa("היי אלמוג, מעוניינים באפטר פארטי טכנו לחתונה")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-bold text-white transition hover:scale-105"
                >
                  <span>בדיקת זמינות</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <Link
                  href="/weddings"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  כל שירותי החתונות
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            >
              <div className="flex h-full items-center justify-center text-8xl">
                🎧
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-black text-white md:text-5xl">
            הסגנונות המוזיקליים
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {genres.map((genre, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-xl"
              >
                <h3 className="mb-2 text-xl font-bold text-white">{genre.name}</h3>
                <p className="mb-3 text-white">{genre.description}</p>
                <p className="text-sm text-foreground-secondary">
                  <strong>Artists:</strong> {genre.artists}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-xl">
            <h2 className="mb-8 text-center text-3xl font-black text-white md:text-4xl">
              מה כלול בחבילה?
            </h2>
            <ul className="space-y-4">
              {whatIncluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    ✓
                  </div>
                  <span className="text-lg text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cross-Sell: Main Wedding Service */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 text-center backdrop-blur-xl">
            <p className="mb-4 text-sm uppercase tracking-wider text-white">אולי יעניין אתכם גם</p>
            <h3 className="mb-4 text-2xl font-black text-white">צריכים DJ גם לחתונה עצמה?</h3>
            <p className="mb-6 text-white">
              בנוסף לאפטר פארטי, אני מספק ליווי מוזיקלי מלא – מהחופה ועד סיום האירוע הרשמי. 
              בואו נבנה מסע מוזיקלי שלם לכל הערב.
            </p>
            <Link
              href="/weddings"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-6 py-3 font-bold text-white transition hover:border-[#059cc0] hover:bg-[#059cc0]/10"
            >
              <span>למידע על DJ לחתונה</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-black text-white md:text-5xl">
            מוכנים להרים את הרחבה?
          </h2>
          <p className="mb-8 text-lg text-white">
            בואו נבדוק זמינות ונדבר על הסגנון המוזיקלי שמתאים לכם.
          </p>
          <a
            href={wa("היי אלמוג, רוצים לשמוע על אפטר פארטי טכנו")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-105"
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
