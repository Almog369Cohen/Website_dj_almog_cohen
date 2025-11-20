import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DJ או להקה? המדריך המאוזן שיעזור לכם להחליט | DJ אלמוג כהן",
  description:
    "מדריך לזוגות שמתלבטים בין DJ, להקה חיה או שילוב – כולל יתרונות, חסרונות וטיפים לבניית רחבת ריקודים מושלמת.",
};

export default function DjOrBandGuidePage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המדריך DJ או להקה ורוצים להתייעץ על הקונספט המוזיקלי לאירוע שלנו."
  );

  return (
    <div className="bg-brand-dark text-brand-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 md:py-16">
        <nav className="text-sm text-white/60" aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-brand-blue">
                בית
              </Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-blue">
                בלוג
              </Link>
              <span className="mx-1">/</span>
            </li>
            <li className="text-white">DJ או להקה?</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/80">
            בחירת קונספט מוזיקלי
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            DJ או להקה? המדריך המאוזן שיעזור לכם להחליט
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            אין תשובה אחת נכונה – יש מה שמתאים לאירוע, לאופי שלכם ולתקציב. כאן תמצאו סקירה
            אמיתית של היתרונות והחסרונות של כל אופציה, וגם את פתרון הביניים המנצח.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">קטגוריה: החלטות מוזיקליות</span>
            <span className="rounded-full border border-white/10 px-3 py-1">זמן קריאה: ~10 דקות</span>
          </div>
        </header>

        <article className="space-y-10 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <p>
              אחת השאלות הכי נפוצות אצל זוגות היא האם להשקיע ב-DJ, בלהקה חיה – או לשלב ביניהם.
              כל בחירה מביאה איתה וייב אחר, רמת גמישות אחרת, ותקציב אחר.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold md:text-xl">1. ה-DJ: גמישות אינסופית וזרימה חלקה</h2>
            <p className="font-semibold text-brand-blue">יתרונות ה-DJ:</p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>גישה לספריית מוזיקה עצומה – מכל ז&apos;אנר, שפה וסגנון.</li>
              <li>יכולת להגיב לקהל בזמן אמת ולהחליף כיוון מיד כשהרחבה מרגישה אחרת.</li>
              <li>עלות-תועלת מעולה ביחס להיקף המוזיקה והזמן.</li>
              <li>מוזיקה רציפה בלי הפסקות בין סטים.</li>
            </ul>
            <p className="font-semibold text-brand-blue">חסרונות אפשריים:</p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>חלק מהאורחים מחפשים &quot;show&quot; ויזואלי של הופעה חיה.</li>
              <li>אם ה-DJ פחות מנוסה, האירוע עלול להרגיש גנרי ומיינסטרימי מדי.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold md:text-xl">2. להקה חיה: דרמה, נוכחות ובמה</h2>
            <p className="font-semibold text-brand-blue">יתרונות הלהקה:</p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>אנרגיה חיה על הבמה – חוויה של הופעה לכל דבר.</li>
              <li>קשר ויזואלי חזק עם האורחים – כולם רואים מי מנגן ושר.</li>
              <li>מתאים במיוחד לאירועים רשמיים, ג&apos;אז, סול, פאנק ועוד.</li>
            </ul>
            <p className="font-semibold text-brand-blue">חסרונות אפשריים:</p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>עלות גבוהה יותר – כמה נגנים, סאונדמן, ציוד.</li>
              <li>גמישות מוזיקלית מוגבלת – מנגנים רק מה שהם ערוכים אליו.</li>
              <li>הפסקות חובה בין סטים, מה שעלול לשבור רצף ברחבה.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold md:text-xl">3. השילוב המנצח: DJ + נגנים חיים</h2>
            <p>
              הטרנד החזק היום הוא חיבור בין DJ שמוביל את הערב לבין נגן חי אחד או יותר – סקסופון,
              כנר, מתופף ועוד.
            </p>
            <p className="font-semibold text-brand-blue">איך זה עובד בפועל?</p>
            <p>
              ה-DJ שולט בפלייליסט והזרימה, והנגן מגיע מעל המוזיקה ומוסיף אנרגיה, סולואים ורגעי
              שיא. כך מקבלים גם את הגמישות של DJ וגם את הדרמה של הופעה חיה.
            </p>
          </section>

          <section className="space-y-4 border-r-4 border-brand-blue pr-4 text-sm md:text-base">
            <h2 className="text-lg font-semibold md:text-xl">מיני-מדריך: 5 טיפים לרחבת ריקודים מושלמת</h2>
            <ul className="list-decimal space-y-2 pr-5 text-white/90">
              <li>
                <span className="font-semibold">המיקום קובע:</span> דאגו שעמדת ה-DJ תהיה עם קו ראייה
                לרחבה וסאונד מאוזן בכל האולם.
              </li>
              <li>
                <span className="font-semibold">חוק 3 השירים הראשונים:</span> תנו ל-DJ חופש לבחור את
                שלושת השירים שאחרי הסלואו – הם אלו שיקבעו אם הרחבה מתפוצצת.
              </li>
              <li>
                <span className="font-semibold">בר נגיש ורענן:</span> שתייה קלה ומרעננת קרובה לרחבה
                עוזרת לשמור על האנרגיה.
              </li>
              <li>
                <span className="font-semibold">ירידות מתח מתוכננות:</span> תנו ל-DJ לנהל רגעים רגועים
                קצרצרים באמצע הערב – כדי לחזור לפיק גדול יותר.
              </li>
              <li>
                <span className="font-semibold">כלל ה-30%:</span> הרחבה תתמלא כשה&quot;משוגעים&quot; שלכם יהיו
                שם. תתכננו מראש מי נכנס איתכם לרחבה ראשונים.
              </li>
            </ul>
          </section>
        </article>

        <section className="mt-4 rounded-2xl bg-gradient-to-l from-brand-blue/20 via-brand-green/10 to-transparent p-6 text-sm md:text-base">
          <h2 className="mb-2 text-lg font-semibold md:text-xl">
            מתלבטים בין DJ, להקה או שילוב?
          </h2>
          <p className="mb-4 text-white/80">
            בואו נדבר על הקונספט המוזיקלי המושלם לאירוע שלכם – נבין מי הקהל, מה הוייב, ומה התקציב,
            ונבנה יחד חוויה שלא דומה לאף חתונה אחרת.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              לקביעת שיחת ייעוץ מוזיקלית
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
            >
              להתייעץ ב-WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
