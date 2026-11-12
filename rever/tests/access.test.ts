/**
 * בדיקות הרשאות צד-שרת (מה כל עובד מקבל ומה מותר לו לכתוב), עם מסד מדומה בזיכרון.
 * הרצה: npm test
 */
import assert from "node:assert/strict";
import type { Member } from "../src/lib/types";

type Row = Record<string, unknown>;
const IS_NULL = Symbol("null");
const tables: Record<string, Row[]> = {};

// ---- מסד מדומה שמחקה את מה ש-supabase-js מחזיר ----
function q(table: string) {
  let rows = () => (tables[table] ??= []);
  const filters: [string, unknown][] = [];
  let op: "select" | "delete" | "update" = "select";
  let patch: Row = {};
  let head = false;
  const apply = () => rows().filter((r) => filters.every(([k, v]) => (v === IS_NULL ? r[k] == null : r[k] === v)));
  const b = {
    select(_c?: string, o?: { head?: boolean }) { head = !!o?.head; return b; },
    eq(k: string, v: unknown) { filters.push([k, v]); return b; },
    is(k: string, _v: null) { filters.push([k, IS_NULL]); return b; },
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
      if (op === "update") { const hit = apply(); hit.forEach((r) => Object.assign(r, patch)); return res({ data: hit.map((r) => ({ ...r })), error: null }); }
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

  await ok("כרטיס אירוע: עלויות ספקים מוסתרות ונשמרות", async () => {
    tables.event_plans = [{ id: "L1", suppliers: JSON.stringify([{ id: "s1", name: "דני", cost: 8000 }]) }];
    await writeRow(pub("gal"), "members", { ...pub("arad"), can_prices: false });
    const d = await readAll(pub("arad"));
    const seen = JSON.parse(d.event_plans[0].suppliers!);
    assert.equal("cost" in seen[0], false);
    seen[0].cost = 1;
    await writeRow(pub("arad"), "event_plans", { id: "L1", suppliers: JSON.stringify(seen) });
    assert.equal(JSON.parse(String(tables.event_plans[0].suppliers))[0].cost, 8000);
  });

  await ok("קישור ללקוח ותוכנית תשלומים: מוסתרים ונשמרים לפי הרשאה", async () => {
    tables.event_plans = [{ id: "L1", portal_token: "tok_x", portal_enabled: true, payment_plan: "[{\"amount\":5000}]" }];
    const d = await readAll(pub("arad"));
    assert.equal(d.event_plans[0].portal_token, undefined);
    assert.equal(d.event_plans[0].payment_plan, undefined);
    await writeRow(pub("arad"), "event_plans", { id: "L1", portal_enabled: false, portal_token: "hacked", payment_plan: "[]", notes: "x" });
    const r = tables.event_plans[0];
    assert.equal(r.portal_token, "tok_x"); assert.equal(r.portal_enabled, true); assert.match(String(r.payment_plan), /5000/); assert.equal(r.notes, "x");
  });

  await ok("מחירים בלי כספים: תוכנית התשלומים לא נשלחת ונשמרת", async () => {
    tables.event_plans = [{ id: "L1", payment_plan: "[{\"amount\":5000}]", suppliers: JSON.stringify([{ id: "s1", name: "דני", cost: 8000 }]) }];
    await writeRow(pub("gal"), "members", { ...pub("arad"), can_prices: true, can_finance: false });
    const d = await readAll(pub("arad"));
    assert.equal(d.event_plans[0].payment_plan, undefined);
    assert.equal(JSON.parse(d.event_plans[0].suppliers!)[0].cost, 8000);
    await writeRow(pub("arad"), "event_plans", { ...d.event_plans[0], payment_plan: "[]" });
    assert.match(String(tables.event_plans[0].payment_plan), /5000/);
  });
  await ok("שדות דיג'יי ישנים (שירים, רגעים, ציוד) נזרקים", async () => {
    await writeRow(pub("gal"), "event_plans", { id: "L1", must_songs: "x", no_songs: "y", moments: "{}", equipment: "{}" });
    const r = tables.event_plans[0];
    for (const k of ["must_songs", "no_songs", "moments", "equipment"]) assert.equal(k in r, false);
  });
  // ---- הזוג: כניסה בטלפון + קוד, צפייה, ושמירת משימות ----
  const T = (id: string, title: string, extra: Record<string, unknown> = {}) => ({ id, title, owner: "both", category: "guests", status: "todo", done: false, section: "before", order: 0, ...extra });
  let session = "";
  await ok("כניסת הזוג: טלפון + קוד נכונים בלבד; 5 טעויות נועלות", async () => {
    const { portalLogin } = await import("../src/lib/server/access");
    tables.leads[0].status = "won"; tables.leads[0].phone = "050-1234567"; tables.leads[0].assigned_to = "gal";
    tables.members.find((m) => m.id === "gal")!.phone = "050-1112222";
    tables.event_plans = [{ id: "L1", portal_token: "tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", portal_enabled: true, portal_code: "482913", portal_code_ver: 0, client_tasks_rev: 0, internal_notes: "סודי" }];
    await denied(portalLogin("0501234567", "111111"));
    session = (await portalLogin("+972-50-123-4567", "482913")).session;
    assert.ok(session.length > 20);
    for (let i = 0; i < 5; i++) await denied(portalLogin("0501234567", "000000"));
    await denied(portalLogin("0501234567", "482913")); // נעול, גם עם הקוד הנכון (ובלי לגלות שזה טלפון של לקוח)
    // במקביל: 30 ניסיונות בבת אחת לא עוקפים את הנעילה
    tables.event_plans[0].portal_locked_until = null; tables.event_plans[0].portal_fails = 0;
    const burst = await Promise.allSettled(Array.from({ length: 30 }, () => portalLogin("0501234567", "000000")));
    assert.ok(burst.every((r) => r.status === "rejected"));
    assert.ok(tables.event_plans[0].portal_locked_until, "חייב להינעל");
    tables.event_plans[0].portal_locked_until = null;
    await denied(portalLogin("0509999999", "482913")); // טלפון אחר
  });
  await ok("צפייה: רק עם אסימון תקף; נרשמת פעם אחת; טלפון המטפל; בלי הערות פנימיות", async () => {
    const { portalView } = await import("../src/lib/server/access");
    const before = tables.activities.length;
    const v = await portalView(session);
    await portalView(session);
    assert.equal(tables.activities.length, before + 1);
    assert.equal(v!.contact.phone, "050-1112222");
    assert.ok(!JSON.stringify(v).includes("סודי") && !JSON.stringify(v).includes("482913"));
    assert.equal(await portalView("tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), null); // הקישור הסודי לא מספיק
    assert.equal(await portalView(session.slice(0, -2) + "xx"), null); // חתימה מזויפת
    const { makeSession } = await import("../src/lib/server/session");
    assert.equal(await portalView(makeSession("gal")), null); // אסימון עובד לא נכנס כלקוח
  });
  await ok("הזוג שומר משימות, וכותב רק אותן (לא מחיר, לא הערות, לא קישור)", async () => {
    const { portalTasksSave } = await import("../src/lib/server/access");
    const r = await portalTasksSave(session, { tasks: [T("k1", "טבעות"), { ...T("k2", "רבנות"), price: 1, internal_notes: "x" }], dismissed: ["s-bus"], rev: 0 });
    assert.equal(r.rev, 1);
    const p = tables.event_plans[0];
    assert.equal(JSON.parse(String(p.client_tasks)).length, 2);
    assert.ok(!String(p.client_tasks).includes("price"));
    assert.equal(p.internal_notes, "סודי"); assert.equal(p.portal_enabled, true); assert.equal(tables.leads[0].price, 20000);
    assert.ok(tables.activities.some((a) => String(a.text).startsWith("✅ הזוג עדכן משימות: הוסיפו: טבעות, רבנות")));
  });
  await ok("התנגשות גרסה, ולידציה, וחלק משימות כבוי חוסמים", async () => {
    const { portalTasksSave, Conflict } = await import("../src/lib/server/access");
    await assert.rejects(portalTasksSave(session, { tasks: [], rev: 0 }), (e) => e instanceof Conflict);
    await denied(portalTasksSave(session, { tasks: Array.from({ length: 101 }, (_, i) => T("k" + i, "x")), rev: 1 }));
    await denied(portalTasksSave(session, { tasks: [T("k1", "x", { owner: "hacker" })], rev: 1 }));
    await denied(portalTasksSave(session, { tasks: [T("k1", "x".repeat(121))], rev: 1 }));
    tables.event_plans[0].portal_sections = JSON.stringify({ tasks: false });
    await denied(portalTasksSave(session, { tasks: [], rev: 1 }));
    tables.event_plans[0].portal_sections = null;
  });
  await ok("סימון נרשם בהיסטוריה באותה שורה (מקובץ לשעה)", async () => {
    const { portalTasksSave } = await import("../src/lib/server/access");
    const n0 = tables.activities.length;
    await portalTasksSave(session, { tasks: [T("k1", "טבעות", { done: true }), T("k2", "רבנות")], rev: 1 });
    assert.equal(tables.activities.length, n0);
    assert.ok(tables.activities.some((a) => String(a.text).includes("סימנו: טבעות")));
  });
  await ok("שמירה רגילה של הצוות לא דורסת משימות; קוד חדש מנתק את הזוג", async () => {
    const { portalView, staffTasksSave } = await import("../src/lib/server/access");
    await writeRow(pub("gal"), "event_plans", { id: "L1", client_tasks: "[]", client_tasks_rev: 0, portal_fails: 0, notes: "x", portal_enabled: true, portal_code: "482913", portal_code_ver: 0 });
    assert.equal(JSON.parse(String(tables.event_plans[0].client_tasks)).length, 2);
    await staffTasksSave(pub("arad"), "L1", { tasks: [T("k1", "טבעות")], rev: 2 });
    assert.equal(tables.event_plans[0].client_tasks_rev, 3);
    const d = await readAll(pub("sapir"));
    assert.equal(d.event_plans[0].portal_code, undefined); // בלי הרשאת קישור ללקוח
    await writeRow(pub("gal"), "event_plans", { ...tables.event_plans[0], portal_code: "777777", portal_code_ver: 1 });
    assert.equal(await portalView(session), null);
  });

  await ok("שמירת משימות במקביל: אחד נשמר, השני מקבל התנגשות (לא נבלע בשקט)", async () => {
    const { portalTasksSave, staffTasksSave, Conflict } = await import("../src/lib/server/access");
    tables.event_plans[0].portal_code = "482913"; tables.event_plans[0].portal_code_ver = 0; tables.event_plans[0].portal_enabled = true;
    const s2 = (await (await import("../src/lib/server/access")).portalLogin("0501234567", "482913")).session;
    const rev = Number(tables.event_plans[0].client_tasks_rev);
    const r = await Promise.allSettled([portalTasksSave(s2, { tasks: [T("z1", "זוג")], rev }), staffTasksSave(pub("gal"), "L1", { tasks: [T("z2", "צוות")], rev })]);
    assert.equal(r.filter((x) => x.status === "fulfilled").length, 1);
    assert.ok(r.some((x) => x.status === "rejected" && x.reason instanceof Conflict));
  });
  await ok("תצוגה מקדימה: רק לעובד מחובר; בלי מחירים+כספים אין תשלומים", async () => {
    const { portalPreview } = await import("../src/lib/server/access");
    const tok = String(tables.event_plans[0].portal_token);
    assert.equal(await portalPreview(tok, null), null);
    const v = await portalPreview(tok, pub("sapir") as never);
    assert.equal(v!.payments, undefined);
    assert.ok((await portalPreview(tok, pub("gal")))!.payments);
  });
  await ok("עותק ישן של הדף לא מחזיר קוד שהוחלף ולא מדליק דף שכובה", async () => {
    const old = { ...tables.event_plans[0] };
    const v = Number(old.portal_code_ver) || 0;
    await writeRow(pub("gal"), "event_plans", { ...old, portal_code: "555555", portal_code_ver: v + 1 });
    await writeRow(pub("gal"), "event_plans", { ...old, notes: "ישן" });
    assert.equal(tables.event_plans[0].portal_code, "555555"); assert.equal(tables.event_plans[0].notes, "ישן");
    await writeRow(pub("gal"), "event_plans", { ...tables.event_plans[0], portal_enabled: false });
    assert.equal(tables.event_plans[0].portal_enabled, true);
  });
  await ok("אסימון לקוח לא עובר כאסימון עובד, ולהפך (גם עם קידומת)", async () => {
    const { makeClientSession, verifyClientSession } = await import("../src/lib/server/session");
    const c = makeClientSession("L1", 0);
    assert.equal(verifySession(c), null); assert.equal(verifySession("client:" + c), null);
    assert.equal(verifyClientSession(makeSession("gal")), null);
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
