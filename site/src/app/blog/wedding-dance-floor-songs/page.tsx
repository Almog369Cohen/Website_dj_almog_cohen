import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "50 שירים לרחבה בחתונה שיבטיחו רחבה מלאה | DJ אלמוג כהן",
  description:
    "רשימת 50 שירים לרחבה בחתונה מחולקים לקטגוריות: ישראלי, מזרחי, להיטים בינלאומיים, טכנו והאוס. הפלייליסט המושלם לחתונה שלכם מ-DJ עם 1000+ חתונות.",
  keywords: [
    "שירים לרחבה בחתונה",
    "שירים לחתונה",
    "מוזיקה לרחבה",
    "פלייליסט לחתונה",
    "שירים לחתונה 2025",
    "שירי רחבה",
    "מוזיקה לחתונה ישראלית",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/blog/wedding-dance-floor-songs",
  },
};

const songCategories = [
  {
    title: "להיטים ישראליים — הבסיס של כל רחבה",
    emoji: "🇮🇱",
    description: "השירים שכולם מכירים ושמבטיחים שכל הדורות ירקדו ביחד.",
    songs: [
      { artist: "עומר אדם", name: "שני משוגעים" },
      { artist: "עומר אדם", name: "תל אביב" },
      { artist: "סטטיק ובן אל תבורי", name: "טודו בום" },
      { artist: "עידן רייכל", name: "מילים יפות" },
      { artist: "אייל גולן", name: "כזה דבר" },
      { artist: "שלמה ארצי", name: "לא עוזב את הבמה" },
      { artist: "משינה", name: "שלג בפברואר" },
      { artist: "עברי לידר", name: "ארץ מובטחת" },
      { artist: "שירי מימון", name: "השמש עולה" },
      { artist: "אתניקס", name: "אלה לי" },
    ],
  },
  {
    title: "מזרחית — האנרגיה שמזיזה את הרחבה",
    emoji: "🔥",
    description: "מזרחית מודרנית וקלאסית שגורמת לכל הרחבה להתפוצץ. בחתונות ישראליות, המזרחית היא הדלק.",
    songs: [
      { artist: "עומר אדם", name: "שמח" },
      { artist: "אייל גולן", name: "הלב שלי" },
      { artist: "זוהר ארגוב", name: "הפרח בגני" },
      { artist: "שרית חדד", name: "כל כך יפה" },
      { artist: "אבי אברהם", name: "ברחובות של עיר" },
      { artist: "אליעד", name: "זה הרגע" },
      { artist: "דקלון", name: "סעי לצלחה" },
      { artist: "קובי פרץ", name: "מחרוזת ארגוב" },
      { artist: "עדן חסון", name: "עד מתי" },
      { artist: "נסרין קדרי", name: "מוכנה לרקוד" },
    ],
  },
  {
    title: "בינלאומי — להיטים שכולם מכירים",
    emoji: "🌍",
    description: "הלהיטים הבינלאומיים שמביאים את כולם לרחבה — מפופ ועד R&B.",
    songs: [
      { artist: "Dua Lipa", name: "Don't Start Now" },
      { artist: "The Weeknd", name: "Blinding Lights" },
      { artist: "Bruno Mars", name: "Uptown Funk" },
      { artist: "Ed Sheeran", name: "Shape of You" },
      { artist: "Beyoncé", name: "Crazy in Love" },
      { artist: "Justin Timberlake", name: "Can't Stop the Feeling" },
      { artist: "Mark Ronson", name: "Uptown Funk" },
      { artist: "Pharrell Williams", name: "Happy" },
      { artist: "Rihanna", name: "We Found Love" },
      { artist: "David Guetta ft. Sia", name: "Titanium" },
    ],
  },
  {
    title: "טכנו / האוס — לאפטר פארטי ולרחבה מתקדמת",
    emoji: "🎧",
    description: "לזוגות שרוצים לקחת את הרחבה לרמה הבאה. מתאים במיוחד לשעות המאוחרות.",
    songs: [
      { artist: "Fisher", name: "Losing It" },
      { artist: "Meduza", name: "Piece of Your Heart" },
      { artist: "Disclosure", name: "Latch" },
      { artist: "Duke Dumont", name: "Ocean Drive" },
      { artist: "CamelPhat & Elderbrook", name: "Cola" },
      { artist: "Gorgon City", name: "Ready for Your Love" },
      { artist: "Artbat", name: "Best of Me" },
      { artist: "Anyma", name: "Running" },
      { artist: "Solardo", name: "XTC" },
      { artist: "Dennis Cruz", name: "Push It" },
    ],
  },
  {
    title: "קלאסיקות נצחיות — שירים שלא מזדקנים",
    emoji: "💎",
    description: "שירים שעובדים בכל חתונה, בכל דור, תמיד. הם הביטוח שלכם לרחבה מלאה.",
    songs: [
      { artist: "Queen", name: "Don't Stop Me Now" },
      { artist: "ABBA", name: "Dancing Queen" },
      { artist: "Journey", name: "Don't Stop Believin'" },
      { artist: "Michael Jackson", name: "Billie Jean" },
      { artist: "Earth, Wind & Fire", name: "September" },
      { artist: "Bee Gees", name: "Stayin' Alive" },
      { artist: "Backstreet Boys", name: "Everybody" },
      { artist: "Spice Girls", name: "Wannabe" },
      { artist: "Whitney Houston", name: "I Wanna Dance with Somebody" },
      { artist: "Village People", name: "Y.M.C.A." },
    ],
  },
];

export default function WeddingDanceFloorSongsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המאמר על שירים לרחבה ואנחנו רוצים לבנות איתך פלייליסט לחתונה שלנו."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "50 שירים לרחבה בחתונה שיבטיחו רחבה מלאה",
            description: "רשימת 50 שירים לרחבה בחתונה מחולקים לקטגוריות: ישראלי, מזרחי, בינלאומי, טכנו וקלאסיקות.",
            author: { "@type": "Person", name: "DJ אלמוג כהן" },
            publisher: { "@type": "Organization", name: "Compaktt", url: "https://www.compaktt.com" },
            url: "https://www.compaktt.com/blog/wedding-dance-floor-songs",
            inLanguage: "he",
            mainEntityOfPage: "https://www.compaktt.com/blog/wedding-dance-floor-songs",
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
            <li className="text-foreground-heading">שירים לרחבה בחתונה</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-green">
            מדריך מוזיקלי לחתונה
          </p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            50 שירים לרחבה בחתונה שיבטיחו רחבה מלאה
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            אחרי 1000+ חתונות, אני יודע בדיוק אילו שירים מזיזים רחבה ואילו לא.
            הנה הרשימה המלאה — מחולקת לקטגוריות כדי שתוכלו לבנות את הפלייליסט המושלם לחתונה שלכם.
          </p>
          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            <span>מאת: DJ אלמוג כהן</span>
            <span>•</span>
            <span>זמן קריאה: 8 דקות</span>
          </div>
        </header>

        <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">למה הרשימה הזו שונה?</h2>
          <p className="text-foreground-secondary leading-relaxed">
            ברשת מלא רשימות גנריות. הרשימה הזו מבוססת על <strong className="text-foreground">ניסיון אמיתי מ-1000+ חתונות</strong> — 
            אני יודע אילו שירים באמת עובדים ברחבה ישראלית, מתי לשים כל שיר, ואיך לבנות סט שלם שלא מוריד את האנרגיה.
            הרשימה מעודכנת ל-2025 וכוללת גם קלאסיקות נצחיות וגם להיטים חדשים.
          </p>
        </div>

        {songCategories.map((category, catIdx) => (
          <section key={catIdx} className="space-y-4">
            <h2 className="text-2xl font-black text-foreground md:text-3xl">
              {category.emoji} {category.title}
            </h2>
            <p className="text-foreground-secondary leading-relaxed">{category.description}</p>
            <div className="overflow-hidden rounded-2xl border border-foreground/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/5">
                    <th className="px-4 py-3 text-right text-sm font-bold text-foreground">#</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-foreground">שיר</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-foreground">אמן</th>
                  </tr>
                </thead>
                <tbody>
                  {category.songs.map((song, songIdx) => (
                    <tr key={songIdx} className="border-b border-foreground/5 last:border-0">
                      <td className="px-4 py-3 text-sm text-foreground-secondary">{catIdx * 10 + songIdx + 1}</td>
                      <td className="px-4 py-3 text-sm font-bold text-foreground">{song.name}</td>
                      <td className="px-4 py-3 text-sm text-foreground-secondary">{song.artist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            💡 טיפים מ-DJ מנוסה: איך לבנות סט רחבה מושלם
          </h2>
          <div className="space-y-4 text-foreground-secondary leading-relaxed">
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
              <h3 className="font-bold text-foreground mb-2">1. התחילו בנמוך ותעלו</h3>
              <p>אל תתחילו עם האנרגיה הכי גבוהה. תנו לרחבה להתמלא טבעית. שירים ישראליים מוכרים → מזרחית → להיטים בינלאומיים → ובסוף אפטר.</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
              <h3 className="font-bold text-foreground mb-2">2. קראו את הקהל</h3>
              <p>כל חתונה שונה. אם הרחבה מגיבה למזרחית — תנו יותר. אם יש קהל צעיר שאוהב טכנו — אל תפחדו להכניס. הגמישות היא המפתח.</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
              <h3 className="font-bold text-foreground mb-2">3. אל תשכחו את הדורות</h3>
              <p>הורים וסבים רוצים גם לרקוד. כמה שירים משנות ה-80 או קלאסיקות ישראליות בזמן הנכון — וכל המשפחה על הרחבה.</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
              <h3 className="font-bold text-foreground mb-2">4. מעברים חלקים</h3>
              <p>המעבר בין שירים חשוב לא פחות מהשירים עצמם. DJ מקצועי יודע לעשות מעבר חלק שלא מוריד את האנרגיה.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            🔗 מדריכים נוספים לחתונה
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/blog/chuppah-20-songs" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">20 שירי כניסה לחופה</h3>
              <p className="text-sm text-foreground-secondary">הבחירה המוזיקלית הכי חשובה בחתונה</p>
            </Link>
            <Link href="/blog/how-to-choose-wedding-dj" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">איך לבחור DJ לחתונה</h3>
              <p className="text-sm text-foreground-secondary">5 שאלות חובה לפני שסוגרים</p>
            </Link>
            <Link href="/weddings" className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">עמוד חתונות — DJ אלמוג כהן</h3>
              <p className="text-sm text-foreground-secondary">כל מה שצריך לדעת על חתונה איתי</p>
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-foreground mb-3">
            רוצים פלייליסט מותאם אישית לחתונה שלכם?
          </h2>
          <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
            הרשימה הזו היא נקודת התחלה מצוינת, אבל כל חתונה שונה. בשיחה קצרה אני אבין את הסגנון שלכם ואבנה פלייליסט מושלם.
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
      </main>
    </div>
  );
}
