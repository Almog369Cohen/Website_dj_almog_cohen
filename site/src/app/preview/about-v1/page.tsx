"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { buildWhatsAppLink } from "@/utils/whatsapp";

const waLink = buildWhatsAppLink("היי אלמוג, נכנסתי לאתר ואשמח לשמוע עוד!");

const timeline = [
  {
    year: "2012",
    title: "השיעור הראשון",
    text: "בן 14. נכנסתי לחוג DJ בבית ספר. המורה אמר: ״תצרוב 2 דיסקים ותבוא איתם שבוע הבא.״ הצרבתי, הגעתי, ולא הפסקתי מאז.",
  },
  {
    year: "2013",
    title: "על הבמה",
    text: "בן 15, כבר על במות במסיבות הכי שוות בעיר. יחצן, מפיק, ועל העמדה. העמדה פשוט קרצה לי — וידעתי שזה מה שאני רוצה.",
  },
  {
    year: "2018",
    title: "ירושלים → כל הארץ",
    text: "מירושלים לכל הארץ. חתונות, אירועי חברה, הפקות. כל אירוע — ליווי אישי מהתכנון ועד הרחבה.",
  },
  {
    year: "2023",
    title: "Compakt Academy",
    text: "לתת לדור הבא את הידע והכלים בדרך הכי חדשנית — זה מה שהייתי רוצה לקבל כשהתחלתי. כלים חכמים, AI, וגישה מעשית.",
  },
  {
    year: "2026",
    title: "1,000+ אירועים",
    text: "14 שנות ניסיון. 5 תלמידים פרטיים. 5 קבוצות בבתי ספר וחוגים. והמסע רק מתחיל.",
  },
];

const uniquePoints = [
  {
    icon: "🤝",
    title: "ליווי אישי",
    text: "מהפגישה הראשונה ועד הרגע האחרון על הרחבה. לא אוטומט — תהליך.",
  },
  {
    icon: "🎛️",
    title: "XP2 + מידי בלייב",
    text: "מכונת אפקטים שמתחברת לפלטה. נגינה בלייב שלא תשמעו אצל אף DJ אחר.",
  },
  {
    icon: "👁️",
    title: "קריאת קהל",
    text: "14 שנה של קריאת רחבות. אני יודע מתי להעלות, מתי להוריד, ומתי לתת לרגע לנשום.",
  },
];

export default function AboutV1() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#000", color: "#fff" }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#000!important;color:#fff!important}` }} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
            alt="DJ אלמוג כהן"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#03b28c]">
              אודות
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] mb-6">
              אלמוג כהן
              <br />
              <span className="text-white/70 text-2xl sm:text-3xl md:text-4xl font-bold">
                14 שנה על הבמה, ועדיין על הרחבה
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-black mb-4 text-white"
          >
            המסע
          </motion.h2>
          <div className="h-1 w-16 mx-auto mb-16 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full" />

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute right-6 md:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#059cc0] via-[#03b28c] to-transparent" />

            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-start gap-6 mb-12 ${
                  idx % 2 === 0 ? "md:flex-row-reverse md:text-left" : "md:text-right"
                }`}
              >
                {/* Dot */}
                <div className="absolute right-[18px] md:right-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] border-2 border-black z-10 flex-shrink-0" />

                {/* Content */}
                <div className={`mr-14 md:mr-0 md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
                  <span className="inline-block text-sm font-black text-[#03b28c] mb-1">{item.year}</span>
                  <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Me Different */}
      <section className="px-4 py-16 md:py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-black mb-4 text-white"
          >
            מה מייחד אותי
          </motion.h2>
          <div className="h-1 w-16 mx-auto mb-12 bg-gradient-to-r from-[#03b28c] to-[#059cc0] rounded-full" />

          <div className="grid md:grid-cols-3 gap-6">
            {uniquePoints.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="text-4xl mb-4">{point.icon}</div>
                <h3 className="text-lg font-black text-white mb-2">{point.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6 text-[#03b28c]">״</div>
            <blockquote className="text-xl md:text-2xl font-bold leading-relaxed text-white/90 mb-6">
              לתת לדור הבא את הידע והכלים בדרך הכי חדשנית —
              <br className="hidden sm:block" />
              זה מה שמניע אותי. על הבמה ומחוצה לה.
            </blockquote>
            <p className="text-white/40 text-sm font-bold">— אלמוג כהן</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-24 border-t border-white/10">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">בואו נדבר</h2>
            <p className="text-white/60 mb-8">שיחה קצרה, בלי התחייבות. ספרו לי על האירוע שלכם.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 font-black text-white hover:scale-105 transition-transform"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                שלחו הודעה בוואטסאפ
              </a>
              <a
                href="/weddings"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 font-bold text-white hover:bg-white/5 transition"
              >
                ראו אירועים
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
