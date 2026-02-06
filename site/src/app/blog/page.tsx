import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "בלוג DJ אלמוג כהן – מדריכים לחתונות, DJ ומוזיקה",
  description:
    "מאמרים מקצועיים על בחירת DJ לחתונה, פלייליסט לחופה, קורסי DJ, ציוד מקצועי והחלטות מוזיקליות לאירוע שלכם.",
};

const posts = [
  {
    slug: "how-to-choose-wedding-dj",
    title: "איך לבחור DJ לחתונה: 5 שאלות חובה לפני שסוגרים",
    excerpt:
      "המדריך לזוגות שמחפשים DJ ברמה הגבוהה ביותר – עם 5 שאלות מפתח לפגישת הייעוץ.",
    category: "חתונות",
  },
  {
    slug: "dj-course-5-mistakes",
    title: "קורס DJ: 5 טעויות קריטיות שכל מתחיל חייב להימנע מהן",
    excerpt:
      "המלכודות הגדולות של DJ מתחילים – ואיך להפוך את הלימוד למסלול צמיחה אמיתי.",
    category: "קורס DJ",
  },
  {
    slug: "chuppah-20-songs",
    title: "20 שירי כניסה לחופה שישברו את הרשת",
    excerpt:
      "פלייליסט חופה מחולק לקטגוריות – קלאסיים, בחירות פחות צפויות ושירים לכניסת הורים וסבים.",
    category: "חופה",
  },
  {
    slug: "pro-gear-behind-the-scenes",
    title: "מאחורי הקלעים: הציוד המקצועי שמשדרג כל אירוע",
    excerpt:
      "איך הציוד הנכון – מהמיקסר ועד התאורה – משפיע על איכות האירוע שלכם.",
    category: "ציוד",
  },
  {
    slug: "dj-or-band-guide",
    title: "DJ או להקה? המדריך המאוזן שיעזור לכם להחליט",
    excerpt:
      "סקירה אמיתית של היתרונות, החסרונות והפתרון המנצח: DJ עם נגנים חיים.",
    category: "החלטות מוזיקליות",
  },
  {
    slug: "wedding-dance-floor-songs",
    title: "50 שירים לרחבה בחתונה שיבטיחו רחבה מלאה",
    excerpt:
      "רשימת 50 שירים מחולקים לקטגוריות: ישראלי, מזרחי, בינלאומי, טכנו וקלאסיקות — מ-DJ עם 1000+ חתונות.",
    category: "חתונות",
  },
  {
    slug: "wedding-dj-cost",
    title: "כמה עולה DJ לחתונה? מדריך מחירים מלא 2025",
    excerpt:
      "טווחי מחירים, מה משפיע על העלות, 5 טעויות נפוצות ושאלות שחובה לשאול לפני שסוגרים.",
    category: "חתונות",
  },
  {
    slug: "wedding-reception-music",
    title: "מוזיקה לקבלת פנים בחתונה — הפלייליסט המושלם",
    excerpt:
      "כללי הזהב, 20 שירים מומלצים לפי קטגוריות, וטעויות שחייבים להימנע מהן בקבלת הפנים.",
    category: "חתונות",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue/80">
            BLOG & GUIDES
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground-heading md:text-4xl">בלוג / תוכן דיגיטלי</h1>
        </div>
        <p className="mb-10 max-w-2xl text-sm text-foreground-secondary md:text-base">
          מדריכים, טיפים מאחורי הקלעים והשראה לזוגות, מפיקים ו-DJ&apos;ים – מתוך הניסיון של מאות
          אירועים.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col justify-between rounded-2xl border border-border bg-background/50 p-6 text-right shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1.5 hover:border-brand-blue/50"
            >
              <div className="space-y-3">
                <p className="text-xs text-brand-blue/80">{post.category}</p>
                <h2 className="text-lg font-semibold text-foreground-heading md:text-xl">{post.title}</h2>
                <p className="text-sm text-foreground-secondary">{post.excerpt}</p>
              </div>
              <div className="mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-brand-blue hover:underline"
                >
                  לקריאת המאמר →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
