"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomeSketch4Luxury() {
  const whatsappNumber = "972502427616";
  const phoneNumber = "050-242-7616";
  
  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Minimal Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#059cc0]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#03b28c]/5 rounded-full blur-3xl" />
      </div>

      {/* Hero - Minimalist Luxury */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-none overflow-hidden">
                <Image
                  src="/assets/almog/hero-poster.jpg"
                  alt="DJ אלמוג כהן"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/20" />
              <div className="absolute -top-8 -right-8 w-32 h-32 border border-white/20" />
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <div className="mb-8">
                <div className="w-16 h-px bg-gradient-to-r from-[#059cc0] to-transparent mb-8" />
                <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-6">Exclusive DJ Experience</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-[0.9] tracking-tight">
                  אלמוג כהן
                </h1>
                <div className="space-y-6 text-lg md:text-xl text-white/60 leading-relaxed font-light">
                  <p>
                    לא כל אירוע מתאים לי.
                    <br />
                    לא כל זוג מחפש את מה שאני מציע.
                  </p>
                  <p className="text-white/90">
                    אני עובד רק עם <span className="text-white font-normal">12 זוגות בשנה</span>.
                    <br />
                    כל אחד מקבל את מלוא תשומת הלב שלי.
                  </p>
                  <p>
                    זה לא רק תקלוט.
                    <br />
                    <span className="text-[#03b28c] font-normal">זה אמנות.</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={getWhatsAppLink("היי אלמוג, אני מחפש חוויה אקסקלוסיבית לאירוע שלי")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/40 transition-all duration-500"
                >
                  <span className="font-light tracking-wide">בואו נדבר</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-light mb-1">10+</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">Years</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light mb-1">12</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">Events/Year</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light mb-1">100%</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">Exclusive</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative py-32 px-4 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-12" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-12 leading-relaxed">
              "המוזיקה היא לא רקע.
              <br />
              <span className="text-white/40">היא הלב של הערב."</span>
            </h2>
            <div className="max-w-2xl mx-auto space-y-8 text-lg text-white/60 leading-relaxed font-light">
              <p>
                אני לא מאמין בפלייליסטים גנריים. כל זוג הוא עולם ומלואו, 
                וכל אירוע צריך לשקף את האישיות הייחודית שלהם.
              </p>
              <p>
                לכן אני עובד רק עם מספר מצומצם של לקוחות בשנה. 
                זה מאפשר לי להקדיש את כל תשומת הלב, כל הזמן, כל האנרגיה.
              </p>
              <p className="text-white/90">
                התוצאה? אירוע שאנשים זוכרים לא שבוע, לא חודש - 
                <span className="text-white font-normal"> לכל החיים</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipment - Premium Details */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-4">Premium Equipment</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">הציוד שלי</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Pioneer CDJ-3000",
                desc: "הסטנדרט המקצועי העולמי. דיוק מושלם, תגובה מיידית.",
                spec: "Professional Grade"
              },
              {
                title: "Allen & Heath Mixer",
                desc: "איכות שמע שאין שני לה. כל תדר, כל ניואנס - מושלם.",
                spec: "Studio Quality"
              },
              {
                title: "Custom Sound System",
                desc: "מערכת קול מותאמת אישית. כל אולם, כל גודל - צליל מושלם.",
                spec: "Tailored Setup"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group"
              >
                <div className="relative mb-6">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-white/20 group-hover:border-[#03b28c]/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-white/20 group-hover:border-[#03b28c]/50 transition-colors duration-500" />
                  <div className="p-8">
                    <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">{item.spec}</div>
                    <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase - Minimal */}
      <section className="relative py-32 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-4 text-center">Selected Works</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-4">עבודות נבחרות</h2>
            <p className="text-center text-white/60 font-light">רגעים מאירועים שיצרתי</p>
          </motion.div>

          <div className="space-y-8">
            {[
              { url: "https://youtu.be/yarUtbqD0BI", thumb: "https://img.youtube.com/vi/yarUtbqD0BI/maxresdefault.jpg", title: "Wedding — Tel Aviv, 2025", desc: "250 guests, intimate atmosphere" },
              { url: "https://youtu.be/cLZaotSdbAg", thumb: "https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg", title: "Live Set — Jerusalem, 2024", desc: "3-hour journey through sound" },
              { url: "https://youtu.be/ivoBO3wWCbI", thumb: "https://img.youtube.com/vi/ivoBO3wWCbI/maxresdefault.jpg", title: "Private Event — Herzliya, 2024", desc: "Exclusive celebration" }
            ].map((video, i) => (
              <motion.a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group block"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center border border-white/10 hover:border-white/20 transition-all duration-500 p-8">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumb}
                      alt={video.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border border-white/40 flex items-center justify-center group-hover:border-[#03b28c] transition-colors duration-500">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-3">{video.desc}</div>
                    <h3 className="text-2xl md:text-3xl font-light mb-4">{video.title}</h3>
                    <div className="flex items-center gap-2 text-white/60 group-hover:text-[#03b28c] transition-colors duration-500">
                      <span className="text-sm font-light">Watch</span>
                      <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial - Single, Powerful */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-12" />
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed mb-12 text-white/90">
              "אלמוג לא רק תקלט את החתונה שלנו.
              <br />
              <span className="text-white/60">הוא יצר חוויה שכל אורח זוכר עד היום."</span>
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/assets/almog/wedding-1.jpg"
                  alt="שירה ויונתן"
                  fill
                  className="object-cover grayscale"
                />
              </div>
              <div className="text-left">
                <div className="font-light">שירה ויונתן</div>
                <div className="text-white/40 text-sm font-light">Tel Aviv, April 2025</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-32 px-4 border-y border-white/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-4">The Process</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">איך אנחנו עובדים</h2>
          </motion.div>

          <div className="space-y-16">
            {[
              {
                num: "01",
                title: "פגישת היכרות",
                desc: "שיחה אישית ואינטימית. אני רוצה להכיר אתכם, להבין את החזון שלכם, להרגיש את האנרגיה שלכם."
              },
              {
                num: "02",
                title: "בניית הפלייליסט",
                desc: "יצירה מותאמת אישית. כל שיר נבחר בקפידה, כל מעבר מתוכנן בדיוק. זה לא רנדומלי - זה מדע ואמנות."
              },
              {
                num: "03",
                title: "הכנת האולם",
                desc: "אני מגיע שעות לפני. בודק כל פרט, מתאים את הקול, מוודא שהכל מושלם. אין מקום לאלתורים."
              },
              {
                num: "04",
                title: "הערב עצמו",
                desc: "אני לא רק משמיע מוזיקה. אני קורא את הקהל, מרגיש את האנרגיה, מתאים את עצמי בזמן אמת. כל רגע הוא ייחודי."
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="grid md:grid-cols-[120px_1fr] gap-8 items-start"
              >
                <div className="text-6xl md:text-7xl font-light text-white/10">{step.num}</div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-light mb-4">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed font-light text-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Exclusive */}
      <section className="relative py-40 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-12" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
              האם אתם מתאימים?
            </h2>
            <p className="text-xl md:text-2xl text-white/60 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
              אני עובד רק עם זוגות שמחפשים משהו שונה.
              <br />
              משהו אקסקלוסיבי. משהו מושלם.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href={getWhatsAppLink("היי אלמוג, אני מחפש חוויה אקסקלוסיבית ומושלמת לאירוע שלי")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 px-10 py-5 border border-white/20 hover:border-white/40 transition-all duration-500"
              >
                <span className="font-light tracking-wide text-lg">בואו נדבר</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            <p className="text-white/30 text-sm mt-12 font-light tracking-wide">
              Limited availability — 12 events per year
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-sm font-light">
            © 2026 Almog Cohen. All rights reserved.
          </div>
          <div className="flex items-center gap-8">
            <a href={`tel:${phoneNumber}`} className="text-white/60 hover:text-white transition-colors font-light text-sm">
              {phoneNumber}
            </a>
            <a
              href="https://www.instagram.com/almog.cohen.dj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
