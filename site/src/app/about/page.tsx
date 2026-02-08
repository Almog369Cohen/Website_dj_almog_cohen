"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buildWhatsAppLink } from "@/utils/whatsapp";

const waLink = buildWhatsAppLink("היי אלמוג, נכנסתי לאתר ואשמח לשמוע עוד!");

const djHighlights = [
  { stat: "14", label: "שנות ניסיון" },
  { stat: "1,000+", label: "אירועים" },
  { stat: "5★", label: "דירוג" },
];

const academyHighlights = [
  { stat: "30+", label: "תלמידים" },
  { stat: "5", label: "קבוצות" },
  { stat: "AI", label: "כלים חדשניים" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#000", color: "#fff" }}>
      <style dangerouslySetInnerHTML={{ __html: `body{background-color:#000!important;color:#fff!important}` }} />

      {/* Hero — Full Width */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/almog/מסיבת רחוב יד למעלה מעלה.jpg"
            alt="DJ אלמוג כהן על הבמה"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-32 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#03b28c]">
              אודות
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              אלמוג כהן
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white font-bold max-w-2xl mx-auto">
              על הבמה — בונה רחבות.
              <br />
              מחוץ לבמה — בונה DJ-ים.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story — Short */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-lg leading-relaxed text-white"
          >
            בגיל 14 נכנסתי לשיעור DJ ראשון. המורה אמר ״תצרוב 2 דיסקים ותבוא שבוע הבא.״
            בגיל 15 כבר הייתי על במות. יחצן, מפיק, ועל העמדה.
            היום, אחרי 14 שנה ו-1,000+ אירועים, אני עדיין על הרחבה —
            <strong className="text-white"> ומלמד את הדור הבא לעשות את אותו הדבר.</strong>
          </motion.p>
        </div>
      </section>

      {/* Two Worlds Split */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* DJ World */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden border border-[#059cc0]/20"
            >
              <div className="absolute inset-0">
                <Image
                  src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
                  alt="DJ אלמוג כהן באירוע"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
              </div>

              <div className="relative z-10 p-8 md:p-10 min-h-[420px] flex flex-col justify-end">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#059cc0]/30 bg-[#059cc0]/10 px-3 py-1 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#059cc0]" />
                    <span className="text-[10px] font-bold text-[#059cc0] uppercase tracking-wider">DJ לאירועים</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                    בונה רחבות
                  </h2>
                  <p className="text-white text-sm leading-relaxed mb-6">
                    ליווי אישי מהתכנון ועד הרחבה. XP2 + נגינת מידי בלייב.
                    קריאת קהל בזמן אמת. כל אירוע — חוויה שלא תשכחו.
                  </p>
                </div>

                <div className="flex gap-6 mb-6">
                  {djHighlights.map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl md:text-2xl font-black text-[#059cc0]">{item.stat}</div>
                      <div className="text-[10px] text-white font-bold">{item.label}</div>
                    </div>
                  ))}
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#059cc0] px-6 py-3.5 font-black text-sm text-white hover:scale-105 transition-transform w-full sm:w-auto"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  בואו נדבר על האירוע
                </a>
              </div>
            </motion.div>

            {/* Academy World */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden border border-[#03b28c]/20"
            >
              <div className="absolute inset-0">
                <Image
                  src="/assets/almog/מיקרופון מעלה אדומים.jpg"
                  alt="Compakt Academy"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
              </div>

              <div className="relative z-10 p-8 md:p-10 min-h-[420px] flex flex-col justify-end">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#03b28c]/30 bg-[#03b28c]/10 px-3 py-1 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#03b28c]" />
                    <span className="text-[10px] font-bold text-[#03b28c] uppercase tracking-wider">Compakt Academy</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                    בונה DJ-ים
                  </h2>
                  <p className="text-white text-sm leading-relaxed mb-6">
                    לתת לדור הבא את הידע והכלים בדרך הכי חדשנית.
                    כלים חכמים, AI, וגישה מעשית — לא קורס, מסלול כניסה לעולם האירועים.
                  </p>
                </div>

                <div className="flex gap-6 mb-6">
                  {academyHighlights.map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl md:text-2xl font-black text-[#03b28c]">{item.stat}</div>
                      <div className="text-[10px] text-white font-bold">{item.label}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/academy"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#03b28c] px-6 py-3.5 font-black text-sm text-white hover:scale-105 transition-transform w-full sm:w-auto"
                >
                  רוצה ללמוד?
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6 text-[#03b28c]">״</div>
            <blockquote className="text-xl md:text-2xl font-bold leading-relaxed text-white mb-6">
              לתת לדור הבא את הידע והכלים
              <br className="hidden sm:block" />
              בדרך הכי חדשנית שאני הייתי רוצה ללמוד —
              <br className="hidden sm:block" />
              זה מה שמניע אותי.
            </blockquote>
            <p className="text-white/50 text-sm font-bold">— אלמוג כהן</p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof — Logos */}
      <section className="px-4 py-12 border-t border-white/10">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-white/50 mb-6">עבדתי עם</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <Image src="/assets/clients/DHL.png" alt="DHL" width={60} height={30} className="h-8 w-auto object-contain invert" />
            <Image src="/assets/clients/logoapril.jpeg" alt="April" width={60} height={30} className="h-8 w-auto object-contain invert rounded" />
            <Image src="/assets/clients/אריאל .jpeg" alt="Ariel" width={60} height={30} className="h-8 w-auto object-contain invert rounded" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">בואו נדבר</h2>
            <p className="text-white/60 mb-8 text-sm">שיחה קצרה, בלי התחייבות. ספרו לי מה אתם מחפשים.</p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-10 py-4 font-black text-white hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              שלחו הודעה בוואטסאפ
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
