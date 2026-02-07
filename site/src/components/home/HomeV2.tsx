"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import LogoCarousel from "@/components/LogoCarousel";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import { useState, useEffect } from "react";

function FAQItem({ faq }: { faq: { q: string; a: string; icon: React.ReactNode; defaultOpen: boolean } }) {
  const [isOpen, setIsOpen] = useState(faq.defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#03b28c]/50 transition-all"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0">{faq.icon}</div>
          <h3 className="text-lg md:text-xl font-bold text-white">{faq.q}</h3>
        </div>
        <svg
          className={`w-6 h-6 text-[#03b28c] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <p className="text-white/70 leading-relaxed pl-10">{faq.a}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HomeV2() {
  const whatsappNumber = "972502427616";
  const phoneNumber = "050-242-7616";
  const [availableSlots, setAvailableSlots] = useState(3);
  const [viewersCount, setViewersCount] = useState(47);
  const [bookedThisWeek, setBookedThisWeek] = useState(2);
  const [showUrgencyBar, setShowUrgencyBar] = useState(false);
  
  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(Math.floor(Math.random() * 20) + 40);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowUrgencyBar(true), 3000);
    const hideTimer = setTimeout(() => setShowUrgencyBar(false), 10000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);



  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Urgency Bar — slides in after 3s, auto-hides after 10s */}
      <AnimatePresence>
        {showUrgencyBar && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#059cc0] to-[#03b28c] text-white py-3 px-4 text-center font-bold text-sm md:text-base"
          >
            🔥 {bookedThisWeek} זוגות הזמינו השבוע | נשארו {availableSlots} תאריכים זמינים | {viewersCount} אנשים צופים עכשיו
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end justify-center pb-12 md:pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src="https://www.youtube.com/embed/Sxfrs5Pzy8A?autoplay=1&mute=1&loop=1&playlist=Sxfrs5Pzy8A&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="DJ אלמוג כהן - תדמית"
            allow="autoplay; encrypted-media"
            style={{ border: 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-[#03b28c] rounded-full animate-pulse" />
                <span className="text-xs font-bold">10+ שנות ניסיון | דירוג 5★</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 leading-tight">
                <span className="bg-gradient-to-r from-[#059cc0] via-[#03b28c] to-[#059cc0] bg-clip-text text-transparent animate-gradient">
                  החתונה שלכם
                  <br />
                  מגיעה רק פעם אחת
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 leading-relaxed">
                אל תסתכנו עם DJ שלא מכיר את הקהל שלכם.
                <span className="block mt-1 text-[#03b28c] font-bold">
                  רחבה מלאה מהרגע הראשון. מובטח.
                </span>
              </p>

              <div className="flex flex-row gap-3 mb-4">
                <a
                  href={getWhatsAppLink("היי אלמוג! אני רוצה לשמור תאריך לחתונה שלי 🎉")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-black text-sm hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>שלחו הודעה עכשיו</span>
                  </div>
                </a>
                <a
                  href="https://youtu.be/cLZaotSdbAg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/20 rounded-full font-bold text-sm hover:bg-white/5 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>צפו בסט מלא</span>
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>תגובה תוך 5 דקות</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>ללא התחייבות</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="relative py-12 bg-white/5 backdrop-blur-xl border-y border-white/10 overflow-hidden">
        <div className="mb-6 text-center">
          <p className="text-white/60 text-sm md:text-base font-bold">עבדתי עם המותגים הגדולים בארץ</p>
        </div>
        <LogoCarousel />
      </section>

      {/* Photo Gallery */}
      <GallerySection />

      {/* Stats Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                num: "1000+", 
                label: "אירועים", 
                desc: "כל אחד ייחודי, כל אחד מושלם", 
                icon: <svg className="w-8 h-8 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              },
              { 
                num: "10+", 
                label: "שנות ניסיון", 
                desc: "יודע לקרוא קהל ולהתאים את עצמי", 
                icon: <svg className="w-8 h-8 text-[#059cc0]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              },
              { 
                num: "100%", 
                label: "אווירה", 
                desc: "אווירה מהרגע הראשון", 
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
                <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-2xl blur-xl opacity-25 group-hover:opacity-75 transition duration-300" />
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                  <div className="flex items-center justify-center mb-4">{stat.icon}</div>
                  <div className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                    {stat.num}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-white/60 text-sm">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4">
              תראו בעצמכם
            </h2>
            <p className="text-white/60 text-lg md:text-xl">לא צריך להאמין לי. תראו מה קורה באירועים שלי.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { url: "https://youtu.be/yarUtbqD0BI", thumb: "https://img.youtube.com/vi/yarUtbqD0BI/maxresdefault.jpg", title: "תדמית מחתונה", desc: "רחבה שלא עוצרת" },
              { url: "https://youtu.be/cLZaotSdbAg", thumb: "https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg", title: "סט DJ חי", desc: "אנרגיה מטורפת" },
              { url: "https://youtu.be/ivoBO3wWCbI", thumb: "https://img.youtube.com/vi/ivoBO3wWCbI/maxresdefault.jpg", title: "תדמית מסיבה", desc: "כיף שלא נגמר" }
            ].map((video, i) => (
              <motion.a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-[#03b28c] transition-all"
              >
                <Image
                  src={video.thumb}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#03b28c] transition-all">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-black text-xl mb-1">{video.title}</h3>
                  <p className="text-white/70 text-sm">{video.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* FAQ */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              שאלות נפוצות
            </h2>
            <p className="text-white/60 text-lg">כל מה שצריך לדעת לפני שמתחילים</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "איך התהליך עובד?",
                a: "פגישת היכרות אישית → בניית פלייליסט מותאם → הכנת האולם → הערב עצמו. אני מלווה אתכם בכל שלב.",
                icon: <svg className="w-6 h-6 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                defaultOpen: true
              },
              {
                q: "כמה זמן לפני האירוע צריך לקבוע?",
                a: "מומלץ 3-6 חודשים מראש. התאריכים נגמרים מהר, במיוחד בעונת החתונות.",
                icon: <svg className="w-6 h-6 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                defaultOpen: false
              },
              {
                q: "מה כלול במחיר?",
                a: "ציוד מקצועי מלא, פגישת היכרות, בניית פלייליסט מותאם אישית, הגעה מוקדמת להכנות, וליווי צמוד לאורך כל הערב.",
                icon: <svg className="w-6 h-6 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                defaultOpen: false
              }
            ].map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#059cc0]/20 to-[#03b28c]/20 border border-[#03b28c]/50 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-[#03b28c] rounded-full animate-pulse" />
              <span className="text-[#03b28c] font-bold">⚡ התאריכים נגמרים מהר</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
              מוכנים לחתונה<br />
              <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                שכולם יזכרו?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 mb-10">
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
              href={getWhatsAppLink("היי אלמוג! אני רוצה לשמור תאריך לחתונה שלי 🎉")}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full blur-xl opacity-75 group-hover:opacity-100 transition animate-pulse" />
              <div className="relative flex items-center justify-center gap-3 px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>שלחו הודעה בוואטסאפ</span>
              </div>
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center gap-3 px-10 py-6 border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>או התקשרו: {phoneNumber}</span>
            </a>
          </motion.div>

          <p className="text-white/40 text-sm mt-8">
            ⚡ תגובה תוך 5 דקות • 📱 80% מהלקוחות שלי מגיעים דרך מובייל • 🔒 שיחה סודית ללא התחייבות
          </p>
        </div>
      </section>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
