"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FAQSection, FinalCTASection } from "@/components/sections";
import { buildWhatsAppLink, getEventsWhatsAppMessage } from "@/utils/whatsapp";
import { trackEvent } from "@/utils/analytics";

export default function WeddingsPage() {
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waLink = buildWhatsAppLink(getEventsWhatsAppMessage("weddings_dj"));

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked - fallback to poster
    });
  }, []);

  const tryPlayHeroVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked - fallback to poster
    });
  };

  return (
    <div className="min-h-screen bg-[#1f1f21]">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Compaktt – ניהול מוזיקלי לחתונות | Almog Cohen",
            description: "ניהול מוזיקלי וארכיטקטורת רגש לחתונות בישראל. ליווי רגוע, מדויק, ומבוסס התאמה – לא מתאים לכל זוג.",
            provider: {
              "@type": "Person",
              name: "Almog Cohen",
              description: "Music Director & Emotional Architect",
            },
            areaServed: {
              "@type": "Country",
              name: "Israel",
            },
            serviceType: ["Wedding Music Direction", "Musical Director"],
          }),
        }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="hover:text-white">בית</Link>
            <span>›</span>
            <span className="text-white">חתונות</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#03b28c]/10 blur-[120px]" />
        </div>

        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {!heroVideoFailed ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/almog/IMG_6561.jpg"
              onCanPlay={tryPlayHeroVideo}
              onError={() => setHeroVideoFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectFit: "cover", aspectRatio: "16 / 9" }}
            >
              <source src="/assets/hero-main-optimized.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/assets/almog/IMG_6561.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 text-4xl font-black leading-tight text-white md:text-6xl"
          >
            מוזיקה היא לא פלייליסט.
            <br />
            <span className="bg-gradient-to-r from-[#059cc0] to-[#03b28c] bg-clip-text text-transparent">
              היא הנהגה רגשית.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl"
          >
            אם אתם רוצים חתונה עם בהירות, שקט פנימי וזרימה שאפשר לסמוך עליה —
            נבדוק התאמה, בלי לחץ.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_hero" })}
              className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              <span>בדיקת זמינות בוואטסאפ</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <Link
              href="/weddings/fit-check"
              onClick={() => trackEvent("fitcheck_open", { source: "weddings_hero" })}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              בדיקת התאמה (דקה)
            </Link>
            <p className="text-sm font-medium text-white/80">לא מתאים לכל זוג – וזה בכוונה.</p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white md:text-5xl">טעימה מהערב</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              זה המקום לראות 60 שניות שמראות קהל, רצף ותזמון. לא סיכום, לא פרסומת.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/yarUtbqD0BI"
                title="טעימה מהערב"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-5 text-white/85">
              <div className="text-sm font-bold text-white">מה כדאי להקשיב לו</div>
              <p className="mt-2 text-sm text-white/80">
                איך המעברים נשמרים טבעיים, ואיך החדר מתקדם בלי ״דחיפות״.
              </p>
              <div className="mt-4 flex flex-col items-center gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_video" })}
                  className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  בדיקת זמינות בוואטסאפ
                </a>
                <Link
                  href="/weddings/fit-check"
                  onClick={() => trackEvent("fitcheck_open", { source: "weddings_video" })}
                  className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  בדיקת התאמה (דקה)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white md:text-5xl">סימני אמון</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
              לוגואים, צילומי מסך והמלצות — כאן יישבו נכסים אמיתיים מהספרייה.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white">חברות / מותגים</h3>
              <p className="mt-2 text-sm text-white/70">Placeholder — יוחלף בקרוסלת הלוגואים הקיימת.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["Logo 1", "Logo 2", "Logo 3", "Logo 4", "Logo 5", "Logo 6"].map((t) => (
                  <div key={t} className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-3 py-4 text-xs font-semibold text-white/75">
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white">מה זוגות כותבים</h3>
              <p className="mt-2 text-sm text-white/70">Placeholder — יוחלף בצילומי מסך מטושטשים / המלצות קצרות.</p>
              <div className="mt-5 space-y-3">
                {["הרגיש שיש יד על ההגה לאורך כל הערב.", "הקהל היה מגוון והמעברים נשארו טבעיים.", "היה סדר, בלי להרגיש שמנהלים אותנו."].map((q) => (
                  <div key={q} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85">
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">האם זה מתאים לכם?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <h3 className="mb-4 text-xl font-bold text-white">מתאים אם אתם…</h3>
              <ul className="space-y-3 text-white/85">
                {[
                  "רוצים מישהו שמחזיק את הערב רגוע, ולא דוחף אותו בכוח",
                  "מחפשים חיבור אנושי לפני בחירות מוזיקליות",
                  "רוצים שהאורחים ירגישו בידיים טובות — גם בלי להבין למה",
                  "רוצים מסגרת ברורה: מה כן, מה לא, ומה קורה כשדברים משתנים",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 text-[#03b28c]">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <h3 className="mb-4 text-xl font-bold text-white">לא מתאים אם אתם…</h3>
              <ul className="space-y-3 text-white/85">
                {[
                  "מחפשים מחיר ואז נסתדר",
                  "רוצים נוסחה קבועה של חתונה: אותו פתיח, אותו שיא, אותה סגירה",
                  "רוצים מישהו על המיקרופון שינהל את הקהל במקום שהמוזיקה תוביל",
                  "רוצים רשימת שירים שתפתור את כל הבעיות",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 text-red-400">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_fit_block" })}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              בדיקת זמינות בוואטסאפ
            </a>
            <p className="text-sm font-medium text-white/70">לא מתאים לכל זוג – וזה בסדר.</p>
          </div>
        </div>
      </section>

      {/* Why Me */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">הבעיה האמיתית</h2>

          <div className="mx-auto max-w-3xl space-y-5 text-white/85">
            <p>
              רוב החתונות מרגישות אותו הדבר לא בגלל שאין השקעה — אלא בגלל שמנסים לפתור רגש עם טכניקה.
            </p>
            <p>
              רשימת שירים נותנת תחושת שליטה רגעית, אבל היא לא מייצרת זרימה.
              כי העניין הוא לא איזה שיר מגיע — אלא מתי הוא מגיע, ולמי הוא מדבר.
            </p>
            <p>
              החרדה סביב מוזיקה היא לא על מוזיקה.
              היא על אחריות: אתם לא רוצים להמר על הזרימה של היום הכי משמעותי שלכם.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">הגישה של Compaktt</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "ארכיטקטורת רגש",
                  desc: "לא להרים בכוח. לבנות מסלול רגשי — מהכניסה ועד הסגירה.",
                },
                {
                  title: "קריאה בזמן אמת",
                  desc: "להבין אנשים בחדר, לא לנהל ערב לפי סט קבוע.",
                },
                {
                  title: "הובלה בלי אגו",
                  desc: "בלי מיקרופון דומיננטי. המוזיקה מכוונת, אתם במרכז.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                  <h3 className="mb-2 text-xl font-bold text-white">{c.title}</h3>
                  <p className="text-white/85">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories/Testimonials */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">הדרך (בקצרה)</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "לפני החתונה",
                items: [
                  "הקשבה עמוקה: מי אתם, מה חשוב לכם, ומה אתם לא רוצים",
                  "מסגרת ברורה: גבולות, קווים אדומים, ותיאום ציפיות",
                  "פחות רעש מבחוץ, יותר דיוק מבפנים",
                ],
              },
              {
                title: "במהלך החתונה",
                items: [
                  "נוכחות מלאה בחדר — לא רק לנהל מוזיקה",
                  "אינטואיציה + איפוק: מתי לתת שקט ומתי לתת שיא",
                  "התאמות בזמן אמת לקהל מעורב",
                ],
              },
              {
                title: "אחרי החתונה",
                items: [
                  "סגירה אנושית: להבין מה עבד ומה נשאר איתכם",
                  "משוב קצר שמחזיר תחושת שלמות",
                  "אם צריך — גם רפלקציה, לא רק תיעוד",
                ],
              },
            ].map((step) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                <h3 className="mb-4 text-xl font-bold text-white">{step.title}</h3>
                <ul className="space-y-3 text-white/85">
                  {step.items.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-0.5 text-[#03b28c]">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
            <h2 className="mb-3 text-2xl font-black text-white">הוכחה חברתית</h2>
            <p className="mb-6 text-white/85">
              כדי להשלים את הסקשן הזה כמו שצריך (תמונות, קליפים והמלצות אמיתיות) —
              צריך נכסים מקוריים. כרגע הסקשן מוגדר כמקום שמחכה לחומרים.
            </p>
            <div className="grid gap-3 text-white/85 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">וידאו אופקי (Hero) – 5–12 שניות, שקט, לופ חלק</div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">תמונות חתונה (10–30) – חיבור, פנים, תנועה</div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">המלצות אמיתיות (טקסט/וידאו) – 5–8 מספיק</div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-10 text-center text-3xl font-black text-white md:text-5xl">למה זוגות בוחרים בי</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                "הובלה רגועה ובטוחה — בלי לחץ בחדר",
                "אינטליגנציה רגשית: לקרוא אנשים, לא רק מוזיקה",
                "עומק מוזיקלי שמשרת אתכם — לא מרשים על חשבונכם",
                "כבוד לזוג ולאורחים: אף אחד לא צריך להוכיח שהוא נהנה",
                "מעורבות אישית: אין אאוטסורסינג",
                "התאמה מעל זמינות: לא כל זוג מתקבל",
              ].map((t) => (
                <div key={t} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex gap-3 text-white/85">
                    <span className="text-[#03b28c]">✓</span>
                    <span>{t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { source: "weddings_benefits" })}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              בדיקת זמינות בוואטסאפ
            </a>
            <Link
              href="/weddings/fit-check"
              onClick={() => trackEvent("fitcheck_open", { source: "weddings_benefits" })}
              className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              בדיקת התאמה (דקה)
            </Link>
            <p className="text-sm font-medium text-white/70">לא מתאים לכל זוג – וזה בסדר.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection type="wedding" />

      {/* Final CTA */}
      <FinalCTASection 
        title="מוכנים לבדוק זמינות?"
        subtitle="הודעה קצרה עם תאריך, אולם וכמות אורחים — ואני עונה." 
        primaryCTA={{
          text: "בדיקת זמינות בוואטסאפ",
          href: waLink,
          isWhatsApp: true
        }}
        secondaryCTA={{
          text: "בדיקת התאמה (דקה)",
          href: "/weddings/fit-check"
        }}
      />
    </div>
  );
}
