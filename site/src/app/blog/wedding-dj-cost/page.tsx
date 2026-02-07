import type { Metadata } from "next";
import Link from "next/link";
import RelatedArticles from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
  title: "כמה עולה DJ לחתונה? מחירון DJ לחתונות 2025 | DJ אלמוג כהן",
  description:
    "מדריך מחירים מלא ל-DJ לחתונה בישראל 2025. כמה עולה תקליטן לחתונה, מה משפיע על המחיר, מה כדאי לבדוק לפני שסוגרים, ואיך לא לטעות.",
  keywords: [
    "כמה עולה DJ לחתונה",
    "מחיר DJ לחתונה",
    "מחירון DJ חתונה",
    "DJ לחתונה מחיר",
    "תקליטן לחתונה מחיר",
    "עלות DJ לחתונה 2025",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/blog/wedding-dj-cost",
  },
};

export default function WeddingDJCostPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המאמר על מחירי DJ לחתונה ואנחנו רוצים לבדוק תאריך ולשמוע הצעת מחיר."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "כמה עולה DJ לחתונה? מחירון DJ לחתונות 2025",
            description: "מדריך מחירים מלא ל-DJ לחתונה בישראל 2025. כמה עולה תקליטן לחתונה, מה משפיע על המחיר, ואיך לא לטעות.",
            author: { "@type": "Person", name: "DJ אלמוג כהן" },
            publisher: { "@type": "Organization", name: "Compaktt", url: "https://www.compaktt.com" },
            url: "https://www.compaktt.com/blog/wedding-dj-cost",
            inLanguage: "he",
            mainEntityOfPage: "https://www.compaktt.com/blog/wedding-dj-cost",
          }),
        }}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 md:py-16">
        <nav className="text-sm text-foreground-secondary" aria-label="breadcrumb">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-brand-blue">בית</Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-blue">בלוג</Link>
              <span className="mx-1">/</span>
            </li>
            <li className="text-foreground-heading">מחירון DJ לחתונה</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-green">
            מדריך מחירים 2025
          </p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            כמה עולה DJ לחתונה? מדריך מחירים מלא 2025
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            אחד השאלות הראשונות שזוגות שואלים. הנה תשובה כנה ומפורטת מ-DJ עם 10+ שנות ניסיון ו-1000+ חתונות — 
            כולל מה משפיע על המחיר, מה כדאי לבדוק, ואילו שאלות לשאול.
          </p>
          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            <span>מאת: DJ אלמוג כהן</span>
            <span>•</span>
            <span>זמן קריאה: 6 דקות</span>
          </div>
        </header>

        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">
          <p className="text-foreground leading-relaxed">
            <strong>הערה חשובה:</strong> המחירים במאמר הזה הם טווחי מחירים מקובלים בשוק הישראלי. 
            המחיר הסופי תמיד תלוי בפרטים הספציפיים של האירוע שלכם.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            💰 טווחי מחירים — DJ לחתונה 2025
          </h2>
          <p className="text-foreground-secondary leading-relaxed">
            המחירים משתנים מאוד בהתאם לניסיון, לציוד, ולרמת השירות. הנה החלוקה המקובלת:
          </p>

          <div className="space-y-4">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-foreground">DJ מתחיל</h3>
                <span className="text-lg font-bold text-brand-blue">₪3,000 – ₪5,000</span>
              </div>
              <ul className="space-y-2 text-foreground-secondary text-sm">
                <li>• 1-3 שנות ניסיון</li>
                <li>• ציוד בסיסי</li>
                <li>• פלייליסט סטנדרטי</li>
                <li>• מתאים לחתונות קטנות ואינטימיות</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-foreground">DJ מנוסה</h3>
                <span className="text-lg font-bold text-brand-green">₪5,000 – ₪10,000</span>
              </div>
              <ul className="space-y-2 text-foreground-secondary text-sm">
                <li>• 5-10 שנות ניסיון</li>
                <li>• ציוד מקצועי ברמה גבוהה</li>
                <li>• פגישת תכנון מוזיקלי</li>
                <li>• גמישות והתאמה לקהל בזמן אמת</li>
                <li>• מתאים לרוב החתונות</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-foreground">DJ פרימיום</h3>
                <span className="text-lg font-bold text-brand-blue">₪10,000 – ₪20,000+</span>
              </div>
              <ul className="space-y-2 text-foreground-secondary text-sm">
                <li>• 10+ שנות ניסיון, מאות/אלפי חתונות</li>
                <li>• ציוד ברמה הגבוהה ביותר</li>
                <li>• ליווי אישי מלא — מהתכנון ועד הביצוע</li>
                <li>• ניהול מוזיקלי של כל הערב</li>
                <li>• אפשרות לאפטר פארטי, תאורה, אפקטים</li>
                <li>• מתאים לחתונות יוקרה, חתונות גדולות, ואירועי בוטיק</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            📊 מה משפיע על המחיר?
          </h2>
          <div className="space-y-4">
            {[
              { title: "ניסיון ומוניטין", desc: "DJ עם 10+ שנות ניסיון ומאות ביקורות חיוביות יגבה יותר מ-DJ שמתחיל. אתם משלמים על שקט נפשי ועל ניסיון שאי אפשר לזייף." },
              { title: "משך האירוע", desc: "חתונה רגילה (5-6 שעות) vs. חתונה עם אפטר פארטי (8-10 שעות). ככל שהאירוע ארוך יותר, המחיר עולה." },
              { title: "ציוד", desc: "רמקולים מקצועיים, סאב-בייס, תאורה, מכונות עשן, אפקטים — כל אלה מוסיפים לעלות אבל גם לחוויה." },
              { title: "מיקום", desc: "אירוע בצפון הרחוק או באילת עשוי לכלול תוספת נסיעה. רוב ה-DJ-ים במרכז מכסים את אזור המרכז ללא תוספת." },
              { title: "מועד", desc: "חמישי בקיץ עולה יותר מיום שלישי בחורף. תאריכים פופולריים = מחיר גבוה יותר." },
              { title: "שירותים נוספים", desc: "קבלת פנים נפרדת, הגברת חופה, DJ נוסף לאפטר, רקדנים — כל תוספת משפיעה." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            ⚠️ 5 טעויות נפוצות בבחירת DJ לפי מחיר
          </h2>
          <div className="space-y-3 text-foreground-secondary leading-relaxed">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">1. ללכת על הכי זול</h3>
              <p>המוזיקה היא 80% מהאווירה בחתונה. DJ זול שלא יודע לקרוא קהל = רחבה ריקה. אתם חוסכים 3,000₪ ומפסידים את הערב.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">2. לא לבדוק סרטונים מאירועים אמיתיים</h3>
              <p>תמונות וסרטוני תדמית זה יפה, אבל מה שחשוב הוא איך נראית הרחבה באירועים אמיתיים. בקשו לראות סרטונים.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">3. לא לשאול מה כלול במחיר</h3>
              <p>DJ אחד כולל ציוד ותאורה, DJ אחר גובה על כל דבר בנפרד. תבקשו פירוט מלא לפני שסוגרים.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">4. להתעלם מפגישה מקדימה</h3>
              <p>DJ שלא מציע פגישת תכנון = DJ שלא יתאים את המוזיקה אליכם. פגישה מקדימה היא חובה.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">5. לסגור ברגע האחרון</h3>
              <p>DJ-ים טובים נתפסים מוקדם. אם תחכו לחודש לפני, נשארים DJ-ים פחות מנוסים במחירים גבוהים יותר.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            ✅ שאלות שחובה לשאול DJ לפני שסוגרים
          </h2>
          <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
            <ol className="space-y-3 text-foreground-secondary leading-relaxed list-decimal list-inside">
              <li><strong className="text-foreground">כמה חתונות עשית?</strong> — ניסיון אמיתי הוא הדבר הכי חשוב.</li>
              <li><strong className="text-foreground">מה כלול במחיר?</strong> — ציוד, תאורה, הגברה, שעות עבודה.</li>
              <li><strong className="text-foreground">יש פגישת תכנון מוזיקלי?</strong> — DJ טוב מקדיש זמן להבין את הסגנון שלכם.</li>
              <li><strong className="text-foreground">אפשר לראות סרטונים מחתונות אמיתיות?</strong> — לא רק תדמית, אלא רחבה בפעולה.</li>
              <li><strong className="text-foreground">מה קורה אם יש תקלה?</strong> — backup ציוד, גמישות, תוכנית B.</li>
              <li><strong className="text-foreground">יש המלצות מזוגות?</strong> — קראו ביקורות אמיתיות.</li>
            </ol>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            🔗 מדריכים נוספים
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/blog/how-to-choose-wedding-dj" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">איך לבחור DJ לחתונה</h3>
              <p className="text-sm text-foreground-secondary">5 שאלות חובה לפני שסוגרים</p>
            </Link>
            <Link href="/blog/wedding-dance-floor-songs" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">50 שירים לרחבה בחתונה</h3>
              <p className="text-sm text-foreground-secondary">הפלייליסט המושלם לחתונה שלכם</p>
            </Link>
            <Link href="/weddings" className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-5 hover:border-brand-green transition-all md:col-span-2">
              <h3 className="font-bold text-foreground mb-1">עמוד חתונות — DJ אלמוג כהן</h3>
              <p className="text-sm text-foreground-secondary">כל מה שצריך לדעת על חתונה איתי — timeline, גלריה, המלצות ועוד</p>
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-foreground mb-3">
            רוצים לשמוע הצעת מחיר?
          </h2>
          <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
            שלחו הודעה עם תאריך, אולם, ומספר אורחים — ותקבלו תגובה תוך 5 דקות עם כל הפרטים.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            שלחו הודעה בוואטסאפ
          </a>
        </section>

        <RelatedArticles currentSlug="wedding-dj-cost" />
      </main>
    </div>
  );
}
