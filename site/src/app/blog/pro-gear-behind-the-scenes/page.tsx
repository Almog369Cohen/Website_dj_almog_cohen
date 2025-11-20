import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מאחורי הקלעים: הציוד המקצועי שמשדרג כל אירוע | DJ אלמוג כהן",
  description:
    "סקירה של הציוד הקריטי לאירוע ברמה גבוהה – קונטרולר, מערכת הגברה, תאורה ואפקטים – ואיך הם משפיעים על חוויית האורחים.",
};

export default function ProGearBehindTheScenesPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המאמר על הציוד המקצועי ורוצים לדבר על האירוע / השכרת ציוד."
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
            <li className="text-white">מאחורי הקלעים: הציוד המקצועי</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/80">
            מאחורי הקלעים
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            מאחורי הקלעים: הציוד המקצועי שמשדרג כל אירוע
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            DJ מוביל הוא לא רק טעם מוזיקלי. הוא גם מהנדס סאונד קטן. הציוד הנכון משפיע ישירות
            על איכות הסאונד, האווירה והביטחון שלכם באירוע.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">קטגוריה: ציוד</span>
            <span className="rounded-full border border-white/10 px-3 py-1">זמן קריאה: ~7 דקות</span>
          </div>
        </header>

        <article className="space-y-10 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <p>
              הרבה אנשים חושבים ש-DJ הוא רק אדם שעומד מאחורי שולחן עם אוזניות. אבל האמת היא,
              ש-DJ מקצועי חייב להיות מומחה טכני, שמבין איך כל רכיב בשרשרת הסאונד משפיע על החוויה.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">1. המוח: קונטרולר הדגל / המיקסר</h2>
            <p>
              הקונטרולר או המיקסר הוא מרכז הפיקוד של ה-DJ. הוא חייב להיות מהיר, אמין, ולאפשר
              שליטה מלאה על כל פרט במיקס.
            </p>
            <p className="font-semibold text-brand-blue">למה זה קריטי?</p>
            <p>
              ציוד איכותי מבטיח מיקסים חלקים, תגובה מהירה, וסאונד נקי. אנחנו עובדים עם דגמי דגל
              של Pioneer/Denon כדי למנוע תקלות ולהבטיח יציבות לאורך כל הערב.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">2. הלב: מערכת ההגברה (PA)</h2>
            <p>
              מערכת ההגברה היא זו שמתרגמת את המוזיקה לחוויה פיזית ברחבה. לא כל הרמקולים נולדו
              שווים, במיוחד באירועים גדולים או בחללים מורכבים.
            </p>
            <p className="font-semibold text-brand-blue">למה זה קריטי?</p>
            <p>
              סאונד קונצרטי צריך להיות חזק, אבל לא צורם. מאוזן, אבל לא משעמם. אנחנו משתמשים
              במערכות מודולריות של מותגים מובילים (כמו L-Acoustics, JBL Pro וכו&apos;), ומכוונים את
              המערכת לפי גודל ומבנה החלל.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">3. הנשמה: תאורה ואפקטים חזותיים</h2>
            <p>
              המוזיקה היא חצי מהחוויה. החצי השני הוא מה שהעיניים רואות – תאורה, אפקטים, עשן
              כבד לסלואו, ועוד.
            </p>
            <p className="font-semibold text-brand-blue">למה זה קריטי?</p>
            <p>
              תאורה מתוזמנת נכון יכולה להפוך סלואו לרגע קולנועי, ורחבה למסיבת פסטיבל. אנחנו
              עובדים עם תאורה חכמה (DMX), אפקטים מדויקים ותיאום מלא עם הסאונד.
            </p>
          </section>

          <section className="space-y-3 border-r-4 border-brand-blue pr-4 text-sm md:text-base">
            <h2 className="text-lg font-semibold md:text-xl">שירות השכרת ציוד מקצועי</h2>
            <p>
              אם אתם DJ&apos;ים, מפיקים או בעלי אולמות שמחפשים לשדרג את האירוע עם ציוד ברמה גבוהה,
              אנו מציעים מגוון פתרונות להשכרה – מהמערכות הקטנות ועד סטאפים מלאים לאירועים גדולים.
            </p>
            <p>
              נשמח לייעץ לכם איזה ציוד מתאים לסוג האירוע, לגודל הרחבה ולסגנון המוזיקה – כדי שכל
              נוטה ונוטה יישמעו בדיוק כמו שצריך.
            </p>
          </section>
        </article>

        <section className="mt-4 rounded-2xl bg-gradient-to-l from-brand-blue/20 via-brand-green/10 to-transparent p-6 text-sm md:text-base">
          <h2 className="mb-2 text-lg font-semibold md:text-xl">
            צריכים ציוד לאירוע או רוצים להבין מה מתאים לכם?
          </h2>
          <p className="mb-4 text-white/80">
            דברו איתנו על האירוע או על הצרכים שלכם בתור DJ, ונבנה לכם פתרון ציוד מותאם אישית – עם
            אפשרות לייעוץ, התקנה ותפעול מלא.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/rental"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              לפרטים על השכרת ציוד
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
            >
              להתייעצות ב-WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
