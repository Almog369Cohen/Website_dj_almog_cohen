"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FAQSection, FinalCTASection } from "@/components/sections";
import { buildWhatsAppLink, getEventsWhatsAppMessage } from "@/utils/whatsapp";
import { trackEvent } from "@/utils/analytics";

export default function WeddingsPage() {
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waLink = buildWhatsAppLink(getEventsWhatsAppMessage("weddings_dj"));
  
  // Dynamic stats for urgency
  const [availableSlots, setAvailableSlots] = useState(4);
  const [viewersCount, setViewersCount] = useState(23);
  const [bookedThisMonth, setBookedThisMonth] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(Math.floor(Math.random() * 15) + 18);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const logos = [
    { src: "/assets/logos/april.svg", alt: "April" },
    { src: "/assets/clients/logoעירייה.png", alt: "עיריית ירושלים" },
    { src: "/assets/clients/DHL.png", alt: "DHL" },
    { src: "/assets/logos/ort.png", alt: "ORT" },
    { src: "/assets/clients/קריית אונו .png", alt: "קריית אונו" },
    { src: "/assets/clients/אריאל .jpeg", alt: "אריאל" },
  ];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked - fallback to poster
    });
  }, []);

  const tryPlayHeroVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked - fallback to poster
    });
  };

  return (
    <div className="min-h-screen bg-[#1f1f21]">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Compaktt – ניהול מוזיקלי לחתונות | Almog Cohen",
            description: "ניהול מוזיקלי וארכיטקטורת רגש לחתונות בישראל. ליווי רגוע, מדויק, ומבוסס התאמה.",
            provider: {
              "@type": "Person",
              name: "Almog Cohen",
              description: "Music Director & Emotional Architect",
            },
            areaServed: {
              "@type": "Country",
              name: "Israel",
            },
            serviceType: ["Wedding Music Direction", "Musical Director"],
          }),
        }}
      />

      {/* Urgency Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-[#059cc0] to-[#03b28c] text-white py-3 px-4 text-center font-bold text-sm md:text-base"
      >
        🔥 {bookedThisMonth} זוגות סגרו החודש | נשארו {availableSlots} תאריכים ל-2025 | {viewersCount} צופים עכשיו
      </motion.div>

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
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#03b28c]/10 blur-[120px]" />
        </div>

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {!heroVideoFailed ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/almog/IMG_6561.jpg"
              onCanPlay={tryPlayHeroVideo}
              onError={() => setHeroVideoFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectFit: "cover", aspectRatio: "16 / 9" }}
            >
              <source src="/assets/hero-main-optimized.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/assets/almog/IMG_6561.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Personal Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden md:block"
            >
              <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-[#03b28c]/30">
                <Image
                  src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
                  alt="DJ אלמוג כהן"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -right-4 bg-gradient-to-br from-[#059cc0] to-[#03b28c] rounded-2xl p-5 backdrop-blur-xl border border-white/20"
              >
                <div className="text-3xl font-black">300+</div>
                <div className="text-sm text-white/90">חתונות מוצלחות</div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center md:text-right"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2.5 mb-6">
                <div className="w-2.5 h-2.5 bg-[#03b28c] rounded-full animate-pulse" />
                <span className="text-sm font-bold">10+ שנות ניסיון | דירוג 5★</span>
              </div>

              <h1 className="mb-5 text-4xl font-black leading-tight text-white md:text-6xl">
                החתונה שלכם
                <br />
                <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                  מגיעה רק פעם אחת
                </span>
              </h1>

              <p className="mx-auto md:mx-0 mb-8 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                אל תסתכנו עם DJ שלא מכיר את הקהל שלכם.
                <span className="block mt-2 text-[#03b28c] font-bold">
                  רחבה מלאה מהרגע הראשון. מובטח.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_hero" })}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  <div className="relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-black shadow-lg transition hover:scale-[1.02]">
                    <span>שלחו הודעה עכשיו</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://youtu.be/cLZaotSdbAg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>צפו בסט מלא</span>
                </a>
              </div>

              <div className="flex items-center gap-4 mt-6 text-sm text-white/70 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>תגובה תוך 5 דקות</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>ללא התחייבות</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                num: "300+", 
                label: "חתונות מוצלחות", 
                desc: "כל אחת ייחודית, כל אחת מושלמת",
                icon: <svg className="w-8 h-8 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              },
              { 
                num: "10+", 
                label: "שנות ניסיון", 
                desc: "יודע לקרוא קהל ולהתאים בזמן אמת",
                icon: <svg className="w-8 h-8 text-[#059cc0]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              },
              { 
                num: "100%", 
                label: "שביעות רצון", 
                desc: "אף אירוע לא בוטל. אף זוג לא התאכזב.",
                icon: <svg className="w-8 h-8 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition duration-300" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                    {stat.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{stat.label}</h3>
                  <p className="text-white/60 text-sm">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="px-4 py-12 border-y border-white/10 bg-white/5 overflow-hidden">
        <div className="mb-6 text-center">
          <p className="text-white/60 text-sm md:text-base font-bold">עבדתי עם המותגים הגדולים בארץ</p>
        </div>
        <div className="relative">
          <div className="flex animate-scroll-logos">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 mx-8 md:mx-12">
                <div className="relative w-24 h-12 md:w-32 md:h-16 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes scroll-logos {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-scroll-logos {
            animation: scroll-logos 30s linear infinite;
          }
          @media (max-width: 768px) {
            .animate-scroll-logos {
              animation-duration: 75s;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-scroll-logos {
              animation: none;
              transform: translateX(0);
            }
          }
        `}</style>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white md:text-5xl">טעימה מהערב</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              זה המקום לראות 60 שניות שמראות קהל, רצף ותזמון. לא סיכום, לא פרסומת.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/yarUtbqD0BI"
                title="טעימה מהערב"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-5 text-white/85">
              <div className="text-sm font-bold text-white">מה כדאי להקשיב לו</div>
              <p className="mt-2 text-sm text-white/80">
                איך המעברים נשמרים טבעיים, ואיך החדר מתקדם בלי ״דחיפות״.
              </p>
              <div className="mt-4 flex flex-col items-center gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_video" })}
                  className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  בדיקת זמינות בוואטסאפ
                </a>
                <Link
                  href="/weddings/fit-check"
                  onClick={() => trackEvent("fitcheck_open", { source: "weddings_video" })}
                  className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  בדיקת התאמה (דקה)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white md:text-5xl mb-4">רגעים מהחתונות שלי</h2>
            <p className="text-white/70 text-lg">כל תמונה מספרת סיפור של ערב בלתי נשכח</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { src: "/photo almog cohen website/1-150.jpg", alt: "חתונה - רגעי שיא" },
              { src: "/photo almog cohen website/1-152.jpg", alt: "אירוע מיוחד" },
              { src: "/photo almog cohen website/IMG_5462.JPG", alt: "רחבה מלאה" },
              { src: "/photo almog cohen website/IMG_5469.JPG", alt: "אנרגיה מטורפת" },
              { src: "/photo almog cohen website/WhatsApp Image 2025-04-24 at 03.31.04 (4).jpeg", alt: "DJ בפעולה" },
              { src: "/photo almog cohen website/WhatsApp Image 2025-04-24 at 03.31.09 (2).jpeg", alt: "הערב שלכם" }
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-[#03b28c] transition-all"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm md:text-base">{photo.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white md:text-5xl mb-4">תראו בעצמכם</h2>
            <p className="text-white/70 text-lg">לא צריך להאמין לי. תראו מה קורה באירועים שלי.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "yarUtbqD0BI", title: "תדמית מחתונה", desc: "רחבה שלא עוצרת" },
              { id: "cLZaotSdbAg", title: "סט DJ חי", desc: "אנרגיה מטורפת" },
              { id: "ivoBO3wWCbI", title: "תדמית מסיבה", desc: "כיף שלא נגמר" }
            ].map((video, i) => (
              <motion.a
                key={i}
                href={`https://youtu.be/${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-[#03b28c] transition-all"
              >
                <Image
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#03b28c] transition-all">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-black text-lg mb-1">{video.title}</h3>
                  <p className="text-white/70 text-sm">{video.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-white md:text-5xl mb-4">מה הזוגות אומרים</h2>
            <p className="text-white/70 text-lg">300+ המלצות אמיתיות מלקוחות מרוצים</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "אלמוג הפך את החתונה שלנו לערב שכל האורחים עדיין מדברים עליו. הרחבה הייתה מלאה כל הזמן והאנרגיה הייתה מטורפת!",
                author: "שירה ויונתן",
                event: "חתונה באפריל 2025",
                image: "/photo almog cohen website/1-150.jpg"
              },
              {
                quote: "חיפשנו DJ שיבין את הסגנון שלנו - לא רק מוזיקה מסחרית. אלמוג הקשיב, הבין, והביא בדיוק את מה שרצינו. האנרגיה הייתה מושלמת!",
                author: "דנה ועומר",
                event: "חתונה ביוני 2024",
                image: "/photo almog cohen website/1-152.jpg"
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
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 hover:border-[#03b28c]/50 transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/90 text-base leading-relaxed mb-5 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#03b28c]/30">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white">{testimonial.author}</div>
                      <div className="text-white/60 text-sm">{testimonial.event}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-black text-white md:text-5xl mb-4">יצירת קשר</h2>
            <p className="text-white/70 text-lg">תאריך + אולם + כמות אורחים — ואני חוזר אליכם תוך 5 דקות</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_mid_contact" })}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full blur-xl opacity-75 group-hover:opacity-100 transition animate-pulse" />
              <div className="relative flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-lg hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>שלחו הודעה בוואטסאפ</span>
              </div>
            </a>
            <a
              href="tel:050-242-7616"
              className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-white/20 rounded-full font-bold text-lg text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>או התקשרו: 050-242-7616</span>
            </a>
          </motion.div>

          <p className="text-white/40 text-sm mt-6">⚡ תגובה תוך 5 דקות • 🔒 שיחה סודית ללא התחייבות</p>
        </div>
      </section>

      {/* Stories/Testimonials */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">הדרך (בקצרה)</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "לפני החתונה",
                items: [
                  "הקשבה עמוקה: מי אתם, מה חשוב לכם, ומה אתם לא רוצים",
                  "מסגרת ברורה: גבולות, קווים אדומים, ותיאום ציפיות",
                  "פחות רעש מבחוץ, יותר דיוק מבפנים",
                ],
              },
              {
                title: "במהלך החתונה",
                items: [
                  "נוכחות מלאה בחדר — לא רק לנהל מוזיקה",
                  "אינטואיציה + איפוק: מתי לתת שקט ומתי לתת שיא",
                  "התאמות בזמן אמת לקהל מעורב",
                ],
              },
              {
                title: "אחרי החתונה",
                items: [
                  "סגירה אנושית: להבין מה עבד ומה נשאר איתכם",
                  "משוב קצר שמחזיר תחושת שלמות",
                  "אם צריך — גם רפלקציה, לא רק תיעוד",
                ],
              },
            ].map((step) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                <h3 className="mb-4 text-xl font-bold text-white">{step.title}</h3>
                <ul className="space-y-3 text-white/85">
                  {step.items.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-0.5 text-[#03b28c]">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">למה זוגות בוחרים בי</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                "הובלה רגועה ובטוחה — בלי לחץ בחדר",
                "אינטליגנציה רגשית: לקרוא אנשים, לא רק מוזיקה",
                "עומק מוזיקלי שמשרת אתכם — לא מרשים על חשבונכם",
                "כבוד לזוג ולאורחים: אף אחד לא צריך להוכיח שהוא נהנה",
                "מעורבות אישית: אין אאוטסורסינג",
                "התאמה מעל זמינות: לא כל זוג מתקבל",
              ].map((t) => (
                <div key={t} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex gap-3 text-white/85">
                    <span className="text-[#03b28c]">✓</span>
                    <span>{t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_benefits" })}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              בדיקת זמינות בוואטסאפ
            </a>
            <Link
              href="/weddings/fit-check"
              onClick={() => trackEvent("fitcheck_open", { source: "weddings_benefits" })}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              בדיקת התאמה (דקה)
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection type="wedding" />

      {/* Final CTA - Enhanced */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#059cc0]/20 to-[#03b28c]/20 border border-[#03b28c]/50 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-[#03b28c] rounded-full animate-pulse" />
              <span className="text-[#03b28c] font-bold">⚡ התאריכים נגמרים מהר</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight text-white">
              מוכנים לחתונה<br />
              <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                שכולם יזכרו?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 mb-8">
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
              className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-white/20 rounded-full font-bold text-lg text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>או התקשרו: 050-242-7616</span>
            </a>
          </motion.div>

          <p className="text-white/40 text-sm mt-8">
            ⚡ תגובה תוך 5 דקות • 📱 80% מהלקוחות מגיעים דרך מובייל • 🔒 שיחה סודית ללא התחייבות
          </p>
        </div>
      </section>
    </div>
  );
}
