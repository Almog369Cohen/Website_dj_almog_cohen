"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FAQSection } from "@/components/sections";
import WeddingsHero from "@/components/weddings/WeddingsHero";
import WeddingsGallery from "@/components/weddings/WeddingsGallery";
import { buildWhatsAppLink, getEventsWhatsAppMessage } from "@/utils/whatsapp";
import { trackEvent } from "@/utils/analytics";

const timelineSteps = [
  { icon: "🥂", title: "קבלת פנים", desc: "מוזיקת רקע שיוצרת אווירה חמימה ומזמינה", image: "/assets/gallery/djavira/hupa-wide.jpeg" },
  { icon: "💍", title: "כניסה לחופה", desc: "הרגע שכולם מחכים לו — השיר שמלווה אתכם לחופה", image: "/assets/gallery/djavira/entrance.jpg" },
  { icon: "🎊", title: "שבירת כוס", desc: "הפיצוץ. האנרגיה עולה. הרחבה מתחילה", image: "/assets/gallery/djavira/crowd.jpg" },
  { icon: "💕", title: "ריקוד ראשון", desc: "הרגע האינטימי שלכם — השיר שבחרתם ביחד", image: "/assets/gallery/djavira/hupa.jpg" },
  { icon: "🔥", title: "רחבה מטורפת", desc: "על הכתפיים, ידיים באוויר, כולם רוקדים", image: "/assets/gallery/djavira/shoulders.jpg" },
  { icon: "🎉", title: "אפטר פארטי", desc: "הסט שלא רוצים שייגמר", image: "/assets/gallery/djavira/dj-booth.jpg" },
];

const playlists = [
  { title: "כניסה לחופה", icon: "💍", youtubeId: "PLACEHOLDER" },
  { title: "שבירת כוס", icon: "🥂", youtubeId: "PLACEHOLDER" },
  { title: "סלואו / ריקוד ראשון", icon: "💕", youtubeId: "PLACEHOLDER" },
  { title: "סט רחבה", icon: "🔥", youtubeId: "PLACEHOLDER" },
];

