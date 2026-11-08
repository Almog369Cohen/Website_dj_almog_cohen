/**
 * בדיקות הרשאות צד-שרת (מה כל עובד מקבל ומה מותר לו לכתוב), עם מסד מדומה בזיכרון.
 * הרצה: npm test
 */
import assert from "node:assert/strict";
import type { Member } from "../src/lib/types";

type Row = Record<string, unknown>;
const tables: Record<string, Row[]> = {};

// ---- מסד מדומה שמחקה את מה ש-supabase-js מחזיר ----
function q(table: string) {
  let rows = () => (tables[table] ??= []);
  const filters: [string, unknown][] = [];
  let op: "select" | "delete" | "update" = "select";
  let patch: Row = {};
  let head = false;
  const apply = () => rows().filter((r) => filters.every(([k, v]) => r[k] === v));
  const b = {
    select(_c?: string, o?: { head?: boolean }) { head = !!o?.head; return b; },
    eq(k: string, v: unknown) { filters.push([k, v]); return b; },
    order() { return b; },
    maybeSingle() { return Promise.resolve({ data: apply()[0] ?? null, error: null }); },
    delete() { op = "delete"; return b; },
    update(p: Row) { op = "update"; patch = p; return b; },
    upsert(r: Row) {
      const i = rows().findIndex((x) => x.id === r.id);
      if (i >= 0) rows()[i] = { ...rows()[i], ...r }; else rows().push({ ...r });
      return Promise.resolve({ error: null });
    },
    insert(r: Row) { rows().push({ ...r }); return Promise.resolve({ error: null }); },
    then(res: (v: unknown) => void) {
      if (op === "delete") { const keep = rows().filter((r) => !apply().includes(r)); tables[table] = keep; return res({ error: null }); }
      if (op === "update") { apply().forEach((r) => Object.assign(r, patch)); return res({ error: null }); }
      const data = apply().map((r) => ({ ...r }));
      return res(head ? { count: data.length, error: null } : { data, error: null });
    },
  };
  return b;
}
(globalThis as Record<string, unknown>).__reverTestDb = { from: q };

const M = (p: Partial<Member> & { id: string; role: Member["role"] }): Row => ({
  name: p.id, can_prices: false, can_finance: false, can_delete: false, can_templates: false, active: true, pin_hash: "x", ...p,
});

