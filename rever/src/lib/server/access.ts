import "server-only";
import type { DB, Member, Table } from "../types";
import { memberCan, TABLES } from "../types";
import { adminDb } from "./db";
import { readSession } from "./session";

/** העמודות שמותר לכתוב לכל טבלה (כל השאר נזרק). */
const COLUMNS: Record<Table, string[]> = {
  leads: ["id", "name", "phone", "email", "event_type", "event_date", "guests", "venue", "source", "status", "price", "next_followup", "followup_note", "pending_message", "last_contact", "notes", "assigned_to", "created_at"],
  activities: ["id", "lead_id", "kind", "text", "at", "by"],
  calendar_items: ["id", "kind", "title", "start", "location", "lead_id"],
  templates: ["id", "name", "description", "body", "sort"],
  payments: ["id", "lead_id", "kind", "amount", "date", "method", "note"],
  expenses: ["id", "date", "amount", "category", "supplier", "note", "lead_id"],
  docs: ["id", "lead_id", "type", "number", "amount", "date", "status"],
  settings: ["id", "business_name", "owner_name", "whatsapp_mode", "make_webhook_url", "vat_rate", "sheet_url", "sheet_map", "sheet_auto", "sheet_last_pull"],
  members: ["id", "name", "title", "role", "can_prices", "can_finance", "can_delete", "can_templates", "active", "created_at"],
};
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
    role: r.role as Member["role"],
    can_prices: !!r.can_prices,
    can_finance: !!r.can_finance,
    can_delete: !!r.can_delete,
    can_templates: !!r.can_templates,
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
  if (table === "members") {
    if (row.id === me.id && (row.role !== "admin" || row.active === false)) throw new Forbidden("אי אפשר להוריד לעצמך הרשאת מאסטר");
    for (const k of ["can_prices", "can_finance", "can_delete", "can_templates", "active"]) row[k] = !!row[k];
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
