"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/site";
import { telLink } from "@/lib/whatsapp";
import { Todo } from "./Todo";

type Kind = "privacy" | "a11y";
const EVENT = "rever:dialog";

export function openDialog(kind: Kind) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: kind }));
}

const UPDATED = "אוקטובר 2026";

/** Privacy policy and accessibility statement, opened from the form and the footer. */
export function Dialogs() {
  const ref = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>("privacy");

  useEffect(() => {
    const onOpen = (e: Event) => {
      setKind((e as CustomEvent<Kind>).detail);
      ref.current?.showModal();
    };
    const d = ref.current;
    const onClick = (e: MouseEvent) => e.target === d && d?.close();
    window.addEventListener(EVENT, onOpen);
    d?.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(EVENT, onOpen);
      d?.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <dialog ref={ref} className="theme-ivory m-auto max-h-[85dvh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-[16px] border border-line p-0 backdrop:bg-black/60" aria-labelledby="dlg-title">
      <div className="p-6 md:p-8">
        {kind === "privacy" ? (
          <>
            <h2 id="dlg-title" className="font-display text-2xl font-medium">מדיניות פרטיות</h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-dim">
              <p>כשאתם ממלאים את הטופס באתר, אנחנו מקבלים את השם, הטלפון ופרטי האירוע שכתבתם. אנחנו משתמשים בהם רק כדי לחזור אליכם ולתאם את ההפקה.</p>
              <p>הפרטים נשלחים אלינו בוואטסאפ, ואם הוגדר שירות טפסים, גם לתיבת הפניות שלנו. איננו מוכרים או מעבירים אותם לגורם אחר לצורכי שיווק.</p>
              <p>אם הסכמתם לעוגיות מדידה, האתר משתמש ב-Google Analytics ובפיקסל של Meta כדי להבין מאיפה מגיעים מבקרים. אפשר לסרב, והאתר יעבוד כרגיל.</p>
              <p>אפשר לבקש לעיין בפרטים שלכם, לתקן אותם או למחוק אותם. פנו אלינו: <a href={telLink}><Todo dir="ltr">{brand.phoneDisplay}</Todo></a>, מייל: <Todo>להשלים</Todo></p>
              <p>עודכן: {UPDATED}</p>
            </div>
          </>
        ) : (
          <>
            <h2 id="dlg-title" className="font-display text-2xl font-medium">הצהרת נגישות</h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-dim">
              <p>{brand.fullName} פועלת להנגשת האתר לכלל הגולשים, כולל אנשים עם מוגבלות, לפי התקן הישראלי 5568 והנחיות WCAG 2.1 ברמה AA.</p>
              <p>מה כבר עשינו: ניווט מלא במקלדת, טקסט חלופי לתמונות, כותרות מסודרות, תוויות לשדות הטופס, וכיבוד ההגדרה ״הפחתת תנועה״ במכשיר (הסרטון נעצר).</p>
              <p>מגבלות ידועות: סרטון הפתיחה הוא קישוטי וללא קול. חלק מהטקסטים מופיעים על גבי תמונות.</p>
              <p>רכז/ת נגישות: <Todo>להשלים</Todo>. טלפון: <a href={telLink}><Todo dir="ltr">{brand.phoneDisplay}</Todo></a>. מייל: <Todo>להשלים</Todo></p>
              <p>עודכן: {UPDATED}</p>
            </div>
          </>
        )}
        <form method="dialog">
          <button className="mt-6 min-h-11 rounded-full bg-[#2a2118] px-6 text-[15px] text-[#f6f0e6]">סגירה</button>
        </form>
      </div>
    </dialog>
  );
}
