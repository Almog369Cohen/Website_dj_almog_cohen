export type LeadStatus = "new" | "talk" | "meeting" | "quote" | "won" | "lost";

export const STATUSES: { id: LeadStatus; label: string; hint: string; color: string }[] = [
  { id: "new", label: "חדש", hint: "עוד לא דיברנו", color: "var(--blue)" },
  { id: "talk", label: "בשיחה", hint: "מחכים לתשובה", color: "var(--orange)" },
  { id: "meeting", label: "פגישה נקבעה", hint: "פגישה ביומן", color: "var(--violet)" },
  { id: "quote", label: "הצעת מחיר", hint: "נשלחה, ממתינה", color: "var(--gold)" },
  { id: "won", label: "נסגר", hint: "לקוח סגור", color: "var(--green)" },
  { id: "lost", label: "לא רלוונטי", hint: "ירד מהפרק", color: "var(--dim)" },
];

export const statusLabel = (s: LeadStatus) => STATUSES.find((x) => x.id === s)?.label ?? s;

export const EVENT_TYPES = ["חתונה", "בר מצווה", "בת מצווה", "חינה", "אירוע חברה", "כנס", "יום הולדת", "אחר"];
export const LOST_REASONS = ["מחיר", "תאריך תפוס", "בחרו מישהו אחר", "לא ענו", "אחר"];
export const SOURCES = ["פייסבוק", "אינסטגרם", "וואטסאפ", "אתר", "המלצה", "אחר"];

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  event_type: string;
  event_date?: string; // YYYY-MM-DD
  guests?: number;
  venue?: string;
  source: string;
  status: LeadStatus;
  price?: number; // מחיר סגור / מחיר בהצעה
  next_followup?: string; // ISO datetime
  followup_note?: string;
  pending_message?: string; // הודעה מתוזמנת שממתינה לשליחה
  last_contact?: string; // ISO
  notes?: string;
  assigned_to?: string; // העובד שמטפל בליד
  lost_reason?: string; // למה לא סגרנו
  created_at: string;
}

export type ActivityKind = "created" | "message" | "call" | "status" | "note" | "meeting" | "payment";
export interface Activity {
  id: string;
  lead_id: string;
  kind: ActivityKind;
  text: string;
  at: string;
  by?: string; // מזהה העובד שביצע
}

export type CalendarKind = "event" | "meeting" | "followup";
export interface CalendarItem {
  id: string;
  kind: CalendarKind;
  title: string;
  start: string; // ISO datetime
  location?: string;
  lead_id?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  body: string;
  sort: number;
}

export type PaymentKind = "deposit" | "payment" | "refund";
export const PAYMENT_KINDS: Record<PaymentKind, string> = { deposit: "מקדמה", payment: "תשלום", refund: "החזר" };
export const PAYMENT_METHODS = ["העברה בנקאית", "ביט", "פייבוקס", "אשראי", "מזומן", "צ׳ק"];

export interface Payment {
  id: string;
  lead_id: string;
  kind: PaymentKind;
  amount: number;
  date: string; // YYYY-MM-DD
  method: string;
  note?: string;
}

export const EXPENSE_CATEGORIES = ["ספקים", "ציוד", "שיווק ופרסום", "עובדים", "רכב והובלה", "משרד", "אחר"];
export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  supplier: string;
  note?: string;
  lead_id?: string;
}

export type DocType = "quote" | "invoice" | "receipt";
export const DOC_TYPES: Record<DocType, string> = { quote: "הצעת מחיר", invoice: "חשבונית מס", receipt: "קבלה" };
export type DocStatus = "draft" | "sent" | "paid" | "cancelled";
export const DOC_STATUS: Record<DocStatus, string> = { draft: "טיוטה", sent: "נשלח", paid: "שולם", cancelled: "בוטל" };
export interface Doc {
  id: string;
  lead_id: string;
  type: DocType;
  number: string;
  amount: number;
  date: string;
  status: DocStatus;
  show_client?: boolean; // להציג בקישור ללקוח
}

export interface Settings {
  id: string;
  business_name: string;
  owner_name: string;
  whatsapp_mode: "link" | "webhook";
  make_webhook_url?: string;
  vat_rate: number;
  sheet_url?: string; // גיליון לידים בגוגל שיטס
  sheet_map?: string; // JSON: איזה עמודה = איזה שדה
  sheet_auto?: boolean; // למשוך לידים חדשים אוטומטית בכל כניסה
  sheet_last_pull?: string;
  contact_phone?: string; // טלפון לפניות לקוחות (בקישור ללקוח)
}

