import type { DB, EventPlan, Lead, Supplier, TimelineItem } from "./types";
import { shortDate, uid } from "./format";
import { lateTasks, parseTasks } from "./tasks";
import { duePays } from "./money";

/** צ'קליסט הכנה לאירוע (חברת הפקות) */
export const CHECKS: { id: string; label: string }[] = [
  { id: "contract", label: "חוזה נחתם" },
  { id: "deposit", label: "מקדמה התקבלה" },
  { id: "meeting", label: "פגישת תיאום עם הלקוח" },
  { id: "suppliers", label: "ספקים סגורים ואישרו" },
  { id: "timeline", label: "לו\"ז סופי, אושר מול הלקוח ונשלח לספקים" },
  { id: "venue", label: "תיאום עם האולם / המקום" },
  { id: "invoice", label: "חשבונית הופקה" },
  { id: "final_payment", label: "תשלום אחרון התקבל" },
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
  after: Record<string, boolean>;
  meta: CheckMetaAll;
}

/* ───────── צ'קליסט שאפשר לערוך ─────────
 * checklist (מזהה → בוצע) ו-extra_checks (פריטים שהוסיפו) נשארים כמו שהם, כי דף הלקוח מחשב מהם מוכנות.
 * כל השאר (שם, תאריך יעד, הערה, לפני/אחרי, סדר) נשמר בנפרד ב-check_meta, שלא נשלח ללקוח.
 */
export type CheckSection = "before" | "after";
export interface CheckMeta { label?: string; due?: string; note?: string; section?: CheckSection }
export interface CheckMetaAll { order?: string[]; items?: Record<string, CheckMeta> }
export interface CheckItem { id: string; label: string; done: boolean; due?: string; note?: string; section: CheckSection; builtin: boolean }
export const CHECK_LIMITS = { label: 120, note: 500, items: 100 };

const DATE = /^\d{4}-\d{2}-\d{2}$/;
/** מנקה את check_meta: רק שדות מוכרים, אורך מוגבל, תאריך תקין */
export function sanitizeCheckMeta(x: unknown): CheckMetaAll {
  const o = (x && typeof x === "object" ? x : {}) as CheckMetaAll;
  const items: Record<string, CheckMeta> = {};
  const src = o.items && typeof o.items === "object" ? o.items : {};
  for (const [id, raw] of Object.entries(src).slice(0, CHECK_LIMITS.items * 2)) {
    if (!raw || typeof raw !== "object" || id.length > 140) continue;
    const m: CheckMeta = {};
    const label = String(raw.label ?? "").trim().slice(0, CHECK_LIMITS.label);
    const note = String(raw.note ?? "").trim().slice(0, CHECK_LIMITS.note);
    if (label) m.label = label;
    if (note) m.note = note;
    if (typeof raw.due === "string" && DATE.test(raw.due)) m.due = raw.due;
    if (raw.section === "after") m.section = "after";
    if (Object.keys(m).length) items[id] = m;
  }
  const order = Array.isArray(o.order) ? [...new Set(o.order.filter((i) => typeof i === "string" && i.length <= 140))].slice(0, CHECK_LIMITS.items * 2) : [];
  return { ...(order.length ? { order } : {}), ...(Object.keys(items).length ? { items } : {}) };
}

