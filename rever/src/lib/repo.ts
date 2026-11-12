import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DB, Table } from "./types";
import { demoDB } from "./seed";
import { applyClientTasks } from "./portal";

/** שכבת נתונים אחת עם שני מימושים: Supabase (אמיתי) או localStorage (דמו). */
export interface Repo {
  mode: "supabase" | "sheets" | "demo";
  /** קביעת קוד לעובד (בשרת) */
  setPin?(staffId: string, pin: string): Promise<void>;
  loadAll(): Promise<DB>;
  upsert<T extends Table>(table: T, row: DB[T][number]): Promise<void>;
  remove(table: Table, id: string): Promise<void>;
  reset?(): Promise<DB>;
  /** מצב דמו: מחיקת נתוני הדוגמה (שומר צוות, תבניות והגדרות) */
  clean?(): Promise<DB>;
  restore?(db: DB): Promise<DB>;
  /** המשימות של הזוג (מסלול נפרד עם גרסה, כדי לא לדרוס שינוי של הזוג) */
  saveTasks(id: string, input: { tasks: unknown; dismissed?: unknown; rev: number }): Promise<{ rev: number }>;
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
export const supabase = () => {
  if (!URL || !KEY) return null;
  if (!client) client = createClient(URL, KEY);
  return client;
};

const LS_KEY = "rever-crm-demo-v11";

/** מצב דמו: הלקוח צפה. מעדכן "נצפה לאחרונה" ורושם בהיסטוריה (לכל היותר פעם ב-6 שעות) */
export function markLocalSeen(db: DB, planId: string) {
  try {
    const now = new Date().toISOString();
    const plan = db.event_plans.find((p) => p.id === planId);
    if (!plan) return;
    const prev = plan.portal_seen_at;
    plan.portal_seen_at = now;
    if (!prev || +new Date(now) - +new Date(prev) >= 6 * 3600e3)
      db.activities.push({ id: Math.random().toString(36).slice(2), lead_id: planId, kind: "note", text: "👀 הלקוח צפה בדף האירוע", at: now });
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {}
}

/** מצב דמו: כל הנתונים מהדפדפן (לקישור ללקוח באותו מכשיר) */
export function readLocalDB(): DB | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as DB) : demoDB();
  } catch {
    return null;
  }
}

/** עובדים במצב דמו (כולל קודים), למסך בחירת העובד */
export function demoMembers() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return (JSON.parse(raw) as DB).members ?? [];
  } catch {}
  return demoDB().members;
}

class LocalRepo implements Repo {
  mode = "demo" as const;
  private read(): DB {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as DB;
    } catch {}
    const db = demoDB();
    this.write(db);
    return db;
  }
  private write(db: DB) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(db));
    } catch {}
  }
  async loadAll() {
    return this.read();
  }
  async upsert<T extends Table>(table: T, row: DB[T][number]) {
    const db = this.read();
    const list = db[table] as { id: string }[];
    const i = list.findIndex((r) => r.id === (row as { id: string }).id);
    if (i >= 0) list[i] = row as { id: string };
    else list.push(row as { id: string });
    this.write(db);
  }
  async saveTasks(id: string, input: { tasks: unknown; dismissed?: unknown; rev: number }) {
    const db = this.read();
    let plan = db.event_plans.find((p) => p.id === id);
    if (!plan) db.event_plans.push((plan = { id }));
    const r = applyClientTasks(plan, input, { client: false });
    Object.assign(plan, r.patch);
    this.write(db);
    return { rev: r.rev };
  }
  async remove(table: Table, id: string) {
    const db = this.read();
    (db[table] as { id: string }[]) = (db[table] as { id: string }[]).filter((r) => r.id !== id);
    this.write(db);
  }
  async reset() {
    const db = demoDB();
    this.write(db);
    return db;
  }
  async clean() {
    const cur = this.read();
    const db: DB = { ...cur, leads: [], activities: [], calendar_items: [], payments: [], expenses: [], docs: [] };
    this.write(db);
    return db;
  }
  async restore(db: DB) {
    for (const t of ["leads", "activities", "calendar_items", "templates", "payments", "expenses", "docs", "settings", "members"] as const)
      if (!Array.isArray(db[t])) throw new Error("קובץ גיבוי לא תקין");
    this.write(db);
    return db;
  }
}

