"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomeSketch2Storyteller() {
  const whatsappNumber = "972502427616";
  const phoneNumber = "050-242-7616";
  
  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const timeline = [
    { year: "2014", title: "ההתחלה", desc: "התאהבתי במוזיקה. קניתי את הציוד הראשון שלי והתחלתי לתרגל כל לילה." },
    { year: "2016", title: "האירוע הראשון", desc: "חתונה קטנה של חברים. הלב דפק, הידיים רעדו, אבל הרחבה הייתה מלאה." },
    { year: "2018", title: "המעבר למקצועי", desc: "עזבתי את העבודה היומיומית. החלטתי להקדיש את החיים שלי למוזיקה." },
    { year: "2020", title: "הקורונה", desc: "כל האירועים בוטלו. פתחתי את האקדמיה ללמד DJ מתחילים." },
    { year: "2023", title: "300 חתונות", desc: "הגעתי לאבן דרך. כל חתונה לימדה אותי משהו חדש." },
    { year: "2026", title: "היום", desc: "אני לא רק DJ. אני אדריכל של רגשות. בונה ערבים שנשארים בזיכרון לנצח." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0e0e0e] to-black text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#059cc0]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#03b28c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero - Personal Introduction */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden"
              >
                <Image
                  src="/assets/almog/hero-poster.jpg"
                  alt="DJ אלמוג כהן"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#059cc0] to-[#03b28c] rounded-2xl p-6 backdrop-blur-xl border border-white/20"
              >
                <div className="text-4xl font-black">10+</div>
                <div className="text-sm text-white/80">שנות ניסיון</div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-sm text-white/70">היי, אני אלמוג 👋</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                  מהרגע שהתאהבתי במוזיקה,
                  <span className="block mt-2 bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                    ידעתי שזה המקום שלי
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
                  לא תמיד הייתי DJ מקצועי. התחלתי כמו כולם - עם חלום, קצת ציוד, והרבה תשוקה. 
                  <span className="block mt-4 text-white/90">
                    היום, אחרי 300+ חתונות ו-10 שנות ניסיון, אני לא רק משמיע מוזיקה.
                  </span>
                  <span className="block mt-2 font-bold text-[#03b28c]">
                    אני בונה ערבים שנשארים בזיכרון לנצח.
                  </span>
                </p>
                <a
                  href={getWhatsAppLink("היי אלמוג, קראתי את הסיפור שלך ואני רוצה לשמוע עוד")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full font-bold text-lg hover:scale-105 transition-transform"
                >
                  <span>בואו נדבר על האירוע שלכם</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline - The Journey */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">המסע שלי</h2>
            <p className="text-white/60 text-lg">מהחלום הראשון ועד היום</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute right-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#059cc0] via-[#03b28c] to-[#059cc0] hidden md:block" />

            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative mb-12 md:mb-16 ${i % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:text-left'}`}
              >
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:ml-auto md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#03b28c]/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl font-black bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                        {item.year}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#059cc0]/50 to-transparent" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {/* Timeline Dot */}
                <div className="absolute right-1/2 top-6 w-4 h-4 bg-gradient-to-br from-[#059cc0] to-[#03b28c] rounded-full border-4 border-black transform translate-x-1/2 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video - The Main Story */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-black/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              תראו את הסיפור בעיניים שלכם
            </h2>
            <p className="text-white/60 text-lg">כך נראה ערב אמיתי איתי</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <a
              href="https://youtu.be/yarUtbqD0BI"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-video rounded-3xl overflow-hidden border-2 border-white/10 hover:border-[#03b28c] transition-all"
            >
              <Image
                src="https://img.youtube.com/vi/yarUtbqD0BI/maxresdefault.jpg"
                alt="תדמית מחתונה - DJ אלמוג כהן"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#03b28c]/30 rounded-full blur-2xl group-hover:bg-[#03b28c]/50 transition-all" />
                  <div className="relative w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#03b28c] transition-all">
                    <svg className="w-12 h-12 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl md:text-3xl font-black mb-2">תדמית מחתונה אמיתית</h3>
                <p className="text-white/80 text-lg">רחבה מלאה, אנרגיה מטורפת, זיכרונות לכל החיים</p>
              </div>
            </a>
          </motion.div>

          {/* Additional Videos */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {[
              { url: "https://youtu.be/cLZaotSdbAg", thumb: "https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg", title: "סט DJ חי", desc: "מוזיקה שמחברת" },
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
                className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-[#03b28c]/50 transition-all"
              >
                <Image
                  src={video.thumb}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-all">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-lg font-bold mb-1">{video.title}</h4>
                  <p className="text-white/70 text-sm">{video.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Real Stories */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              הסיפורים שלהם
            </h2>
            <p className="text-white/60 text-lg">זוגות אמיתיים, רגשות אמיתיים</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "אלמוג לא רק תקלט את החתונה שלנו - הוא יצר חוויה שכל האורחים עדיין מדברים עליה. הרחבה הייתה מלאה מהרגע הראשון ועד השעות הקטנות. הוא קרא את הקהל בצורה מדהימה.",
                author: "שירה ויונתן",
                event: "חתונה באפריל 2025",
                image: "/assets/almog/wedding-1.jpg"
              },
              {
                quote: "חיפשנו DJ שיבין את הסגנון שלנו - לא רק מוזיקה מסחרית. אלמוג הקשיב, הבין, והביא בדיוק את מה שרצינו. האנרגיה הייתה מושלמת והאורחים שלנו לא הפסיקו לרקוד.",
                author: "דנה ועומר",
                event: "חתונה ביוני 2024",
                image: "/assets/almog/wedding-2.jpg"
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
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#03b28c]/50 transition-all">
                  <div className="text-[#03b28c] text-5xl mb-4 font-serif">"</div>
                  <p className="text-white/90 text-lg leading-relaxed mb-6 italic">
                    {testimonial.quote}
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
        </div>
      </section>

      {/* Philosophy - What I Believe */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8">
              מה אני מאמין
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                <span className="text-[#03b28c] font-bold">אני מאמין</span> שכל חתונה היא ייחודית. 
                אין שני זוגות זהים, ואין שני ערבים זהים.
              </p>
              <p>
                <span className="text-[#03b28c] font-bold">אני מאמין</span> שהתפקיד שלי הוא לא רק להשמיע מוזיקה, 
                אלא לקרוא את האנרגיה של האולם ולדעת בדיוק מתי להעלות טמפו ומתי להוריד.
              </p>
              <p>
                <span className="text-[#03b28c] font-bold">אני מאמין</span> שהכנה טובה היא המפתח להצלחה. 
                לכן אני נפגש עם כל זוג לפני האירוע, מכיר אותם, ובונה פלייליסט מותאם אישית.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-8">
                ובעיקר - <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                  אני מאמין שאתם מגיעים את הטוב ביותר.
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Let's Write Your Story */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
              בואו נכתוב ביחד
              <span className="block mt-2 bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
                את הסיפור שלכם
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
              כל חתונה היא סיפור. בואו נוודא שהסיפור שלכם יהיה בלתי נשכח.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={getWhatsAppLink("היי אלמוג, קראתי את הסיפור שלך ואני רוצה שתהיה חלק מהסיפור שלנו")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full font-bold text-lg hover:scale-105 transition-transform"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>בואו נדבר</span>
              </a>
              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-5 border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{phoneNumber}</span>
              </a>
            </div>
            <p className="text-white/40 text-sm mt-8">
              💬 שיחה אישית וסודית • 🎵 פגישת היכרות ללא התחייבות • ❤️ בניית פלייליסט מותאם אישית
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
