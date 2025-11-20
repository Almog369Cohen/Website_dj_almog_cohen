import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "קורס DJ: 5 טעויות קריטיות שכל מתחיל חייב להימנע מהן | DJ אלמוג כהן",
  description:
    "הטעויות הנפוצות של DJ מתחילים – ציוד, אימון אוזניים, תורת המוזיקה, מיינדסט ורשתות חברתיות – ואיך להימנע מהן.",
};

export default function DjCourseFiveMistakesPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראתי את המאמר על טעויות בקורס DJ ואני רוצה לשמוע על מסלולי הקורסים / המנטורינג."
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
            <li className="text-white">קורס DJ: 5 טעויות קריטיות</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/80">
            מדריך ל-DJ מתחילים
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            קורס DJ: 5 טעויות קריטיות שכל מתחיל חייב להימנע מהן
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            החלטתם להיכנס לעולם התקלוט? מזל טוב! זו דרך מרתקת, אבל מלאה במלכודות. הנה 5 טעויות
            שחוזרות שוב ושוב אצל מתחילים – ואיך להימנע מהן.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">קטגוריה: קורס DJ</span>
            <span className="rounded-full border border-white/10 px-3 py-1">זמן קריאה: ~7 דקות</span>
          </div>
        </header>

        <article className="space-y-10 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <p>
              כמנטור ותקליטן ותיק, אני רואה שוב ושוב אותם דפוסים אצל DJ&apos;ים בתחילת הדרך. חלקם
              טכניים, חלקם מנטליים – וכולם יכולים לעלות לכם בזמן, כסף ואנרגיה מיותרת.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">1. קניית ציוד יקר מדי – מוקדם מדי</h2>
            <p>
              הטעות הנפוצה ביותר: לרוץ לקנות קונטרולר דגל או מיקסר מתקדם עוד לפני שיש שליטה
              בסיסית ב-Beatmatching או בהבנה של המבנה המוזיקלי.
            </p>
            <p className="font-semibold text-brand-blue">מה לעשות במקום:</p>
            <p>
              התחילו עם קונטרולר בסיסי ואיכותי. הדגש בשלב הראשון הוא לא על כמות הכפתורים, אלא
              על שליטה בטכניקה – סנכרון, מיקסים נקיים, שליטה בעוצמות. אחרי שאתם שולטים ביסודות,
              אפשר להתחיל לחשוב על שדרוג.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">2. התעלמות מאימון אוזניים (Ear Training)</h2>
            <p>
              להסתמך רק על מסכי הגל ועל כפתור ה-Sync היא טעות קריטית. DJ מקצועי חייב לפתח
              תחושת קצב ואוזן חדה.
            </p>
            <p className="font-semibold text-brand-blue">מה לעשות במקום:</p>
            <p>
              תרגלו התאמת BPM ופאזה באוזן, לפני שאתם מסתכלים על המסך. כבו לפעמים את הצג, תנו
              לעצמכם להרגיש את המוזיקה. זה משחרר אתכם מהמחשב ומאפשר לכם להתחבר באמת לקהל.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">3. דילוג על תורת המוזיקה הבסיסית (Key Mixing)</h2>
            <p>
              ערבוב שירים רק לפי ז&apos;אנר או אנרגיה, בלי לשים לב לסולם המוזיקלי, גורם לעיתים קרובות
              למעברים צורמים ולא נעימים.
            </p>
            <p className="font-semibold text-brand-blue">מה לעשות במקום:</p>
            <p>
              למדו Harmonic Mixing. גם הבנה בסיסית של סולמות והתאמתם בין קטעים תשדרג את המיקסים
              שלכם מרמה &quot;טכנית&quot; לרמה &quot;אמנותית&quot; – זה אחד ההבדלים בין DJ שמנגן ל-DJ שיוצר.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">4. פחד מכישלון – ומהרחבה ריקה</h2>
            <p>
              הרבה DJ&apos;ים מתחילים נצמדים לפלייליסט סגור מראש, מתוך פחד לאבד את הקהל או לטעות
              במיקס. אבל כך מפספסים את הקסם של הרגע.
            </p>
            <p className="font-semibold text-brand-blue">מה לעשות במקום:</p>
            <p>
              זכרו ש-DJ הוא מנהיג. מותר לטעות, מותר לקחת סיכון מחושב. רחבה ריקה היא לא כישלון,
              היא פידבק. בקורס מקצועי מדברים גם על מיינדסט – איך להתמודד עם לחץ, לשדר ביטחון
              ולקבל החלטות בזמן אמת.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">5. ציפיות לא ריאליות מהרשתות החברתיות</h2>
            <p>
              קל להסתכל על פיד אינסטגרם של DJ מצליח ולחשוב ש&quot;תוך חצי שנה גם אני שם&quot;. אבל
              המציאות מורכבת יותר.
            </p>
            <p className="font-semibold text-brand-blue">מה לעשות במקום:</p>
            <p>
              השקיעו קודם כל במאסטריות – שליטה בציוד, בהכרת מוזיקה, בקריאת קהל. בנו קהל קטן
              ואמיתי, בבתי חברים, במסיבות קטנות, בבר המקומי. רק אחרי שיש בסיס חזק, תנו לרשתות
              החברתיות לעבוד בשבילכם.
            </p>
          </section>

          <section className="space-y-3 border-r-4 border-brand-blue pr-4 text-sm md:text-base">
            <h2 className="text-lg font-semibold md:text-xl">רוצים לגדול כ-DJ ולא רק ללמוד ללחוץ פליי?</h2>
            <p>
              קורס טוב הוא לא רק טכניקה. הוא גם מנטורינג, ליווי, שפה מקצועית וכיוון קריירה.
              המטרה היא להפוך אתכם לאומנים שיודעים להחזיק רחבה – לא רק &quot;להפעיל ציוד".
            </p>
            <p>
              אם אתם מרגישים שהגיע הזמן להשקיע בעצמכם וביכולות שלכם, אשמח לספר לכם על מסלולי
              המנטורינג והקורסים שאני מציע.
            </p>
          </section>
        </article>

        <section className="mt-4 rounded-2xl bg-gradient-to-l from-brand-blue/20 via-brand-green/10 to-transparent p-6 text-sm md:text-base">
          <h2 className="mb-2 text-lg font-semibold md:text-xl">
            רוצים לשמוע על מסלולי הקורסים והליווי?
          </h2>
          <p className="mb-4 text-white/80">
            השאירו פרטים בטופס או שלחו לי הודעת WhatsApp, ואעזור לכם להבין איזה מסלול מתאים
            לרמת הידע והשאיפות שלכם.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              לפרטים על הקורסים
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
            >
              לדבר איתי ב-WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
