// הקישור ללקוח: מה הלקוח מקבל, ושגרסת השרת וגרסת גוגל שיטס זהות.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { allocatePlan, clientView, newPortalCode, newPortalToken, normPhone } from "../src/lib/portal";
import { partnersOf, sanitizeTasks, starterTasks, suggestions, whenText } from "../src/lib/tasks";
import type { DB, EventPlan, Lead } from "../src/lib/types";

const lead = { id: "L3", name: "שירן ועומר", phone: "0500000003", event_type: "חתונה", event_date: "2026-11-30", guests: 400, venue: "אולם הגן", source: "אינסטגרם", status: "won", price: 30000, assigned_to: "m-gal", notes: "הערה פנימית בליד", created_at: "x" } as Lead;
const plan: EventPlan = {
  id: "L3",
  portal_token: "tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  portal_enabled: true,
  timeline: JSON.stringify([
    { id: "1", time: "00:30", title: "סיום ופירוק", who: "גל", show_client: false },
    { id: "2", time: "19:30", title: "קבלת פנים", who: "אולם" },
    { id: "3", time: "16:00", title: "הקמה", who: "גל", show_client: false },
    { id: "4", time: "21:00", title: "חופה", who: "רב" },
  ]),
  suppliers: JSON.stringify([
    { id: "s1", role: "DJ", name: "די ג'יי", phone: "050", cost: 8000, confirmed: true, category: "dj", show_client: true },
    { id: "s2", role: "תאורה", name: "תאורה", phone: "051", cost: 5000, category: "light", show_client: false },
  ]),
  checklist: JSON.stringify({ contract: true, deposit: true, meeting: true, suppliers: false }),
  payment_plan: JSON.stringify([{ id: "a", name: "מקדמה", amount: 10000, due: "2026-10-03" }, { id: "b", name: "ביניים", amount: 5000, due: "2026-11-08" }, { id: "c", name: "אחרון", amount: 15000, due: "2026-11-23" }]),
  internal_notes: "סודי: אבא רגיש למחיר",
  contact_name: "אמא של הכלה",
  requests: "בלי עשן",
};
const db = {
  payments: [
    { id: "p1", lead_id: "L3", kind: "deposit", amount: 10000, date: "2026-10-03", method: "ביט" },
    { id: "p2", lead_id: "L3", kind: "payment", amount: 5000, date: "2026-11-08", method: "ביט", note: "פנימי" },
    { id: "pX", lead_id: "OTHER", kind: "payment", amount: 99999, date: "2026-11-01", method: "x" },
  ],
  docs: [
    { id: "d1", lead_id: "L3", type: "receipt", number: "R-1", amount: 10000, date: "2026-10-03", status: "paid", show_client: true },
    { id: "d2", lead_id: "L3", type: "invoice", number: "INV-SECRET", amount: 1, date: "2026-10-03", status: "draft" },
  ],
  settings: [{ id: "main", business_name: "רבר הפקות", owner_name: "גל", whatsapp_mode: "link", vat_rate: 18, make_webhook_url: "https://hook.secret", contact_phone: "050-0000000" }],
  members: [{ id: "m-gal", name: "גל כהן", role: "admin", can_prices: true, can_finance: true, can_delete: true, can_templates: true, active: true, pin: "1111" }],
} as unknown as Pick<DB, "payments" | "docs" | "settings" | "members">;

let n = 0;
const ok = (name: string, fn: () => void) => (fn(), console.log(`✓ ${++n}. ${name}`));
const view = clientView({ lead, plan, db });
const flat = JSON.stringify(view);

ok("לא נשלחים: עלויות ספקים, רווח, הערות פנימיות, מי אחראי, webhook, קודים", () => {
  for (const secret of ["8000", "5000\"", "cost", "סודי", "הערה פנימית", "who", "hook.secret", "1111", "INV-SECRET", "99999", "פנימי", "method"]) assert.ok(!flat.includes(secret), "דלף: " + secret);
});
ok("לו\"ז: רק שורות שמוצגות ללקוח, ממוין, בלי 'מי אחראי'", () => {
  assert.deepEqual(view.timeline, [{ time: "19:30", title: "קבלת פנים" }, { time: "21:00", title: "חופה" }]);
});
ok("ספקים: רק מי שסומן להציג, בלי מחיר", () => {
  assert.deepEqual(view.suppliers, [{ category: "DJ", icon: "🎧", name: "די ג'יי", phone: "050" }]);
});
ok("תשלומים: סה\"כ, שולם, יתרה, ותוכנית לפי הסדר", () => {
  assert.equal(view.payments!.total, 30000);
  assert.equal(view.payments!.paid, 15000);
  assert.equal(view.payments!.balance, 15000);
  assert.deepEqual(view.payments!.plan.map((p) => p.paid), [true, true, false]);
  assert.deepEqual(view.payments!.docs, [{ label: "קבלה", number: "R-1", date: "2026-10-03" }]);
});
ok("סטטוס: רק השלבים שנבחרו ללקוח, ואיש הקשר בשם פרטי", () => {
  assert.deepEqual(view.steps!.map((s) => s.done), [true, true, true, false, false]);
  assert.equal(view.contact.name, "גל");
  assert.equal(view.details!.arrival, "19:30");
});
ok("חלק שכובה לא נשלח בכלל", () => {
  const v = clientView({ lead, plan: { ...plan, portal_sections: JSON.stringify({ payments: false, suppliers: false }) }, db });
  assert.equal(v.payments, undefined);
  assert.equal(v.suppliers, undefined);
  assert.ok(!JSON.stringify(v).includes("30000"));
});
ok("חלוקת תשלום חלקי", () => {
  assert.deepEqual(allocatePlan([{ id: "a", name: "א", amount: 100 }, { id: "b", name: "ב", amount: 100 }], 150).map((p) => p.paid), [true, false]);
});
ok("קוד קישור: 32 תווים, שונה בכל פעם", () => {
  const a = newPortalToken(), b = newPortalToken();
  assert.equal(a.length, 32); assert.notEqual(a, b); assert.match(a, /^[\w-]+$/);
});
ok("השרת שבגוגל שיטס מחזיר בדיוק את אותה גרסת לקוח", () => {
  const ctx: Record<string, unknown> = {};
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8"), ctx);
  const J = (x: unknown) => JSON.parse(JSON.stringify(x));
  const gs = (ctx.clientView_ as (...a: unknown[]) => unknown)(lead, plan, db.payments, db.docs, db.settings, db.members);
  assert.deepEqual(J(gs), J(view));
  for (const sec of [{ status: false }, { timeline: false, details: false }]) {
    const p2 = { ...plan, portal_sections: JSON.stringify(sec) };
    assert.deepEqual(J((ctx.clientView_ as (...a: unknown[]) => unknown)(lead, p2, db.payments, db.docs, db.settings, db.members)), J(clientView({ lead, plan: p2, db })));
  }
});
const gsCtx = (() => {
  const ctx: Record<string, unknown> = {};
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8"), ctx);
  return ctx as Record<string, (...a: unknown[]) => unknown>;
})();
const J = (x: unknown) => JSON.parse(JSON.stringify(x));
const T = (id: string, title: string, extra: Record<string, unknown> = {}) => ({ id, title, owner: "both", category: "guests", status: "todo", done: false, section: "before", order: 0, ...extra });

