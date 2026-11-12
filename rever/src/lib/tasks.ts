import type { EventPlan, Lead } from "./types";

/**
 * "המשימות שלנו": רשימת משימות של הזוג (לא של רבר).
 * הזוג עורך אותה מדף הלקוח, הצוות מהכרטיס. אותה ולידציה רצה בשרת (כאן + apps-script/Code.gs: sanitizeTasks_).
 */

export type TaskOwner = "a" | "b" | "both" | "none";
export type TaskStatus = "todo" | "doing" | "on_it";
export type TaskSection = "before" | "after";

export interface ClientTask {
  id: string;
  title: string;
  owner: TaskOwner;
  category: string;
  status: TaskStatus;
  start?: string; // YYYY-MM-DD
  note?: string;
  done: boolean;
  section: TaskSection;
  order: number;
}

export const TASK_LIMITS = { count: 100, title: 120, note: 300, category: 40, id: 40, dismissed: 200 };
export const OWNERS: TaskOwner[] = ["a", "b", "both", "none"];
export const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "לא התחלנו" },
  { id: "doing", label: "בתהליך" },
  { id: "on_it", label: "אנחנו על זה" },
];

export const TASK_CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: "guests", label: "אורחים", icon: "👥" },
  { id: "rabbinate", label: "רבנות וטקס", icon: "📜" },
  { id: "outfit", label: "לבוש וטיפוח", icon: "👗" },
  { id: "rings", label: "טבעות", icon: "💍" },
  { id: "transport", label: "רכב והסעות", icon: "🚌" },
  { id: "day", label: "יום האירוע", icon: "🎉" },
  { id: "money", label: "כסף ומתנות", icon: "🎁" },
  { id: "after", label: "אחרי האירוע", icon: "💌" },
  { id: "other", label: "אחר", icon: "📌" },
];
export const categoryOf = (id: string) => TASK_CATEGORIES.find((c) => c.id === id) ?? TASK_CATEGORIES[TASK_CATEGORIES.length - 1];

type Tpl = { key: string; title: string; category: string; section?: TaskSection; owner?: TaskOwner; days?: number };
/** days = כמה ימים לפני האירוע להתחיל (שלילי = אחרי האירוע) */
const WEDDING: Tpl[] = [
  { key: "w-guests", title: "הכנת רשימת מוזמנים", category: "guests", owner: "both", days: 150 },
  { key: "w-rabbi", title: "פתיחת תיק ברבנות", category: "rabbinate", days: 90 },
  { key: "w-rings", title: "רכישת טבעות", category: "rings", owner: "both", days: 90 },
  { key: "w-dress", title: "בחירת שמלה", category: "outfit", owner: "a", days: 120 },
  { key: "w-suit", title: "בחירת חליפה", category: "outfit", owner: "b", days: 60 },
  { key: "w-invites", title: "עיצוב ושליחת הזמנות", category: "guests", owner: "both", days: 60 },
  { key: "w-rsvp", title: "אישורי הגעה מהמוזמנים", category: "guests", owner: "both", days: 21 },
  { key: "w-seating", title: "סידורי ישיבה", category: "guests", owner: "both", days: 10 },
  { key: "w-fitting", title: "מדידה אחרונה לשמלה", category: "outfit", owner: "a", days: 10 },
  { key: "w-thanks", title: "הודעות תודה לאורחים", category: "after", owner: "both", section: "after", days: -3 },
  { key: "w-album", title: "בחירת תמונות לאלבום", category: "after", owner: "both", section: "after", days: -14 },
];
const WEDDING_SUGGEST: Tpl[] = [
  { key: "s-bus", title: "הסעות לאורחים", category: "transport", days: 45 },
  { key: "s-kit", title: "ערכת חירום ליום האירוע", category: "day", days: 3 },
  { key: "s-ringholder", title: "מי מחזיק את הטבעות בחופה", category: "rabbinate", days: 7 },
  { key: "s-makeup", title: "ניסיון איפור ושיער", category: "outfit", owner: "a", days: 30 },
  { key: "s-vows", title: "כתיבת נדרים / מילים לחופה", category: "rabbinate", owner: "both", days: 14 },
  { key: "s-room", title: "חדר במלון ללילה של החתונה", category: "day", days: 30 },
  { key: "s-checks", title: "מי אוסף את המתנות והצ׳קים בסוף הערב", category: "money", days: 3 },
  { key: "s-return", title: "החזרת חליפה / שמלה", category: "after", section: "after", days: -3 },
];
const MITZVA: Tpl[] = [
  { key: "m-guests", title: "הכנת רשימת מוזמנים", category: "guests", owner: "both", days: 120 },
  { key: "m-torah", title: "תיאום עלייה לתורה", category: "rabbinate", days: 60 },
  { key: "m-outfit", title: "בגדים לחוגג/ת ולמשפחה", category: "outfit", days: 45 },
  { key: "m-invites", title: "עיצוב ושליחת הזמנות", category: "guests", owner: "both", days: 45 },
  { key: "m-video", title: "תמונות לסרטון / מצגת", category: "day", days: 30 },
  { key: "m-candles", title: "רשימת מדליקי נרות", category: "day", days: 14 },
  { key: "m-rsvp", title: "אישורי הגעה", category: "guests", owner: "both", days: 14 },
  { key: "m-thanks", title: "הודעות תודה", category: "after", section: "after", owner: "both", days: -3 },
];
const MITZVA_SUGGEST: Tpl[] = [
  { key: "s-speech", title: "כתיבת ברכה / דרשה", category: "rabbinate", days: 21 },
  { key: "s-kit", title: "ערכת חירום ליום האירוע", category: "day", days: 3 },
  { key: "s-checks", title: "מי אוסף את המתנות בסוף הערב", category: "money", days: 3 },
];
const GENERIC: Tpl[] = [
  { key: "g-guests", title: "רשימת מוזמנים", category: "guests", owner: "both", days: 60 },
  { key: "g-invites", title: "שליחת הזמנות", category: "guests", owner: "both", days: 30 },
  { key: "g-rsvp", title: "אישורי הגעה", category: "guests", owner: "both", days: 10 },
  { key: "g-thanks", title: "הודעות תודה", category: "after", section: "after", owner: "both", days: -3 },
];
const GENERIC_SUGGEST: Tpl[] = [
  { key: "s-kit", title: "ערכת חירום ליום האירוע", category: "day", days: 3 },
  { key: "s-bus", title: "הסעות לאורחים", category: "transport", days: 30 },
];

