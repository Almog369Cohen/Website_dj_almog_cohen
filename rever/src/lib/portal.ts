import type { DB, EventPlan, Lead, PlanPayment, PortalSection, Supplier, TimelineItem } from "./types";
import { DOC_TYPES, SUPPLIER_CATEGORIES } from "./types";
import { CHECKS, byTime } from "./events";
import { TASKS_LOG_PREFIX, describeChange, parseTasks, partnersOf, sanitizeDismissed, sanitizeTasks, type ClientTask } from "./tasks";

/**
 * הקישור ללקוח: מה הלקוח מקבל.
 * הכל נבנה כאן מרשימה סגורה של שדות. שדה חדש שיתווסף למערכת לא ייחשף ללקוח בלי לגעת בקובץ הזה.
 * אותה לוגיקה ממומשת גם ב-apps-script/Code.gs (clientView_), והבדיקות משוות בין השתיים.
 */

/** איך הלקוח רואה כל שלב בצ'קליסט */
export const CLIENT_STEP_LABELS: Record<string, string> = {
  contract: "החוזה נחתם",
  deposit: "מקדמה התקבלה",
  meeting: "פגישת תיאום",
  suppliers: "הספקים נסגרו",
  timeline: "לו״ז סופי",
  venue: "תיאום עם המקום",
  invoice: "חשבונית",
  final_payment: "תשלום אחרון",
};
export const DEFAULT_CLIENT_STEPS = ["contract", "deposit", "meeting", "suppliers", "timeline"];
export const DEFAULT_SECTIONS: Record<PortalSection, boolean> = { status: true, tasks: true, timeline: true, payments: true, suppliers: true, details: true };

export interface ClientView {
  business: string;
  event: { name: string; type: string; date?: string; venue?: string; guests?: number };
  sections: Record<PortalSection, boolean>;
  readiness?: number;
  steps?: { label: string; done: boolean }[];
  timeline?: { time: string; title: string }[];
  payments?: {
    total: number;
    paid: number;
    balance: number;
    plan: { name: string; amount: number; due?: string; paid: boolean }[];
    docs: { label: string; number: string; date: string }[];
  };
  suppliers?: { category: string; icon: string; name: string; phone?: string }[];
  details?: { venue?: string; arrival?: string; guests?: number; day_contact?: string; requests?: string };
  contact: { name: string; phone?: string };
  tasks?: { list: ClientTask[]; rev: number; partners: { a: string; b: string }; dismissed: string[] };
}

const parse = <X>(s: string | undefined, d: X): X => {
  if (!s) return d;
  try {
    return JSON.parse(s) as X;
  } catch {
    return d;
  }
};

/** מחלק את מה ששולם על פני שלבי התוכנית, לפי הסדר */
export function allocatePlan(plan: PlanPayment[], paid: number) {
  let left = paid;
  return plan.map((p) => {
    const ok = left >= p.amount - 0.5;
    left -= p.amount;
    return { name: p.name, amount: p.amount, due: p.due, paid: ok };
  });
}

export function clientView(input: { lead: Lead; plan: EventPlan; db: Pick<DB, "payments" | "docs" | "settings" | "members"> }): ClientView {
  const { lead, plan, db } = input;
  const sections = { ...DEFAULT_SECTIONS, ...parse<Partial<Record<PortalSection, boolean>>>(plan.portal_sections, {}) };
  const checklist = parse<Record<string, boolean>>(plan.checklist, {});
  const extra = parse<string[]>(plan.extra_checks, []);
  const ids = [...CHECKS.map((c) => c.id), ...extra.map((x) => "x:" + x)];
  const owner = db.members.find((m) => m.id === lead.assigned_to);
  const settings = db.settings[0];

  const view: ClientView = {
    business: settings?.business_name || "",
    event: { name: lead.name, type: lead.event_type, date: lead.event_date, venue: lead.venue, guests: lead.guests },
    sections,
    contact: { name: (owner?.name || settings?.owner_name || settings?.business_name || "").split(" ")[0], phone: owner?.phone || settings?.contact_phone || undefined },
  };

  if (sections.status) {
    view.readiness = ids.length ? Math.round((ids.filter((i) => checklist[i]).length / ids.length) * 100) : 0;
    view.steps = parse<string[]>(plan.client_steps, DEFAULT_CLIENT_STEPS)
      .filter((id) => CLIENT_STEP_LABELS[id])
      .map((id) => ({ label: CLIENT_STEP_LABELS[id], done: !!checklist[id] }));
  }
  if (sections.tasks) {
    view.tasks = {
      list: parseTasks(plan.client_tasks),
      rev: Number(plan.client_tasks_rev) || 0,
      partners: partnersOf(lead, plan),
      dismissed: parse<string[]>(plan.dismissed_suggestions, []),
    };
  }
  if (sections.timeline) {
    view.timeline = parse<TimelineItem[]>(plan.timeline, [])
      .filter((t) => t.show_client !== false && t.title)
      .sort(byTime)
      .map((t) => ({ time: t.time, title: t.title }));
  }
  if (sections.payments) {
    const total = Number(lead.price) || 0;
    const paid = db.payments.filter((p) => p.lead_id === lead.id).reduce((s, p) => s + (p.kind === "refund" ? -p.amount : p.amount), 0);
    view.payments = {
      total,
      paid,
      balance: Math.max(0, total - paid),
      plan: allocatePlan(parse<PlanPayment[]>(plan.payment_plan, []), paid),
      docs: db.docs
        .filter((d) => d.lead_id === lead.id && d.show_client && d.status !== "cancelled")
        .map((d) => ({ label: DOC_TYPES[d.type], number: d.number, date: d.date })),
    };
  }
  if (sections.suppliers) {
    view.suppliers = parse<Supplier[]>(plan.suppliers, [])
      .filter((s) => s.show_client && s.name)
      .map((s) => {
        const c = SUPPLIER_CATEGORIES.find((x) => x.id === s.category);
        return { category: c?.label || s.role || "", icon: c?.icon || "🤝", name: s.name, phone: s.phone || undefined };
      });
  }
  if (sections.details) {
    const tl = view.timeline ?? [];
    view.details = {
      venue: lead.venue,
      arrival: tl.find((t) => /קבלת פנים|הגעת אורחים/.test(t.title))?.time,
      guests: lead.guests,
      day_contact: plan.contact_name || undefined,
      requests: plan.requests || undefined,
    };
  }
  return view;
}

