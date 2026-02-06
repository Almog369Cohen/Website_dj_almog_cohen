"use client";

import { motion } from "framer-motion";

export default function Home2026OrganicFluidUpgraded() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,300 Q360,100 720,300 T1440,300 L1440,0 L0,0 Z"
            fill="url(#gradient1)"
            initial={{ d: "M0,300 Q360,100 720,300 T1440,300 L1440,0 L0,0 Z" }}
            animate={{ d: "M0,250 Q360,150 720,250 T1440,250 L1440,0 L0,0 Z" }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.path
            d="M0,600 Q360,500 720,600 T1440,600 L1440,900 L0,900 Z"
            fill="url(#gradient2)"
            initial={{ d: "M0,600 Q360,500 720,600 T1440,600 L1440,900 L0,900 Z" }}
            animate={{ d: "M0,650 Q360,550 720,650 T1440,650 L1440,900 L0,900 Z" }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059cc0" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#03b28c" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#03b28c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#059cc0" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-[#059cc0]/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-48 h-48 md:w-96 md:h-96 bg-[#03b28c]/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12 md:mb-20"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight px-2">
              <motion.span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #059cc0 0%, #03b28c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(5, 156, 192, 0.5))",
                }}
              >
                DJ אלמוג כהן
              </motion.span>
              <br />
              <span className="text-white/90 text-3xl sm:text-4xl md:text-6xl lg:text-7xl">לאירועים שמרגישים אמיתיים</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto px-4"
            >
              מוזיקה שמחברת אנשים. אנרגיה שנשארת לאורך כל הערב.
              <br className="hidden sm:block" />
              <span className="text-[#03b28c] font-bold">למעלה מ-300 אירועים מוצלחים</span> ברחבי הארץ.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-[2rem] blur-lg opacity-40 group-hover:opacity-70 transition duration-500" />
              <div className="relative rounded-[2rem] bg-[#1f1f21]/80 backdrop-blur-xl p-6 md:p-10 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#059cc0] to-[#03b28c] flex items-center justify-center text-2xl">
                    💍
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">חתונות</h2>
                </div>
                <p className="text-white/80 text-base md:text-lg mb-4 leading-relaxed">
                  רחבה שלא עוצרת מהרגע הראשון ועד השעות הקטנות. 
                  <span className="block mt-2 text-white/70">
                    אני קורא את האנרגיה של האולם ויודע בדיוק מתי להעלות טמפו, מתי להוריד, ומתי לתת את השיר שכולם מחכים לו.
                  </span>
                </p>
                <div className="space-y-2 mb-6 text-sm md:text-base">
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#03b28c]">✓</span>
                    <span>פגישת היכרות אישית לפני האירוע</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#03b28c]">✓</span>
                    <span>בניית פלייליסט מותאם אישית</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#03b28c]">✓</span>
                    <span>ציוד מקצועי ברמה הגבוהה ביותר</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] font-bold text-sm md:text-base shadow-lg shadow-[#059cc0]/50">
                  <span>בדיקת זמינות (דקה)</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#03b28c] to-[#059cc0] rounded-[2rem] blur-lg opacity-40 group-hover:opacity-70 transition duration-500" />
              <div className="relative rounded-[2rem] bg-[#1f1f21]/80 backdrop-blur-xl p-6 md:p-10 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#03b28c] to-[#059cc0] flex items-center justify-center text-2xl">
                    🎓
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black">Academy</h2>
                </div>
                <p className="text-white/80 text-base md:text-lg mb-4 leading-relaxed">
                  קורסים ומנטורינג אישי לתקלוט מקצועי.
                  <span className="block mt-2 text-white/70">
                    למדתי את המקצוע בדרך הקשה — עכשיו אני חוסך לכם שנים של ניסוי וטעייה. מלמד רק מה שעובד באמת.
                  </span>
                </p>
                <div className="space-y-2 mb-6 text-sm md:text-base">
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#059cc0]">✓</span>
                    <span>קורס DJ מתחילים עד מתקדמים</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#059cc0]">✓</span>
                    <span>מנטורינג אישי 1:1</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-[#059cc0]">✓</span>
                    <span>ליווי עד האירוע הראשון שלכם</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-[#059cc0] font-bold text-sm md:text-base">
                  <span>למידע נוסף</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
          >
            {[
              { icon: "🎵", title: "מוזיקה", desc: "סטים ופלייליסטים מהאירועים שלי" },
              { icon: "🎸", title: "חוגג מנגן", desc: "DJ + נגן חי באירוע אחד — חוויה מושלמת" },
              { icon: "📝", title: "בלוג", desc: "מדריכים וטיפים לתכנון אירוע מושלם" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-8 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-12 md:py-20 bg-gradient-to-b from-transparent to-[#1f1f21]/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">למה לבחור בי?</h2>
            <p className="text-white/70 text-base md:text-xl">מה שהופך אירוע טוב לאירוע בלתי נשכח</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {[
              {
                title: "ניסיון מוכח",
                desc: "למעלה מ-300 אירועים מוצלחים. כל אחד ייחודי, כל אחד מושלם.",
                icon: "⭐"
              },
              {
                title: "קריאת קהל",
                desc: "אני לא רק משמיע מוזיקה — אני קורא את האנרגיה ויודע בדיוק מה צריך.",
                icon: "🎯"
              },
              {
                title: "ציוד פרימיום",
                desc: "ציוד מקצועי ברמה הגבוהה ביותר. איכות שמע שמרגישים.",
                icon: "🔊"
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
                <div className="text-5xl md:text-6xl mb-4">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#059cc0] to-[#03b28c] flex items-center justify-center text-3xl md:text-4xl shadow-lg shadow-[#059cc0]/50">
                  💬
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <p className="text-lg md:text-2xl text-white/90 mb-2 leading-relaxed">
                  "אלמוג הפך את החתונה שלנו לערב שכל האורחים עדיין מדברים עליו. 
                  הרחבה הייתה מלאה כל הזמן והאנרגיה הייתה מטורפת!"
                </p>
                <p className="text-white/60 text-sm md:text-base">— שירה ויונתן, חתונה באפריל 2025</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#059cc0]/40 to-[#03b28c]/40 rounded-[3rem] blur-2xl" />
            <div className="relative rounded-[2.5rem] md:rounded-[3rem] bg-[#1f1f21]/90 backdrop-blur-xl p-8 md:p-12 border border-white/20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6">מוכנים להתחיל?</h2>
              <p className="text-lg md:text-xl text-white/70 mb-6 md:mb-8 leading-relaxed px-2">
                שלחו לי הודעה עם <span className="text-[#03b28c] font-bold">תאריך האירוע ואזור/אולם</span>
                <br className="hidden sm:block" />
                ואני עונה תוך דקות עם זמינות ומחיר.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] font-bold text-base md:text-lg shadow-2xl shadow-[#059cc0]/50 hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>שלחו הודעה בוואטסאפ</span>
                </div>
                <div className="text-white/50 text-sm">או</div>
                <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 rounded-full border-2 border-white/20 font-bold text-sm md:text-base hover:bg-white/5 transition-all">
                  <span>050-242-7616</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              <p className="text-white/50 text-xs md:text-sm mt-6">
                ⚡ תגובה מהירה תוך דקות • 📱 80% מהלקוחות שלי מגיעים דרך מובייל
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