ok("משימות הזוג: מגיעות ללקוח עם שמות בני הזוג; חלק כבוי לא נשלח; זהה בשני השרתים", () => {
  const p2 = { ...plan, client_tasks: JSON.stringify([T("k1", "טבעות", { done: true })]), client_tasks_rev: 4, dismissed_suggestions: JSON.stringify(["s-bus"]) };
  const v = clientView({ lead, plan: p2, db });
  assert.deepEqual(v.tasks!.partners, { a: "שירן", b: "עומר" });
  assert.equal(v.tasks!.rev, 4); assert.equal(v.tasks!.list.length, 1);
  assert.deepEqual(J(gsCtx.clientView_(lead, p2, db.payments, db.docs, db.settings, db.members)), J(v));
  const off = { ...p2, portal_sections: JSON.stringify({ tasks: false }) };
  assert.equal(clientView({ lead, plan: off, db }).tasks, undefined);
  assert.deepEqual(J(gsCtx.clientView_(lead, off, db.payments, db.docs, db.settings, db.members)), J(clientView({ lead, plan: off, db })));
});
ok("ולידציית משימות זהה ב-TS וב-Apps Script (כולל הודעות שגיאה)", () => {
  const cases: unknown[] = [
    [T("a", "  טבעות ", { note: "  x ", start: "2026-01-02", order: "3", hack: 1 })],
    [T("b", "y", { category: "nope", done: "yes", order: null })],
    [T("c", "z", { owner: "x" })],
    [T("d", "z", { status: "x" })],
    [T("e", "z", { section: "x" })],
    [T("f", "z", { start: "2.1.26" })],
    [T("g", "")],
    [T("h", "x".repeat(121))],
    [T("i", "a"), T("i", "b")],
    Array.from({ length: 101 }, (_, i) => T("k" + i, "x")),
    "not array",
  ];
  for (const c of cases) {
    let ts: unknown, gs: unknown;
    try { ts = sanitizeTasks(c); } catch (e) { ts = { error: (e as Error).message }; }
    try { gs = gsCtx.sanitizeTasks_(c); } catch (e) { gs = { error: (e as Error).message }; }
    assert.deepEqual(J(gs), J(ts), "שונה: " + JSON.stringify(c).slice(0, 80));
  }
});
ok("שמות בני הזוג, טלפון, קוד, רשימה מוכנה והצעות", () => {
  assert.deepEqual(partnersOf({ name: "דנה ויובל" }, {}), { a: "דנה", b: "יובל" });
  assert.deepEqual(partnersOf({ name: "משפחת לוי" }, {}), { a: "צד א׳", b: "צד ב׳" });
  assert.deepEqual(partnersOf({ name: "דנה ויובל" }, { partner_a: "דני" }), { a: "דני", b: "יובל" });
  assert.equal(normPhone("+972-50-123-4567"), "0501234567");
  const c = newPortalCode(); assert.match(c, /^\d{6}$/);
  const st = starterTasks("חתונה", "2099-11-30");
  assert.ok(st.length >= 8 && st.every((t) => t.title && t.id) && new Set(st.map((t) => t.id)).size === st.length);
  assert.equal(st.find((t) => t.title === "אישורי הגעה מהמוזמנים")!.start, "2099-11-09");
  const past = starterTasks("חתונה", new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10));
  assert.ok(past.every((t) => !whenText(t).late), "משימה חדשה לא נולדת באיחור");
  assert.ok(st.some((t) => t.section === "after"));
  const sg = suggestions("חתונה", st, ["s-bus"]);
  assert.equal(sg.length, 3); assert.ok(!sg.some((x) => x.key === "s-bus"));
  assert.deepEqual(J(sanitizeTasks(st)), J(st)); // רשימה מוכנה עוברת ולידציה
  assert.equal(whenText(T("w", "x", { start: "2026-01-01" }) as never, new Date("2026-01-05T10:00:00")).text, "באיחור של 4 ימים");
  assert.equal(whenText(T("w", "x", { start: "2026-01-08" }) as never, new Date("2026-01-05T10:00:00")).text, "להתחיל בעוד 3 ימים");
});
console.log(`\nכל ${n} בדיקות הקישור ללקוח עברו`);