export type Role = "admin" | "team";
export type Perm = "prices" | "finance" | "delete" | "templates" | "portal" | "settings";
/** הרשאות שהמנהלים מדליקים לכל עובד. "settings" (הגדרות + צוות) = מנהלים בלבד */
export const PERMS: { id: Exclude<Perm, "settings">; label: string; hint: string }[] = [
  { id: "prices", label: "מחירים", hint: "רואה מחירים בלידים ובהצעות" },
  { id: "finance", label: "כספים", hint: "מסך כספים: הכנסות, תשלומים, הוצאות, חשבוניות" },
  { id: "delete", label: "מחיקה", hint: "מחיקת לידים ופריטים" },
  { id: "templates", label: "עריכת תבניות", hint: "שינוי תבניות ההודעה" },
  { id: "portal", label: "קישור ללקוח", hint: "הפעלה ושליחה של הקישור ללקוח, ומה מוצג בו" },
];

/** עובד. כולם נכנסים עם חשבון הגוגל של העסק, ואז כל אחד מקיש קוד אישי. */
export interface Member {
  id: string;
  name: string;
  title?: string; // תפקיד: מזכירה, תפעול…
  phone?: string; // מוצג ללקוח כשהעובד מטפל באירוע שלו
  role: Role; // admin = קוד מאסטר
  can_prices: boolean;
  can_finance: boolean;
  can_delete: boolean;
  can_templates: boolean;
  can_portal?: boolean;
  active: boolean;
  has_pin?: boolean; // מגיע מהשרת: האם הוגדר קוד
  pin?: string; // מצב דמו בלבד
  created_at?: string;
}

/** בדיקת הרשאה. משותף לשרת ולמסך. */
export function memberCan(m: Member | undefined, perm: Perm): boolean {
  if (!m || !m.active) return false;
  if (m.role === "admin") return true;
  if (perm === "prices") return m.can_prices || m.can_finance;
  if (perm === "finance") return m.can_finance;
  if (perm === "delete") return m.can_delete;
  if (perm === "templates") return m.can_templates;
  if (perm === "portal") return !!m.can_portal;
  return false;
}

/** כרטיס אירוע (לליד שנסגר). id = מזהה הליד. רשימות נשמרות כ-JSON כדי שיעבדו גם בגוגל שיטס */
export interface EventPlan {
  id: string;
  timeline?: string; // JSON: TimelineItem[]
  suppliers?: string; // JSON: Supplier[]
  checklist?: string; // JSON: Record<string, boolean>
  extra_checks?: string; // JSON: string[] (פריטים שהוסיפו)
  contact_name?: string;
  contact_phone?: string;
  requests?: string; // בקשות מיוחדות
  notes?: string;
  after?: string; // JSON: { review_asked, review_got, footage_got, skip }
  // ---- קישור ללקוח ----
  portal_token?: string;
  portal_enabled?: boolean;
  portal_sections?: string; // JSON: Record<PortalSection, boolean>
  portal_seen_at?: string;
  client_steps?: string; // JSON: מזהי צ'קליסט שהלקוח רואה
  payment_plan?: string; // JSON: PlanPayment[]
  contract_status?: "none" | "sent" | "signed";
  internal_notes?: string; // הלקוח לא רואה
  updated_at?: string;
}
export interface TimelineItem { id: string; time: string; title: string; who?: string; show_client?: boolean }
export interface Supplier { id: string; role: string; name: string; phone?: string; cost?: number; confirmed?: boolean; category?: string; show_client?: boolean }
export interface PlanPayment { id: string; name: string; amount: number; due?: string }
export type PortalSection = "status" | "timeline" | "payments" | "suppliers" | "details";
export const PORTAL_SECTIONS: { id: PortalSection; label: string; hint?: string }[] = [
  { id: "status", label: "✨ סטטוס הכנה" },
  { id: "timeline", label: "🕒 לו״ז הערב", hint: "בלי \"מי אחראי\"" },
  { id: "payments", label: "💳 התשלומים שלו", hint: "בלי עלויות ורווח" },
  { id: "suppliers", label: "🤝 ספקים", hint: "בלי מחירים" },
  { id: "details", label: "📍 פרטי האירוע ומה שסיכמנו" },
];
export const SUPPLIER_CATEGORIES = [
  { id: "venue", label: "אולם / מקום", icon: "🏛️" },
  { id: "catering", label: "קייטרינג", icon: "🍽️" },
  { id: "design", label: "עיצוב ופרחים", icon: "💐" },
  { id: "photo", label: "צילום", icon: "📸" },
  { id: "dj", label: "DJ", icon: "🎧" },
  { id: "light", label: "תאורה והגברה", icon: "💡" },
  { id: "attraction", label: "אטרקציות", icon: "🎉" },
  { id: "other", label: "אחר", icon: "🤝" },
];

export interface DB {
  leads: Lead[];
  activities: Activity[];
  calendar_items: CalendarItem[];
  templates: Template[];
  payments: Payment[];
  expenses: Expense[];
  docs: Doc[];
  settings: Settings[];
  members: Member[];
  event_plans: EventPlan[];
}

export type Table = keyof DB;
export const TABLES: Table[] = ["leads", "activities", "calendar_items", "templates", "payments", "expenses", "docs", "settings", "members", "event_plans"];
