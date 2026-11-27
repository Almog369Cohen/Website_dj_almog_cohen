import { pages } from "@/content/routes";
import { Closing, PageHero } from "@/components/sections";
import { Todo } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

const m = pages.accessibility;
export const metadata = pageMetadata(m);

export default function Accessibility() {
  return (
    <>
      <main id="main" data-wa="קראתי את הצהרת הנגישות באתר">
        <PageHero title="הצהרת נגישות" crumbs={[{ name: "בית", path: "/" }, { name: "הצהרת נגישות", path: m.path }]} cta={false} />
        <div className="page-body wrap">
          <div className="prose">
            <p className="updated">עודכן ב-25 באוקטובר 2026</p>
            <h2>מה עשינו</h2>
            <p>האתר נבנה לפי תקן ישראלי 5568, ברמה AA של הנחיות WCAG.</p>
            <ul>
              <li>אפשר לעבור על כל האתר במקלדת, וכל רכיב שמקבל מיקוד מסומן בקו זהב.</li>
              <li>לכל תמונה יש תיאור לקורא מסך, והאתר כתוב בעברית מימין לשמאל.</li>
              <li>ניגודיות של 4.5:1 לפחות בין הטקסט לרקע.</li>
              <li>מי שביקש במכשיר להפחית תנועה מקבל אתר בלי אנימציות גלילה.</li>
              <li>לסרטון הפתיחה יש כפתור עצירה.</li>
            </ul>
            <h2>מה עוד לא מושלם</h2>
            <p>אם מצאתם משהו שלא עובד בשבילכם, נשמח לשמוע ולתקן.</p>
            <h2>רכז/ת הנגישות</h2>
            <p><Todo>שם, טלפון ומייל של רכז/ת הנגישות ב-REVER</Todo></p>
          </div>
        </div>
      </main>
      <Closing />
    </>
  );
}