export default function WeddingsPage() {
  const waLink = buildWhatsAppLink(getEventsWhatsAppMessage("weddings_dj"));
  const [openPlaylist, setOpenPlaylist] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* JSON-LD: Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "DJ לחתונות — אלמוג כהן",
            description: "DJ מקצועי לחתונות בישראל. ליווי אישי מהתכנון ועד הרחבה, תזמון מדויק, התאמה לקהל מעורב, ו-10+ שנות ניסיון ב-1000+ אירועים.",
            provider: {
              "@type": "LocalBusiness",
              name: "DJ Almog Cohen",
              image: "https://www.compaktt.com/assets/almog/IMG_6561.jpg",
              telephone: "+972-50-242-7616",
              url: "https://www.compaktt.com",
              address: { "@type": "PostalAddress", addressCountry: "IL" },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                bestRating: "5",
                ratingCount: "150",
              },
            },
            areaServed: { "@type": "Country", name: "Israel" },
            serviceType: ["DJ לחתונות", "Wedding DJ", "ניהול מוזיקלי לחתונות"],
          }),
        }}
      />
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "כמה זמן לפני החתונה צריך לסגור DJ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "מומלץ 4-6 חודשים מראש. תאריכים פופולריים (קיץ, חגים) נתפסים מהר. ככל שתסגרו מוקדם יותר, כך יש יותר זמן לתכנון מוזיקלי מדויק.",
                },
              },
              {
                "@type": "Question",
                name: "מה כלול במחיר DJ לחתונה?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "פגישת ייעוץ מקדימה, בניית playlist מותאם אישית, ציוד DJ מקצועי, נוכחות מהחופה ועד הסיום, וגמישות מלאה במהלך הערב.",
                },
              },
              {
                "@type": "Question",
                name: "האם DJ אלמוג כהן מתאים גם לקהל מבוגר?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "בהחלט! ההתמחות היא בדיוק בקהל מעורב — מעברים חלקים בין להיטים ישראליים, מזרחית, שנות ה-80 וטכנו, הכל תלוי בקהל שעל הרחבה.",
                },
              },
              {
                "@type": "Question",
                name: "מה קורה אם יש שינויים ברגע האחרון בחתונה?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "גמישות זה שם המשחק. אלמוג מגיע עם ספריית מוזיקה ענקית ויודע להתאים בזמן אמת. שינויים הם חלק מהעבודה.",
                },
              },
            ],
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-background/50 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Link href="/" className="hover:text-foreground">בית</Link>
            <span>›</span>
            <span className="text-foreground">חתונות</span>
          </nav>
        </div>
      </div>

      {/* 1. Hero */}
      <WeddingsHero ctaSource="weddings_hero" />

      {/* 2. Why Me — Trust Building */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-foreground md:text-5xl mb-4">למה זוגות בוחרים בי</h2>
            <p className="text-foreground-secondary text-lg">לא רק DJ. שותף לערב הכי חשוב שלכם.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "תזמון מדויק",
                desc: "אני יודע בדיוק מתי להעלות אנרגיה, מתי להוריד, ומתי לתת לרגע לנשום. 10+ שנות ניסיון לימדו אותי לקרוא חדר."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                title: "קריאת קהל",
                desc: "כל חתונה היא שונה. אני מתאים את עצמי לקהל שלכם — גיל, סגנון, אנרגיה. לא פלייליסט גנרי."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
                title: "ליווי אישי",
                desc: "משיחת ההיכרות ועד הרגע האחרון ברחבה — אני איתכם. תכנון מוזיקלי, התאמות, ושקט נפשי."
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-2xl p-8 hover:border-[#03b28c]/50 transition-all h-full">
                  <div className="mb-5">{card.icon}</div>
                  <h3 className="text-xl font-black text-foreground mb-3">{card.title}</h3>
                  <p className="text-foreground-secondary leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Timeline — Wedding Journey */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-b from-transparent via-foreground/5 to-transparent">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-black text-foreground md:text-5xl mb-4">מסע הערב</h2>
            <p className="text-foreground-secondary text-lg">כל רגע מתוזמן, כל שלב מותאם אישית</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line - desktop only */}
            <div className="hidden md:block absolute right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#059cc0] via-[#03b28c] to-[#059cc0]" />

            {timelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-6 mb-12 ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Dot on timeline */}
                <div className="hidden md:flex absolute right-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#059cc0] to-[#03b28c] items-center justify-center text-xl z-10">
                  {step.icon}
                </div>

                {/* Content */}
                <div className={`md:w-5/12 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                  <div className="flex items-center gap-3 mb-2 md:hidden">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="text-xl font-black text-foreground">{step.title}</h3>
                  </div>
                  <h3 className="hidden md:block text-xl font-black text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground-secondary leading-relaxed">{step.desc}</p>
                </div>

                {/* Spacer for alignment */}
                <div className="hidden md:block md:w-2/12" />

                {/* Image */}
                <div className="w-full md:w-5/12">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-foreground/10">
                    <Image src={step.image} alt={step.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Gallery — Auto-slideshow on mobile */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-foreground md:text-5xl mb-4">רגעים מהחתונות שלי</h2>
            <p className="text-foreground-secondary text-lg">כל תמונה מספרת סיפור של ערב בלתי נשכח</p>
          </motion.div>
          <WeddingsGallery />
        </div>
      </section>

      {/* 5. Video Showcase */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-b from-transparent via-foreground/5 to-transparent">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-black text-foreground md:text-5xl mb-4">תראו בעצמכם</h2>
            <p className="text-foreground-secondary text-lg">60 שניות שמראות קהל, רצף ותזמון</p>
          </motion.div>

          <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/yarUtbqD0BI"
                title="חתונה עם DJ אלמוג כהן"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-6 text-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_video" })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                רוצים את זה בחתונה שלכם?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-foreground md:text-5xl mb-4">מה הזוגות אומרים</h2>
            <p className="text-foreground-secondary text-lg">מילים אמיתיות מזוגות אמיתיים</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "אלמוג הפך את החתונה שלנו לערב שכל האורחים עדיין מדברים עליו. הרחבה הייתה מלאה כל הזמן והאנרגיה הייתה מטורפת!",
                author: "שירה ויונתן",
                event: "חתונה באפריל 2025",
                image: "/assets/gallery/djavira/entrance.jpg"
              },
              {
                quote: "חיפשנו DJ שיבין את הסגנון שלנו — לא רק מוזיקה מסחרית. אלמוג הקשיב, הבין, והביא בדיוק את מה שרצינו.",
                author: "דנה ועומר",
                event: "חתונה ביוני 2024",
                image: "/assets/gallery/djavira/traditional.jpg"
              },
              {
                quote: "מהשיחה הראשונה הרגשנו שאנחנו בידיים טובות. אלמוג תכנן את הערב לפרטי פרטים ושום דבר לא נפל.",
                author: "אופק ושיראל",
                event: "חתונה בנובמבר 2023",
                image: "/assets/gallery/djavira/hupa-wide.jpeg"
              },
              {
                quote: "ההורים שלנו עדיין מדברים על המוזיקה. אלמוג ידע לשלב בין הדורות בצורה מושלמת — כולם רקדו!",
                author: "נועם ומיכל",
                event: "חתונה בספטמבר 2024",
                image: "/assets/gallery/djavira/crowd.jpg"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0]/20 to-[#03b28c]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-7 hover:border-[#03b28c]/50 transition-all h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground text-base leading-relaxed mb-5 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#03b28c]/30">
                      <Image src={testimonial.image} alt={testimonial.author} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.author}</div>
                      <div className="text-foreground-secondary text-sm">{testimonial.event}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Playlists — Small Section */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-b from-transparent via-foreground/5 to-transparent">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-black text-foreground md:text-4xl mb-3">טעימה מהמוזיקה שלי</h2>
            <p className="text-foreground-secondary">פלייליסטים לכל חלק בחתונה</p>
          </motion.div>

          <div className="space-y-3">
            {playlists.map((pl, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenPlaylist(openPlaylist === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 hover:border-[#03b28c]/50 transition-all text-right"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pl.icon}</span>
                    <span className="font-bold text-foreground">{pl.title}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-foreground-secondary transition-transform ${openPlaylist === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {openPlaylist === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-1">
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-foreground/10 bg-black flex items-center justify-center">
                          <p className="text-white text-sm">הפלייליסט יתווסף בקרוב</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Process — How We Work */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-foreground md:text-5xl mb-4">איך עובדים איתי</h2>
            <p className="text-foreground-secondary text-lg">תהליך פשוט, שקוף, ובלי הפתעות</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "שיחת היכרות",
                desc: "שיחה קצרה בוואטסאפ או בטלפון. מספרים לי על הסגנון שלכם, התאריך, והאולם. אני מבין מה אתם צריכים.",
                color: "#059cc0"
              },
              {
                step: "02",
                title: "תכנון מוזיקלי",
                desc: "ביחד בונים את מפת הערב — מקבלת פנים ועד הסוף. שירים שחשובים לכם, אווירה, וכל הפרטים.",
                color: "#03b28c"
              },
              {
                step: "03",
                title: "הערב שלכם",
                desc: "אני מגיע מוכן, עם ציוד מקצועי ותכנית מדויקת. אתם רק נהנים. הרחבה מלאה — מובטח.",
                color: "#059cc0"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-black text-white mb-6"
                  style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_process" })}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              בואו נתחיל בשיחה קצרה
            </a>
          </motion.div>
        </div>
      </section>

      {/* 9. FAQ */}
      <FAQSection type="wedding" />

      {/* 10. Final CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight text-foreground">
              מוכנים לחתונה<br />
              <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                שכולם יזכרו?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground-secondary mb-8">
              שלחו הודעה עכשיו ותקבלו תגובה תוך 5 דקות
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_final" })}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full blur-xl opacity-75 group-hover:opacity-100 transition animate-pulse" />
              <div className="relative flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-lg hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>שלחו הודעה בוואטסאפ</span>
              </div>
            </a>
            <a
              href="tel:050-242-7616"
              className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-foreground/20 rounded-full font-bold text-lg text-foreground hover:bg-foreground/5 transition-all"
            >
              050-242-7616
            </a>
          </motion.div>

          <p className="text-muted-foreground text-sm mt-8">
            ⚡ תגובה תוך 5 דקות • 🔒 שיחה סודית ללא התחייבות
          </p>
        </div>
      </section>
    </div>
  );
}
