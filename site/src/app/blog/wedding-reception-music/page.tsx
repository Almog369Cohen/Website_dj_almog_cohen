import type { Metadata } from "next";
import Link from "next/link";
import RelatedArticles from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
  title: "מוזיקה לקבלת פנים בחתונה — הפלייליסט המושלם | DJ אלמוג כהן",
  description:
    "מדריך מלא למוזיקה בקבלת פנים בחתונה: איזה סגנון, איזו עוצמה, ואילו שירים עובדים הכי טוב. כולל פלייליסט מומלץ מ-DJ עם 1000+ חתונות.",
  keywords: [
    "מוזיקה לקבלת פנים",
    "שירים לקבלת פנים בחתונה",
    "מוזיקת רקע לחתונה",
    "פלייליסט קבלת פנים",
    "מוזיקה לכניסת אורחים",
    "אווירה בקבלת פנים",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/blog/wedding-reception-music",
  },
};

const receptionSongs = [
  { category: "ג'אז ובוסה נובה", songs: [
    { artist: "Frank Sinatra", name: "Fly Me to the Moon" },
    { artist: "Norah Jones", name: "Come Away with Me" },
    { artist: "Michael Bublé", name: "Feeling Good" },
    { artist: "Nina Simone", name: "My Baby Just Cares for Me" },
    { artist: "Stan Getz & João Gilberto", name: "The Girl from Ipanema" },
  ]},
  { category: "ישראלי רגוע", songs: [
    { artist: "עידן רייכל", name: "מעבר לים" },
    { artist: "שלמה ארצי", name: "לפעמים הרוח" },
    { artist: "ריטה", name: "כאילו כאן" },
    { artist: "בנני פרידמן", name: "כל העולם כולו" },
    { artist: "עברי לידר", name: "ארץ מובטחת (גרסה אקוסטית)" },
  ]},
  { category: "פופ אקוסטי", songs: [
    { artist: "Ed Sheeran", name: "Perfect" },
    { artist: "John Legend", name: "All of Me" },
    { artist: "Jason Mraz", name: "I'm Yours" },
    { artist: "Jack Johnson", name: "Better Together" },
    { artist: "Adele", name: "Make You Feel My Love" },
  ]},
  { category: "לאונג' ו-Chill", songs: [
    { artist: "Café del Mar", name: "אוסף" },
    { artist: "Bonobo", name: "Kerala" },
    { artist: "Tycho", name: "Awake" },
    { artist: "Thievery Corporation", name: "Lebanese Blonde" },
    { artist: "Zero 7", name: "Destiny" },
  ]},
];

