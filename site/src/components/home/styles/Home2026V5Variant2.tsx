"use client";

import { motion } from "framer-motion";

export default function Home2026V5Variant2() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white relative overflow-hidden">
      <div className="absolute top-10 md:top-20 left-5 md:left-20 w-48 h-48 md:w-[500px] md:h-[500px] bg-[#059cc0]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 md:bottom-20 right-5 md:right-20 w-48 h-48 md:w-[500px] md:h-[500px] bg-[#03b28c]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-16 md:mb-24"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 leading-none tracking-tight">
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/70 font-light max-w-3xl leading-relaxed"
            >
              לאירועים שמרגישים אמיתיים
              <span className="block mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl text-white/50">
                מוזיקה שמחברת. אנרגיה שנשארת. ערב שנזכר.
              </span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="space-y-0"
          >
            <div className="group">
              <div className="flex items-start gap-4 md:gap-6 py-6 md:py-8 border-b border-white/10 hover:border-[#03b28c]/50 transition-all cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border-2 border-[#03b28c]/40 flex items-center justify-center group-hover:border-[#03b28c] group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 md:w-10 md:h-10 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 md:mb-3 group-hover:text-[#03b28c] transition-colors">
                    חתונות
                  </h2>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    רחבה שלא עוצרת מהרגע הראשון ועד השעות הקטנות. 
                    <span className="block mt-2 text-white/60">
                      אני קורא את האנרגיה של האולם ויודע בדיוק מתי להעלות טמפו, מתי להוריד, ומתי לתת את השיר שכולם מחכים לו.
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
                    <span className="px-3 py-1 rounded-full bg-[#03b28c]/10 text-[#03b28c] border border-[#03b28c]/20">פגישת היכרות</span>
                    <span className="px-3 py-1 rounded-full bg-[#03b28c]/10 text-[#03b28c] border border-[#03b28c]/20">פלייליסט מותאם</span>
                    <span className="px-3 py-1 rounded-full bg-[#03b28c]/10 text-[#03b28c] border border-[#03b28c]/20">ציוד פרימיום</span>
                  </div>
                </div>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white/20 group-hover:text-[#03b28c] group-hover:translate-x-2 transition-all flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group">
              <div className="flex items-start gap-4 md:gap-6 py-6 md:py-8 border-b border-white/10 hover:border-[#059cc0]/50 transition-all cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border-2 border-[#059cc0]/40 flex items-center justify-center group-hover:border-[#059cc0] group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 md:w-10 md:h-10 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 md:mb-3 group-hover:text-[#059cc0] transition-colors">
                    Academy
                  </h2>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    קורסים ומנטורינג אישי לתקלוט מקצועי.
                    <span className="block mt-2 text-white/60">
                      למדתי את המקצוע בדרך הקשה — עכשיו אני חוסך לכם שנים של ניסוי וטעייה. מלמד רק מה שעובד באמת.
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
                    <span className="px-3 py-1 rounded-full bg-[#059cc0]/10 text-[#059cc0] border border-[#059cc0]/20">קורס מתחילים-מתקדמים</span>
                    <span className="px-3 py-1 rounded-full bg-[#059cc0]/10 text-[#059cc0] border border-[#059cc0]/20">מנטורינג 1:1</span>
                    <span className="px-3 py-1 rounded-full bg-[#059cc0]/10 text-[#059cc0] border border-[#059cc0]/20">ליווי עד האירוע</span>
                  </div>
                </div>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white/20 group-hover:text-[#059cc0] group-hover:translate-x-2 transition-all flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group">
              <div className="flex items-start gap-4 md:gap-6 py-6 md:py-8 border-b border-white/10 hover:border-[#03b28c]/50 transition-all cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border-2 border-[#03b28c]/40 flex items-center justify-center group-hover:border-[#03b28c] group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 md:w-10 md:h-10 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 md:mb-3 group-hover:text-[#03b28c] transition-colors">
                    חוגג מנגן
                  </h2>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    DJ + נגן חי באירוע אחד — חוויה מושלמת.
                    <span className="block mt-2 text-white/60">
                      שילוב ייחודי של תקלוט מקצועי עם נגינה חיה. האנרגיה של DJ עם החום של מוזיקה אקוסטית.
                    </span>
                  </p>
                </div>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white/20 group-hover:text-[#03b28c] group-hover:translate-x-2 transition-all flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="group">
              <div className="flex items-start gap-4 md:gap-6 py-6 md:py-8 border-b border-white/10 hover:border-[#059cc0]/50 transition-all cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border-2 border-[#059cc0]/40 flex items-center justify-center group-hover:border-[#059cc0] group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 md:w-10 md:h-10 text-[#059cc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 md:mb-3 group-hover:text-[#059cc0] transition-colors">
                    מוזיקה
                  </h2>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    סטים ופלייליסטים מהאירועים שלי.
                    <span className="block mt-2 text-white/60">
                      תקבלו הרגשה של מה שאני עושה ברחבה. מוזיקה שעובדת, שמחברת, שגורמת לאנשים לרקוד.
                    </span>
                  </p>
                </div>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white/20 group-hover:text-[#059cc0] group-hover:translate-x-2 transition-all flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
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
                desc: "יודע לקרוא קהל ולהתאים את עצמי",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              },
              {
                num: "100%",
                title: "ציוד פרימיום",
                desc: "איכות שמע שמרגישים",
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
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#059cc0]/20 to-[#03b28c]/20 backdrop-blur-xl border-2 border-white/10 mb-4">
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
            מוכנים
            <br />
            להתחיל?
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/70 mb-8 md:mb-12 max-w-3xl leading-relaxed">
            שלחו לי הודעה עם <span className="text-[#03b28c] font-bold">תאריך האירוע ואזור/אולם</span>
            <br className="hidden sm:block" />
            ואני עונה תוך דקות עם זמינות ומחיר.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-12 py-5 md:py-6 rounded-full bg-white text-black font-bold text-base md:text-xl hover:scale-105 transition-transform shadow-2xl">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>שלחו הודעה בוואטסאפ</span>
            </div>
            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-5 md:py-6 rounded-full border-2 border-white/20 font-bold text-base md:text-lg hover:bg-white/5 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>050-242-7616</span>
            </div>
          </div>
          <p className="text-white/40 text-xs md:text-sm mt-6 md:mt-8">
            ⚡ תגובה מהירה תוך דקות • 📱 80% מהלקוחות שלי מגיעים דרך מובייל
          </p>
        </motion.div>
      </section>
    </div>
  );
}
