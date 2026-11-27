import type { CalendarKind, DB, Settings } from "./types";

export interface AgendaItem {
  key: string;
  kind: CalendarKind;
  title: string;
  sub: string;
  start: string;
  allDay: boolean;
  end?: string;
  cat: string; // מזהה קטגוריית הצבע
  lead_id?: string;
  item_id?: string; // אם הגיע מטבלת calendar_items (ניתן לעריכה)
}

/* ───────── קטגוריות צבע ─────────
 * נשמרות בהגדרות העסק (רק מאסטר משנה). שלוש הראשונות קבועות: אירועים של לקוחות, פגישות ופולואפים.
 */
export const CAL_COLORS = ["green", "violet", "orange", "blue", "red", "gold", "teal", "pink", "gray"] as const;
export type CalColor = (typeof CAL_COLORS)[number];
export interface CalendarCat { id: string; label: string; color: CalColor }
export const BUILTIN_CATS: CalendarCat[] = [
  { id: "event", label: "אירוע", color: "green" },
  { id: "meeting", label: "פגישה", color: "violet" },
  { id: "followup", label: "פולואפ", color: "orange" },
];
export const MAX_CATS = 12;

/** הקטגוריות מההגדרות: הקבועות תמיד קיימות (אפשר לשנות להן שם וצבע), ועוד עד 9 של העסק */
export function calendarCats(settings?: Pick<Settings, "calendar_cats">): CalendarCat[] {
  let raw: unknown = [];
  try {
    raw = JSON.parse(settings?.calendar_cats || "[]");
  } catch {}
  return sanitizeCats(raw);
}
export function sanitizeCats(raw: unknown): CalendarCat[] {
  const list = Array.isArray(raw) ? raw : [];
  const clean = (c: Record<string, unknown>, fallback?: CalendarCat): CalendarCat | null => {
    const id = String(c?.id ?? fallback?.id ?? "").slice(0, 40);
    const label = String(c?.label ?? "").trim().slice(0, 30) || fallback?.label || "";
    const color = (CAL_COLORS as readonly string[]).includes(String(c?.color)) ? (c.color as CalColor) : fallback?.color || "gray";
    return id && label ? { id, label, color } : null;
  };
  const builtins = BUILTIN_CATS.map((b) => clean(list.find((c) => c?.id === b.id) ?? {}, b)!);
  const seen = new Set(builtins.map((b) => b.id));
  const extra: CalendarCat[] = [];
  for (const c of list) {
    const x = c && typeof c === "object" ? clean(c as Record<string, unknown>) : null;
    if (x && !seen.has(x.id) && extra.length < MAX_CATS - builtins.length) (seen.add(x.id), extra.push(x));
  }
  return [...builtins, ...extra];
}
/** הקטגוריה של פריט. נמחקה? חוזר לקטגוריה של הסוג שלו */
export const catOf = (cats: CalendarCat[], id: string, kind: string = "meeting") => cats.find((c) => c.id === id) ?? cats.find((c) => c.id === kind) ?? cats[1];

/* ───────── תצוגות ───────── */
export type CalView = "day" | "week" | "month";
/** תחילת השבוע (יום ראשון) */
export function weekStart(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - x.getDay());
  return x;
}
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** הימים שמוצגים בכל תצוגה */
export function viewDays(view: CalView, cursor: Date): Date[] {
  if (view === "day") return [new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())];
  if (view === "week") return Array.from({ length: 7 }, (_, i) => addDays(weekStart(cursor), i));
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const weeks = Math.ceil((first.getDay() + last.getDate()) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(weekStart(first), i));
}
/** קדימה/אחורה: יום, שבוע או חודש */
export function stepCursor(view: CalView, cursor: Date, n: number) {
  if (view === "day") return addDays(cursor, n);
  if (view === "week") return addDays(cursor, 7 * n);
  return new Date(cursor.getFullYear(), cursor.getMonth() + n, 1);
}

/** סוף הפריט: מה שנשמר, ואם אין (או שהוא לפני ההתחלה) שעה אחרי ההתחלה */
export const endOf = (a: Pick<AgendaItem, "start" | "end">) => {
  const s = +new Date(a.start), e = a.end ? +new Date(a.end) : NaN;
  return new Date(e > s ? e : s + 3600e3);
};

/**
 * פריסה בתצוגת שעות: פריטים חופפים יושבים זה לצד זה.
 * מחזיר לכל פריט עמודה ומספר עמודות בקבוצה, ומיקום בדקות מתחילת היום.
 */
export function layoutDay<T extends Pick<AgendaItem, "key" | "start" | "end">>(items: T[], day: Date) {
  const d0 = +new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const rows = items
    .map((it) => {
      const top = Math.max(0, (+new Date(it.start) - d0) / 60000);
      const bottom = Math.min(24 * 60, (+endOf(it) - d0) / 60000);
      return { it, top, bottom: Math.max(bottom, top + 20), col: 0, cols: 1 };
    })
    .sort((a, b) => a.top - b.top || b.bottom - a.bottom);
  let group: typeof rows = [];
  let groupEnd = -1;
  const close = () => {
    const cols = Math.max(1, ...group.map((g) => g.col + 1));
    group.forEach((g) => (g.cols = cols));
    group = [];
  };
  for (const r of rows) {
    if (r.top >= groupEnd && group.length) close();
    const used = new Set(group.filter((g) => g.bottom > r.top).map((g) => g.col));
    while (used.has(r.col)) r.col++;
    group.push(r);
    groupEnd = Math.max(groupEnd, r.bottom);
  }
  if (group.length) close();
  return rows;
}

/** כל מה שמופיע ביומן: פריטים ידניים + אירועים של לקוחות סגורים + פולואפים של לידים פתוחים */
export function agendaItems(db: DB): AgendaItem[] {
  const out: AgendaItem[] = [];
  for (const c of db.calendar_items) {
    const l = db.leads.find((x) => x.id === c.lead_id);
    out.push({
      key: "c" + c.id,
      kind: c.kind,
      title: c.title,
      sub: [c.kind === "meeting" ? "פגישה" : c.kind === "event" ? "אירוע" : "תזכורת", c.location, l?.event_type].filter(Boolean).join(" · "),
      start: c.start,
      end: c.ends_at,
      allDay: false,
      cat: c.cat || c.kind,
      lead_id: c.lead_id,
      item_id: c.id,
    });
  }
  for (const l of db.leads) {
    if (l.status === "won" && l.event_date) {
      out.push({
        key: "e" + l.id,
        kind: "event",
        title: `${l.event_type}: ${l.name}`,
        sub: [l.venue, l.guests ? `${l.guests} איש` : ""].filter(Boolean).join(" · ") || "אירוע",
        start: new Date(l.event_date + "T20:00:00").toISOString(),
        allDay: true,
        cat: "event",
        lead_id: l.id,
      });
    }
    if (!["won", "lost"].includes(l.status) && l.next_followup) {
      // לא להכפיל אם כבר יש פגישה לאותו ליד באותה שעה
      const dup = db.calendar_items.some((c) => c.lead_id === l.id && c.start === l.next_followup);
      if (!dup)
        out.push({
          key: "f" + l.id,
          kind: "followup",
          title: `פולואפ: ${l.name}`,
          sub: l.followup_note || "לחזור ללקוח",
          start: l.next_followup,
          allDay: false,
          cat: "followup",
          lead_id: l.id,
        });
    }
  }
  return out.sort((a, b) => +new Date(a.start) - +new Date(b.start));
}
