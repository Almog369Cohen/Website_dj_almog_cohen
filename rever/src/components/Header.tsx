"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { waLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Icons";

export function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 40);
    // match the section under the header: ivory glass over light sections, dark glass over dark ones
    const under = document.elementsFromPoint(innerWidth / 2, 72).find((el) => !el.closest("header"));
    setLight(!!under?.closest(".theme-ivory"));
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-right bg-gradient-to-l from-gold-lo via-gold-hi to-gold" style={{ scaleX: scrollYProgress }} />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? `${light ? "glass-ivory" : "glass-dark"} !border-x-0 !border-t-0 py-2` : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" aria-label="REVER PRODUCTIONS — לראש הדף">
            <Logo className="h-12 md:h-14" priority />
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="ניווט ראשי">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`group relative text-[14px] transition-colors ${scrolled && light ? "text-[#2a2118]/80 hover:text-[#2a2118]" : "text-[#f6f0e6]/80 hover:text-[#f6f0e6]"}`}>
                {n.label}
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-105 sm:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              דברו איתנו
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${scrolled && light ? "border-[#2a2118]/25 [&>span]:bg-[#2a2118]" : "border-white/25"}`}
              aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
              aria-expanded={open}
            >
              <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-px w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg/95 px-8 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          >
            <nav className="flex flex-col gap-6" aria-label="ניווט נייד">
              {nav.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl font-bold"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                >
                  <span className="ml-4 align-middle text-sm text-gold">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-gold mt-12 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-bold">
              <WhatsAppIcon /> שלחו הודעה בוואטסאפ
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
