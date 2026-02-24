import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "שאלות נפוצות – חותך אודיו | Compaktt",
  description:
    "שאלות ותשובות על חותך האודיו של Compaktt: פורמטים נתמכים, איכות ייצוא, פרטיות, ועוד.",
  alternates: { canonical: "/cutter/faq" },
};

const faqs: { q: string; a: string }[] = [
  {
    q: "אילו פורמטים נתמכים?",
    a: "ניתן להעלות כל קובץ אודיו שהדפדפן תומך בו: MP3, WAV, M4A/AAC, FLAC, AIFF, OGG ועוד. הייצוא זמין ב-WAV (Lossless), MP3 (320kbps), ו-AIFF (Lossless).",
  },
  {
    q: "מה האורך המקסימלי של הקטע?",
    a: "עד 60 שניות. ניתן לבחור כל טווח בתוך השיר על-ידי גרירה של אזור הבחירה על הוויבפורם.",
  },
  {
    q: "האם הקבצים שלי מועלים לשרת?",
    a: "לא. הכל רץ בדפדפן שלכם — שום קובץ לא יוצא מהמחשב. אין שרת, אין אחסון ענן, אין מעקב.",
  },
  {
    q: "מה האיכות של ייצוא MP3?",
    a: "MP3 מיוצא ב-320kbps — הביטרייט הגבוה ביותר האפשרי. מתאים לנגנים, DJ-ים ופלטפורמות.",
  },
  {
    q: "מה ההבדל בין WAV ל-AIFF?",
    a: "שניהם Lossless (ללא אובדן איכות) ב-16 ביט. WAV נפוץ יותר ב-Windows ובייצור מוזיקה, AIFF נפוץ ב-macOS ובציוד DJ מקצועי.",
  },
  {
    q: "למה אין FLAC?",
    a: "תמיכה ב-FLAC בפיתוח ותהיה זמינה בקרוב. בינתיים, WAV ו-AIFF מספקים אותה איכות Lossless.",
  },
  {
    q: "האם יש קיצורי מקלדת?",
    a: "כן. Space = נגן/השהה, Enter = נגן קטע נבחר, R = איפוס בחירה, Escape = עצור, +/- = זום.",
  },
  {
    q: "האם הכלי עובד במובייל?",
    a: "כן, הכלי מותאם לנייד ולטאבלט. עם זאת, חוויית העבודה הטובה ביותר היא על מחשב בזכות הוויבפורם והזום.",
  },
  {
    q: "יש הגבלת גודל קובץ?",
    a: "מכיוון שהכל רץ בדפדפן, ההגבלה תלויה בזיכרון הזמין במכשיר שלכם. בדרך כלל עד 400MB בלי בעיה.",
  },
];

export default function CutterFaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <nav className="mb-6 text-xs text-foreground-secondary" aria-label="breadcrumb">
        <Link href="/cutter" className="hover:text-brand-blue transition">חותך אודיו</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground-heading">שאלות נפוצות</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground-heading mb-8">
        שאלות נפוצות
      </h1>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group glass-panel rounded-xl p-4 open:pb-5 transition-all"
          >
            <summary className="cursor-pointer text-sm md:text-base font-bold text-foreground-heading list-none flex items-center justify-between gap-2">
              {faq.q}
              <span className="shrink-0 text-white/30 group-open:rotate-45 transition-transform text-lg">+</span>
            </summary>
            <p className="mt-3 text-sm text-foreground-secondary leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
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
