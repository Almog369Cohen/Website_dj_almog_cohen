"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

export default function PremiumPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const modules = [
    {
      number: "01",
      title: "מיתוג ופוזישנינג",
      description: "בניית brand אישי שבולט מהמתחרים",
      topics: [
        "מי אתה? מה הסטוריה שלך?",
        "איך לבנות זהות מותגית ייחודית",
        "פוזישנינג: למה לקוח יבחר בך ולא באחר",
        "Unique Value Proposition: מה עושה אותך שונה",
      ],
    },
    {
      number: "02",
      title: "עסקים בתחום הלילה",
      description: "איך לחשוב ולפעול כמו בעל עסק",
      topics: [
        "הבנת השוק: אולמות, מבצעים, סוכנויות",
        "תמחור אסטרטגי: איך לדעת כמה שווה",
        "משא ומתן: איך לסגור דיל טוב",
        "חוזים והגנה משפטית: מה חייב להיות בחוזה",
      ],
    },
    {
      number: "03",
      title: "שיווק דיגיטלי מתקדם",
      description: "מלייקים להופעות - איך הופכים followers ללקוחות",
      topics: [
        "אינסטגרם ו-TikTok: תוכן שמוכר",
        "וידאו, סטוריז, רילס: איך לייצר engagement",
        "מדידה ואופטימיזציה: מה עובד ומה לא",
        "Lead Generation: איך להשיג לקוחות פוטנציאליים",
      ],
    },
    {
      number: "04",
      title: "ניהול קריירה",
      description: "מתיק קטן לביזנס רציני",
      topics: [
        "מיומן ללוח שנתי: איך למלא תאריכים",
        "שימור לקוחות: איך לגרום להם לחזור",
        "הפניות: איך הלקוח הופך למשווק שלך",
        "סקיילינג: מעסק קטן לעסק גדול",
      ],
    },
    {
      number: "05",
      title: "Mindset & Psychology",
      description: "החשיבה שמפרידה בין חובבנים למקצוענים",
      topics: [
        "איך לחשוב כמו בעל עסק (לא עובד שכיר)",
        "התמודדות עם דחיות ואי-הצלחות",
        "בניית ביטחון עצמי על הבמה ומחוצה לה",
        "איזון חיי לילה ואיכות חיים",
      ],
    },
  ];

  const bonuses = [
    {
      title: "ליווי אישי חודשי",
      description: "שיחות 1-on-1 עם אלמוג לבניית תכנית אישית ומעקב אחרי התקדמות",
      gradient: "from-[#ffaa00] to-[#ff8800]",
    },
    {
      title: "קבוצת WhatsApp סגורה",
      description: "גישה לקהילה אקסקלוסיבית של דיג'ייז מתקדמים - רק בוגרי התכנית",
      gradient: "from-[#03b28c] to-[#059cc0]",
    },
    {
      title: "תכנית עבודה מותאמת",
      description: "roadmap מפורט ל-90 יום הראשונים - יעדים, משימות ומעקב",
      gradient: "from-[#059cc0] to-[#03b28c]",
    },
    {
      title: "צפייה בהופעות",
      description: "אפשרות להגיע להופעות אמיתיות ולראות איך זה עובד בשטח",
      gradient: "from-[#ffaa00] to-[#03b28c]",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "תכנית מנטורינג פרמיום",
            description: "ליווי אישי לבניית קריירה בתחום הלילה - מדיג'יי לבעל עסק מצליח",
            provider: {
              "@type": "EducationalOrganization",
              name: "Compakt Academy",
              url: "https://www.compaktt.com/academy",
            },
            instructor: {
              "@type": "Person",
              name: "Almog Cohen",
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-background/50 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Link href="/" className="hover:text-foreground-heading">בית</Link>
            <span>›</span>
            <Link href="/academy" className="hover:text-foreground-heading">Academy</Link>
            <span>›</span>
            <span className="text-foreground-heading">תכנית פרמיום</span>
          </nav>
        </div>
      </div>

      {/* Hero with Gold Theme */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-[#ffaa00]/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* VIP Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-block"
          >
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#ffaa00]/50 bg-gradient-to-r from-[#ffaa00]/20 to-[#ff8800]/20 px-6 py-2 text-sm font-bold uppercase tracking-wider text-[#ffaa00] shadow-lg">
              <span className="text-xl">💎</span>
              VIP ONLY
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-black leading-tight text-foreground-heading md:text-6xl lg:text-7xl"
          >
            תכנית הפרמיום
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-2xl font-bold text-foreground-heading md:text-3xl"
          >
            מדיג'יי לבעל עסק מצליח
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-foreground-secondary"
          >
            זה לא עוד קורס. זה ליווי אישי שיקח אתכם מ"אני רק מתקלט" ל
            <strong className="text-foreground-heading">"אני מנהל ביזנס רציני בתחום הלילה"</strong>.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href={wa("היי אלמוג, מעוניין בשיחת התאמה לתכנית הפרמיום")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ffaa00] to-[#ff8800] px-10 py-5 text-xl font-bold text-white shadow-[0_0_40px_rgba(255,170,0,0.5)] transition hover:scale-105 hover:shadow-[0_0_60px_rgba(255,170,0,0.7)]"
            >
              <span>שיחת התאמה חינם</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* For Who / Not For */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* For Who */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border-2 border-brand-green/30 bg-brand-green/10 p-8 backdrop-blur-xl"
            >
              <h3 className="mb-6 text-2xl font-black text-foreground-heading">זה בשבילכם אם...</h3>
              <ul className="space-y-4">
                {[
                  "דיג'ייז שיודעים לתקלט אבל לא מצליחים להשיג הופעות",
                  "מי שרוצה לעבור מחובבן לפרופסיונל",
                  "דיג'ייז שרוצים לבנות מותג ולא רק לנגן",
                  "מי שמוכן להשקיע בעצמו ובקריירה",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                      ✓
                    </div>
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not For */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/20 bg-white/5 p-8 opacity-70 grayscale backdrop-blur-xl"
            >
              <h3 className="mb-6 text-2xl font-black text-white">פחות מתאים אם...</h3>
              <ul className="space-y-4">
                {[
                  "מי שעדיין לא יודע לתקלט (תתחיל בקורס מתחילים)",
                  "מי שמחפש 'נוסחה קסומה' ללא עבודה",
                  "מי שלא מוכן להשקיע זמן וכסף",
                  "מי שרוצה תוצאות מהירות בלי סבלנות",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 text-white/80">✕</span>
                    <span className="text-white/80 line-through">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included - Course Structure */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-black text-white md:text-5xl">
            מה כלול בתכנית
          </h2>
          <p className="mb-12 text-center text-white/85">8 שיעורים מקיפים + ליווי אישי + חוויות בשטח</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 8 Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#ffaa00]/30 bg-gradient-to-br from-[#ffaa00]/10 to-transparent p-6"
            >
              <div className="mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#ffaa00] to-[#ff8800]" />
              <h3 className="mb-2 text-xl font-bold text-white">8 שיעורי תקלוט</h3>
              <p className="mb-3 text-white/85">6 מעשי + 2 עיוני</p>
              <p className="text-sm text-white/70">כל שיעור עם תרגילי בית מותאמים אישית</p>
            </motion.div>

            {/* Field Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-6"
            >
              <div className="mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#03b28c] to-[#059cc0]" />
              <h3 className="mb-2 text-xl font-bold text-white">יציאה לשטח</h3>
              <p className="mb-3 text-white/85">2 אירועים מאחורי הקלעים</p>
              <p className="text-sm text-white/70">לראות איך נראה אירוע אמיתי מהצד המקצועי</p>
            </motion.div>

            {/* Sound & Light Session */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 to-transparent p-6"
            >
              <div className="mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c]" />
              <h3 className="mb-2 text-xl font-bold text-white">סשן הגברה ותאורה</h3>
              <p className="mb-3 text-white/85">היכרות בסיסית עם הציוד</p>
              <p className="text-sm text-white/70">להבין מה קורה מאחורי הקונסולה</p>
            </motion.div>

            {/* Photo Shoot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-[#ffaa00]/30 bg-gradient-to-br from-[#ffaa00]/10 to-transparent p-6"
            >
              <div className="mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#ffaa00] to-[#03b28c]" />
              <h3 className="mb-2 text-xl font-bold text-white">צילומי תדמית</h3>
              <p className="mb-3 text-white/85">תמונות מקצועיות לפרופיל</p>
              <p className="text-sm text-white/70">לבניית המותג האישי שלך</p>
            </motion.div>

            {/* Event Accompaniment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-6"
            >
              <div className="mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#03b28c] to-[#059cc0]" />
              <h3 className="mb-2 text-xl font-bold text-white">ליווי לאירוע</h3>
              <p className="mb-3 text-white/85">באירוע הראשון שלך</p>
              <p className="text-sm text-white/70">
                אופציה לתוספת: <span className="font-bold text-[#ffaa00]">450₪ + מע״מ</span>
              </p>
            </motion.div>

            {/* Business Zoom Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-[#ffaa00]/30 bg-gradient-to-br from-[#ffaa00]/10 to-transparent p-6"
            >
              <div className="mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#ffaa00] to-[#ff8800]" />
              <h3 className="mb-2 text-xl font-bold text-white">2 סשן זום עסקי-מנטלי</h3>
              <p className="mb-3 text-white/85">שעה וחצי כל סשן</p>
              <p className="text-sm text-white/70">כניסה לתחום האירועים – הכנה מנטלית ועסקית</p>
            </motion.div>
          </div>

          {/* Zoom Support Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 rounded-2xl border border-white/20 bg-white/5 p-6 text-center"
          >
            <div className="mx-auto mb-4 h-3 w-12 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c]" />
            <h3 className="mb-2 text-xl font-bold text-white">3 סשני זום תמיכה</h3>
            <p className="mb-2 text-white/85">45 דקות כל סשן</p>
            <p className="text-sm text-white/70">שיקוף מסך, עדכונים, הסברים וסגירת פערים בתקלוט</p>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-black text-white md:text-5xl">
            המודולים של התכנית
          </h2>

          <div className="space-y-8">
            {modules.map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-xl transition hover:border-[#ffaa00]/50 hover:shadow-[0_0_30px_rgba(255,170,0,0.2)]"
              >
                {/* Number Badge */}
                <div className="absolute left-8 top-8 text-8xl font-black text-white/5 transition group-hover:text-[#ffaa00]/10">
                  {module.number}
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-black text-white">{module.title}</h3>
                      <p className="text-white/85">{module.description}</p>
                    </div>
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#ffaa00]/20 text-xl font-bold text-[#ffaa00]">
                      {module.number}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2">
                    {module.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#03b28c]" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-black text-white md:text-5xl">
            בונוסים לתכנית
          </h2>
          <p className="mb-12 text-center text-white/85">מה שבאמת עושה את ההבדל</p>

          <div className="grid gap-6 md:grid-cols-2">
            {bonuses.map((bonus, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-[#ffaa00]/20 bg-gradient-to-br from-[#ffaa00]/5 to-transparent p-6 backdrop-blur-xl"
              >
                <div className={`mb-4 h-3 w-12 rounded-full bg-gradient-to-r ${bonus.gradient}`} />
                <h3 className="mb-2 text-xl font-bold text-white">{bonus.title}</h3>
                <p className="text-white/85">{bonus.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Down-Sell: Beginners Course */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <p className="mb-4 text-sm text-white/80">עדיין לא יודעים לתקלט?</p>
            <h3 className="mb-4 text-2xl font-black text-white">התחילו מהבסיס</h3>
            <p className="mb-6 text-white/85">
              לפני שמתחילים בניית קריירה, צריך לדעת לתקלט. <strong className="text-white">קורס DJ למתחילים</strong> ילמד אתכם את היסודות – ביט-מיקס, ציוד, מבנה מוזיקלי ותרגול מעשי.
            </p>
            <Link
              href="/academy/dj-course"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#059cc0]/30 bg-[#059cc0]/10 px-6 py-3 font-bold text-[#059cc0] transition hover:bg-[#059cc0]/20"
            >
              <span>למידע על קורס המתחילים</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Investment & CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border-2 border-[#ffaa00]/30 bg-gradient-to-br from-[#ffaa00]/10 via-[#1f1f21] to-[#1f1f21] p-12 text-center backdrop-blur-xl">
            <h2 className="mb-6 text-3xl font-black text-white md:text-5xl">
              מוכנים לעשות את הקפיצה?
            </h2>
            <p className="mb-8 text-lg text-white/85">
              זה לא קורס. זה <strong className="text-white">השקעה בעצמכם</strong> ובעתיד המקצועי שלכם.
            </p>
            <div className="mb-8 text-white/80">
              <p className="mb-2">משך: 3-6 חודשים</p>
              <p className="mb-2">ליווי: שיחות חודשיות + קבוצה סגורה</p>
              <p>מחיר: בשיחת ההתאמה</p>
            </div>
            <a
              href={wa("היי אלמוג, רוצה לשמוע על תכנית הפרמיום")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ffaa00] to-[#ff8800] px-10 py-5 text-xl font-bold text-white shadow-[0_0_40px_rgba(255,170,0,0.5)] transition hover:scale-105"
            >
              <span>בואו נדבר – ללא התחייבות</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