/** 32 תווים אקראיים לקישור */
export function newPortalToken() {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const portalPath = (token: string) => `/e?t=${encodeURIComponent(token)}`;

/* ───────── כניסת הזוג: טלפון + קוד ───────── */

export const CLIENT_SESSION_DAYS = 90;
export const CLIENT_MAX_TRIES = 5;
export const CLIENT_LOCK_MIN = 15;
export const CLIENT_LOGIN_ERROR = "טלפון או קוד שגויים";

/** 050-123-4567 / +972501234567 → 0501234567 */
export const normPhone = (p: unknown) => {
  const d = String(p ?? "").replace(/\D/g, "");
  return d.startsWith("972") ? "0" + d.slice(3) : d;
};

/** קוד כניסה בן 6 ספרות */
export function newPortalCode() {
  const b = new Uint32Array(1);
  crypto.getRandomValues(b);
  return String(100000 + (b[0] % 900000));
}

/** מוצא את האירוע לפי טלפון + קוד (לקוח עם שני אירועים: הקוד מכריע) */
export function findByLogin(leads: Lead[], plans: EventPlan[], phone: string, code: string) {
  const p = normPhone(phone);
  const mine = plans.filter((pl) => {
    const l = leads.find((x) => x.id === pl.id);
    return l && l.status === "won" && pl.portal_enabled && normPhone(l.phone) === p;
  });
  return { candidates: mine, match: mine.find((pl) => pl.portal_code && String(pl.portal_code) === String(code).trim()) ?? null };
}

/* ───────── שמירת משימות מהלקוח (אותה לוגיקה בשרת ובדמו) ───────── */

export class TasksConflict extends Error {}

/**
 * מקבל את מה שהלקוח שלח ומחזיר רק את השדות שמותר לכתוב + שורת היסטוריה.
 * rev חייב להיות זהה לגרסה השמורה, אחרת זו התנגשות (מישהו אחר שמר בינתיים).
 */
export function applyClientTasks(plan: EventPlan, input: { tasks: unknown; dismissed?: unknown; rev: unknown }, opts: { client: boolean } = { client: true }) {
  const sections = { ...DEFAULT_SECTIONS, ...parse<Partial<Record<PortalSection, boolean>>>(plan.portal_sections, {}) };
  if (opts.client && !sections.tasks) throw new Error("המשימות לא פתוחות לעריכה");
  const cur = Number(plan.client_tasks_rev) || 0;
  if (Number(input.rev) !== cur) throw new TasksConflict("הרשימה עודכנה בינתיים. טוענים מחדש");
  const tasks = sanitizeTasks(input.tasks);
  const prev = parseTasks(plan.client_tasks);
  return {
    patch: {
      client_tasks: JSON.stringify(tasks),
      client_tasks_rev: cur + 1,
      dismissed_suggestions: JSON.stringify(sanitizeDismissed(input.dismissed ?? parse<string[]>(plan.dismissed_suggestions, []))),
    },
    change: describeChange(prev, tasks),
    rev: cur + 1,
  };
}

/** רישום בהיסטוריה מקובץ: עדכון של אותה שעה מצטרף לשורה הקיימת */
export function mergeTasksLog(last: { text: string; at: string } | undefined, change: string, now: string) {
  if (last && last.text.startsWith(TASKS_LOG_PREFIX) && +new Date(now) - +new Date(last.at) < 3600e3) {
    const text = (last.text + " · " + change).slice(0, 400);
    return { update: true as const, text };
  }
  return { update: false as const, text: `${TASKS_LOG_PREFIX}: ${change}`.slice(0, 400) };
}
