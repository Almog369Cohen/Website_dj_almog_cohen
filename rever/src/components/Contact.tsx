"use client";

import Image from "next/image";
import { useState } from "react";
import { brand, contact } from "@/content/site";
import { telLink, waLink } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

const field =
  "w-full rounded-none border-0 border-b border-[#f6f0e6]/30 bg-transparent px-1 py-3 text-[16px] text-[#f6f0e6] placeholder:text-[#f6f0e6]/55 outline-none transition-colors focus:border-[#d9b26f]";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const lines = [
      "היי REVER, השארתי פרטים באתר.",
      `שם: ${d.get("name")}`,
      `טלפון: ${d.get("phone")}`,
      `סוג אירוע: ${d.get("type")}`,
      d.get("date") ? `מתי: ${d.get("date")}` : "",
      d.get("guests") ? `מספר אורחים: ${d.get("guests")}` : "",
      d.get("message") ? `פרטים: ${d.get("message")}` : "",
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-24 text-[#f6f0e6] md:px-10 md:py-36">
      <Image src={contact.image} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[#0e0c0a]/60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <SectionKicker>{contact.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08]">
            {contact.title}
            <span className="block text-[#d9b26f]">{contact.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-md text-[17px] font-light leading-[1.8] text-[#f6f0e6]/85">{contact.subtitle}</p>
          <div className="mt-10 flex flex-col gap-4 text-[16px]">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-3 hover:text-[#e8cfa0]">
              <WhatsAppIcon className="h-5 w-5 text-[#d9b26f]" /> שלחו לנו הודעה בוואטסאפ
            </a>
            <a href={telLink} className="inline-flex w-fit items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-[#d9b26f]" /> <Todo dir="ltr">{brand.phoneDisplay}</Todo>
            </a>
            <span className="inline-flex w-fit items-center gap-3">
              <span className="h-5 w-5 text-center text-[#d9b26f]" aria-hidden="true">⌖</span> <Todo>{brand.addressPlaceholder}</Todo>
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={onSubmit} className="glass-dark rounded-[28px] p-7 md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sr-only" htmlFor="c-name">שם מלא</label>
              <input id="c-name" name="name" required autoComplete="name" placeholder="שם מלא *" className={field} />
              <label className="sr-only" htmlFor="c-phone">טלפון</label>
              <input id="c-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+\-\s]{9,15}" placeholder="טלפון *" className={field} />
              <label className="sr-only" htmlFor="c-type">סוג האירוע</label>
              <select id="c-type" name="type" required defaultValue="" className={`${field} [color-scheme:dark]`}>
                <option value="" disabled>סוג האירוע *</option>
                {contact.eventTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#0e0c0a]">{t}</option>
                ))}
              </select>
              <label className="sr-only" htmlFor="c-date">מתי האירוע</label>
              <input id="c-date" name="date" placeholder="מתי? (חודש ושנה)" className={field} />
              <label className="sr-only" htmlFor="c-guests">מספר אורחים</label>
              <input id="c-guests" name="guests" type="number" min={1} inputMode="numeric" placeholder="מספר אורחים משוער" className={`${field} sm:col-span-2`} />
              <label className="sr-only" htmlFor="c-msg">ספרו לנו על האירוע</label>
              <textarea id="c-msg" name="message" rows={3} maxLength={600} placeholder="ספרו לנו על האירוע שאתם חולמים עליו" className={`${field} resize-none sm:col-span-2`} />
            </div>
            <button type="submit" className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[16px] font-medium transition-transform hover:scale-[1.01]">
              <WhatsAppIcon className="h-4 w-4" /> שליחה בוואטסאפ
            </button>
            <p className="mt-4 text-center text-[13px] text-[#f6f0e6]/70" role="status">
              {sent ? "פתחנו לכם וואטסאפ עם הפרטים. נשאר רק ללחוץ שליחה." : "הפרטים נשלחים אלינו ישירות בוואטסאפ, ללא התחייבות."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
