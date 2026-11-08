import type { CalendarItem, Lead, Settings } from "./types";
import { cleanPhone, relDay, shortDate } from "./format";

/** ממלא תבנית: {שם} {תאריך} {אירוע} {עסק} {בעלים} {פגישה} {מחיר} */
export function fillTemplate(body: string, lead: Lead, settings: Settings, meeting?: CalendarItem) {
  const map: Record<string, string> = {
    "שם": lead.name,
    "תאריך": lead.event_date ? shortDate(lead.event_date) : "התאריך",
    "אירוע": lead.event_type || "אירוע",
    "עסק": settings.business_name || "",
    "בעלים": settings.owner_name || "",
    "פגישה": meeting ? `${relDay(meeting.start)}${meeting.location ? ", " + meeting.location : ""}` : "בפגישה שקבענו",
    "מחיר": lead.price ? "₪" + lead.price.toLocaleString("he-IL") : "",
  };
  return body.replace(/\{([^}]+)\}/g, (m, k) => (k in map ? map[k] : m));
}

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(text)}`;

/**
 * שליחה: במצב "link" נפתח וואטסאפ עם ההודעה מוכנה (לחיצה אחת לשלוח).
 * במצב "webhook" ההודעה נשלחת ל-Make, ש-Make מעביר ל-WhatsApp API / ManyChat.
 */
export async function sendWhatsApp(
  lead: Lead,
  text: string,
  settings: Settings,
  sendAt?: string,
): Promise<{ ok: boolean; via: "link" | "webhook"; error?: string }> {
  if (settings.whatsapp_mode === "webhook" && settings.make_webhook_url) {
    try {
      const res = await fetch(settings.make_webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp_message",
          phone: cleanPhone(lead.phone),
          name: lead.name,
          message: text,
          send_at: sendAt ?? null,
          lead_id: lead.id,
        }),
      });
      if (!res.ok) return { ok: false, via: "webhook", error: `Make החזיר ${res.status}` };
      return { ok: true, via: "webhook" };
    } catch (e) {
      return { ok: false, via: "webhook", error: e instanceof Error ? e.message : String(e) };
    }
  }
  window.open(waLink(lead.phone, text), "_blank", "noopener");
  return { ok: true, via: "link" };
}
