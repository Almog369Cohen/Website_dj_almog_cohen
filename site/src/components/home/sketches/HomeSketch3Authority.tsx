"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomeSketch3Authority() {
  const whatsappNumber = "972502427616";
  const phoneNumber = "050-242-7616";
  
  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const stats = [
    { number: "300+", label: "חתונות מוצלחות", sublabel: "ברחבי הארץ" },
    { number: "10+", label: "שנות ניסיון", sublabel: "בתעשייה" },
    { number: "0", label: "אירועים מבוטלים", sublabel: "אמינות 100%" },
    { number: "5★", label: "דירוג ממוצע", sublabel: "מכל הלקוחות" },
  ];

  const clients = [
    { src: "/assets/logos/april.svg", alt: "April", name: "April" },
    { src: "/assets/clients/logoעירייה.png", alt: "עיריית ירושלים", name: "עיריית ירושלים" },
    { src: "/assets/clients/DHL.png", alt: "DHL", name: "DHL" },
    { src: "/assets/logos/ort.png", alt: "ORT", name: "ORT תעופה וחלל" },
    { src: "/assets/clients/קריית אונו .png", alt: "קריית אונו", name: "עיריית קריית אונו" },
    { src: "/assets/clients/אריאל .jpeg", alt: "אריאל", name: "אריאל" },
  ];

  const testimonials = [
    {
      quote: "אלמוג הוא פשוט המקצוען הכי טוב שעבדנו איתו. הרחבה הייתה מלאה כל הערב, והאורחים לא הפסיקו לרקוד. הוא קרא את הקהל בצורה מדהימה!",
      author: "שירה ויונתן",
      event: "חתונה באפריל 2025",
      rating: 5,
      image: "/assets/almog/wedding-1.jpg"
    },
    {
      quote: "חיפשנו DJ מקצועי שיבין את הסגנון שלנו. אלמוג עשה עבודה מושלמת - מהפגישה הראשונה ועד הרגע האחרון. ממליצים בחום!",
      author: "דנה ועומר",
      event: "חתונה ביוני 2024",
      rating: 5,
      image: "/assets/almog/wedding-2.jpg"
    },
    {
      quote: "עבדנו עם אלמוג באירוע קורפורטיבי גדול. הוא היה מקצועי, אמין, והאנרגיה שהוא הביא הייתה בדיוק מה שהיינו צריכים. בהחלט נעבוד איתו שוב!",
      author: "מנהל אירועים DHL",
      event: "אירוע קורפורטיבי 2024",
      rating: 5,
      image: "/assets/almog/corporate-1.jpg"
    },
    {
      quote: "אלמוג לא רק DJ - הוא אמן אמיתי. הוא יודע לקרוא את הרגע, להרגיש את האנרגיה, ולתת בדיוק את מה שהקהל צריך. תודה על ערב בלתי נשכח!",
      author: "מיכל ויוסי",
      event: "חתונה בספטמבר 2024",
      rating: 5,
      image: "/assets/almog/private-1.jpg"
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero - Authority Statement */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#059cc0]/10 via-transparent to-[#03b28c]/10" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-[#03b28c]/30 rounded-full px-6 py-3 mb-6">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">דירוג 5 כוכבים | 300+ המלצות</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
          >
            <span className="block text-white/40 text-2xl sm:text-3xl md:text-4xl mb-4">DJ מוביל בישראל</span>
            <span className="bg-gradient-to-r from-[#059cc0] via-white to-[#03b28c] bg-clip-text text-transparent">
              אלמוג כהן
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-bold text-white">{stat.label}</div>
                <div className="text-xs md:text-sm text-white/50">{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={getWhatsAppLink("היי אלמוג, ראיתי את ההמלצות המדהימות ואני רוצה לשמוע פרטים")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full font-black text-lg hover:scale-105 transition-transform shadow-2xl shadow-[#03b28c]/50"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>קבעו פגישת ייעוץ חינם</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Clients Logo Wall */}
      <section className="relative py-16 bg-white/5 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-black mb-2">הם סמכו עלי</h2>
            <p className="text-white/60">ארגונים ומותגים מובילים בישראל</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clients.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="relative h-20 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={client.src}
                    alt={client.alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-1 text-xs whitespace-nowrap">
                    {client.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Proof */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4">
              הוכחות מהשטח
            </h2>
            <p className="text-white/60 text-lg md:text-xl">תראו בעצמכם למה כולם ממליצים</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { url: "https://youtu.be/yarUtbqD0BI", thumb: "https://img.youtube.com/vi/yarUtbqD0BI/maxresdefault.jpg", title: "חתונה - 250 אורחים", views: "12K צפיות" },
              { url: "https://youtu.be/cLZaotSdbAg", thumb: "https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg", title: "סט DJ מלא", views: "8.5K צפיות" },
              { url: "https://youtu.be/ivoBO3wWCbI", thumb: "https://img.youtube.com/vi/ivoBO3wWCbI/maxresdefault.jpg", title: "אירוע פרטי", views: "6.2K צפיות" }
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
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-1 text-xs">
                  {video.views}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#03b28c] transition-all">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-black text-xl">{video.title}</h3>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Wall */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4">
              מה הלקוחות אומרים
            </h2>
            <p className="text-white/60 text-lg md:text-xl">300+ המלצות אמיתיות מלקוחות מרוצים</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0]/20 to-[#03b28c]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#03b28c]/50 transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/90 leading-relaxed mb-6 text-base md:text-lg">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#03b28c]/30">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-white/60 text-lg mb-6">ועוד 296 המלצות נוספות...</p>
            <a
              href={getWhatsAppLink("היי אלמוג, ראיתי את כל ההמלצות ואני רוצה להצטרף לרשימה!")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#03b28c] font-bold hover:gap-4 transition-all"
            >
              <span>קראו עוד המלצות</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "✓", title: "אמינות 100%", desc: "0 אירועים מבוטלים" },
              { icon: "🏆", title: "מומחה מוכר", desc: "10+ שנות ניסיון" },
              { icon: "⚡", title: "תגובה מהירה", desc: "תוך 5 דקות" },
              { icon: "💎", title: "ציוד פרימיום", desc: "Pioneer & Allen Heath" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#03b28c]/50 transition-all"
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <div className="font-bold text-white mb-1">{badge.title}</div>
                <div className="text-white/60 text-sm">{badge.desc}</div>
              </motion.div>
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
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
              הצטרפו ל-300+ זוגות
              <span className="block mt-2 bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                שבחרו באיכות
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 mb-12">
              אל תסתפקו בפחות. תבחרו במומחה.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={getWhatsAppLink("היי אלמוג, אני רוצה להצטרף לרשימת הלקוחות המרוצים שלך!")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl shadow-[#03b28c]/50"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>שלחו הודעה עכשיו</span>
              </a>
              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center justify-center gap-3 px-10 py-6 border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{phoneNumber}</span>
              </a>
            </div>
            <p className="text-white/40 text-sm mt-8">
              ⭐ דירוג 5 כוכבים • 🏆 300+ המלצות • ⚡ תגובה תוך 5 דקות • 🔒 שיחה סודית
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
