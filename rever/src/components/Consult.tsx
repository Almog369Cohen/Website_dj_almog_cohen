"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { consult } from "@/content/site";
import { track } from "@/lib/analytics";

/** Where the consultation form lives: on the home page and the contact page it is on the page itself. */
export function useConsultHref() {
  const path = usePathname();
  return path === "/" || path === "/contact/" || path === "/contact" ? "#contact" : "/contact/#contact";
}

/** The one action on the site: book a free consultation call. */
export function ConsultButton({ children = consult.cta, className = "btn-gold", where, onNavigate }: { children?: React.ReactNode; className?: string; where: string; onNavigate?: () => void }) {
  const href = useConsultHref();
  return (
    <Link className={className} href={href} onClick={() => { track("click_consult", { where }); onNavigate?.(); }} data-consult={where}>
      <CalIcon />
      {children}
    </Link>
  );
}

/** The floating button on phones: the consultation, always one tap away (the Engine shows it from the second stage). */
export function ConsultFab() {
  const href = useConsultHref();
  return (
    <Link className="fab" id="fab" href={href} onClick={() => track("click_consult", { where: "fab" })}>
      <CalIcon />
      <span>{consult.short}</span>
    </Link>
  );
}

export function CalIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}
