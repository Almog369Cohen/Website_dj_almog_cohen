"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

export default function BarMitzvahDJPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "DJ לבר מצווה",
            description: "DJ מקצועי לבר מצווה - מוזיקה שמתאימה לנוער ומבוגרים",
            provider: { "@type": "Person", name: "Almog Cohen" },
          }),
        }}
      />

      <div className="border-b border-border bg-background/50 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Link href="/" className="hover:text-foreground-heading">בית</Link>
            <span>›</span>
            <Link href="/events" className="hover:text-foreground-heading">אירועים</Link>
            <span>›</span>
            <span className="text-foreground-heading">DJ בר מצווה</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span className="text-sm font-bold text-blue-400">DJ לבר מצווה</span>
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 text-4xl font-black text-foreground-heading md:text-6xl">
                מסיבה שהילד יזכור לנצח
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 text-lg text-foreground-secondary">
                בר מצווה זה <strong className="text-foreground-heading">אירוע חד פעמי</strong> בחיי הילד. 
                אני יודע לקרוא קהל מעורב – מהילדים על הרחבה ועד ההורים והסבים. 
                מוזיקה שמתאימה לכולם, עם אינטראקציה ומשחקים שמעלים את האנרגיה.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8 space-y-3">
                {[
                  "מוזיקה מותאמת לגילאי נוער + מבוגרים",
                  "אינטראקציה עם הילדים - משחקים ואתגרים",
                  "ניסיון רב באירועי בני נוער",
                  "רגישות לצרכים של כל המשפחה",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">✓</div>
                    <span className="text-foreground-secondary">{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <a href={wa("היי אלמוג, מעוניינים ב-DJ לבר מצווה")} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white transition hover:scale-105">
                  <span>בדיקת זמינות</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30" />
              <div className="relative flex h-full items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-3xl opacity-40" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-black text-foreground-heading md:text-5xl">מה כולל השירות?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: "Playlist מותאם", desc: "משלבים את המוזיקה של הילד עם המוזיקה של המבוגרים" },
              { title: "משחקים ואתגרים", desc: "אינטראקציה שמעלה את האנרגיה ושומרת על הילדים מרוכזים" },
              { title: "קריאת קהל מעורב", desc: "יודע איך לשמור על כולם ברחבה - מגיל 13 ועד 70" },
              { title: "ציוד מתאים", desc: "סאונד איכותי + תאורה (בתיאום)" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background/50 p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground-heading">{item.title}</h3>
                <p className="text-foreground-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-black text-foreground-heading md:text-5xl">בואו ניצור בר מצווה בלתי נשכח</h2>
          <a href={wa("היי אלמוג, רוצים לשמוע על DJ לבר מצווה")} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-10 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-105">
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
