import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "20 שירי כניסה לחופה שישברו את הרשת | DJ אלמוג כהן",
  description:
    "רשימת 20 שירי חופה מחולקים לקטגוריות – קלאסיים, ייחודיים ושירים לכניסת הורים וסבים – עם טיפים לבחירה חכמה.",
};

export default function Chuppah20SongsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המדריך לשירי חופה ואנחנו רוצים לבנות איתך פלייליסט חופה אישי."
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
            <li className="text-white">20 שירי כניסה לחופה</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/80">
            מדריך לחופה
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            הפלייליסט המרגש: 20 שירי כניסה לחופה שישברו את הרשת
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            רגע החופה הוא אחד הרגעים הכי אישיים ומרגשים בחתונה. הבחירה המוזיקלית כאן היא
            הפסקול לזיכרון שיישאר אתכם לכל החיים.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">קטגוריה: חופה</span>
            <span className="rounded-full border border-white/10 px-3 py-1">זמן קריאה: ~9 דקות</span>
          </div>
        </header>

        <article className="space-y-10 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <p>
              כדי לעזור לכם לבחור, ריכזתי 20 שירי חופה מחולקים לקטגוריות – קלאסיים, ייחודיים,
              ושירים שמתאימים לכניסת הורים וסבים.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">א. שירי חופה מרגשים וקלאסיים (נצחיים)</h2>
            <p>
              שירים שמבטיחים צמרמורת ומתאימים כמעט לכל זוג. הם חזקים מוזיקלית ומעבירים רגש טהור:
            </p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>שלמה ארצי – אהבה</li>
              <li>עידן רייכל – מכל האהבות</li>
              <li>יונתן רזאל – קטונתי</li>
              <li>אריק איינשטיין – עוף גוזל</li>
              <li>אברהם טל – שירת העשבים</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">ב. שירי חופה ייחודיים ואלטרנטיביים</h2>
            <p>
              אם אתם מחפשים משהו קצת שונה ומפתיע, עם עיבודים מיוחדים או וייב פחות מיינסטרימי:
            </p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>Coldplay – Sky Full of Stars (עיבוד אינסטרומנטלי)</li>
              <li>אליעד – מתוק כשמרלי</li>
              <li>קובי אפללו – שיר געגועים</li>
              <li>The Lumineers – Ho Hey</li>
              <li>A Great Big World – Say Something</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">ג. שירים לכניסת הורים / סבים וסבתות</h2>
            <p>
              המוזיקה של כניסת המשפחה היא חלק מהדרמה של החופה. מומלץ לבחור שירים שאינם איטיים מדי,
              אבל עדיין מלאי רגש.
            </p>
            <ul className="list-disc space-y-1 pr-5 text-white/90">
              <li>Queen – Love of My Life (ביצוע אקוסטי)</li>
              <li>מאיר בנאי – אהבה קצרה</li>
              <li>בניה ברבי – מישהו איתי כאן</li>
              <li>Andrea Bocelli – Con Te Partiro</li>
              <li>נתן גושן – כל מה שיש לי</li>
            </ul>
          </section>

          <section className="space-y-3 border-r-4 border-brand-blue pr-4 text-sm md:text-base">
            <h2 className="text-lg font-semibold md:text-xl">טיפ זהב מה-DJ: חלקו את רגעי החופה</h2>
            <p>
              אל תפחדו לבחור שני שירים שונים – אחד לכניסת ההורים, ואחד לכניסה שלכם. זה יוצר שתי
              דרמות נפרדות ומעצים את רגע השיא. אפשר גם לבחור עיבוד אינסטרומנטלי בשילוב עם ביצוע
              מקורי, כדי לייצר בנייה הדרגתית.
            </p>
            <p>
              בסוף, השיר הנכון הוא זה שמרגיש &quot;אתם&quot;. אל תנסו לרצות את כולם – תבחרו שיר שידבר
              אליכם, ודרכו הקהל ירגיש את הסיפור שלכם.
            </p>
          </section>
        </article>

        <section className="mt-4 rounded-2xl bg-gradient-to-l from-brand-blue/20 via-brand-green/10 to-transparent p-6 text-sm md:text-base">
          <h2 className="mb-2 text-lg font-semibold md:text-xl">
            רוצים לבנות פלייליסט חופה מותאם אישית?
          </h2>
          <p className="mb-4 text-white/80">
            השאירו פרטים או שלחו לי הודעת WhatsApp, ונבנה יחד את הפס הקולי המדויק לרגע החופה
            שלכם – מהכניסה של ההורים ועד הנשיקה.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              לקביעת ייעוץ מוזיקלי
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
            >
              לשיחה ב-WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
