/**
 * The consultation lead, in one shape, ready for REVER's CRM.
 *
 * Nothing external is connected. A lead is sent only when NEXT_PUBLIC_LEAD_ENDPOINT is set
 * (see analytics.ts); until then the form hands the details to WhatsApp instead.
 * To connect the CRM later: point the endpoint at it and map these fields. No code change is needed.
 */
export type ConsultLead = {
  /** what the lead asked for: always a free consultation call */
  intent: "consultation";
  name: string;
  phone: string;
  eventType?: string;
  /** free text: "יוני הבא", "15.8.2027" */
  eventDate?: string;
  /** בוקר / צהריים / ערב / לא משנה */
  callTime?: string;
  message?: string;
};

export function leadFromForm(d: Record<string, string>): ConsultLead | null {
  const name = d.name?.trim(), phone = d.phone?.trim(), eventType = d.type?.trim();
  if (!name || !phone) return null;
  return {
    intent: "consultation",
    name,
    phone,
    eventType: eventType || undefined,
    eventDate: d.when?.trim() || undefined,
    callTime: d.callTime || undefined,
    message: d.message?.trim() || undefined,
  };
}

/** An Israeli phone number, loosely: 9–10 digits once spaces, dashes and +972 are removed. */
export function looksLikePhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "").replace(/^972/, "0");
  return digits.length >= 9 && digits.length <= 10;
}

/** The same lead as a WhatsApp message, for when no endpoint is set or the couple prefers to write. */
export function leadMessage(l: ConsultLead, greeting: string) {
  return [
    `${greeting.trim()} אשמח לקבוע שיחת ייעוץ.`,
    `שם: ${l.name}`,
    `טלפון: ${l.phone}`,
    l.eventType ? `סוג אירוע: ${l.eventType}` : "",
    l.eventDate ? `מתי: ${l.eventDate}` : "",
    l.callTime ? `נוח לי לדבר: ${l.callTime}` : "",
    l.message ? `פרטים: ${l.message}` : "",
  ].filter(Boolean).join("\n");
}