const lib = (eventType: string) =>
  /חתונה/.test(eventType) ? { base: WEDDING, suggest: WEDDING_SUGGEST } : /מצווה/.test(eventType) ? { base: MITZVA, suggest: MITZVA_SUGGEST } : { base: GENERIC, suggest: GENERIC_SUGGEST };

/** תאריך התחלה = X ימים לפני האירוע, אבל לא לפני היום (משימה חדשה לא נולדת "באיחור") */
const addDays = (ymd: string | undefined, d: number | undefined, today = new Date()) => {
  if (!ymd || d === undefined) return undefined;
  const t = new Date(ymd + "T12:00:00");
  t.setDate(t.getDate() - d);
  const now = new Date(today);
  now.setHours(12, 0, 0, 0);
  return (t < now ? now : t).toISOString().slice(0, 10);
};

let seq = 0;
const tid = () => "k" + Date.now().toString(36) + (seq++).toString(36) + Math.random().toString(36).slice(2, 6);
const fromTpl = (t: Tpl, eventDate: string | undefined, order: number): ClientTask => ({
  id: tid(),
  title: t.title,
  owner: t.owner ?? "none",
  category: t.category,
  status: "todo",
  start: addDays(eventDate, t.days),
  done: false,
  section: t.section ?? "before",
  order,
});

/** רשימה מוכנה לפי סוג האירוע (הצוות טוען אותה לזוג) */
export const starterTasks = (eventType: string, eventDate?: string) => lib(eventType).base.map((t, i) => fromTpl(t, eventDate, i));

/** עד 3 הצעות שלא קיימות ברשימה ושלא נסגרו */
export function suggestions(eventType: string, tasks: ClientTask[], dismissed: string[], max = 3) {
  const have = new Set(tasks.map((t) => t.title.trim()));
  return lib(eventType)
    .suggest.filter((s) => !have.has(s.title) && !dismissed.includes(s.key))
    .slice(0, max)
    .map((s) => ({ key: s.key, title: s.title, category: s.category, make: (eventDate: string | undefined, order: number) => fromTpl(s, eventDate, order) }));
}

export const newTask = (order: number, section: TaskSection = "before"): ClientTask => ({
  id: tid(), title: "", owner: "none", category: "other", status: "todo", done: false, section, order,
});

/** סדר תצוגה: לפני האירוע (פתוחות לפי הסדר, אחר כך שבוצעו), ואז אחרי האירוע */
export function sortTasks(tasks: ClientTask[]) {
  const by = (a: ClientTask, b: ClientTask) => Number(a.done) - Number(b.done) || a.order - b.order;
  return { before: tasks.filter((t) => t.section !== "after").sort(by), after: tasks.filter((t) => t.section === "after").sort(by) };
}

