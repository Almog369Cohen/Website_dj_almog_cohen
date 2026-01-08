"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

export default function GroomDJPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const steps = [
    {
      number: "01",
      title: "שיחת היכרות",
      description: "נדבר על החתונה, הסגנון המוזיקלי שלכם, והרגע המושלם להפתעה",
    },
    {
      number: "02",
      title: "3-5 שיעורים פרטיים",
      description: "לומדים תקלוט בסיסי, בוחרים את השירים ומכינים את הסט",
    },
    {
      number: "03",
      title: "ריפרוף לפני האירוע",
      description: "מפגש אחרון לוודא שהכול מדויק ושאתם מרגישים בטוחים",
    },
    {
      number: "04",
      title: "יום החתונה",
      description: "אני איתכם במקום, מכין את הציוד ומלווה אתכם ברגע הגדול",
    },
  ];

  const whySpecial = [
    {
      icon: "💝",
      title: "הפתעה שנשארת",
      description: "הרגע שבו החתן עולה לעמדה והאורחים לא מאמינים למראה עיניהם",
    },
    {
      icon: "🎥",
      title: "תוכן ויראלי",
      description: "זה יהיה ה-content הכי חם באינסטגרם שלכם. כולם ישמרו ושיתפו",
    },
    {
      icon: "🎯",
      title: "בטחון מלא",
      description: "אני לידכם כל הזמן - אין מצב שמשהו ישתבש",
    },
    {
      icon: "⚡",
      title: "אנרגיה שיא",
      description: "האורחים מתלהבים פי 10 כשהם רואים את בעל השמחה על העמדה",
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
            name: "חתן מתקלט",
            description: "אטרקציה מיוחדת לחתונה - החתן או הכלה לומדים לתקלט ומפתיעים את האורחים",
            provider: {
              "@type": "Person",
              name: "Almog Cohen",
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
            <span className="text-foreground-heading">חתן מתקלט</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-pink-500/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-purple-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-pink-500/20 px-4 py-1 text-sm font-bold text-pink-400">
                  💝 מתנה מדויקת
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 text-4xl font-black text-foreground-heading md:text-6xl"
              >
                החתן מתקלט
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-2xl font-bold text-foreground-heading"
              >
                האטרקציה המרגשת ביותר לחתונה שלכם
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-lg text-foreground-secondary"
              >
                תארו לעצמכם: החתן (או הכלה) עולה לעמדה, מתקלט 15-20 דקות 
                ומרעיד את הרחבה. האורחים לא מאמינים למראה עיניהם. 
                <strong className="text-foreground-heading"> זה לא סתם אטרקציה – זה רגע שיזכרו לנצח.</strong>
              </motion.p>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8 space-y-3"
              >
                {[
                  "3-5 שיעורים פרטיים",
                  "בחירת שירים מותאמת אישית",
                  "ליווי ביום החתונה",
                  "הכל על הציוד שלי - אין צורך בציוד נוסף",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
                      ✓
                    </div>
                    <span className="text-foreground-secondary">{item}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <a
                  href={wa("היי אלמוג, רוצים להפתיע בחתונה עם חתן מתקלט")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 text-lg font-bold text-white transition hover:scale-105"
                >
                  <span>בואו נתכנן את ההפתעה</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Right: Video/Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-pink-500/20 to-purple-500/20"
            >
              <div className="flex h-full items-center justify-center text-8xl">
                💍
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Special */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-black text-foreground-heading md:text-5xl">
            למה זו האטרקציה הכי מיוחדת?
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {whySpecial.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-foreground-heading">{item.title}</h3>
                <p className="text-foreground-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-black text-foreground-heading md:text-5xl">
            איך זה עובד?
          </h2>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-xl"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-xl font-bold text-pink-400">
                  {step.number}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-foreground-heading">{step.title}</h3>
                  <p className="text-foreground-secondary">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-black text-white md:text-4xl">
            שאלות נפוצות
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "האם צריך ידע מוקדם?",
                a: "בכלל לא! זה בדיוק בשביל מישהו שאף פעם לא תקלט. אני מלמד הכל מאפס.",
              },
              {
                q: "כמה זמן לוקח ההכנה?",
                a: "בדרך כלל 3-5 שיעורים של שעה-שעה וחצי. תלוי בקצב שלך.",
              },
              {
                q: "מה אם אני מתלבט?",
                a: "אני מלווה אותך כל הדרך. ביום החתונה אני ליד העמדה - אין מצב שמשהו ישתבש.",
              },
              {
                q: "האם זה רק לחתנים?",
                a: "בכלל לא! גם כלות, גם שושבינים, גם הורים - כל מי שרוצה להפתיע.",
              },
              {
                q: "איזה ציוד צריך?",
                a: "כלום. הכל על הציוד שלי. אתה רק צריך להגיע ולהיות מוכן להדליק.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-xl"
              >
                <h3 className="mb-2 text-lg font-bold text-foreground-heading">{faq.q}</h3>
                <p className="text-foreground-secondary">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Sell: Link to Weddings */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-border bg-background/50 p-8 text-center backdrop-blur-xl">
            <p className="mb-4 text-sm uppercase tracking-wider text-foreground-secondary">אולי יעניין אתכם גם</p>
            <h3 className="mb-4 text-2xl font-black text-foreground-heading">צריכים DJ לחתונה עצמה?</h3>
            <p className="mb-6 text-foreground-secondary">
              בנוסף לאטרקציה של "חתן מתקלט", אלמוג מספק שירות DJ מלא לחתונות יוקרה – 
              מהחופה ועד האפטר פארטי. ליווי מוזיקלי מקצועי שיהפוך את היום שלכם לבלתי נשכח.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-background/50 px-6 py-3 font-bold text-foreground transition hover:border-brand-blue hover:bg-brand-blue/10"
            >
              <span>למידע על שירות DJ לחתונות</span>
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
          <h2 className="mb-6 text-3xl font-black text-foreground-heading md:text-5xl">
            מתנה שתזכרו לנצח
          </h2>
          <p className="mb-8 text-lg text-foreground-secondary">
            זה לא עוד אטרקציה שכולם עשו. זה הרגע שיספר על מי אתם.
          </p>
          <a
            href={wa("היי אלמוג, רוצים להפתיע את האורחים עם חתן מתקלט")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-10 py-5 text-xl font-bold text-white shadow-lg transition hover:scale-105"
          >
            <span>בואו נתכנן את ההפתעה</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
