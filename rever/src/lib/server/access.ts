import "server-only";
import type { DB, Member, Table } from "../types";
import { memberCan, TABLES } from "../types";
import { adminDb } from "./db";
import { readSession } from "./session";

/** העמודות שמותר לכתוב לכל טבלה (כל השאר נזרק). */
const COLUMNS: Record<Table, string[]> = {
  leads: ["id", "name", "phone", "email", "event_type", "event_date", "guests", "venue", "source", "status", "price", "next_followup", "followup_note", "pending_message", "last_contact", "notes", "assigned_to", "lost_reason", "created_at"],
  activities: ["id", "lead_id", "kind", "text", "at", "by"],
  calendar_items: ["id", "kind", "title", "start", "location", "lead_id"],
  templates: ["id", "name", "description", "body", "sort"],
  payments: ["id", "lead_id", "kind", "amount", "date", "method", "note"],
  expenses: ["id", "date", "amount", "category", "supplier", "note", "lead_id"],
  docs: ["id", "lead_id", "type", "number", "amount", "date", "status", "show_client"],
  settings: ["id", "business_name", "owner_name", "whatsapp_mode", "make_webhook_url", "vat_rate", "sheet_url", "sheet_map", "sheet_auto", "sheet_last_pull", "contact_phone"],
  members: ["id", "name", "title", "phone", "role", "can_prices", "can_finance", "can_delete", "can_templates", "can_portal", "active", "created_at"],
  event_plans: ["id", "timeline", "suppliers", "checklist", "extra_checks", "contact_name", "contact_phone", "requests", "notes", "after", "portal_token", "portal_enabled", "portal_sections", "portal_seen_at", "client_steps", "payment_plan", "contract_status", "internal_notes", "updated_at"],
};
const PORTAL_FIELDS = ["portal_token", "portal_enabled", "portal_sections", "client_steps"];

/** עלויות ספקים: מי שאין לו הרשאת מחירים לא מקבל ולא משנה אותן */
function stripCosts(json: unknown): string | undefined {
  if (typeof json !== "string") return undefined;
  try {
    return JSON.stringify((JSON.parse(json) as Record<string, unknown>[]).map(({ cost: _c, ...s }) => s));
  } catch {
    return json;
  }
}
function keepCosts(next: unknown, prev: unknown): string | null {
  if (typeof next !== "string") return null;
  try {
    const old = new Map(((prev ? JSON.parse(String(prev)) : []) as { id: string; cost?: number }[]).map((s) => [s.id, s.cost]));
    return JSON.stringify((JSON.parse(next) as Record<string, unknown>[]).map((s) => ({ ...s, cost: old.get(String(s.id)) })));
  } catch {
    return null;
  }
}
const FINANCE: Table[] = ["payments", "expenses", "docs"];

export const isTable = (t: unknown): t is Table => typeof t === "string" && (TABLES as string[]).includes(t);

/** העובד המחובר לפי העוגייה, כפי שהוא כרגע במסד (כדי ששינוי הרשאה או השבתה ייכנסו לתוקף מיד). */
export async function currentMember(): Promise<Member | null> {
  const sid = readSession();
  if (!sid) return null;
  const { data } = await adminDb().from("members").select("*").eq("id", sid).maybeSingle();
  if (!data || !data.active) return null;
  return publicMember(data);
}

export function publicMember(r: Record<string, unknown>): Member {
  return {
    id: r.id as string,
    name: r.name as string,
    title: (r.title as string) ?? undefined,
    phone: (r.phone as string) || undefined,
    role: r.role as Member["role"],
    can_prices: !!r.can_prices,
    can_finance: !!r.can_finance,
    can_delete: !!r.can_delete,
    can_templates: !!r.can_templates,
    can_portal: !!r.can_portal,
    active: !!r.active,
    has_pin: !!r.pin_hash,
    created_at: (r.created_at as string) ?? undefined,
  };
}

const stripNulls = (r: Record<string, unknown>) => {
  const o: Record<string, unknown> = {};
  for (const k in r) if (r[k] !== null && k !== "updated_at") o[k] = r[k];
  return o;
};
const maskMoney = (s: string) => s.replace(/₪\s?[\d,.]+/g, "₪•••");

/** קריאה: כל עובד מקבל רק את מה שמותר לו. מספרים לא נשלחים למי שאין לו הרשאה. */
export async function readAll(me: Member): Promise<DB> {
  const db = adminDb();
  const prices = memberCan(me, "prices");
  const finance = memberCan(me, "finance");
  const out = {} as Record<Table, unknown[]>;
  await Promise.all(
    TABLES.map(async (t) => {
      if (FINANCE.includes(t) && !finance) return void (out[t] = []);
      const { data, error } = await db.from(t).select("*");
      if (error) throw new Error(`${t}: ${error.message}`);
      let rows = (data ?? []).map(stripNulls);
      if (t === "members") rows = (data ?? []).map((r) => publicMember(r) as unknown as Record<string, unknown>);
      if (t === "leads" && !prices) rows = rows.map(({ price: _p, ...r }) => r);
      if (t === "activities" && !prices) rows = rows.filter((r) => r.kind !== "payment").map((r) => ({ ...r, text: maskMoney(String(r.text)) }));
      if (t === "settings" && me.role !== "admin") rows = rows.map(({ make_webhook_url: _w, ...r }) => r);
      if (t === "event_plans" && !prices) rows = rows.map((r) => ({ ...r, suppliers: stripCosts(r.suppliers) }));
      // תוכנית תשלומים בלי התשלומים עצמם נראית כמו "באיחור": רק למי שרואה מחירים וגם כספים
      if (t === "event_plans" && !(prices && finance)) rows = rows.map(({ payment_plan: _pp, ...r }) => r);
      if (t === "event_plans" && !memberCan(me, "portal")) rows = rows.map(({ portal_token: _t, ...r }) => r);
      out[t] = rows;
    }),
  );
  return out as unknown as DB;
}

