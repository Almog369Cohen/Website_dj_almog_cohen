import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "פרטיות – חותך אודיו | Compaktt",
  description:
    "מדיניות הפרטיות של חותך האודיו של Compaktt: עיבוד מקומי בלבד, ללא העלאה לשרת.",
  alternates: { canonical: "/cutter/privacy" },
};

export default function CutterPrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <nav className="mb-6 text-xs text-foreground-secondary" aria-label="breadcrumb">
        <Link href="/cutter" className="hover:text-brand-blue transition">חותך אודיו</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground-heading">פרטיות</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground-heading mb-8">
        מדיניות פרטיות — חותך אודיו
      </h1>

      <div className="glass-panel rounded-xl p-5 md:p-8 flex flex-col gap-6 text-sm text-foreground-secondary leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-foreground-heading mb-2">עיבוד מקומי בלבד</h2>
          <p>
            חותך האודיו של Compaktt פועל לחלוטין בתוך הדפדפן שלכם. קובצי האודיו שאתם
            מעלים <strong className="text-white">לא עוברים לאף שרת</strong> — לא שלנו ולא של צד
            שלישי. כל הפענוח, החיתוך, הקידוד וההורדה מתבצעים על המכשיר שלכם בלבד.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground-heading mb-2">מה לא נאסף</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>שם הקובץ או תוכנו</li>
            <li>מטא-דטה של האודיו (אמן, אלבום, תגיות)</li>
            <li>הבחירה שביצעתם (טווח זמנים, פורמט ייצוא)</li>
            <li>הקובץ המיוצא</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground-heading mb-2">מה כן נאסף</h2>
          <p>
            האתר עשוי להשתמש ב-Google Analytics לצורך ניתוח תנועה כללי (מספר ביקורים,
            סוג דפדפן, מדינה). מידע זה אנונימי ואינו כולל תוכן אודיו או פעולות חיתוך.
            ניתן לחסום Analytics באמצעות תוסף חוסם פרסומות.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground-heading mb-2">קוקיז</h2>
          <p>
            חותך האודיו עצמו לא שומר קוקיז. קוקיז שמופיעים באתר שייכים ל-Google Analytics
            בלבד ומשמשים למדידת תנועה כללית.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground-heading mb-2">זכויות יוצרים</h2>
          <p>
            הכלי מיועד לשימוש אישי ומקצועי חוקי. האחריות על זכויות היוצרים של החומר המעובד
            חלה על המשתמש/ת בלבד.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground-heading mb-2">יצירת קשר</h2>
          <p>
            לשאלות בנושא פרטיות ניתן לפנות דרך{" "}
            <a href="https://wa.me/972502427616" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              WhatsApp
            </a>{" "}
            או במייל{" "}
            <a href="mailto:info@compaktt.com" className="text-brand-blue hover:underline">
              info@compaktt.com
            </a>.
          </p>
        </section>

        <p className="text-xs text-white/40 pt-2 border-t border-white/10">
          עדכון אחרון: פברואר 2026
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/cutter"
          className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-foreground-heading"
        >
          חזרה לחותך האודיו
        </Link>
      </div>
    </div>
  );
}