export default function WeddingReceptionMusicPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המאמר על מוזיקה לקבלת פנים ואנחנו רוצים לתכנן את המוזיקה לחתונה שלנו."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "מוזיקה לקבלת פנים בחתונה — הפלייליסט המושלם",
            description: "מדריך מלא למוזיקה בקבלת פנים בחתונה: סגנון, עוצמה, ושירים מומלצים.",
            author: { "@type": "Person", name: "DJ אלמוג כהן" },
            publisher: { "@type": "Organization", name: "Compaktt", url: "https://www.compaktt.com" },
            url: "https://www.compaktt.com/blog/wedding-reception-music",
            inLanguage: "he",
            mainEntityOfPage: "https://www.compaktt.com/blog/wedding-reception-music",
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
            <li className="text-foreground-heading">מוזיקה לקבלת פנים</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-green">
            מדריך מוזיקלי לחתונה
          </p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            מוזיקה לקבלת פנים בחתונה — הפלייליסט המושלם
          </h1>
          <p className="text-lg text-foreground-secondary leading-relaxed">
            קבלת הפנים היא הרושם הראשון של החתונה שלכם. המוזיקה הנכונה יוצרת אווירה חמימה, 
            גורמת לאורחים להרגיש בנוח, ובונה את הציפייה לערב שלפניהם. הנה הכל על איך לעשות את זה נכון.
          </p>
          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            <span>מאת: DJ אלמוג כהן</span>
            <span>•</span>
            <span>זמן קריאה: 5 דקות</span>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            🎵 למה המוזיקה בקבלת פנים כל כך חשובה?
          </h2>
          <div className="space-y-3 text-foreground-secondary leading-relaxed">
            <p>
              רוב הזוגות מתמקדים במוזיקה לרחבה — וזה הגיוני. אבל קבלת הפנים היא 45-90 דקות שקובעות 
              את הטון לכל הערב. מוזיקה חזקה מדי? האורחים עייפים עוד לפני שהתחלתם. שקט מדי? אווירה מתה.
            </p>
            <p>
              הסוד הוא <strong className="text-foreground">מוזיקת רקע ברמת עוצמה נכונה</strong> — מספיק כדי 
              ליצור אווירה, לא מספיק כדי להפריע לשיחות. זה אומנות בפני עצמה.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            📋 כללי הזהב למוזיקה בקבלת פנים
          </h2>
          <div className="space-y-3">
            {[
              { title: "עוצמה נמוכה-בינונית", desc: "האורחים צריכים לשמוע את המוזיקה אבל לדבר בנוחות. אם הם צועקים — הרגשתם." },
              { title: "סגנון עקבי", desc: "בחרו סגנון אחד ותישארו איתו. אל תקפצו מג'אז למזרחית לטראנס. עקביות = אווירה." },
              { title: "ללא שירים 'גדולים'", desc: "שמרו את הלהיטים הגדולים לרחבה. בקבלת פנים, פחות מוכר = יותר אלגנטי." },
              { title: "התאמה לסביבה", desc: "גן? בוסה נובה. אולם יוקרה? ג'אז. חצר בסגנון בוהו? אקוסטי. הסביבה קובעת." },
              { title: "בנו את האנרגיה בהדרגה", desc: "התחילו רגוע ותעלו לאט לקראת סוף הקבלה — זה יוצר ציפייה טבעית לחופה." },
            ].map((rule, i) => (
              <div key={i} className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
                <h3 className="font-bold text-foreground mb-1">{i + 1}. {rule.title}</h3>
                <p className="text-foreground-secondary text-sm">{rule.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            🎶 פלייליסט מומלץ לקבלת פנים — 20 שירים
          </h2>
          <p className="text-foreground-secondary leading-relaxed">
            הרשימה מחולקת ל-4 קטגוריות. אפשר לשלב ביניהן או לבחור קטגוריה אחת שמתאימה לסגנון שלכם.
          </p>

          {receptionSongs.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <h3 className="text-xl font-black text-foreground">{cat.category}</h3>
              <div className="overflow-hidden rounded-2xl border border-foreground/10">
                <table className="w-full">
                  <tbody>
                    {cat.songs.map((song, songIdx) => (
                      <tr key={songIdx} className="border-b border-foreground/5 last:border-0">
                        <td className="px-4 py-3 text-sm font-bold text-foreground">
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist + ' ' + song.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-blue transition inline-flex items-center gap-1"
                          >
                            {song.name}
                            <svg className="h-3 w-3 opacity-40" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.2071 14.2071L9.79289 12.7929L17.585 5H13V3H21Z"/></svg>
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground-secondary">{song.artist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            ❌ טעויות נפוצות בקבלת פנים
          </h2>
          <div className="space-y-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">לשים פלייליסט מספוטיפיי ולשכוח</h3>
              <p className="text-foreground-secondary text-sm">פלייליסט אוטומטי לא מתחשב בעוצמה, במעברים, או באווירה. DJ מקצועי מתאים בזמן אמת.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">להתחיל עם אנרגיה גבוהה</h3>
              <p className="text-foreground-secondary text-sm">אם הקבלה מרגישה כמו מסיבה, אין לאן לעלות אחר כך. שמרו את האנרגיה לרחבה.</p>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-bold text-foreground mb-1">להתעלם ממוזיקת הקבלה</h3>
              <p className="text-foreground-secondary text-sm">הרבה זוגות מתמקדים רק ברחבה. אבל 90 דקות של קבלה בלי מוזיקה טובה = אורחים משועממים.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground md:text-3xl">
            🔗 מדריכים נוספים
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/blog/chuppah-20-songs" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">20 שירי כניסה לחופה</h3>
              <p className="text-sm text-foreground-secondary">מקבלת פנים → לחופה</p>
            </Link>
            <Link href="/blog/wedding-dance-floor-songs" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">50 שירים לרחבה</h3>
              <p className="text-sm text-foreground-secondary">מהחופה → לרחבה מטורפת</p>
            </Link>
            <Link href="/blog/wedding-dj-cost" className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">כמה עולה DJ לחתונה?</h3>
              <p className="text-sm text-foreground-secondary">מדריך מחירים מלא 2025</p>
            </Link>
            <Link href="/weddings" className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-5 hover:border-brand-green transition-all">
              <h3 className="font-bold text-foreground mb-1">חתונה עם DJ אלמוג כהן</h3>
              <p className="text-sm text-foreground-secondary">כל מה שצריך לדעת</p>
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-foreground mb-3">
            רוצים שאתכנן את המוזיקה לכל הערב?
          </h2>
          <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
            מקבלת פנים ועד האפטר פארטי — אני אבנה איתכם פלייליסט מותאם אישית שיתאים בדיוק לסגנון שלכם.
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

        <RelatedArticles currentSlug="wedding-reception-music" />
      </main>
    </div>
  );
}