/** כל פריטי הצ'קליסט לפי הסדר שנשמר (פריט שלא בסדר נכנס בסוף, לפי ברירת המחדל) */
export function checkItems(v: Pick<PlanView, "checklist" | "extra" | "meta">): CheckItem[] {
  const meta = v.meta.items ?? {};
  const all: CheckItem[] = [
    ...CHECKS.map((c) => ({ id: c.id, def: c.label, builtin: true })),
    ...v.extra.map((x) => ({ id: "x:" + x, def: /^c_/.test(x) ? "פריט" : x, builtin: false })),
  ].map(({ id, def, builtin }) => {
    const m = meta[id] ?? {};
    return { id, label: m.label || def, done: !!v.checklist[id], due: m.due, note: m.note, section: m.section === "after" ? "after" : "before", builtin };
  });
  const pos = new Map((v.meta.order ?? []).map((id, i) => [id, i]));
  return all
    .map((it, i) => ({ it, k: pos.has(it.id) ? pos.get(it.id)! : 1e6 + i }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.it);
}

/** פריט שלא בוצע ותאריך היעד שלו עבר */
export const checkLate = (it: CheckItem, today: string) => !it.done && !!it.due && it.due < today;
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** פעולות עריכה: כל אחת מחזירה את השדות לשמירה בכרטיס האירוע */
export const checkOps = {
  update(v: PlanView, id: string, patch: CheckMeta): Partial<EventPlan> {
    const items = { ...(v.meta.items ?? {}) };
    items[id] = { ...items[id], ...patch };
    return { check_meta: JSON.stringify(sanitizeCheckMeta({ ...v.meta, items })) };
  },
  /** סדר חדש של מקטע אחד (לפני/אחרי). המקטע השני נשאר במקומו */
  reorder(v: PlanView, section: CheckSection, ids: string[]): Partial<EventPlan> {
    const cur = checkItems(v);
    const other = cur.filter((i) => i.section !== section).map((i) => i.id);
    const order = section === "before" ? [...ids, ...other] : [...other, ...ids];
    return { check_meta: JSON.stringify(sanitizeCheckMeta({ ...v.meta, order })) };
  },
  /** מעביר בין "לפני" ל"אחרי": הפריט נכנס לסוף המקטע החדש */
  move(v: PlanView, id: string, section: CheckSection): Partial<EventPlan> {
    const items = { ...(v.meta.items ?? {}), [id]: { ...(v.meta.items ?? {})[id], section } };
    const order = [...checkItems(v).map((i) => i.id).filter((x) => x !== id), id];
    return { check_meta: JSON.stringify(sanitizeCheckMeta({ order, items })) };
  },
  add(v: PlanView, label: string, section: CheckSection, newId = "c_" + uid()): Partial<EventPlan> {
    const id = "x:" + newId;
    const items = { ...(v.meta.items ?? {}), [id]: { label: label.trim().slice(0, CHECK_LIMITS.label), ...(section === "after" ? { section } : {}) } };
    const order = [...checkItems(v).map((i) => i.id), id];
    return { extra_checks: JSON.stringify([...v.extra, newId]), check_meta: JSON.stringify(sanitizeCheckMeta({ order, items })) };
  },
  /** רק פריט שהוסיפו. הפריטים הקבועים נשארים (דף הלקוח סופר אותם במוכנות) */
  remove(v: PlanView, id: string): Partial<EventPlan> {
    if (!id.startsWith("x:")) return {};
    const { [id]: _m, ...items } = v.meta.items ?? {};
    const { [id]: _c, ...checklist } = v.checklist;
    return {
      extra_checks: JSON.stringify(v.extra.filter((x) => "x:" + x !== id)),
      checklist: JSON.stringify(checklist),
      check_meta: JSON.stringify(sanitizeCheckMeta({ order: (v.meta.order ?? []).filter((x) => x !== id), items })),
    };
  },
};

export function planOf(db: DB, lead: Lead): PlanView {
  return planView(db.event_plans.find((p) => p.id === lead.id) ?? { id: lead.id });
}
export function planView(plan: EventPlan): PlanView {
  return {
    plan,
    timeline: parse<TimelineItem[]>(plan.timeline, []),
    suppliers: parse<Supplier[]>(plan.suppliers, []),
    checklist: parse<Record<string, boolean>>(plan.checklist, {}),
    extra: parse<string[]>(plan.extra_checks, []),
    after: parse<Record<string, boolean>>(plan.after, {}),
    meta: sanitizeCheckMeta(parse<unknown>(plan.check_meta, {})),
  };
}


/** מה דורש טיפול באירועים (כמו במשרד): לא מוכן בשבועיים, תשלום לפי התוכנית, המלצה אחרי */
export function eventTodos(db: DB) {
  const out: { lead: Lead; kind: "not_ready" | "review" | "payment" | "couple_task" | "check_late"; text: string; sub: string }[] = [];
  const today = todayISO();
  for (const l of db.leads) {
    if (l.status !== "won" || !l.event_date) continue;
    const d = daysUntil(l.event_date)!;
    const v = planOf(db, l);
    const r = readiness(v);
    if (d >= 0 && d <= 14 && r.pct < 100) out.push({ lead: l, kind: "not_ready", text: `${l.event_type}: ${l.name}`, sub: `בעוד ${d} ימים · מוכן ${r.done} מתוך ${r.total}` });
    for (const p of duePayments(db, l)) out.push({ lead: l, kind: "payment", text: `תשלום: ${l.name} · ${p.name}`, sub: p.late ? `באיחור של ${-p.days} ימים · ₪${p.amount.toLocaleString("he-IL")}` : `בעוד ${p.days} ימים · ₪${p.amount.toLocaleString("he-IL")}` });
    const lateChecks = d >= -21 ? checkItems(v).filter((it) => checkLate(it, today)) : [];
    if (lateChecks.length) out.push({ lead: l, kind: "check_late", text: `הכנה באיחור: ${l.name}`, sub: lateChecks.length === 1 ? `"${lateChecks[0].label}" · היעד היה ${shortDate(lateChecks[0].due)}` : `${lateChecks.length} פריטים בצ'קליסט עברו את תאריך היעד` });
    const late = d >= 0 ? lateTasks(parseTasks(v.plan.client_tasks)) : [];
    if (late.length) out.push({ lead: l, kind: "couple_task", text: `הזוג תקוע: ${l.name}`, sub: `${late.length === 1 ? `"${late[0].title}"` : `${late.length} משימות`} באיחור של יותר משבוע · להציע עזרה` });
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

/** שלבי תוכנית התשלומים (מכרטיס הלקוח) שלא סומנו כשולמו, ומועדם עבר או בעוד 3 ימים לכל היותר */
export function duePayments(_db: DB, l: Lead, withinDays = 3) {
  return duePays([l], withinDays).map(({ pay, days, late }) => ({ name: pay.name, amount: Number(pay.amount) || 0, due: pay.due!, days, late }));
}