/** מצב אמיתי: כל הנתונים עוברים דרך השרת של המערכת, שבודק את הרשאות העובד. */
class ApiRepo implements Repo {
  mode = "supabase" as const;
  private async call(method: string, url: string, body?: unknown) {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) window.dispatchEvent(new Event("rever:signed-out"));
    if (!res.ok) throw new Error(data.error || `שגיאה ${res.status}`);
    return data;
  }
  async loadAll() {
    return (await this.call("GET", "/api/data")) as DB;
  }
  async upsert<T extends Table>(table: T, row: DB[T][number]) {
    await this.call("POST", "/api/data", { table, row });
  }
  async saveTasks(id: string, input: { tasks: unknown; dismissed?: unknown; rev: number }) {
    return (await this.call("POST", "/api/data", { action: "tasks", id, ...input })) as { rev: number };
  }
  async remove(table: Table, id: string) {
    await this.call("DELETE", `/api/data?table=${table}&id=${encodeURIComponent(id)}`);
  }
}

/* ───────────── גוגל שיטס (Apps Script) ───────────── */

const SHEETS_URL_KEY = "rever-sheets-url";
const SHEETS_TOKEN_KEY = "rever-sheets-token";

/** כתובת השרת בגיליון: נקבעת בבנייה, או פעם אחת במכשיר (?connect=...) */
export function sheetsUrl(): string | null {
  const baked = process.env.NEXT_PUBLIC_SHEETS_URL;
  if (baked) return baked;
  if (typeof window === "undefined") return null;
  try {
    const p = new URLSearchParams(window.location.search).get("connect");
    if (p && /^https:\/\/script\.google\.com\/(a\/macros\/[^/]+|macros)\/s\/[\w-]+\/exec$/.test(p)) localStorage.setItem(SHEETS_URL_KEY, p);
    return localStorage.getItem(SHEETS_URL_KEY);
  } catch {
    return null;
  }
}
export function disconnectSheets() {
  try {
    localStorage.removeItem(SHEETS_URL_KEY);
    localStorage.removeItem(SHEETS_TOKEN_KEY);
  } catch {}
}
export const sheetsToken = {
  get: () => {
    try {
      return localStorage.getItem(SHEETS_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (t: string | null) => {
    try {
      if (t) localStorage.setItem(SHEETS_TOKEN_KEY, t);
      else localStorage.removeItem(SHEETS_TOKEN_KEY);
    } catch {}
  },
};

/** קריאה לשרת שבגיליון מדף הלקוח: בלי אסימון עובד, ובלי לנתק עובד שמחובר באותו מכשיר */
export async function portalSheetsCall<T = Record<string, unknown>>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = sheetsUrl();
  if (!url) throw new Error("הגיליון לא מחובר");
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action, ...payload }), redirect: "follow" });
  const data = await res.json().catch(() => ({ error: "תשובה לא תקינה" }));
  if (data.error) throw Object.assign(new Error(data.error), { code: data.code });
  return data as T;
}

/** מצב דמו: קריאה וכתיבה ישירה של הנתונים בדפדפן (לדף הלקוח באותו מכשיר) */
export function writeLocalDB(db: DB) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {}
}

/** קריאה לשרת שבגיליון. text/plain כדי שהדפדפן לא ישלח בקשת preflight. */
export async function sheetsCall<T = Record<string, unknown>>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = sheetsUrl();
  if (!url) throw new Error("הגיליון לא מחובר");
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, token: sheetsToken.get(), ...payload }),
      redirect: "follow",
    });
  } catch {
    throw new Error("אין חיבור לגיליון. בדקו אינטרנט ונסו שוב");
  }
  const data = await res.json().catch(() => ({ error: "תשובה לא תקינה מהגיליון" }));
  if (data.code === "auth") {
    sheetsToken.set(null);
    window.dispatchEvent(new Event("rever:signed-out"));
  }
  if (data.error) throw new Error(data.error);
  return data as T;
}

class SheetsRepo implements Repo {
  mode = "sheets" as const;
  async loadAll() {
    const r = await sheetsCall<{ db: DB }>("load");
    return r.db;
  }
  async upsert<T extends Table>(table: T, row: DB[T][number]) {
    await sheetsCall("upsert", { table, row });
  }
  async saveTasks(id: string, input: { tasks: unknown; dismissed?: unknown; rev: number }) {
    return sheetsCall<{ rev: number }>("tasks_save", { id, ...input });
  }
  async remove(table: Table, id: string) {
    await sheetsCall("remove", { table, id });
  }
  async setPin(staffId: string, pin: string) {
    await sheetsCall("set_pin", { staff_id: staffId, pin });
  }
}

export function makeRepo(): Repo {
  if (supabase()) return new ApiRepo();
  if (sheetsUrl()) return new SheetsRepo();
  return new LocalRepo();
}
