"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { brand, contact } from "@/content/site";
import { telLink, waLink } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { Reveal, SectionKicker } from "./Reveal";

const field =
  "w-full rounded-2xl border border-line bg-bg/60 px-5 py-4 text-ink placeholder:text-ink-dim/70 outline-none transition-colors focus:border-gold";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const lines = [
      "היי Rever! השארתי פרטים באתר 🎉",
      `שם: ${d.get("name")}`,
      `טלפון: ${d.get("phone")}`,
      `סוג אירוע: ${d.get("type")}`,
      d.get("date") ? `תאריך: ${d.get("date")}` : "",
      d.get("guests") ? `מספר אורחים: ${d.get("guests")}` : "",
      d.get("message") ? `פרטים: ${d.get("message")}` : "",
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(217,178,111,0.18),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <SectionKicker>צור קשר</SectionKicker>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            {contact.title.split(" ").slice(0, 2).join(" ")} <span className="text-gold-grad">{contact.title.split(" ").slice(2).join(" ")}</span>
          </h2>
          <p className="mt-6 text-lg text-ink-dim">{contact.subtitle}</p>

          <div className="mt-10 flex flex-col gap-4">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-3xl border border-line bg-bg-soft p-5 transition-colors hover:border-[#25D366]/60">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#25D366]">
                <WhatsAppIcon className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-sm text-ink-dim">וואטסאפ — מענה מהיר</span>
                <span className="text-xl font-bold">שלחו הודעה</span>
              </span>
            </a>
            <a href={telLink} className="group flex items-center gap-4 rounded-3xl border border-line bg-bg-soft p-5 transition-colors hover:border-gold/60">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <PhoneIcon className="h-7 w-7" />
              </span>
              <span>
                <span className="block text-sm text-ink-dim">התקשרו אלינו</span>
                <span className="text-xl font-bold" dir="ltr">{brand.phoneDisplay}</span>
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={onSubmit} className="relative rounded-[2rem] border border-line bg-bg-soft/80 p-6 backdrop-blur-xl md:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sr-only" htmlFor="c-name">שם מלא</label>
              <input id="c-name" name="name" required autoComplete="name" placeholder="שם מלא *" className={field} />
              <label className="sr-only" htmlFor="c-phone">טלפון</label>
              <input id="c-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+\-\s]{9,15}" placeholder="טלפון *" className={field} />
              <label className="sr-only" htmlFor="c-type">סוג האירוע</label>
              <select id="c-type" name="type" required defaultValue="" className={field}>
                <option value="" disabled>סוג האירוע *</option>
                {contact.eventTypes.map((t) => (
                  <option key={t} value={t} className="bg-bg">{t}</option>
                ))}
              </select>
              <label className="sr-only" htmlFor="c-date">תאריך משוער</label>
              <input id="c-date" name="date" type="date" className={`${field} [color-scheme:dark]`} aria-label="תאריך משוער" />
              <label className="sr-only" htmlFor="c-guests">מספר אורחים</label>
              <input id="c-guests" name="guests" type="number" min={1} inputMode="numeric" placeholder="מספר אורחים משוער" className={`${field} sm:col-span-2`} />
              <label className="sr-only" htmlFor="c-msg">ספרו לנו על האירוע</label>
              <textarea id="c-msg" name="message" rows={4} placeholder="ספרו לנו על האירוע שאתם חולמים עליו..." className={`${field} sm:col-span-2`} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-gold mt-6 flex w-full items-center justify-center gap-2 rounded-full py-5 text-lg font-bold"
            >
              <WhatsAppIcon /> שליחה ובדיקת זמינות
            </motion.button>
            <p className="mt-4 text-center text-sm text-ink-dim" role="status">
              {sent ? "פתחנו לכם את וואטסאפ עם הפרטים — רק ללחוץ שליחה ✓" : "הפרטים נשלחים ישירות אלינו בוואטסאפ. ללא התחייבות."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
