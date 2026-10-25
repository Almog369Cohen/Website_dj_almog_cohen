"use client";

import Link from "next/link";
import { useState } from "react";
import { contactCopy, whatsapp } from "@/content/site";
import { openWhatsApp, sendLead, track } from "@/lib/analytics";
import { waHref } from "@/lib/whatsapp";
import { WaIcon } from "./ui";

/** Three required fields. The lead is saved first, then WhatsApp opens with every detail in the message. */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "missing" | "sent">("idle");
  const [link, setLink] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (d.website) return;
    if (!d.name?.trim() || !d.phone?.trim() || !d.type) {
      setStatus("missing");
      return;
    }
    const lines = [
      `${whatsapp.greeting.trim()} השארתי פרטים באתר.`,
      `שם: ${d.name.trim()}`,
      `טלפון: ${d.phone.trim()}`,
      `סוג אירוע: ${d.type}`,
      d.when ? `מתי: ${d.when}` : "",
      d.message?.trim() ? `פרטים: ${d.message.trim()}` : "",
    ].filter(Boolean);
    const url = waHref(lines.join("\n"));
    track("generate_lead", { type: d.type });
    await sendLead(d);
    setLink(url);
    setStatus("sent");
    openWhatsApp(url);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <input className="honey" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="field-row">
        <label htmlFor="f-name">שם מלא</label>
        <input id="f-name" name="name" autoComplete="name" required enterKeyHint="next" />
      </div>
      <div className="field-row">
        <label htmlFor="f-phone">טלפון</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" style={{ textAlign: "right" }} required enterKeyHint="next" />
      </div>
      <div className="field-row">
        <label htmlFor="f-type">סוג האירוע</label>
        <select id="f-type" name="type" required defaultValue="">
          <option value="" disabled>בחרו</option>
          {contactCopy.eventTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field-row">
        <label htmlFor="f-when">מתי האירוע (לא חובה)</label>
        <input id="f-when" name="when" placeholder="למשל: יוני הבא" enterKeyHint="next" />
      </div>
      <div className="field-row">
        <label htmlFor="f-msg">ספרו לנו על האירוע (לא חובה)</label>
        <textarea id="f-msg" name="message" rows={3} maxLength={600} />
      </div>
      <button className="btn-gold" type="submit"><WaIcon />שליחה לגל וליאל בוואטסאפ</button>
      <p className="fine" role="status">
        {status === "missing" && "חסר שם, טלפון או סוג אירוע. מלאו אותם ונסו שוב."}
        {status === "sent" && (
          <>
            פתחנו לכם וואטסאפ עם הפרטים. נשאר רק ללחוץ שליחה.{" "}
            <a className="link-quiet" href={link} target="_blank" rel="noopener">לא נפתח? לחצו כאן</a>
          </>
        )}
        {status === "idle" && (
          <>
            ללא התחייבות. הפרטים משמשים רק לחזרה אליכם. <Link href="/privacy/">מדיניות פרטיות</Link>
          </>
        )}
      </p>
    </form>
  );
}
