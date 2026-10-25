/**
 * Measurement and lead capture. Everything is off until configured:
 *   NEXT_PUBLIC_GA_ID          Google Analytics 4 measurement id (loads only after the visitor accepts cookies)
 *   NEXT_PUBLIC_LEAD_ENDPOINT  URL that receives each form lead as JSON, before WhatsApp opens
 *                              (a Google Sheet via Apps Script works: see scripts/lead-sheet.gs)
 */
import { getSource } from "./source";
import { waContextText } from "./whatsapp";

type Win = Window & { gtag?: (...a: unknown[]) => void };

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "";

export type TrackEvent = "click_whatsapp" | "click_call" | "generate_lead" | "open_photo" | "hero_opened" | "night_finished";

export function track(event: TrackEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  (window as Win).gtag?.("event", event, params);
}

/** Saves the lead first; a failed save never blocks the WhatsApp hand-off. */
export async function sendLead(data: Record<string, string>) {
  if (!LEAD_ENDPOINT || data.website) return; // `website` is the hidden honeypot: a person never fills it
  const body = JSON.stringify({ ...data, source: getSource(), context: waContextText(), page: location.href, at: new Date().toISOString() });
  try {
    // text/plain keeps it a "simple" request, which Apps Script and most form services accept without CORS preflight
    await fetch(LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body, keepalive: true, mode: "no-cors" });
  } catch {
    // the WhatsApp message still carries every detail
  }
}

/** Phones and in-app browsers (Instagram, Facebook) block window.open after a submit, so navigate instead. */
export function openWhatsApp(url: string) {
  if (window.matchMedia("(max-width: 767px)").matches) window.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
}
