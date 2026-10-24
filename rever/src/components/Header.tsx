"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { brand, nav } from "@/content/site";
import { track } from "@/lib/analytics";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useDarkAt } from "@/lib/use-tone";
import { telLink, waLink, waContext } from "@/lib/whatsapp";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";

export function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // Which tone sits under the header bar (measured, so it also works inside an iframe preview).
  const light = !useDarkAt(() => 60);
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#f6f0e6" : "#0e0c0a");
  }, [light]);

  useEffect(() => {
    if (!open) return;
    const btn = burger.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      btn?.focus();
    };
  }, [open]);

  const onLight = scrolled && light && !open;

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-right gold-metal-bg" style={{ scaleX: scrollYProgress }} />
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background,padding] duration-500 ${
          scrolled && !open ? `${light ? "glass-ivory" : "glass-dark"} !rounded-none !border-x-0 !border-t-0 !shadow-none` : ""
        }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[padding] duration-500 md:px-8 ${scrolled ? "py-2" : "py-4 md:py-5"}`}>
          <a href="#top" aria-label="REVER PRODUCTIONS, לראש הדף" className="inline-flex min-h-11 items-center">
            <Logo className={`h-11 transition-[filter] duration-500 md:h-14 ${onLight ? "brightness-[.62] saturate-[1.3]" : ""}`} priority />
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="ניווט ראשי">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`group relative py-2 text-[14px] transition-colors ${onLight ? "text-[#2a2118]/80 hover:text-[#2a2118]" : "text-[#f6f0e6]/80 hover:text-[#f6f0e6]"}`}>
                {n.label}
                <span className="absolute bottom-0 right-0 h-px w-0 gold-metal-bg transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { waContext(e); track("click_whatsapp", { location: "header" }); }}
              className={`hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm transition-colors lg:inline-flex ${onLight ? "bg-[#2a2118] text-[#f6f0e6] hover:bg-[#3a2e22]" : "btn-gold"}`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              דברו איתנו
            </a>
            <button
              ref={burger}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${onLight ? "border-[#2a2118]/25 [&>span]:bg-[#2a2118]" : "border-white/30 [&>span]:bg-[#f6f0e6]"}`}
              aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className={`absolute h-px w-5 transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-px w-5 transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-px w-5 transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="תפריט"
            className="fixed inset-0 z-40 flex flex-col justify-between overscroll-contain bg-[#0e0c0a]/97 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] text-[#f6f0e6] backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at 8% 4%)" }}
            animate={{ clipPath: "circle(150% at 8% 4%)" }}
            exit={{ clipPath: "circle(0% at 8% 4%)" }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          >
            <nav className="flex flex-col" aria-label="ניווט נייד">
              {nav.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#f6f0e6]/10 py-4 font-display text-3xl font-medium"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" onClick={(e) => { waContext(e); track("click_whatsapp", { location: "menu" }); }} className="btn-gold inline-flex min-h-14 items-center justify-center gap-2 rounded-full text-[16px] font-medium">
                <WhatsAppIcon className="h-5 w-5" /> שלחו הודעה בוואטסאפ
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={telLink} onClick={() => track("click_call", { location: "menu" })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e3c066]/45 text-[15px]">
                  <PhoneIcon className="h-4 w-4 text-[#e3c066]" /> התקשרו
                </a>
                <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e3c066]/45 text-[15px]">
                  <InstagramIcon className="h-4 w-4 text-[#e3c066]" /> אינסטגרם
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
