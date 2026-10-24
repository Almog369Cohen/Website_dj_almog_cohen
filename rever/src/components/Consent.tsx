"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GA_ID, PIXEL_ID, trackingConfigured } from "@/lib/analytics";
import { openDialog } from "./Dialogs";

const KEY = "rever-consent";

function read() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Measurement scripts load only after consent. Nothing shows when no ids are configured. */
export function Consent() {
  // "pending" on the server, so the bar never flashes before the stored choice is read
  const stored = useSyncExternalStore(() => () => {}, read, () => "pending");
  const [picked, setPicked] = useState<string | null>(null);
  const choice = picked ?? stored;

  const asking = trackingConfigured && choice === null;
  // lift the phone action bar above the cookie bar while it is shown
  useEffect(() => {
    document.body.classList.toggle("consent-open", asking);
  }, [asking]);

  if (!trackingConfigured) return null;
  const decide = (v: "yes" | "no") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setPicked(v);
  };

  return (
    <>
      {choice === "yes" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
        </>
      )}
      {choice === "yes" && PIXEL_ID && (
        <Script id="fb" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}</Script>
      )}
      {choice === null && (
        <div role="region" aria-label="הסכמה לעוגיות" className="glass-dark fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] rounded-2xl p-4 text-[14px] text-[#f6f0e6] md:inset-x-auto md:left-6 md:max-w-sm">
          <p className="leading-relaxed">
            נשמח להשתמש בעוגיות מדידה כדי לשפר את האתר.{" "}
            <button type="button" onClick={() => openDialog("privacy")} className="underline underline-offset-4">פרטים</button>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => decide("yes")} className="btn-gold min-h-10 flex-1 rounded-full text-[14px]">אישור</button>
            <button type="button" onClick={() => decide("no")} className="min-h-10 flex-1 rounded-full border border-white/30 text-[14px]">לא תודה</button>
          </div>
        </div>
      )}
    </>
  );
}
