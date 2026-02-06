"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home2026V5RealContent() {
  const whatsappNumber = "972502427616";
  const phoneNumber = "050-242-7616";
  
  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
      <div className="absolute top-10 md:top-20 left-5 md:left-20 w-48 h-48 md:w-[500px] md:h-[500px] bg-[#059cc0]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 md:bottom-20 right-5 md:right-20 w-48 h-48 md:w-[500px] md:h-[500px] bg-[#03b28c]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            poster="/assets/almog/hero-poster.jpg"
          >
            <source src="/assets/almog/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/60 via-[#0e0e0e]/80 to-[#0e0e0e]" />
        </div>
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-16 md:mb-24"
          >
            <div className="flex items-center gap-6 md:gap-8 mb-6 md:mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#059cc0]/30 flex-shrink-0"
              >
                <Image
                  src="/assets/almog/hero-poster.jpg"
                  alt="DJ אלמוג כהן"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight">
                <span
                  style={{
                    background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px rgba(5, 156, 192, 0.6))",
                  }}
                >
                  DJ אלמוג כהן
                </span>
              </h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/70 font-light max-w-3xl leading-relaxed"
            >
              תקלוט שמרגיש אמיתי
              <span className="block mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl text-white/50">
                מוזיקה שמחברת אנשים. אנרגיה שנשארת כל הערב. רחבה שלא עוצרת.
              </span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="space-y-4 md:space-y-6"
          >
            <Link href="/weddings" className="group block">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 md:py-8 border-b border-white/10 hover:border-[#03b28c]/50 transition-all cursor-pointer">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-[#03b28c]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#03b28c] transition-all duration-300">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black group-hover:text-[#03b28c] transition-colors">
                      חתונות
                    </h2>
                  </div>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                    למעלה מ-300 חתונות ברחבי הארץ. רחבה שלא עוצרת מהרגע הראשון ועד השעות הקטנות.
                    <span className="block mt-2 text-white/60">
                      אני לא רק משמיע מוזיקה — אני קורא את האנרגיה של האולם, מרגיש מתי להעלות טמפו ומתי להוריד, ויודע בדיוק איזה שיר יעשה את הקסם ברגע הנכון.
                    </span>
                  </p>
                  <div className="mt-4 space-y-2 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-white/50">
                      <span className="text-[#03b28c]">✓</span>
                      <span>פגישת היכרות אישית לפני האירוע</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span className="text-[#03b28c]">✓</span>
                      <span>בניית פלייליסט מותאם אישית לזוג</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span className="text-[#03b28c]">✓</span>
                      <span>ציוד מקצועי ברמה הגבוהה ביותר</span>
                    </div>
                  </div>
                </div>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white/30 group-hover:text-[#03b28c] group-hover:translate-x-2 transition-all self-end md:self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            <Link href="/academy" className="group block">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 md:py-8 border-b border-white/10 hover:border-[#059cc0]/50 transition-all cursor-pointer">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-[#059cc0]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#059cc0] transition-all duration-300">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black group-hover:text-[#059cc0] transition-colors">
                      Academy
                    </h2>
                  </div>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                    קורסים ומנטורינג אישי לתקלוט מקצועי. למי שרוצה ללמוד ברצינות.
                    <span className="block mt-2 text-white/60">
                      למדתי את המקצוע בדרך הקשה — שנים של ניסוי וטעייה, אירועים שעבדו ואירועים שלא. עכשיו אני מעביר הלאה רק את מה שעובד באמת, בלי שטויות.
                    </span>
                  </p>
                  <div className="mt-4 space-y-2 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-white/50">
                      <span className="text-[#059cc0]">✓</span>
                      <span>קורס DJ מתחילים עד מתקדמים</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span className="text-[#059cc0]">✓</span>
                      <span>מנטורינג אישי 1:1 עם ליווי צמוד</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span className="text-[#059cc0]">✓</span>
                      <span>ליווי עד האירוע הראשון שלכם</span>
                    </div>
                  </div>
                </div>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white/30 group-hover:text-[#059cc0] group-hover:translate-x-2 transition-all self-end md:self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            <Link href="/chogeg-menagen" className="group block">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 md:py-8 border-b border-white/10 hover:border-[#03b28c]/50 transition-all cursor-pointer">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-[#03b28c]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#03b28c] transition-all duration-300">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black group-hover:text-[#03b28c] transition-colors">
                      חוגג מנגן
                    </h2>
                  </div>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                    DJ + נגן חי באירוע אחד. השילוב המושלם.
                    <span className="block mt-2 text-white/60">
                      אני מביא איתי נגן מקצועי שמשלים את התקלוט בנגינה חיה. האנרגיה של DJ עם החום והאותנטיות של מוזיקה אקוסטית — זה משהו שצריך לחוות.
                    </span>
                  </p>
                </div>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white/30 group-hover:text-[#03b28c] group-hover:translate-x-2 transition-all self-end md:self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            <Link href="/music" className="group block">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 md:py-8 border-b border-white/10 hover:border-[#059cc0]/50 transition-all cursor-pointer">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-[#059cc0]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#059cc0] transition-all duration-300">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black group-hover:text-[#059cc0] transition-colors">
                      מוזיקה
                    </h2>
                  </div>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                    סטים ופלייליסטים מהאירועים שלי. תקבלו הרגשה של מה שאני עושה ברחבה.
                    <span className="block mt-2 text-white/60">
                      מוזיקה שעובדת באמת — לא רק שירים פופולריים, אלא שירים שיודעים לקרוא את הרגע, לחבר אנשים, ולגרום לרחבה להתפוצץ בדיוק במקום הנכון.
                    </span>
                  </p>
                </div>
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white/30 group-hover:text-[#059cc0] group-hover:translate-x-2 transition-all self-end md:self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-12 md:py-20 bg-gradient-to-b from-transparent to-[#1f1f21]/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6">למה לבחור בי?</h2>
            <p className="text-white/60 text-base md:text-xl">מה שהופך אירוע טוב לאירוע בלתי נשכח</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-20">
            {[
              {
                num: "300+",
                title: "אירועים מוצלחים",
                desc: "כל אחד ייחודי, כל אחד מושלם",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              },
              {
                num: "10+",
                title: "שנות ניסיון",
                desc: "יודע לקרוא קהל ולהתאים את עצמי לכל סיטואציה",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              },
              {
                num: "100%",
                title: "ציוד פרימיום",
                desc: "Pioneer, Allen & Heath — איכות שמע שמרגישים",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border border-white/10 mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 md:mb-4 bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                  {item.num}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">{item.title}</h3>
                <p className="text-white/60 text-sm md:text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-20"
          >
            <h3 className="text-2xl md:text-3xl font-black mb-8 text-center">טעימה מהאירועים</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { url: "https://youtu.be/cLZaotSdbAg", thumb: "https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg", title: "חתונה - רגעי שיא" },
                { url: "https://youtu.be/Y0j0n9UopIg", thumb: "https://img.youtube.com/vi/Y0j0n9UopIg/maxresdefault.jpg", title: "אירוע פרטי" },
                { url: "https://youtu.be/IlXhyfptrX8", thumb: "https://img.youtube.com/vi/IlXhyfptrX8/maxresdefault.jpg", title: "אירוע קורפורטיבי" }
              ].map((video, i) => (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-[#03b28c]/50 transition-all"
                >
                  <Image
                    src={video.thumb}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm md:text-base">{video.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-20"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white/70">לקוחות שעבדתי איתם</h3>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { src: "/assets/logos/april.svg", alt: "April", width: 80 },
                { src: "/assets/clients/logoעירייה.png", alt: "עיריית ירושלים", width: 60 },
                { src: "/assets/clients/DHL.png", alt: "DHL", width: 70 },
                { src: "/assets/logos/ort.png", alt: "ORT", width: 60 },
                { src: "/assets/clients/קריית אונו .png", alt: "קריית אונו", width: 70 }
              ].map((logo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
                  style={{ width: logo.width, height: 40 }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-b border-white/10 py-8 md:py-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 md:mb-6 leading-relaxed font-light italic">
                "אלמוג הפך את החתונה שלנו לערב שכל האורחים עדיין מדברים עליו. 
                הרחבה הייתה מלאה כל הזמן והאנרגיה הייתה מטורפת!"
              </p>
              <p className="text-white/50 text-sm md:text-base">— שירה ויונתן, חתונה באפריל 2025</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-16 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight">
            בואו נדבר
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/70 mb-8 md:mb-12 max-w-3xl leading-relaxed">
            שלחו לי הודעה עם <span className="text-[#03b28c] font-bold">תאריך האירוע ואזור/אולם</span>
            <br className="hidden sm:block" />
            ואני עונה תוך דקות עם זמינות ומחיר.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
            <a
              href={getWhatsAppLink("היי אלמוג, אשמח לשמוע פרטים על זמינות לאירוע שלי")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-12 py-5 md:py-6 rounded-full bg-white text-black font-bold text-base md:text-xl hover:scale-105 transition-transform shadow-2xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>שלחו הודעה בוואטסאפ</span>
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-5 md:py-6 rounded-full border-2 border-white/20 font-bold text-base md:text-lg hover:bg-white/5 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{phoneNumber}</span>
            </a>
          </div>
          <p className="text-white/40 text-xs md:text-sm mt-6 md:mt-8">
            ⚡ תגובה מהירה תוך דקות • 📱 80% מהלקוחות שלי מגיעים דרך מובייל
          </p>

          <div className="mt-12 md:mt-16 flex items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/almog.cohen.dj"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/almog.cohen.dj"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@almog.cohen.dj"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
