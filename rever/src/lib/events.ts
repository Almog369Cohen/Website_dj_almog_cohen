import type { DB, EventPlan, Lead, Supplier, TimelineItem } from "./types";
import { shortDate, uid } from "./format";

/** צ'קליסט הכנה לאירוע (חברת הפקות) */
export const CHECKS: { id: string; label: string }[] = [
  { id: "contract", label: "חוזה נחתם" },
  { id: "deposit", label: "מקדמה התקבלה" },
  { id: "meeting", label: "פגישת תיאום עם הלקוח" },
  { id: "songs", label: "שירים ורגעים סגורים" },
  { id: "timeline", label: "לו\"ז סגור ונשלח לספקים" },
  { id: "suppliers", label: "ספקים וציוד סגורים" },
  { id: "venue", label: "תיאום עם האולם / המקום" },
  { id: "invoice", label: "חשבונית הופקה" },
  { id: "final_payment", label: "תשלום אחרון התקבל" },
];

/** רגעים באירוע + שיר לכל רגע */
export const MOMENTS: { id: string; label: string }[] = [
  { id: "entrance", label: "כניסה" },
  { id: "chuppah", label: "חופה" },
  { id: "glass", label: "שבירת כוס" },
  { id: "first", label: "ריקוד ראשון" },
  { id: "slow", label: "סלואו" },
  { id: "floor", label: "פתיחת רחבה" },
];

/** ציוד לפני היציאה (ברירת מחדל, אפשר להוסיף לכל אירוע) */
export const EQUIPMENT = [
  "מערכת הגברה ורמקולים",
  "מיקסר וכבלים (XLR / חשמל / מפצלים)",
  "מיקרופונים אלחוטיים + סוללות רזרביות",
  "תאורה ומעמדים",
  "מחשב / קונטרולר + גיבוי",
  "דיסק-און-קי עם הסט כגיבוי",
  "מכונת עשן / אפקטים (אם הוזמן)",
  "שלטים ודגלים",
];

export const AFTER_STEPS: { id: string; label: string }[] = [
  { id: "review_asked", label: "ביקשתי המלצה" },
  { id: "review_got", label: "קיבלתי המלצה" },
  { id: "footage_got", label: "קיבלתי צילומים" },
  { id: "skip", label: "לא צריך" },
];

const T = (time: string, title: string, who = ""): TimelineItem => ({ id: uid(), time, title, who });

/** תבניות לו"ז לפי סוג אירוע */
export function timelineTemplate(eventType: string): TimelineItem[] {
  if (/מצווה/.test(eventType))
    return [T("17:30", "הגעת ספקים והקמה"), T("19:00", "צילומי משפחה"), T("19:30", "קבלת פנים"), T("20:30", "כניסה לאולם וברכות"), T("21:00", "מצגת / סרטון"), T("21:15", "הדלקת נרות"), T("21:45", "סט ריקודים"), T("23:30", "סיום ופירוק")];
  if (/חברה|כנס/.test(eventType))
    return [T("16:30", "הגעת ספקים והקמה"), T("18:30", "התכנסות וקבלת פנים"), T("19:30", "דברי פתיחה"), T("20:00", "ארוחה"), T("21:00", "מופע / מסיבה"), T("23:00", "סיום ופירוק")];
  if (/חינה/.test(eventType))
    return [T("17:30", "הגעת ספקים והקמה"), T("19:30", "קבלת פנים"), T("20:30", "כניסת החתן והכלה"), T("21:00", "טקס החינה"), T("21:45", "ריקודים"), T("23:30", "סיום")];
  return [T("16:00", "הגעת ספקים והקמה"), T("18:30", "צילומי זוג"), T("19:30", "קבלת פנים"), T("21:00", "חופה"), T("21:30", "כניסה לאולם וריקוד ראשון"), T("22:00", "מנה ראשונה"), T("22:45", "סט ריקודים"), T("00:30", "סיום ופירוק")];
}

const parse = <X>(json: string | undefined, fallback: X): X => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as X;
  } catch {
    return fallback;
  }
};

export interface PlanView {
  plan: EventPlan;
  timeline: TimelineItem[];
  suppliers: Supplier[];
  checklist: Record<string, boolean>;
  extra: string[];
  moments: Record<string, string>;
  equipment: Record<string, boolean>;
  after: Record<string, boolean>;
  songs: string[]; // כל השירים: חובה + רגעים
}

