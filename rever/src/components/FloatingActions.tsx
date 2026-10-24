"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { useDarkAt } from "@/lib/use-tone";
import { telLink, waLink, waContext } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

/**
 * Phones: a bottom action bar in thumb reach (WhatsApp + call), shown after the hero,
 * hidden while the contact form is on screen or a field has focus (keyboard open).
 * Desktop: one quiet round WhatsApp button.
 */
export function FloatingActions() {
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [typing, setTyping] = useState(false);
  const darkBelow = useDarkAt(() => window.innerHeight - 40);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        if (e.target === hero) setPastHero(!e.isIntersecting);
        if (e.target === contact) setAtContact(e.isIntersecting);
      }),
      { threshold: 0.15 },
    );
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    const onFocus = (e: FocusEvent) => setTyping((e.target as HTMLElement)?.matches?.("input, textarea, select") ?? false);
    const onBlur = () => setTyping(false);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      io.disconnect();
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  const show = pastHero && !atContact && !typing;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="bar"
            className={`action-bar ${darkBelow ? "glass-dark" : "glass-ivory"} fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex gap-2 rounded-full p-1.5 transition-colors duration-500 md:hidden`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { waContext(e); track("click_whatsapp", { location: "bottom_bar" }); }}
              className="btn-gold flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-medium"
            >
              <WhatsAppIcon className="h-5 w-5" /> שלחו הודעה בוואטסאפ
            </a>
            <a href={telLink} onClick={() => track("click_call", { location: "bottom_bar" })} aria-label="התקשרו אלינו" className={`flex min-h-12 w-12 shrink-0 items-center justify-center rounded-full border ${darkBelow ? "border-[#e3c066]/45 text-[#e3c066]" : "border-[#2a2118]/20 text-[#6b4e1b]"}`}>
              <PhoneIcon className="h-5 w-5" />
            </a>
          </motion.div>
          <motion.a
            key="fab"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { waContext(e); track("click_whatsapp", { location: "fab" }); }}
            aria-label="שלחו לנו הודעה בוואטסאפ"
            className="btn-gold fixed bottom-6 left-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full ring-2 ring-white/70 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.55)] md:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <WhatsAppIcon className="h-6 w-6" />
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
