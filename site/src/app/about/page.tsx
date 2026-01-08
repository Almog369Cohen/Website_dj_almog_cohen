"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-right"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-foreground-secondary">
            אודות
          </p>

          <h1 className="text-4xl md:text-5xl font-black leading-tight text-foreground-heading">
            הגישה מבוססת על נוכחות, מחשבה ומחויבות לתוצאה.
            <br />
            לא על עבודה באוטומט.
          </h1>

          <div className="mt-10 space-y-10">
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-heading">
                תפיסת עבודה
              </h2>
              <p className="text-base leading-relaxed text-foreground-secondary">
                העבודה אינה נשענת על סט מוכן.
                היא נשענת על קריאה של הרגע, בנייה של זרימה, וקבלת החלטות בזמן אמת.
              </p>
              <p className="text-base leading-relaxed text-foreground-secondary">
                לא מדובר רק בנוכחות בעמדה.
                מדובר בניהול מדויק של אנרגיה — ללא רעש מיותר.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-heading">
                גבולות
              </h2>
              <p className="text-base leading-relaxed text-foreground-secondary">
                לא כל פתרון שעובד טכנית — באמת עובד.
              </p>
              <p className="text-base leading-relaxed text-foreground-secondary">
                לא מחפשים רעש, השפעה רגעית, או מניפולציות.
                הבחירה במה לא לעשות חשובה לא פחות.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-heading">
                למי זה מתאים
              </h2>

              <div className="space-y-2">
                <p className="text-base leading-relaxed text-foreground-secondary">
                  בלמידה, הדגש הוא אחריות, תהליך, ודיוק.
                  לא נוסחה קבועה.
                </p>
                <p className="text-base leading-relaxed text-foreground-secondary">
                  באירועים, הדגש הוא שליטה שקטה ורגישות לרגע.
                  לא תבנית מוכנה.
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-8">
              <p className="text-base font-semibold leading-relaxed text-foreground-heading">
                זו לא שיטה.
                זו דרך עבודה.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link href="/weddings/fit-check" className="btn-cta sm:w-auto">
                  בדיקת התאמה
                </Link>
                <Link
                  href="/academy"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-background"
                >
                  לקריאה נוספת
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
