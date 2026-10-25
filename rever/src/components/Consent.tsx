"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useSyncExternalStore } from "react";
import { GA_ID } from "@/lib/analytics";

const KEY = "rever-consent";
const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

/** Measurement loads only after the visitor agrees. Nothing at all shows while no measurement id is configured. */
export function Consent() {
  // "pending" on the server, so the bar never flashes before the stored choice is read
  const stored = useSyncExternalStore(() => () => {}, read, () => "pending");
  const [picked, setPicked] = useState<string | null>(null);
  const choice = picked ?? stored;
  if (!GA_ID) return null;

  const decide = (v: "yes" | "no") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setPicked(v);
  };

  return (
    <>
      {choice === "yes" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
        </>
      )}
      {choice === null && (
        <div className="consent" role="region" aria-label="הסכמה לעוגיות">
          <p>
            נשמח למדוד בעזרת עוגיות איך משתמשים באתר, כדי לשפר אותו. <Link href="/privacy/">פרטים</Link>
          </p>
          <div className="row">
            <button type="button" className="btn-gold" onClick={() => decide("yes")}>אישור</button>
            <button type="button" className="no" onClick={() => decide("no")}>לא תודה</button>
          </div>
        </div>
      )}
    </>
  );
}
