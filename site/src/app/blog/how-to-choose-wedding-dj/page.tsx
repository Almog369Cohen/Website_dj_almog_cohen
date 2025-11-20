import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "איך לבחור DJ לחתונה: 5 שאלות חובה לפני שסוגרים | DJ אלמוג כהן",
  description:
    "מדריך חובה לזוגות לפני סגירת DJ לחתונה: 5 שאלות מפתח שיעזרו לכם לבחור תקליטן מקצועי שמתאים לאירוע שלכם.",
};

export default function HowToChooseWeddingDJPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, קראנו את המאמר על בחירת DJ לחתונה ורוצים לבדוק תאריך ולדבר על האירוע שלנו."
  );

  return (
    <div className="text-brand-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 md:py-16">
        {/* Breadcrumb */}
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
            <li className="text-white">איך לבחור DJ לחתונה</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/80">
            מדריך לזוגות
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            איך לבחור DJ לחתונה: 5 שאלות חובה לפני שסוגרים
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            בחירת ה-DJ לחתונה היא אחת ההחלטות הקריטיות ביותר לאירוע שלכם. DJ טוב יכול
            להפוך רחבה מנומנמת למסיבה שלא נגמרת. DJ פחות טוב... ובכן, אתם לא רוצים לגלות.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">קטגוריה: חתונות</span>
            <span className="rounded-full border border-white/10 px-3 py-1">זמן קריאה: ~8 דקות</span>
          </div>
        </header>

        {/* Article body */}
        <article className="space-y-10 rounded-3xl border border-white/10 bg-black/60 p-6 leading-relaxed text-sm shadow-2xl shadow-black/40 backdrop-blur-md md:p-8 md:text-base">
          <section className="space-y-4">
            <p>
              המדריך הזה נועד לעזור לכם להגיע לפגישת הייעוץ עם ה-DJ חכמים יותר, חדים יותר,
              ובעיקר – עם השאלות הנכונות. הנה 5 שאלות שאסור לכם לשכוח לשאול, שיעזרו לכם
              להבטיח שהאירוע שלכם בידיים המקצועיות ביותר.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">1. "מהי פילוסופיית האירוע שלך?"</h2>
            <p>
              רוב התקליטנים יגידו "אני קורא את הקהל". וזה נכון – זו נקודת בסיס חשובה. אבל
              מאחורי כל DJ מקצועי צריכה לעמוד גישה ברורה לאיך הוא רואה ערב שלם.
            </p>
            <p className="font-semibold text-brand-blue">
              מה לבדוק:
            </p>
            <p>
              האם הוא מאמין בבניית סיפור מוזיקלי הדרגתי? האם הוא מתמחה במיקסים חלקים או
              במעברים חדים ומקפיצים? DJ מקצועי צריך להציג לכם פילוסופיה: איך הערב נבנה
              מקבלת הפנים, דרך החופה והסלואו, ועד האפטר פארטי.
            </p>
            <p>
              ואם אתם רוצים לשמוע איך אני בונה את הערב שלכם מהחופה ועד האפטר – זו בדיוק השיחה
              שנעשה ביחד בפגישת הייעוץ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">2. "איך מתנהל תהליך הליווי המוזיקלי?"</h2>
            <p>
              השירות האמיתי של DJ פרימיום הוא הליווי, לא רק התקלוט. אירוע טוב מתחיל הרבה לפני
              שפותחים את הרחבה.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              כמה פגישות מקדימות תעברו? האם ה-DJ מגיע עם שאלון מפורט על טעמים מוזיקליים,
              "שחורים" ו"לבנים"? האם יש לו תוכנית גיבוי לניהול אירועים בלתי צפויים (כמו
              דחיית סלואו או שינוי בלוח הזמנים)? תהליך מסודר ומפורט הוא סימן למקצוענות אמיתית.
            </p>
            <p>
              אם חשוב לכם לדעת שיש מי שמחזיק אתכם יד ביד עד הערב עצמו, אני מזמין אתכם לפגישה
              קצרה שבה נעבור יחד על כל התהליך, בלי להשאיר סימני שאלה.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">3. "מהם הציוד והגיבוי שאתה מביא?"</h2>
            <p>
              מאסטריות מוזיקלית שווה אפס אם הציוד נכשל ברגע האמת. ציוד מקצועי הוא הבסיס לחוויית
              סאונד נקייה, מאוזנת וחזקה.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              האם הציוד הוא ציוד מקצועי של מותגים מוכרים (Pioneer למשל)? האם יש ציוד גיבוי
              מלא – קונטרולר נוסף, מחשב רזרבי, פתרון לגיבוי חשמל? ל-DJ מוביל יש תמיד תוכנית
              רזרבית, כדי למנוע דממת אלחוט ברחבה.
            </p>
            <p>
              הרבה זוגות מגלים רק בדקה ה-90 מה באמת כלול בציוד. בשיחה איתי נעבור יחד על כל מה
              שמגיע לחתונה שלכם – מהעמדה ועד הרחבה – כדי שתדעו שהכול מכוסה.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">4. "האם יש לך ניסיון עם הבידול המוזיקלי הספציפי שלנו?"</h2>
            <p>
              לכל זוג יש את ה-DNA המוזיקלי שלו: משילוב של מוזיקת עולם וטכנו מלודי, ועד מיינסטרים
              ישראלי כבד או חפלות ים תיכוניות.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              בקשו דוגמאות למיקסים או וידאו שקרובים לסגנון שלכם. אם אתם משלבים נגן חי
              (סקסופון, כלי הקשה, כנר), ודאו שה-DJ מתורגל בעבודה מול נגנים ויודע לנהל נכון את
              האנרגיות בין הבמה לרחבה.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">5. "איך אתה מנהל רגעי שיא ורגעים שקטים?"</h2>
            <p>
              DJ טוב יודע להרים. DJ מומחה יודע גם מתי להוריד, לתת לנשום – ואז לבנות מחדש.
              חתונה מורכבת מרגעי שיא, רגעים אינטימיים וקטעים של אווירה.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              איך ה-DJ מנהל את המעבר מהחופה, דרך הסלואו, ועד לחלק המסיבתי? האם הוא יודע לשלב
              שירי חתונה קלאסיים עם מיינסטרים מודרני בלי לשבור את הווייב? החוכמה היא לשמור על
              רצף רגשי ומוזיקלי – לא רק על רשימת השמעה טובה.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">6. "איך נראה תהליך התקשורת לפני ואחרי האירוע?"</h2>
            <p>
              DJ טוב לא מופיע רק בערב החתונה – הוא מלווה אתכם מהשיחה הראשונה ועד הרגע האחרון.
              חשוב להבין איך נראית התקשורת, מי זמין אליכם וכמה אתם מרגישים שיש מי שמחזיק אתכם
              בדרך.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              כמה פגישות או שיחות מתוכננות לפני האירוע? האם ה-DJ זמין בווטסאפ לאורך הדרך? האם יש
              ליווי גם בשבוע החתונה עצמו, כשיש הכי הרבה שאלות ולחץ? שירות איכותי מרגיע אתכם עוד
              לפני שהשיר הראשון מתחיל להתנגן.
            </p>
            <p>
              אם אתם מרגישים שתקשורת פתוחה וזמינה זה משהו חשוב לכם, אני אשמח שתכתבו לי ב-WhatsApp
              או תקבעו שיחה, ונראה אם אני ה-DJ הנכון להחזיק אתכם לאורך הדרך.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">7. "האם אתה עובד עם נגנים / ספקים נוספים באירוע?"</h2>
            <p>
              הרבה זוגות משלבים היום סקסופון, כלי הקשה, זמר אורח או להקה בחופה. שילוב נכון בין DJ
              לנגנים חיים יכול להרים את האירוע, אבל דורש ניסיון ותיאום מדויק.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              האם ל-DJ יש ניסיון בעבודה עם נגנים ועם ספקים נוספים (להקה, הפקה, תאורה)? האם הוא
              יודע להוביל חזרות קצרות ביום האירוע ולהסביר לכולם איך זה הולך להישמע? DJ מנוסה
              בונה איתם שפה משותפת מראש, כדי שלא תאבדו רגעי שיא בגלל חוסר תיאום.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">8. "איך אתה מתמודד עם בקשות בזמן אמת מרחבת הריקודים?"</h2>
            <p>
              תמיד יהיו אורחים שיגיעו לעמדה עם בקשות – לפעמים זה שיר גאוני, ולפעמים זה שיר שיכול
              להפיל את האנרגיה. אתם רוצים DJ שמכבד את כולם, אבל קודם כל שומר על הרחבה.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              איך הוא מגיב לבקשות שלא מתאימות לרגע? האם הוא יודע לומר "לא עכשיו" בצורה מכבדת?
              האם הוא יודע לשלב בקשות של משפחה וחברים בלי לשבור את הקו המוזיקלי של הערב? DJ
              מנוסה תמיד שם את טובת הרחבה לפני הכול – אבל בלי לייצר אנטי.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold md:text-xl">9. "איך נראית הצעת המחיר ומה היא כוללת?"</h2>
            <p>
              הצעת מחיר מסודרת היא עוד סימן למקצוענות. היא עוזרת לכם להבין בדיוק על מה אתם
              משלמים, מה כלול ומה נחשב אקסטרה – בלי הפתעות בדקה ה-90.
            </p>
            <p className="font-semibold text-brand-blue">מה לבדוק:</p>
            <p>
              האם המחיר כולל ציוד סאונד ותאורה? האם יש תוספת לשעות נוספות, נסיעות או ציוד מיוחד?
              האם הכל כתוב ומסודר בחוזה ברור? שקיפות מראש חוסכת אי נעימויות ומאפשרת לכם לסגור עם
              ביטחון.
            </p>
            <p>
              אם בא לכם לקבל הצעת מחיר מסודרת, בלי כוכביות ובלי אותיות קטנות, שלחו לי הודעה
              קצרה ב-WhatsApp עם תאריך ולוקיישן – ואחזיר לכם הצעה ברורה עם כל מה שצריך לדעת.
            </p>
          </section>

          <section className="space-y-3 border-r-4 border-brand-blue pr-4 text-sm md:text-base">
            <h2 className="text-lg font-semibold md:text-xl">לסיכום: לבחור DJ שהוא שותף לאירוע</h2>
            <p>
              מעבר לפלייליסט ולציוד, אתם רוצים לבחור אדם שתרגישו איתו חיבור אישי, מישהו שמקשיב
              לכם באמת, ושמביא איתו ניסיון, שקט וביטחון. התשובות לשאלות האלו צריכות לשדר לכם
              מקצוענות, שקיפות ותשוקה אמיתית למוזיקה שלכם.
            </p>
            <p>
              אם התחברתם לגישה הזו, אשמח לשבת איתכם לפגישת ייעוץ לא מחייבת, להכיר אתכם, ולהבין
              יחד מה הופך את הרחבה שלכם לבלתי נשכחת.
            </p>
          </section>
        </article>

        {/* CTA */}
        <section className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-black/85 via-black/70 to-brand-blue/25 p-6 text-sm text-white/85 shadow-xl shadow-black/40 md:text-base">
          <h2 className="mb-2 text-lg font-semibold md:text-xl">
            רוצים לבדוק אם אני פנוי לתאריך שלכם?
          </h2>
          <p className="mb-4 text-white/80">
            השאירו פרטים בטופס באתר או שלחו לי הודעת WhatsApp, ואחזור אליכם עם זמינות, רעיונות
            מוזיקליים והתאמה אישית לאירוע שלכם.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              לטופס יצירת קשר
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
            >
              לבדוק תאריך ב-WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