export const progress = (tasks: ClientTask[]) => {
  const done = tasks.filter((t) => t.done).length;
  return { done, total: tasks.length, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
};

const dayDiff = (ymd: string, today = new Date()) => {
  const a = new Date(ymd + "T12:00:00"), b = new Date(today);
  b.setHours(12, 0, 0, 0);
  return Math.round((+a - +b) / 86400000);
};
const dm = (ymd: string) => `${Number(ymd.slice(8, 10))}.${Number(ymd.slice(5, 7))}`;

/** "להתחיל בעוד 3 ימים" / "התחלנו ב-2.11" / "באיחור של 4 ימים" */
export function whenText(t: ClientTask, today = new Date()): { text: string; late: boolean } {
  if (!t.start) return { text: t.done ? "" : "אין תאריך", late: false };
  const d = dayDiff(t.start, today);
  if (t.done) return { text: "", late: false };
  if (t.status !== "todo") return { text: d <= 0 ? `התחלנו ב-${dm(t.start)}` : "", late: false };
  if (d > 0) return { text: d === 1 ? "להתחיל מחר" : `להתחיל בעוד ${d} ימים`, late: false };
  if (d === 0) return { text: "להתחיל היום", late: false };
  return { text: `באיחור של ${-d} ימים`, late: -d >= 1 };
}

/** משימות של הזוג שעבר מועדן ביותר משבוע (לתזכורת לצוות) */
export const lateTasks = (tasks: ClientTask[], days = 7, today = new Date()) =>
  tasks.filter((t) => !t.done && t.section !== "after" && t.status === "todo" && t.start && dayDiff(t.start, today) <= -days);

/** שמות בני הזוג: מה שהוזן, או פיצול של שם הליד ("שירן ועומר") */
export function partnersOf(lead: Pick<Lead, "name">, plan: Pick<EventPlan, "partner_a" | "partner_b">) {
  const parts = String(lead.name || "").split(/\s+ו(?=\S)|\s*&\s*|\s*\+\s*/);
  const a = plan.partner_a || (parts.length > 1 ? parts[0].trim() : "");
  const b = plan.partner_b || (parts.length > 1 ? parts[1].trim() : "");
  return { a: a || "צד א׳", b: b || "צד ב׳" };
}
export const ownerInitials = (o: TaskOwner, p: { a: string; b: string }) =>
  o === "a" ? p.a.slice(0, 1) : o === "b" ? p.b.slice(0, 1) : o === "both" ? `${p.a.slice(0, 1)}+${p.b.slice(0, 1)}` : "?";
export const ownerLabel = (o: TaskOwner, p: { a: string; b: string }) => (o === "a" ? p.a : o === "b" ? p.b : o === "both" ? "שנינו" : "עוד לא");

export const parseTasks = (s?: string): ClientTask[] => {
  try {
    const v = s ? JSON.parse(s) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

/* ───────── ולידציה (רצה בשרת על כל מה שהלקוח שולח) ───────── */

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const YMD = /^\d{4}-\d{2}-\d{2}$/;

/** מחזיר רשימה נקייה או זורק שגיאה. כל שדה שלא ברשימה נזרק. */
export function sanitizeTasks(input: unknown): ClientTask[] {
  if (!Array.isArray(input)) throw new Error("רשימה לא תקינה");
  if (input.length > TASK_LIMITS.count) throw new Error(`עד ${TASK_LIMITS.count} משימות`);
  const seen = new Set<string>();
  return input.map((raw, i) => {
    const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const id = str(r.id, TASK_LIMITS.id);
    const title = str(r.title, TASK_LIMITS.title + 1);
    if (!id || seen.has(id)) throw new Error("משימה בלי מזהה");
    if (!title) throw new Error("משימה בלי שם");
    if (title.length > TASK_LIMITS.title) throw new Error(`שם משימה עד ${TASK_LIMITS.title} תווים`);
    seen.add(id);
    if (!OWNERS.includes(r.owner as TaskOwner)) throw new Error("אחראי לא תקין");
    if (!STATUSES.some((s) => s.id === r.status)) throw new Error("סטטוס לא תקין");
    if (r.section !== "before" && r.section !== "after") throw new Error("חלק לא תקין");
    const start = str(r.start, 10);
    if (start && !YMD.test(start)) throw new Error("תאריך לא תקין");
    const note = str(r.note, TASK_LIMITS.note);
    const t: ClientTask = {
      id,
      title,
      owner: r.owner as TaskOwner,
      category: TASK_CATEGORIES.some((c) => c.id === r.category) ? (r.category as string) : "other",
      status: r.status as TaskStatus,
      done: r.done === true,
      section: r.section as TaskSection,
      order: Number.isFinite(Number(r.order)) ? Math.round(Number(r.order)) : i,
    };
    if (start) t.start = start;
    if (note) t.note = note;
    return t;
  });
}

export function sanitizeDismissed(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return [...new Set(input.filter((x) => typeof x === "string" && /^[a-z0-9-]{1,40}$/.test(x)))].slice(0, TASK_LIMITS.dismissed) as string[];
}

/** סיכום שינוי להיסטוריה: "סימנו: טבעות · הוסיפו: הסעות" */
export function describeChange(prev: ClientTask[], next: ClientTask[]) {
  const before = new Map(prev.map((t) => [t.id, t]));
  const after = new Map(next.map((t) => [t.id, t]));
  const doneNow = next.filter((t) => t.done && !before.get(t.id)?.done && before.has(t.id)).map((t) => t.title);
  const added = next.filter((t) => !before.has(t.id)).map((t) => t.title);
  const removed = prev.filter((t) => !after.has(t.id)).map((t) => t.title);
  const parts: string[] = [];
  if (doneNow.length) parts.push("סימנו: " + doneNow.join(", "));
  if (added.length) parts.push("הוסיפו: " + added.join(", "));
  if (removed.length) parts.push("מחקו: " + removed.join(", "));
  return parts.join(" · ") || "עדכנו פרטים";
}

export const TASKS_LOG_PREFIX = "✅ הזוג עדכן משימות";
