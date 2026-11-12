"use client";
import { applyClientTasks, clientView, findByLogin, mergeTasksLog, normPhone, CLIENT_LOGIN_ERROR, TasksConflict, type ClientView } from "./portal";
import { TASKS_LOG_PREFIX } from "./tasks";
import { markLocalSeen, portalSheetsCall, readLocalDB, sheetsUrl, supabase, writeLocalDB } from "./repo";

/**
 * דף הלקוח מדבר עם השרת רק דרך הקובץ הזה: כניסה, צפייה, שמירת משימות, ותצוגה מקדימה לצוות.
 * שלושה מצבים: Supabase (/api/portal), גוגל שיטס (Apps Script), ודמו (נתונים בדפדפן).
 */

export type PortalErrorCode = "auth" | "conflict" | "bad" | "net";
export class PortalError extends Error {
  constructor(msg: string, public code: PortalErrorCode) {
    super(msg);
  }
}

const SESSION_KEY = "rever-client-session";
export const clientSession = {
  get: () => {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  },
  set: (v: string | null) => {
    try {
      if (v) localStorage.setItem(SESSION_KEY, v);
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  },
};

async function api<T>(body: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch("/api/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  } catch {
    throw new PortalError("אין חיבור לאינטרנט. נסו שוב", "net");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PortalError(data.error || "שגיאה. נסו שוב", (data.code as PortalErrorCode) || "bad");
  return data as T;
}
async function sheets<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  try {
    return await portalSheetsCall<T>(action, payload);
  } catch (e) {
    const code = (e as { code?: string }).code;
    throw new PortalError(e instanceof Error ? e.message : String(e), code === "auth" || code === "conflict" ? code : "bad");
  }
}

/* ───── מצב דמו: אותה לוגיקה, על הנתונים שבדפדפן ───── */
const demoSession = (id: string, ver: number) => `demo.${id}.${ver}`;
function demoPlan(session: string) {
  const [, id, ver] = session.split(".");
  const db = readLocalDB();
  const plan = db?.event_plans.find((p) => p.id === id);
  const lead = db?.leads.find((l) => l.id === id);
  if (!db || !plan || !lead || lead.status !== "won" || !plan.portal_enabled || String(Number(plan.portal_code_ver) || 0) !== ver) return null;
  return { db, plan, lead };
}

export async function login(phone: string, code: string): Promise<string> {
  if (supabase()) return (await api<{ session: string }>({ action: "login", phone, code })).session;
  if (sheetsUrl()) return (await sheets<{ session: string }>("portal_login", { phone, code })).session;
  const db = readLocalDB();
  const { match } = findByLogin(db?.leads ?? [], db?.event_plans ?? [], normPhone(phone), code);
  if (!match) throw new PortalError(CLIENT_LOGIN_ERROR, "bad");
  return demoSession(match.id, Number(match.portal_code_ver) || 0);
}

export async function view(session: string): Promise<ClientView> {
  if (supabase()) return api<ClientView>({ action: "view", session });
  if (sheetsUrl()) return (await sheets<{ view: ClientView }>("portal_view", { session })).view;
  const d = demoPlan(session);
  if (!d) throw new PortalError("נדרשת כניסה מחדש", "auth");
  const v = clientView({ lead: d.lead, plan: d.plan, db: d.db });
  markLocalSeen(d.db, d.plan.id);
  return v;
}

export async function saveTasks(session: string, input: { tasks: unknown; dismissed: string[]; rev: number }): Promise<number> {
  if (supabase()) return (await api<{ rev: number }>({ action: "tasks", session, ...input })).rev;
  if (sheetsUrl()) return (await sheets<{ rev: number }>("portal_tasks", { session, ...input })).rev;
  const d = demoPlan(session);
  if (!d) throw new PortalError("נדרשת כניסה מחדש", "auth");
  try {
    const r = applyClientTasks(d.plan, input);
    Object.assign(d.plan, r.patch);
    const now = new Date().toISOString();
    const last = d.db.activities.filter((a) => a.lead_id === d.plan.id && a.text.startsWith(TASKS_LOG_PREFIX)).sort((a, b) => b.at.localeCompare(a.at))[0];
    const m = mergeTasksLog(last, r.change, now);
    if (m.update && last) Object.assign(last, { text: m.text, at: now });
    else d.db.activities.push({ id: Math.random().toString(36).slice(2), lead_id: d.plan.id, kind: "note", text: m.text, at: now });
    writeLocalDB(d.db);
    return r.rev;
  } catch (e) {
    if (e instanceof TasksConflict) throw new PortalError(e.message, "conflict");
    throw new PortalError(e instanceof Error ? e.message : String(e), "bad");
  }
}

/** תצוגה מקדימה לצוות (הקישור הסודי): קריאה בלבד */
export async function preview(token: string): Promise<ClientView | null> {
  try {
    if (supabase()) {
      const r = await fetch(`/api/portal?t=${encodeURIComponent(token)}`, { cache: "no-store" });
      return r.ok ? ((await r.json()) as ClientView) : null;
    }
    if (sheetsUrl()) return (await sheets<{ view: ClientView }>("portal_preview", { portal_token: token })).view;
    const db = readLocalDB();
    const plan = db?.event_plans?.find((p) => p.portal_token === token && p.portal_enabled);
    const lead = plan && db!.leads.find((l) => l.id === plan.id && l.status === "won");
    return plan && lead ? clientView({ lead, plan, db: db! }) : null;
  } catch {
    return null;
  }
}
