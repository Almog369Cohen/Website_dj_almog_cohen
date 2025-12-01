"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StoriesSection, FAQSection, FinalCTASection } from "@/components/sections";

export default function WeddingsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const services = [
    {
      title: "חתונות בוטיק",
      icon: "💎",
      description: "חתונות יוקרה עד 300 אורחים",
      features: [
        "פגישת ייעוץ מקדימה ובניית playlist מותאם",
        "קריאת קהל מדויקת - מהחופה ועד הסיום",
        "מעברים מוזיקליים חלקים ללא 'הפסקות'",
        "התאמה לסגנונות: טכנו, האוס, אפרו, ים תיכוני",
        "גמישות מלאה - לא 'תפריט קבוע'",
      ],
      cta: "בדיקת זמינות",
      color: "from-[#059cc0] to-[#03b28c]",
    },
    {
      title: "אפטר פארטי טכנו",
      icon: "🔥",
      description: "מהחתונה לפסטיבל",
      features: [
        "Melodic Techno, Afro House, Progressive",
        "סטים של 2-4 שעות - אנרגיה לא עוצרת",
        "מערכת סאונד מותאמת לטכנו",
        "תאורה ואפקטים (בתיאום)",
        "הרחבה שלא הולכת הביתה עד השמש",
      ],
      link: "/weddings/after-party",
      cta: "לפרטים על אפטר טכנו",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "חתן מתקלט",
      icon: "💍",
      description: "האטרקציה המיוחדת",
      features: [
        "החתן (או הכלה) עולה לעמדה",
        "3-5 שיעורים פרטיים לפני החתונה",
        "ליווי מלא ביום האירוע",
        "הפתעה שהאורחים לא ישכחו",
        "תוכן ויראלי מובטח",
      ],
      link: "/academy/groom-dj",
      cta: "רוצים להפתיע?",
      color: "from-pink-400 to-rose-400",
    },
  ];

  const whyMe = [
    {
      title: "לא כל חתונה מתאימה לי",
      description: "אני בוחר את האירועים שלי בפינצטה. אם אתם מחפשים 'תקליטן זול' או 'שיר אחרי שיר' - זה לא המקום.",
      icon: "⚡",
    },
    {
      title: "12 שנות ניסיון",
      description: "מחתונות אינטימיות ועד הפקות ענק. מתל אביב ועד אילת. מכל סגנון מוזיקלי שתחשבו עליו.",
      icon: "🎯",
    },
    {
      title: "אדריכלות מוזיקלית",
      description: "לא סתם playlist - אלא מסע מוזיקלי מתוכנן. מהרגע הראשון בחופה ועד הרגע האחרון ברחבה.",
      icon: "🎨",
    },
    {
      title: "התמחות בקהל מעורב",
      description: "חתונות של ישראלים וזרים, דתיים וחילוניים, צעירים ומבוגרים. אני יודע לדבר את השפה של כולם.",
      icon: "🌍",
    },
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
            name: "DJ לחתונות יוקרה בישראל",
            description: "שירות DJ מקצועי לחתונות בוטיק ואירועי יוקרה. התמחות בטכנו, האוס וקהלים מעורבים.",
            provider: {
              "@type": "Person",
              name: "Almog Cohen",
              description: "DJ מקצועי עם 12 שנות ניסיון",
            },
            areaServed: {
              "@type": "Country",
              name: "Israel",
            },
            serviceType: ["Wedding DJ", "DJ לחתונות", "אפטר פארטי"],
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="hover:text-white">בית</Link>
            <span>›</span>
            <span className="text-white">חתונות</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-purple-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="inline-block rounded-full bg-[#059cc0]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#059cc0]">
              DJ לחתונות בישראל
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
          >
            לא עוד "שיר אחרי שיר"
            <br />
            <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
              אלא מסע מוזיקלי שלם
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            אדריכל האנרגיה. מתמחה בחתונות בוטיק, קהלים מעורבים וסטים של טכנו והאוס 
            שמרימים את הרחבה. <strong className="text-white">12 שנות ניסיון</strong> בהפקות 
            מהחופה ועד האפטר פארטי.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href={wa("היי אלמוג, מעוניינים ב-DJ לחתונה")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
            >
              <span>בדיקת זמינות לתאריך שלכם</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              <span>סוגי השירותים</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center text-3xl font-black text-white md:text-5xl">
            השירותים שלנו
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-white/20"
              >
                <div className="mb-6 text-6xl">{service.icon}</div>
                <h3 className="mb-2 text-2xl font-black text-white">{service.title}</h3>
                <p className="mb-6 text-sm text-white/80">{service.description}</p>

                <ul className="mb-8 space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                      <span className="mt-0.5 text-[#03b28c]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {service.link ? (
                  <Link
                    href={service.link}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r ${service.color} px-6 py-3 text-base font-bold text-white transition hover:scale-105`}
                  >
                    <span>{service.cta}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                ) : (
                  <a
                    href={wa(`היי אלמוג, מעוניינים ב${service.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r ${service.color} px-6 py-3 text-base font-bold text-white transition hover:scale-105`}
                  >
                    <span>{service.cta}</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-black text-white md:text-5xl">
            למה דווקא אלמוג?
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {whyMe.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
                <p className="text-white/85">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories/Testimonials */}
      <StoriesSection 
        title="סיפורים מהרחבה"
        stories={[
          {
            title: "כשהמרצים שלי הפכו לקהל שלי.",
            content: [
              "בקורונה נרשמתי ללמוד שיווק אצל גל ודימה. כשהם ביקשו שאנגן בחתונה שלהם, התהפכו היוצרות.",
              "כשהם לא הפסיקו לרקוד, ידעתי שקיבלתי את הציון הסופי."
            ],
            image: "/assets/almog/wedding-1.jpg",
            label: "גל ודימה • 2020",
            color: "green"
          },
        ]}
      />

      {/* FAQ */}
      <FAQSection type="wedding" />

      {/* Final CTA */}
      <FinalCTASection 
        title="מוכנים לשדרג את החתונה?"
        subtitle="בואו נבדוק זמינות ונדבר על החזון המוזיקלי שלכם."
        primaryCTA={{
          text: "בדיקת זמינות",
          href: wa("היי אלמוג, רוצים לשמוע על DJ לחתונה"),
          isWhatsApp: true
        }}
      />
    </div>
  );
}