async function main() {
  const { readAll, writeRow, deleteRow, Forbidden } = await import("../src/lib/server/access");
  const { hashPin, checkPin, makeSession, verifySession } = await import("../src/lib/server/session");

  tables.members = [M({ id: "gal", role: "admin" }), M({ id: "liel", role: "admin" }), M({ id: "arad", role: "team", can_templates: true }), M({ id: "sapir", role: "team" })];
  tables.leads = [{ id: "L1", name: "דנה", phone: "050", status: "won", price: 20000, event_type: "חתונה", source: "אתר", created_at: "2026-01-01" }];
  tables.activities = [
    { id: "A1", lead_id: "L1", kind: "note", text: "נשלחה הצעת מחיר ₪20,000", at: "x" },
    { id: "A2", lead_id: "L1", kind: "payment", text: "התקבלה מקדמה ₪5,000", at: "x" },
  ];
  tables.payments = [{ id: "P1", lead_id: "L1", kind: "deposit", amount: 5000, date: "2026-01-01", method: "ביט" }];
  tables.expenses = []; tables.docs = []; tables.calendar_items = []; tables.templates = [{ id: "t1", name: "x", description: "", body: "a", sort: 1 }];
  tables.settings = [{ id: "main", business_name: "רבר", owner_name: "", whatsapp_mode: "webhook", make_webhook_url: "https://hook", vat_rate: 18 }];

  const pub = (id: string) => {
    const r = tables.members.find((m) => m.id === id)!;
    return { ...r, has_pin: true } as unknown as Member;
  };
  let n = 0;
  const ok = (name: string, fn: () => unknown) => Promise.resolve(fn()).then(() => console.log(`✓ ${++n}. ${name}`));
  const denied = async (p: Promise<unknown>) => assert.ok(await p.then(() => false, (e) => e instanceof Forbidden), "expected Forbidden");

  // ---- קריאה ----
  await ok("מאסטר רואה מחירים, תשלומים ו-webhook", async () => {
    const d = await readAll(pub("gal"));
    assert.equal(d.leads[0].price, 20000);
    assert.equal(d.payments.length, 1);
    assert.equal(d.settings[0].make_webhook_url, "https://hook");
  });
  await ok("ספיר (בלי הרשאות) לא מקבלת מחיר, תשלומים, סכומים בהיסטוריה או webhook", async () => {
    const d = await readAll(pub("sapir"));
    assert.equal("price" in d.leads[0], false);
    assert.equal(d.payments.length, 0);
    assert.ok(d.activities.every((a) => !/\d/.test(a.text.replace(/[^₪\d]/g, "")) || !a.text.includes("20,000")));
    assert.equal(d.activities.some((a) => a.kind === "payment"), false);
    assert.equal(d.activities[0].text, "נשלחה הצעת מחיר ₪•••");
    assert.equal(d.settings[0].make_webhook_url, undefined);
  });
  await ok("רשימת העובדים לא כוללת את הקוד המוצפן", async () => {
    const d = await readAll(pub("sapir"));
    assert.ok(d.members.every((m) => !("pin_hash" in m) && !("failed_attempts" in m)));
  });

  // ---- כתיבה ----
  await ok("ספיר מעדכנת סטטוס ליד, והמחיר לא נמחק", async () => {
    const { price: _p, ...lead } = tables.leads[0];
    await writeRow(pub("sapir"), "leads", { ...lead, status: "talk" });
    assert.equal(tables.leads[0].status, "talk");
    assert.equal(tables.leads[0].price, 20000);
  });
  await ok("ספיר לא יכולה לשנות מחיר", async () => {
    await writeRow(pub("sapir"), "leads", { ...tables.leads[0], price: 1 });
    assert.equal(tables.leads[0].price, 20000);
  });
  await ok("ספיר לא יכולה לרשום תשלום", () => denied(writeRow(pub("sapir"), "payments", { id: "P2", lead_id: "L1", kind: "payment", amount: 1, date: "x", method: "x" })));
  await ok("ספיר לא יכולה למחוק ליד", () => denied(deleteRow(pub("sapir"), "leads", "L1")));
  await ok("ספיר לא יכולה לשנות הגדרות", () => denied(writeRow(pub("sapir"), "settings", { ...tables.settings[0], business_name: "x" })));
  await ok("ספיר לא יכולה להפוך את עצמה למאסטר", () => denied(writeRow(pub("sapir"), "members", { ...tables.members[3], role: "admin" })));
  await ok("ספיר לא יכולה לערוך תבנית, ארד (עם הרשאה) כן", async () => {
    await denied(writeRow(pub("sapir"), "templates", { ...tables.templates[0], body: "x" }));
    await writeRow(pub("arad"), "templates", { ...tables.templates[0], body: "חדש" });
    assert.equal(tables.templates[0].body, "חדש");
  });
  await ok("עמודות לא מוכרות נזרקות (אי אפשר להזריק pin_hash)", async () => {
    await writeRow(pub("gal"), "members", { ...pub("sapir"), pin_hash: "hacked" });
    assert.equal(tables.members.find((m) => m.id === "sapir")!.pin_hash, "x");
  });
  await ok("גל פותחת לספיר מחירים, וספיר רואה מחיר אבל לא תשלומים", async () => {
    await writeRow(pub("gal"), "members", { ...pub("sapir"), can_prices: true });
    const d = await readAll(pub("sapir"));
    assert.equal(d.leads[0].price, 20000);
    assert.equal(d.payments.length, 0);
  });
  await ok("מאסטר לא יכול להוריד לעצמו מאסטר או להסיר את עצמו", async () => {
    await denied(writeRow(pub("gal"), "members", { ...pub("gal"), role: "team" }));
    await denied(deleteRow(pub("gal"), "members", "gal"));
  });

  // ---- קודים וסשן ----
  await ok("קוד נשמר מוצפן ונבדק נכון", () => {
    const h = hashPin("1234");
    assert.ok(!h.includes("1234"));
    assert.ok(checkPin("1234", h));
    assert.ok(!checkPin("1235", h));
  });
  await ok("סשן חתום: זיוף נדחה", () => {
    const s = makeSession("sapir");
    assert.equal(verifySession(s), "sapir");
    const [p, mac] = s.split(".");
    const forged = Buffer.from(JSON.stringify({ sid: "gal", exp: Date.now() + 1e7 })).toString("base64url");
    assert.equal(verifySession(`${forged}.${mac}`), null);
    assert.equal(verifySession(`${p}.AAAA`), null);
  });
  console.log(`\nכל ${n} הבדיקות עברו`);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
