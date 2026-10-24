/**
 * Measurement and lead capture. Everything is optional and off until configured:
 *   NEXT_PUBLIC_GA_ID            Google Analytics 4 measurement id
 *   NEXT_PUBLIC_META_PIXEL_ID    Meta (Facebook/Instagram) pixel id
 *   NEXT_PUBLIC_LEAD_ENDPOINT    URL that receives form leads as JSON (Formspree, Make, Apps Script)
 * Tracking scripts load only after the visitor accepts the consent bar.
 */
import { getSource } from "./source";
import { waContextText } from "./whatsapp";

type Win = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "";
export const trackingConfigured = Boolean(GA_ID || PIXEL_ID);

const META_EVENTS: Record<string, string> = { generate_lead: "Lead", click_whatsapp: "Contact", click_call: "Contact" };

export function track(event: "click_whatsapp" | "click_call" | "generate_lead" | "open_gallery", params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  w.gtag?.("event", event, params);
  if (META_EVENTS[event]) w.fbq?.("track", META_EVENTS[event], params);
}

export async function sendLead(data: Record<string, string>) {
  if (!LEAD_ENDPOINT || data.website) return; // `website` is the hidden honeypot field: a human never fills it
  try {
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, source: getSource(), context: waContextText(), page: location.href }),
      keepalive: true,
    });
  } catch {
    // the WhatsApp hand-off still happens; a failed backup must not block the visitor
  }
}

/** Phones and in-app browsers (Instagram, Facebook) block window.open after a submit; navigate instead. */
export function openWhatsApp(url: string) {
  if (window.matchMedia("(max-width: 767px)").matches) window.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
}
