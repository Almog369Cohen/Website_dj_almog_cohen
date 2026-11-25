"use client";

import Link from "next/link";
import { useState } from "react";
import { consult, contactCopy, whatsapp } from "@/content/site";
import { openWhatsApp, sendLead, track } from "@/lib/analytics";
import { leadFromForm, leadMessage, looksLikePhone } from "@/lib/lead";
import { waHref } from "@/lib/whatsapp";
import { CalIcon } from "./Consult";
import { WaIcon } from "./ui";

type Status = "idle" | "missing" | "phone" | "sending" | "saved" | "whatsapp";

/**
 * The consultation form. Three required fields. With a lead endpoint the lead is saved and the couple
 * sees a thank-you; without one (today), WhatsApp opens with every detail, so no lead is ever lost.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [link, setLink] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (d.website) return; // the hidden honeypot: a person never fills it
    const lead = leadFromForm(d);
    if (!lead) return setStatus("missing");
    if (!looksLikePhone(lead.phone)) return setStatus("phone");
    setStatus("sending");
    const url = waHref(leadMessage(lead, whatsapp.greeting));
    setLink(url);
    track("generate_lead", { type: lead.eventType });
    if (await sendLead(lead)) {
      setStatus("saved");
      return;
    }
    setStatus("whatsapp");
    openWhatsApp(url);
  };

  if (status === "saved") {
    return (
      <div className="consult-done" role="status">
        <p className="done-title">קיבלנו. זה מתחיל.</p>
        <p>גל וליאל יחזרו אליכם לתאם את שיחת הייעוץ. רוצים מהר יותר? שלחו לנו גם הודעה.</p>
        <a className="link-quiet" href={link} target="_blank" rel="noopener"><WaIcon />לשלוח גם בוואטסאפ</a>
      </div>
    );
  }

  return (
    <form className="consult-form" onSubmit={onSubmit} noValidate aria-describedby="formNote">
      <input className="honey" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="field-row">
        <label htmlFor="f-name">שם מלא</label>
        <input id="f-name" name="name" autoComplete="name" required enterKeyHint="next" />
      </div>
      <div className="field-row">
        <label htmlFor="f-phone">טלפון</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" style={{ textAlign: "right" }} required enterKeyHint="next" aria-invalid={status === "phone" || undefined} />
      </div>
      <div className="field-pair">
        <div className="field-row">
          <label htmlFor="f-type">סוג האירוע</label>
          <select id="f-type" name="type" required defaultValue="">
            <option value="" disabled>בחרו</option>
            {contactCopy.eventTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="f-when">מתי האירוע</label>
          <input id="f-when" name="when" placeholder="למשל: יוני הבא" enterKeyHint="next" />
        </div>
      </div>
      <fieldset className="field-row times">
        <legend>מתי נוח לכם שנתקשר?</legend>
        <div className="chips">
          {contactCopy.callTimes.map((t, i) => (
            <label key={t} className="chip">
              <input type="radio" name="callTime" value={t} defaultChecked={i === contactCopy.callTimes.length - 1} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field-row">
        <label htmlFor="f-msg">משהו שחשוב לכם שנדע (לא חובה)</label>
        <textarea id="f-msg" name="message" rows={2} maxLength={600} />
      </div>
      <button className="btn-gold btn-big" type="submit" disabled={status === "sending"}>
        <CalIcon />
        {status === "sending" ? "שולחים..." : consult.submit}
      </button>
      <p className="fine" id="formNote" role="status">
        {status === "missing" && "חסר שם, טלפון או סוג אירוע. מלאו אותם ונסו שוב."}
        {status === "phone" && "מספר הטלפון לא נראה תקין. בדקו אותו ונסו שוב."}
        {status === "whatsapp" && (
          <>
            פתחנו לכם וואטסאפ עם כל הפרטים. נשאר רק ללחוץ שליחה.{" "}
            <a className="link-quiet" href={link} target="_blank" rel="noopener">לא נפתח? לחצו כאן</a>
          </>
        )}
        {(status === "idle" || status === "sending") && (
          <>
            {consult.promise} הפרטים משמשים רק לחזרה אליכם. <Link href="/privacy/">מדיניות פרטיות</Link>
          </>
        )}
      </p>
    </form>
  );
}
