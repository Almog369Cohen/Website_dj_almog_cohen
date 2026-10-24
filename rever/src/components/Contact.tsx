"use client";

import Image from "next/image";
import { useState } from "react";
import { brand, contact } from "@/content/site";
import { openWhatsApp, sendLead, track } from "@/lib/analytics";
import { telLink, waLink } from "@/lib/whatsapp";
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { openDialog } from "./Dialogs";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

const label = "mb-1.5 block text-[13px] font-medium text-[#e8cfa0]";
const field =
  "w-full rounded-[10px] border border-[#f6f0e6]/25 bg-[#f6f0e6]/[0.07] px-4 py-3 text-[16px] text-[#f6f0e6] placeholder:text-[#f6f0e6]/50 outline-none transition-colors focus:border-[#d9b26f] focus:bg-[#f6f0e6]/[0.1]";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const lines = [
      "היי REVER, השארתי פרטים באתר.",
      `שם: ${d.name}`,
      `טלפון: ${d.phone}`,
      `סוג אירוע: ${d.type}`,
      d.when ? `מתי: ${d.when}` : "",
      d.guests ? `מספר אורחים: ${d.guests}` : "",
      d.message ? `פרטים: ${d.message}` : "",
    ].filter(Boolean);
    track("generate_lead", { type: d.type });
    void sendLead(d);
    setSent(true);
    openWhatsApp(waLink(lines.join("\n")));
  };

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-20 text-[#f6f0e6] md:px-10 md:py-32">
      <Image src={contact.image} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[#0e0c0a]/65" />
      <div className="relative mx-auto grid max-w-7xl items-end gap-8 md:grid-cols-2 md:gap-x-16 md:gap-y-8">
        <Reveal>
          <SectionKicker>{contact.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08] [text-wrap:balance]">
            {contact.title}
            <span className="block text-[#d9b26f]">{contact.titleAccent}</span>
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-[#f6f0e6]/90">{contact.subtitle}</p>
        </Reveal>

        <Reveal className="order-last md:order-none md:col-start-1 md:row-start-2 md:self-start">
          <ul className="flex flex-col text-[16px]">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track("click_whatsapp", { location: "contact" })} className="inline-flex min-h-11 items-center gap-3 hover:text-[#e8cfa0]">
                <WhatsAppIcon className="h-5 w-5 text-[#d9b26f]" /> שלחו לנו הודעה בוואטסאפ
              </a>
            </li>
            <li>
              <a href={telLink} onClick={() => track("click_call", { location: "contact" })} className="inline-flex min-h-11 items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-[#d9b26f]" /> <Todo dir="ltr">{brand.phoneDisplay}</Todo>
              </a>
            </li>
            <li>
              <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-[#e8cfa0]">
                <InstagramIcon className="h-5 w-5 text-[#d9b26f]" /> <span dir="ltr">{brand.instagramHandle}</span>
              </a>
            </li>
            <li className="inline-flex min-h-11 items-center gap-3">
              <PinIcon className="h-5 w-5 text-[#d9b26f]" /> <Todo>{brand.addressPlaceholder}</Todo>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="md:col-start-2 md:row-span-2 md:row-start-1">
          <form onSubmit={onSubmit} className="glass-dark rounded-[20px] p-5 md:p-9">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="c-name">שם מלא *</label>
                <input id="c-name" name="name" required autoComplete="name" enterKeyHint="next" className={field} />
              </div>
              <div>
                <label className={label} htmlFor="c-phone">טלפון *</label>
                <input id="c-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel" enterKeyHint="next" pattern="[0-9+\-\s]{9,15}" title="מספר טלפון, לפחות 9 ספרות" dir="ltr" className={`${field} text-right`} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="c-type">סוג האירוע *</label>
                <select id="c-type" name="type" required defaultValue="" className={`${field} [color-scheme:dark]`}>
                  <option value="" disabled>בחרו</option>
                  {contact.eventTypes.map((t) => (
                    <option key={t} value={t} className="bg-[#0e0c0a]">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <details className="group mt-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[15px] text-[#e8cfa0] [&::-webkit-details-marker]:hidden">
                פרטים נוספים (לא חובה)
                <span className="transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <fieldset className="sm:col-span-2">
                  <legend className={label}>מתי האירוע?</legend>
                  <div className="flex flex-wrap gap-2">
                    {contact.when.map((w) => (
                      <label key={w} className="cursor-pointer">
                        <input type="radio" name="when" value={w} className="peer sr-only" />
                        <span className="inline-flex min-h-10 items-center rounded-full border border-[#f6f0e6]/25 px-4 text-[14px] peer-checked:border-[#d9b26f] peer-checked:bg-[#d9b26f]/20 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#d9b26f]">
                          {w}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="c-guests">מספר אורחים משוער</label>
                  <input id="c-guests" name="guests" type="text" inputMode="numeric" pattern="[0-9]*" enterKeyHint="next" className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="c-msg">ספרו לנו על האירוע</label>
                  <textarea id="c-msg" name="message" rows={3} maxLength={600} enterKeyHint="send" className={`${field} resize-none`} />
                </div>
              </div>
            </details>

            <button type="submit" className="btn-gold mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full text-[16px] font-medium">
              <WhatsAppIcon className="h-4 w-4" /> שליחה בוואטסאפ
            </button>
            <p className="mt-4 text-center text-[13px] leading-relaxed text-[#f6f0e6]/80" role="status">
              {sent ? "פתחנו לכם וואטסאפ עם הפרטים. נשאר רק ללחוץ שליחה." : "ללא התחייבות. "}
              {!sent && (
                <>
                  הפרטים משמשים רק לחזרה אליכם.{" "}
                  <button type="button" onClick={() => openDialog("privacy")} className="underline underline-offset-4">
                    מדיניות פרטיות
                  </button>
                </>
              )}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