export class Forbidden extends Error {}

/** כתיבה: בדיקת הרשאה לפי טבלה + סינון עמודות. */
export async function writeRow(me: Member, table: Table, input: Record<string, unknown>) {
  const db = adminDb();
  if (typeof input?.id !== "string" || !input.id) throw new Error("חסר id");
  const row: Record<string, unknown> = {};
  for (const c of COLUMNS[table]) if (c in input) row[c] = input[c] === undefined ? null : input[c];
  // שדות שנשלחו כ"לא קיימים" (undefined → נמחקו ב-JSON) צריכים להתאפס
  for (const c of COLUMNS[table]) if (!(c in input) && c !== "id") row[c] = null;

  if (FINANCE.includes(table) && !memberCan(me, "finance")) throw new Forbidden("אין הרשאת כספים");
  if (table === "templates" && !memberCan(me, "templates")) throw new Forbidden("אין הרשאה לערוך תבניות");
  if ((table === "settings" || table === "members") && me.role !== "admin") throw new Forbidden("רק מנהלים");

  if (table === "leads" && !memberCan(me, "prices")) {
    // מי שלא רואה מחירים לא יכול גם לשנות אותם: שומרים את המחיר הקיים
    const { data } = await db.from("leads").select("price").eq("id", row.id).maybeSingle();
    row.price = data?.price ?? null;
  }
  if (table === "settings" && !("make_webhook_url" in input)) delete row.make_webhook_url;
  const plans = memberCan(me, "prices") && memberCan(me, "finance");
  if (table === "event_plans" && (!plans || !memberCan(me, "portal"))) {
    const { data } = await db.from("event_plans").select("*").eq("id", row.id).maybeSingle();
    if (!memberCan(me, "prices")) row.suppliers = keepCosts(row.suppliers, data?.suppliers);
    if (!plans) row.payment_plan = data?.payment_plan ?? null; // תוכנית תשלומים = סכומים
    if (!memberCan(me, "portal")) for (const k of PORTAL_FIELDS) row[k] = data?.[k] ?? null; // רק מי שמורשה מפעיל / משנה את הקישור ללקוח
  }
  if (table === "event_plans") delete row.portal_seen_at; // נכתב רק כשהלקוח צופה
  if (table === "members") {
    if (row.id === me.id && (row.role !== "admin" || row.active === false)) throw new Forbidden("אי אפשר להוריד לעצמך הרשאת מאסטר");
    for (const k of ["can_prices", "can_finance", "can_delete", "can_templates", "can_portal", "active"]) row[k] = !!row[k];
    if (!["admin", "team"].includes(row.role as string)) row.role = "team";
  }
  const { error } = await db.from(table).upsert(row);
  if (error) throw new Error(error.message);
}

export async function deleteRow(me: Member, table: Table, id: string) {
  const ok =
    table === "templates"
      ? memberCan(me, "templates")
      : table === "members"
        ? me.role === "admin" && id !== me.id
        : table === "settings"
          ? false
          : FINANCE.includes(table)
            ? memberCan(me, "finance") && memberCan(me, "delete")
            : table === "activities"
              ? memberCan(me, "delete")
              : memberCan(me, "delete");
  if (!ok) throw new Forbidden("אין הרשאה למחוק");
  if (table === "members") {
    const { data } = await adminDb().from("members").select("id").eq("role", "admin").eq("active", true);
    if ((data ?? []).length <= 1 && data?.[0]?.id === id) throw new Forbidden("חייב להישאר מנהל אחד");
  }
  const { error } = await adminDb().from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** הקישור ללקוח: קריאה בלבד, לפי הקוד שבקישור. מחזיר רק את גרסת הלקוח (clientView). */
/** צפייה של הלקוח נרשמת בהיסטוריה, לכל היותר פעם ב-6 שעות */
export const SEEN_TEXT = "👀 הלקוח צפה בדף האירוע";
export const seenLogDue = (prev: unknown, now: string) => !prev || +new Date(now) - +new Date(String(prev)) >= 6 * 3600e3;

export async function portalView(token: string, preview: boolean) {
  const { clientView } = await import("../portal");
  if (!token || token.length < 20) return null;
  const db = adminDb();
  const { data: plan } = await db.from("event_plans").select("*").eq("portal_token", token).maybeSingle();
  if (!plan || !plan.portal_enabled) return null;
  const [{ data: lead }, { data: payments }, { data: docs }, { data: settings }, { data: members }] = await Promise.all([
    db.from("leads").select("*").eq("id", plan.id).maybeSingle(),
    db.from("payments").select("*").eq("lead_id", plan.id),
    db.from("docs").select("*").eq("lead_id", plan.id),
    db.from("settings").select("*"),
    db.from("members").select("id,name,phone"),
  ]);
  if (!lead || lead.status !== "won") return null;
  if (!preview) {
    const now = new Date().toISOString();
    const prev = plan.portal_seen_at;
    await db.from("event_plans").update({ portal_seen_at: now }).eq("id", plan.id);
    if (seenLogDue(prev, now)) await db.from("activities").insert({ id: crypto.randomUUID(), lead_id: plan.id, kind: "note", text: SEEN_TEXT, at: now });
  }
  const clean = (rows: Record<string, unknown>[] | null) => (rows ?? []).map(stripNulls);
  return clientView({
    lead: stripNulls(lead) as never,
    plan: stripNulls(plan) as never,
    db: { payments: clean(payments) as never, docs: clean(docs) as never, settings: clean(settings) as never, members: clean(members) as never },
  });
}
