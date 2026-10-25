import { pages } from "@/content/routes";
import { brand } from "@/content/site";
import { Closing, PageHero } from "@/components/sections";
import { Todo } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

const m = pages.privacy;
export const metadata = pageMetadata(m);

export default function Privacy() {
  return (
    <>
      <main id="main" data-wa="קראתי את מדיניות הפרטיות באתר">
        <PageHero title="מדיניות פרטיות" crumbs={[{ name: "בית", path: "/" }, { name: "מדיניות פרטיות", path: m.path }]} cta={false} />
        <div className="page-body wrap">
          <div className="prose">
            <p className="updated">עודכן ב-25 באוקטובר 2026</p>
            <h2>מי אחראי על המידע</h2>
            <p>{brand.nameHe} ({brand.fullName}). לפניות בנושא פרטיות: <Todo>כתובת מייל של REVER</Todo>.</p>
            <h2>איזה מידע נאסף</h2>
            <ul>
              <li>מה שאתם כותבים בטופס: שם, טלפון, סוג האירוע, ואם בחרתם גם מתי ופרטים נוספים.</li>
              <li>מאיפה הגעתם לאתר (למשל אינסטגרם או גוגל) ואיזה חלק באתר ראיתם כששלחתם, כדי שנדע על מה לדבר איתכם.</li>
              <li>מדידת שימוש באתר (Google Analytics), רק אם אישרתם עוגיות.</li>
            </ul>
            <h2>למה ומה עושים איתו</h2>
            <p>רק כדי לחזור אליכם לגבי האירוע שלכם. אנחנו לא מוכרים את המידע ולא מעבירים אותו לאחרים לשיווק.</p>
            <h2>איפה הוא נשמר</h2>
            <p>הפנייה נשלחת אלינו בוואטסאפ, ונשמרת גם ב: <Todo>היעד שנבחר לשמירת לידים</Todo>.</p>
            <h2>הזכויות שלכם</h2>
            <p>לפי חוק הגנת הפרטיות (כולל תיקון 13) אפשר לבקש לעיין במידע שלכם, לתקן אותו או למחוק אותו. כתבו לנו לכתובת שלמעלה.</p>
            <h2>עוגיות</h2>
            <p>האתר משתמש בעוגיות מדידה רק אחרי שאישרתם בפס ההסכמה. אפשר לבטל בכל רגע במחיקת נתוני האתר בדפדפן.</p>
          </div>
        </div>
      </main>
      <Closing />
    </>
  );
}
