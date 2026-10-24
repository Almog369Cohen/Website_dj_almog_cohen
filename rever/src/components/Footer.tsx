"use client";

import { brand, nav } from "@/content/site";
import { telLink, waLink } from "@/lib/whatsapp";
import { openDialog } from "./Dialogs";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";
import { Todo } from "./Todo";

export function Footer() {
  return (
    <footer data-scene="golden" className="theme-ivory relative px-4 pb-28 pt-16 md:px-8 md:pb-12 md:pt-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <Logo className="h-28 md:h-36" />
        <p className="mt-4 max-w-sm text-[15px] text-ink-dim">הפקת חתונות ואירועים, מהרעיון הראשון ועד השיר האחרון.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px]">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-gold"><WhatsAppIcon className="h-4 w-4 text-gold" /> וואטסאפ</a>
          <a href={telLink} className="inline-flex min-h-11 items-center gap-2"><PhoneIcon className="h-4 w-4 text-gold" /> <Todo dir="ltr">{brand.phoneDisplay}</Todo></a>
          <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-gold"><InstagramIcon className="h-4 w-4 text-gold" /> <span dir="ltr">{brand.instagramHandle}</span></a>
        </div>
        <nav aria-label="ניווט תחתון" className="mt-6 flex flex-wrap justify-center gap-x-6 text-[14px] text-ink-dim">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="inline-flex min-h-11 items-center hover:text-gold">{n.label}</a>
          ))}
        </nav>
        <div className="mt-8 w-full border-t border-line pt-6 text-[13px] text-ink-dim md:flex md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {brand.fullName}. כל הזכויות שמורות.</span>
          <span className="mt-3 flex justify-center gap-5 md:mt-0">
            <button type="button" onClick={() => openDialog("privacy")} className="min-h-11 underline-offset-4 hover:underline">מדיניות פרטיות</button>
            <button type="button" onClick={() => openDialog("a11y")} className="min-h-11 underline-offset-4 hover:underline">הצהרת נגישות</button>
          </span>
        </div>
      </div>
    </footer>
  );
}
