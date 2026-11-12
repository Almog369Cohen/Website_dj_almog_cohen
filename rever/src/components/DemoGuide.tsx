"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const KEY = "rever-demo-guide-hidden";

/** מצב דמו בלבד: סיור קצר למי שבודק את המערכת (גל וליאל), כדי שהבדיקה תהיה עצמאית */
export function DemoGuide() {
  const { mode, me } = useStore();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  if (mode !== "demo" || hidden) return null;
  const hide = () => {
    setHidden(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };
  return (
    <div className="card guide">
      <h2>
        👋 סיור קצר לבדיקה
        <button className="r muted" onClick={hide} aria-label="הסתרת הסיור">
          הסתרה ✕
        </button>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginBottom: 10 }}>
        זה דמו עם 3 לקוחות לדוגמה. הנתונים נשמרים רק בדפדפן הזה, אפשר לשחק חופשי.
      </p>
      <ol>
        <li>
          <b>צוות והרשאות:</b> קודים גל 1111 · ליאל 2222 (מאסטר) · ארד 3333 · ספיר 4444. לוחצים &quot;החלפה&quot; ורואים מה כל אחד רואה
          {me?.role === "admin" ? " (למשל: ספיר לא רואה סכומים)" : ""}.
        </li>
        <li>
          <b>ליד חדש:</b> <Link href="/leads/view?id=l1">דנה ויובל</Link>: שולחים הודעת היכרות מתבנית, וקובעים פולואפ.
        </li>
        <li>
          <b>אירוע סגור:</b> <Link href="/events/view?id=l3">שירן ועומר</Link>: לו״ז, ספקים, הכנה, משימות הזוג ותשלומים.
        </li>
        <li>
          <b>מה הלקוח רואה:</b>{" "}
          <Link href="/e" target="_blank">
            פותחים את דף הלקוח
          </Link>{" "}
          ונכנסים עם טלפון <b dir="ltr">050-0000003</b> וקוד <b dir="ltr">482913</b>. מסמנים משימה, וחוזרים לכרטיס האירוע לראות שזה נרשם.
        </li>
        <li>
          <b>כספים:</b> <Link href="/finance">יתרות, תשלומים שמגיעים, ורווח לכל אירוע</Link> (הרווח רק למאסטר).
        </li>
        <li>
          <b>להתחיל מחדש:</b> <Link href="/settings">הגדרות</Link> ← &quot;החזרת נתוני דוגמה&quot;.
        </li>
      </ol>
    </div>
  );
}
