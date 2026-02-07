"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FAQSection } from "@/components/sections";
import WeddingsHero from "@/components/weddings/WeddingsHero";
import WeddingsGallery from "@/components/weddings/WeddingsGallery";
import WhatsAppTestimonials from "@/components/weddings/WhatsAppTestimonials";
import { buildWhatsAppLink, getEventsWhatsAppMessage } from "@/utils/whatsapp";
import { trackEvent } from "@/utils/analytics";

const timelineSteps = [
  { icon: "🥂", title: "קבלת פנים", desc: "מוזיקת רקע שיוצרת אווירה חמימה ומזמינה", image: "/assets/gallery/djavira/hupa-wide.jpeg" },
  { icon: "💍", title: "כניסה לחופה", desc: "הרגע שכולם מחכים לו — השיר שמלווה אתכם לחופה", image: "/assets/gallery/djavira/entrance.jpg" },
  { icon: "🎊", title: "שבירת כוס", desc: "הפיצוץ. האנרגיה עולה. הרחבה מתחילה", image: "/assets/gallery/djavira/crowd.jpg" },
  { icon: "💕", title: "ריקוד ראשון", desc: "הרגע האינטימי שלכם — השיר שבחרתם ביחד", image: "/assets/gallery/djavira/hupa.jpg" },
  { icon: "🔥", title: "רחבה מטורפת", desc: "על הכתפיים, ידיים באוויר, כולם רוקדים", image: "/assets/gallery/djavira/shoulders-party.jpeg" },
  { icon: "🎉", title: "אפטר פארטי", desc: "הסט שלא רוצים שייגמר", image: "/assets/gallery/djavira/smoke-vibes.jpg" },
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
    <div className="min-h-screen text-foreground" style={{ backgroundColor: '#fff', color: '#1f1f21' }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#fff!important;color:#1f1f21!important}` }} />
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
      <div className="border-b border-black/10 bg-gray-50/50 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black">בית</Link>
            <span>›</span>
            <span className="text-black">חתונות</span>
          </nav>
        </div>
      </div>

      {/* 1. Hero */}
      <WeddingsHero ctaSource="weddings_hero" />

      {/* 4. Gallery — Auto-slideshow on mobile */}
      <section className="relative px-4 py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#059cc0]/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-black md:text-4xl mb-2">
              <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">רגעים מהחתונות שלי</span>
            </h2>
            <p className="text-gray-600 text-lg">כל תמונה מספרת סיפור של ערב בלתי נשכח</p>
          </motion.div>
          <WeddingsGallery />
        </div>
      </section>

      {/* 5. Video Showcase */}
      <section className="px-4 py-8 md:py-12 bg-gradient-to-b from-transparent via-black/5 to-transparent">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-black text-black md:text-4xl mb-2">תראו בעצמכם</h2>
            <p className="text-gray-600 text-sm md:text-base">60 שניות שמראות קהל, רצף ותזמון</p>
          </motion.div>

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-gray-50 backdrop-blur-xl">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/yarUtbqD0BI"
                title="חתונה עם DJ אלמוג כהן"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-4 text-center">
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

      {/* 6. Testimonials — Real WhatsApp Screenshots */}
      <section className="px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-black text-black md:text-4xl mb-2">מה הזוגות אומרים</h2>
            <p className="text-gray-600 text-sm md:text-base">הודעות אמיתיות מזוגות אמיתיים</p>
          </motion.div>

          <WhatsAppTestimonials />
        </div>
      </section>

      {/* 7. Music Link — Compact */}
      <section className="px-4 py-8 md:py-10">
        <div className="mx-auto max-w-md text-center">
          <p className="text-gray-600 text-sm mb-3">רוצים המלצות ורעיונות לשירים לרגעים החשובים?</p>
          <Link
            href="/music"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-50 px-6 py-3 font-bold text-black hover:border-[#03b28c]/50 transition-all text-sm"
          >
            <span>לעמוד המוזיקה</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 8. Process — How We Work */}
      <section className="relative px-4 py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#059cc0]/8 via-transparent to-[#03b28c]/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#059cc0]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#03b28c]/30 to-transparent" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-black md:text-4xl mb-2">
              <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">איך עובדים איתי</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base">תהליך פשוט, שקוף, ובלי הפתעות</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "שיחת היכרות",
                desc: "שיחה קצרה בוואטסאפ או בטלפון. מספרים לי על הסגנון שלכם, התאריך, והאולם. אני מבין מה אתם צריכים.",
                gradient: "from-[#059cc0] to-[#059cc0]/70"
              },
              {
                step: "02",
                title: "תכנון מוזיקלי",
                desc: "ביחד בונים את מפת הערב — מקבלת פנים ועד הסוף. שירים שחשובים לכם, אווירה, וכל הפרטים.",
                gradient: "from-[#03b28c] to-[#03b28c]/70"
              },
              {
                step: "03",
                title: "הערב שלכם",
                desc: "אני מגיע מוכן, עם ציוד מקצועי ותכנית מדויקת. אתם רק נהנים. הרחבה מלאה — מובטח.",
                gradient: "from-[#059cc0] to-[#03b28c]"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center p-5 rounded-2xl border border-black/10 bg-gray-50 backdrop-blur-sm"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-xl font-black text-white mb-5 bg-gradient-to-br ${item.gradient} shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-black mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_process" })}
              className="group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white transition hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full blur-md opacity-50 group-hover:opacity-80 transition" />
              <span className="relative">בואו נתחיל בשיחה קצרה</span>
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
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight text-black">
              מוכנים לחתונה<br />
              <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                שכולם יזכרו?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
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
              <div className="relative flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#059cc0] to-[#03b28c] text-white rounded-full font-black text-lg hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>שלחו הודעה בוואטסאפ</span>
              </div>
            </a>
            <a
              href="tel:050-242-7616"
              className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-black/20 rounded-full font-bold text-lg text-black hover:bg-black/5 transition-all"
            >
              050-242-7616
            </a>
          </motion.div>

          <p className="text-gray-500 text-sm mt-8">
            ⚡ תגובה תוך 5 דקות • 🔒 שיחה סודית ללא התחייבות
          </p>
        </div>
      </section>
    </div>
  );
}
