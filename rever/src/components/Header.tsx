"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, whatsapp } from "@/content/site";
import { waHref } from "@/lib/whatsapp";
import { WaIcon } from "./ui";

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

/** The page tone under the header (paper, dark, or the opening) is set by the scroll engine as a class. */
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      lenis()?.stop();
      document.body.style.overflow = "hidden";
      closeBtn.current?.focus();
    } else {
      lenis()?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) burger.current?.focus();
  };

  return (
    <>
      <header className={`site-head${path === "/" ? " over-hero" : " is-paper"}`} id="head">
        <div className="row">
          <Link className="wordmark en" href="/" lang="en" aria-label="REVER, לעמוד הבית">REVER</Link>
          <nav className="head-nav" aria-label="ראשי">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}>{n.label}</Link>
            ))}
          </nav>
          <div className="head-actions">
            <a className="round gold" id="headWa" href={waHref()} target="_blank" rel="noopener" data-wa-link="header" aria-label={`${whatsapp.cta} בוואטסאפ`}>
              <WaIcon />
            </a>
            <button ref={burger} className="round burger" type="button" aria-label="פתיחת תפריט" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="menu" id="menu" hidden={!open} aria-label="תפריט">
        <button ref={closeBtn} className="round close" type="button" aria-label="סגירת תפריט" onClick={() => close(true)}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <Link className="big" href="/" onClick={() => close(false)}>בית</Link>
        {nav.map((n) => (
          <Link key={n.href} className="big" href={n.href} onClick={() => close(false)} aria-current={path === n.href ? "page" : undefined}>{n.label}</Link>
        ))}
        <Link className="big" href="/contact/" onClick={() => close(false)}>צור קשר</Link>
        <a className="btn-gold" href={waHref()} target="_blank" rel="noopener" data-wa-link="menu">
          <WaIcon />
          {whatsapp.cta}
        </a>
      </nav>
    </>
  );
}
