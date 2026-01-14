export type WhatsAppTemplateKey =
  | "events_general"
  | "weddings_dj"
  | "corporate_events"
  | "bar_mitzvah"
  | "bat_mitzvah"
  | "henna"
  | "chogeg_menagen"
  | "live_on_dj";

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
}

export function buildWhatsAppLink(text: string, waNumber: string = getWhatsAppNumber()) {
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

export function getEventsWhatsAppMessage(key: WhatsAppTemplateKey) {
  switch (key) {
    case "weddings_dj":
      return "היי אלמוג, חתונה בתאריך ____. אולם/אזור: ____. כמות אורחים: ____. אפשר לבדוק זמינות?";
    case "corporate_events":
      return "היי אלמוג, אני מעוניין/ת ב-DJ לאירוע עסקי. אפשר לבדוק זמינות ולקבל הצעת מחיר?";
    case "bar_mitzvah":
      return "היי אלמוג, אני מעוניין/ת ב-DJ לבר מצווה. אפשר לבדוק זמינות ולדבר על הקונספט?";
    case "bat_mitzvah":
      return "היי אלמוג, אני מעוניין/ת ב-DJ לבת מצווה. אפשר לבדוק זמינות ולדבר על הסגנון?";
    case "henna":
      return "היי אלמוג, אני מעוניין/ת ב-DJ לחינה. אפשר לבדוק זמינות ולשמוע איך זה עובד?";
    case "chogeg_menagen":
      return "היי אלמוג, אני מעוניין/ת בשירות חוגג מנגן. אפשר לשמוע פרטים ולבדוק זמינות?";
    case "live_on_dj":
      return "היי אלמוג, אני מעוניין/ת ב-LIVE ON DJ. אפשר לשמוע פרטים ולבדוק זמינות?";
    case "events_general":
    default:
      return "היי אלמוג, אני רוצה לדבר על אירוע ולבדוק זמינות. אפשר לעזור לי?";
  }
}
