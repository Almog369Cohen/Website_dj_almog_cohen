"use client";

import { useEffect, useRef } from "react";
import { brand, nav } from "@/content/site";
import { telLink, waLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => e.target === d && d.close();
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  return (
    <footer className="relative border-t border-line pt-20 pb-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="select-none text-center font-display text-[22vw] font-bold leading-none tracking-[0.1em] text-transparent [-webkit-text-stroke:1px_rgba(217,178,111,0.25)] md:text-[16vw]" dir="ltr" aria-hidden="true">
          REVER
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-dim">ניהול והפקת אירועים מקצה לקצה. {brand.city}, ובכל הארץ.</p>
          </div>
          <nav aria-label="ניווט תחתון" className="grid grid-cols-2 gap-3 text-sm">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-ink-dim hover:text-gold">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 text-sm">
            <a href={telLink} className="hover:text-gold" dir="ltr">{brand.phoneDisplay}</a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold">וואטסאפ</a>
            <button type="button" onClick={() => dialog.current?.showModal()} className="w-fit text-ink-dim underline-offset-4 hover:text-gold hover:underline">
              הצהרת נגישות
            </button>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-ink-dim md:flex-row">
          <span>© {new Date().getFullYear()} {brand.fullName}. כל הזכויות שמורות.</span>
          <span>עוצב ונבנה באהבה ✦</span>
        </div>
      </div>

      <dialog ref={dialog} className="m-auto max-w-lg rounded-3xl border border-line bg-bg-soft p-0 text-ink backdrop:bg-bg/80 backdrop:backdrop-blur" aria-labelledby="a11y-title">
        <div className="p-8">
          <h2 id="a11y-title" className="font-display text-2xl font-bold text-gold">הצהרת נגישות</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-dim">
            <p>{brand.fullName} רואה חשיבות רבה בהנגשת האתר לכלל הגולשים, כולל אנשים עם מוגבלות.</p>
            <p>האתר נבנה בהתאם להנחיות WCAG 2.1 ברמה AA ותקן ישראלי 5568: ניווט מלא במקלדת, תמיכה בקוראי מסך, ניגודיות צבעים גבוהה, טקסט חלופי לתמונות וכיבוד העדפת &quot;הפחתת תנועה&quot; של מערכת ההפעלה.</p>
            <p>נתקלתם ברכיב שאינו נגיש? נשמח לשמוע ולתקן: <a href={telLink} className="text-gold" dir="ltr">{brand.phoneDisplay}</a></p>
          </div>
          <form method="dialog">
            <button className="btn-gold mt-6 rounded-full px-6 py-3 font-bold">סגירה</button>
          </form>
        </div>
      </dialog>
    </footer>
  );
}