export function planOf(db: DB, lead: Lead): PlanView {
  const plan = db.event_plans.find((p) => p.id === lead.id) ?? { id: lead.id };
  return {
    plan,
    timeline: parse<TimelineItem[]>(plan.timeline, []),
    suppliers: parse<Supplier[]>(plan.suppliers, []),
    checklist: parse<Record<string, boolean>>(plan.checklist, {}),
    extra: parse<string[]>(plan.extra_checks, []),
    moments: parse<Record<string, string>>(plan.moments, {}),
    equipment: parse<Record<string, boolean>>(plan.equipment, {}),
    after: parse<Record<string, boolean>>(plan.after, {}),
    songs: [
      ...String(plan.must_songs ?? "").split(/\n+/),
      ...Object.values(parse<Record<string, string>>(plan.moments, {})),
    ]
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

/** פריטי ציוד לאירוע: ברירת המחדל + מה שהוסיפו */
export const equipmentList = (v: PlanView) => [...EQUIPMENT, ...Object.keys(v.equipment).filter((k) => !EQUIPMENT.includes(k))];

/** מה דורש טיפול באירועים (כמו במשרד): לא מוכן בשבועיים, בלי שירים בשבוע, המלצה אחרי */
export function eventTodos(db: DB) {
  const out: { lead: Lead; kind: "not_ready" | "no_songs" | "review"; text: string; sub: string }[] = [];
  for (const l of db.leads) {
    if (l.status !== "won" || !l.event_date) continue;
    const d = daysUntil(l.event_date)!;
    const v = planOf(db, l);
    const r = readiness(v);
    if (d >= 0 && d <= 14 && r.pct < 100) out.push({ lead: l, kind: "not_ready", text: `${l.event_type}: ${l.name}`, sub: `בעוד ${d} ימים · מוכן ${r.done} מתוך ${r.total}` });
    if (d >= 0 && d <= 7 && !v.songs.length) out.push({ lead: l, kind: "no_songs", text: `שבוע לאירוע: להתחיל הכנה · ${l.name}`, sub: "שירי חובה, רגעים וציוד" });
    if (d < 0 && d >= -21 && !v.after.review_asked && !v.after.skip) out.push({ lead: l, kind: "review", text: `לבקש המלצה: ${l.name}`, sub: `האירוע היה לפני ${-d} ימים` });
  }
  return out;
}

/** אחוז מוכנות: צ'קליסט (כולל פריטים שהוסיפו) */
export function readiness(v: PlanView) {
  const ids = [...CHECKS.map((c) => c.id), ...v.extra.map((x) => "x:" + x)];
  const done = ids.filter((id) => v.checklist[id]).length;
  return { done, total: ids.length, pct: ids.length ? Math.round((done / ids.length) * 100) : 0 };
}

export const daysUntil = (date?: string) =>
  date ? Math.ceil((new Date(date + "T00:00:00").getTime() - new Date(new Date().toDateString()).getTime()) / 86400000) : null;

/** טקסט לו"ז לשליחה בוואטסאפ לספקים / לאיש קשר */
export function timelineText(lead: Lead, v: PlanView) {
  const lines = [
    `📋 לו"ז ${lead.event_type}: ${lead.name}`,
    `📅 ${shortDate(lead.event_date)}${lead.venue ? " · 📍 " + lead.venue : ""}`,
    "",
    ...[...v.timeline].sort(byTime).map((t) => `${t.time}  ${t.title}${t.who ? " (" + t.who + ")" : ""}`),
  ];
  if (v.plan.contact_name) lines.push("", `איש קשר ביום האירוע: ${v.plan.contact_name}${v.plan.contact_phone ? " " + v.plan.contact_phone : ""}`);
  return lines.join("\n");
}

/** מיון לו"ז: אחרי חצות (00:00-05:59) בסוף */
export const byTime = (a: TimelineItem, b: TimelineItem) => {
  const k = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return ((h ?? 0) < 6 ? (h ?? 0) + 24 : h ?? 0) * 60 + (m || 0);
  };
  return k(a.time) - k(b.time);
};
