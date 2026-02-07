import type { Metadata } from "next";
import Link from "next/link";
import RelatedArticles from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
  title: "20 שירי כניסה לחופה שישברו את הרשת | DJ אלמוג כהן",
  description:
    "רשימת 20 שירי חופה מחולקים לקטגוריות – קלאסיים, בחירות פחות צפויות ושירים לכניסת הורים וסבים – עם טיפים לבחירה חכמה.",
  keywords: [
    "שירי חופה",
    "שירי כניסה לחופה",
    "מוזיקה לחופה",
    "שירים לחופה 2025",
    "פלייליסט חופה",
    "שירי כניסה לחתונה",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/blog/chuppah-20-songs",
  },
  openGraph: {
    title: "20 שירי כניסה לחופה שישברו את הרשת",
    description: "רשימת 20 שירים מחולקים לקטגוריות – קלאסיים ובחירות מפתיעות.",
    type: "article",
    url: "https://www.compaktt.com/blog/chuppah-20-songs",
  },
};

export default function Chuppah20SongsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המדריך לשירי חופה ואנחנו רוצים לבנות איתך פלייליסט חופה אישי."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "20 שירי כניסה לחופה שישברו את הרשת",
            description: "רשימת 20 שירי חופה מחולקים לקטגוריות – קלאסיים, בחירות פחות צפויות ושירים לכניסת הורים וסבים – עם טיפים לבחירה חכמה.",
            author: { "@type": "Person", name: "DJ אלמוג כהן" },
            publisher: { "@type": "Organization", name: "Compaktt", url: "https://www.compaktt.com" },
            url: "https://www.compaktt.com/blog/chuppah-20-songs",
            inLanguage: "he",
            mainEntityOfPage: "https://www.compaktt.com/blog/chuppah-20-songs",
          }),
        }}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 md:py-16">
        <nav className="text-sm text-foreground-secondary" aria-label="breadcrumb">
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
            <li className="text-foreground-heading">20 שירי כניסה לחופה</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/80">
            מדריך לחופה
          </p>
          <h1 className="text-2xl font-bold leading-tight text-foreground-heading sm:text-3xl md:text-4xl">
            הפלייליסט המרגש: 20 שירי כניסה לחופה שישברו את הרשת
          </h1>
          <p className="text-sm text-foreground-secondary md:text-base">
            רגע החופה הוא אחד הרגעים הכי אישיים ומרגשים בחתונה. הבחירה המוזיקלית כאן היא
            הפסקול לזיכרון שיישאר אתכם לכל החיים.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-secondary">
            <span className="rounded-full border border-border px-3 py-1">קטגוריה: חופה</span>
            <span className="rounded-full border border-border px-3 py-1">זמן קריאה: ~9 דקות</span>
          </div>
        </header>

        <article className="space-y-10 leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <p>
              כדי לעזור לכם לבחור, ריכזתי 20 שירי חופה מחולקים לקטגוריות – קלאסיים, בחירות פחות צפויות,
              ושירים שמתאימים לכניסת הורים וסבים.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-5">
            <h3 className="text-sm font-bold text-foreground mb-1">טיפ מקצועי</h3>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              הרשימה הזו היא נקודת התחלה — לא פלייליסט סופי. DJ מקצועי יתאים את הגרסה, העיבוד והתזמון 
              לרגע עצמו, כולל <strong className="text-foreground">עריכות ועיבודים בלעדיים</strong> שלא קיימים בפלטפורמות הסטרימינג.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">א. שירי חופה מרגשים וקלאסיים (נצחיים)</h2>
            <p>
              שירים שמבטיחים צמרמורת ומתאימים כמעט לכל זוג. הם חזקים מוזיקלית ומעבירים רגש טהור:
            </p>
            <ul className="list-disc space-y-1 pr-5 text-white">
              <li><a href="https://www.youtube.com/results?search_query=%D7%A9%D7%9C%D7%9E%D7%94+%D7%90%D7%A8%D7%A6%D7%99+%D7%90%D7%94%D7%91%D7%94" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">שלמה ארצי – אהבה ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%A2%D7%99%D7%93%D7%9F+%D7%A8%D7%99%D7%99%D7%9B%D7%9C+%D7%9E%D7%9B%D7%9C+%D7%94%D7%90%D7%94%D7%91%D7%95%D7%AA" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">עידן רייכל – מכל האהבות ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%99%D7%95%D7%A0%D7%AA%D7%9F+%D7%A8%D7%96%D7%90%D7%9C+%D7%A7%D7%98%D7%95%D7%A0%D7%AA%D7%99" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">יונתן רזאל – קטונתי ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%90%D7%A8%D7%99%D7%A7+%D7%90%D7%99%D7%99%D7%A0%D7%A9%D7%98%D7%99%D7%99%D7%9F+%D7%A2%D7%95%D7%A3+%D7%92%D7%95%D7%96%D7%9C" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">אריק איינשטיין – עוף גוזל ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%90%D7%91%D7%A8%D7%94%D7%9D+%D7%98%D7%9C+%D7%A9%D7%99%D7%A8%D7%AA+%D7%94%D7%A2%D7%A9%D7%91%D7%99%D7%9D" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">אברהם טל – שירת העשבים ↗</a></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">ב. שירי חופה אלטרנטיביים</h2>
            <p>
              אם אתם מחפשים משהו קצת שונה ומפתיע, עם עיבודים מיוחדים או וייב פחות מיינסטרימי:
            </p>
            <ul className="list-disc space-y-1 pr-5 text-white">
              <li><a href="https://www.youtube.com/results?search_query=Coldplay+Sky+Full+of+Stars+instrumental" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">Coldplay – Sky Full of Stars (עיבוד אינסטרומנטלי) ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%90%D7%9C%D7%99%D7%A2%D7%93+%D7%9E%D7%AA%D7%95%D7%A7+%D7%9B%D7%A9%D7%9E%D7%A8%D7%9C%D7%99" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">אליעד – מתוק כשמרלי ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%A7%D7%95%D7%91%D7%99+%D7%90%D7%A4%D7%9C%D7%9C%D7%95+%D7%A9%D7%99%D7%A8+%D7%92%D7%A2%D7%92%D7%95%D7%A2%D7%99%D7%9D" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">קובי אפללו – שיר געגועים ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=The+Lumineers+Ho+Hey" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">The Lumineers – Ho Hey ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=A+Great+Big+World+Say+Something" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">A Great Big World – Say Something ↗</a></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">ג. שירים לכניסת הורים / סבים וסבתות</h2>
            <p>
              המוזיקה של כניסת המשפחה היא חלק מהדרמה של החופה. מומלץ לבחור שירים שאינם איטיים מדי,
              אבל עדיין מלאי רגש.
            </p>
            <ul className="list-disc space-y-1 pr-5 text-white">
              <li><a href="https://www.youtube.com/results?search_query=Queen+Love+of+My+Life+acoustic" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">Queen – Love of My Life (ביצוע אקוסטי) ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%9E%D7%90%D7%99%D7%A8+%D7%91%D7%A0%D7%90%D7%99+%D7%90%D7%94%D7%91%D7%94+%D7%A7%D7%A6%D7%A8%D7%94" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">מאיר בנאי – אהבה קצרה ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%91%D7%A0%D7%99%D7%94+%D7%91%D7%A8%D7%91%D7%99+%D7%9E%D7%99%D7%A9%D7%94%D7%95+%D7%90%D7%99%D7%AA%D7%99+%D7%9B%D7%90%D7%9F" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">בניה ברבי – מישהו איתי כאן ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=Andrea+Bocelli+Con+Te+Partiro" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">Andrea Bocelli – Con Te Partiro ↗</a></li>
              <li><a href="https://www.youtube.com/results?search_query=%D7%A0%D7%AA%D7%9F+%D7%92%D7%95%D7%A9%D7%9F+%D7%9B%D7%9C+%D7%9E%D7%94+%D7%A9%D7%99%D7%A9+%D7%9C%D7%99" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition">נתן גושן – כל מה שיש לי ↗</a></li>
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
          <p className="mb-4 text-white">
            השאירו פרטים או שלחו לי הודעת WhatsApp, ונבנה יחד את הפס הקולי המדויק לרגע החופה
            שלכם – מהכניסה של ההורים ועד הנשיקה.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
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

        <RelatedArticles currentSlug="chuppah-20-songs" />
      </main>
    </div>
  );
}
