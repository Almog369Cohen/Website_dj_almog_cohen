// צ'קליסט הכנה שאפשר לערוך: סדר, לפני/אחרי, תאריך יעד, הערות, ושדף הלקוח לא משתנה ולא מקבל את הפרטים
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { CHECKS, checkItems, checkLate, checkOps, eventTodos, planOf, readiness, sanitizeCheckMeta, todayISO, type PlanView } from "../src/lib/events";
import { clientView } from "../src/lib/portal";
import type { DB, EventPlan, Lead } from "../src/lib/types";

let n = 0;
const ok = (name: string, fn: () => void) => (fn(), console.log(`✓ ${++n}. ${name}`));

const lead = { id: "E1", name: "דנה ויובל", phone: "050", event_type: "חתונה", event_date: "2099-01-01", source: "x", status: "won", created_at: "x" } as Lead;
const db = (plan: EventPlan) => ({ leads: [lead], event_plans: [plan], payments: [], docs: [], settings: [{ id: "main", business_name: "רבר" }], members: [], activities: [], calendar_items: [], templates: [], expenses: [] }) as unknown as DB;
const view = (plan: EventPlan): PlanView => planOf(db(plan), lead);
/** מחיל שינוי כמו שהמסך שומר: מיזוג השדות לכרטיס */
const apply = (plan: EventPlan, patch: Partial<EventPlan>) => Object.assign(plan, patch);

ok("ברירת מחדל: הפריטים הקבועים לפי הסדר, כולם 'לפני', בלי פרטים", () => {
  const items = checkItems(view({ id: "E1" }));
  assert.deepEqual(items.map((i) => i.id), CHECKS.map((c) => c.id));
  assert.ok(items.every((i) => i.section === "before" && i.builtin && !i.due && !i.note && !i.done));
});

ok("הוספה, שינוי שם, תאריך יעד והערה; פריט ישן (טקסט) ממשיך לעבוד", () => {
  const plan: EventPlan = { id: "E1", extra_checks: JSON.stringify(["פריט ישן"]), checklist: JSON.stringify({ "x:פריט ישן": true }) };
  apply(plan, checkOps.add(view(plan), "  שאטלים  ", "before", "c_1"));
  apply(plan, checkOps.update(view(plan), "x:c_1", { due: "2026-01-05", note: "שני אוטובוסים" }));
  apply(plan, checkOps.update(view(plan), "venue", { label: "תיאום עם הגן" }));
  const items = checkItems(view(plan));
  const sh = items.find((i) => i.id === "x:c_1")!;
  assert.deepEqual([sh.label, sh.due, sh.note, sh.builtin], ["שאטלים", "2026-01-05", "שני אוטובוסים", false]);
  assert.equal(items.find((i) => i.id === "venue")!.label, "תיאום עם הגן");
  const old = items.find((i) => i.id === "x:פריט ישן")!;
  assert.deepEqual([old.label, old.done], ["פריט ישן", true]);
  assert.equal(items.at(-1)!.id, "x:c_1"); // חדש נכנס בסוף
});

ok("גרירה: סדר חדש במקטע אחד לא מזיז את המקטע השני", () => {
  const plan: EventPlan = { id: "E1" };
  apply(plan, checkOps.move(view(plan), "invoice", "after"));
  apply(plan, checkOps.move(view(plan), "final_payment", "after"));
  const before = checkItems(view(plan)).filter((i) => i.section === "before").map((i) => i.id);
  apply(plan, checkOps.reorder(view(plan), "before", [...before].reverse()));
  const items = checkItems(view(plan));
  assert.deepEqual(items.filter((i) => i.section === "before").map((i) => i.id), [...before].reverse());
  assert.deepEqual(items.filter((i) => i.section === "after").map((i) => i.id), ["invoice", "final_payment"]);
  apply(plan, checkOps.move(view(plan), "invoice", "before"));
  assert.equal(checkItems(view(plan)).filter((i) => i.section === "before").at(-1)!.id, "invoice"); // חוזר לסוף "לפני"
});

ok("מחיקה: רק פריט שהוסיפו (כולל הסימון והפרטים שלו); פריט קבוע לא נמחק", () => {
  const plan: EventPlan = { id: "E1" };
  apply(plan, checkOps.add(view(plan), "זמני", "after", "c_9"));
  apply(plan, { checklist: JSON.stringify({ "x:c_9": true, contract: true }) });
  apply(plan, checkOps.remove(view(plan), "x:c_9"));
  assert.ok(!checkItems(view(plan)).some((i) => i.id === "x:c_9"));
  assert.deepEqual(JSON.parse(plan.checklist!), { contract: true });
  assert.ok(!plan.check_meta!.includes("c_9"));
  assert.deepEqual(checkOps.remove(view(plan), "contract"), {});
});

ok("ניקוי: שדות לא מוכרים, תאריך לא תקין וטקסט ארוך לא נשמרים", () => {
  const m = sanitizeCheckMeta({ order: ["a", "a", 5, "b"], items: { a: { label: "x".repeat(300), due: "5.1.26", note: " ", section: "middle", hack: 1 }, b: { due: "2026-02-30x" }, c: "junk" }, extra: 1 });
  assert.deepEqual(m, { order: ["a", "b"], items: { a: { label: "x".repeat(120) } } });
  assert.deepEqual(sanitizeCheckMeta("garbage"), {});
  assert.deepEqual(checkItems(view({ id: "E1", check_meta: "{not json" })).length, CHECKS.length);
});

ok("באיחור: רק פריט שלא בוצע ותאריך היעד עבר; מופיע במסך 'היום'", () => {
  const today = todayISO();
  const plan: EventPlan = { id: "E1" };
  apply(plan, checkOps.update(view(plan), "suppliers", { due: "2000-01-01" }));
  apply(plan, checkOps.update(view(plan), "venue", { due: "2000-01-01" }));
  apply(plan, checkOps.update(view(plan), "timeline", { due: "2999-01-01" }));
  apply(plan, { checklist: JSON.stringify({ venue: true }) });
  const late = checkItems(view(plan)).filter((i) => checkLate(i, today)).map((i) => i.id);
  assert.deepEqual(late, ["suppliers"]);
  const todo = eventTodos(db(plan)).find((t) => t.kind === "check_late");
  assert.ok(todo && todo.sub.includes("ספקים"));
});

/* ───── דף הלקוח לא משתנה ולא מקבל את הפרטים ───── */
const gs = (() => {
  const ctx: Record<string, unknown> = {};
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8"), ctx);
  return ctx as Record<string, (...a: unknown[]) => unknown>;
})();
const J = (x: unknown) => JSON.parse(JSON.stringify(x));

ok("דף הלקוח: הערות, תאריכי יעד ושמות פנימיים לא נשלחים, בשני השרתים; מוכנות זהה לצוות", () => {
  const plan: EventPlan = { id: "E1", portal_enabled: true, checklist: JSON.stringify({ contract: true }) };
  apply(plan, checkOps.add(view(plan), "שם-פנימי-סודי", "after", "c_s"));
  apply(plan, checkOps.update(view(plan), "contract", { note: "הערה-סודית", due: "2031-07-07", label: "חוזה-פנימי" }));
  apply(plan, checkOps.move(view(plan), "deposit", "after"));
  const d = db(plan);
  const ts = clientView({ lead, plan, db: d });
  const flat = JSON.stringify(ts);
  for (const secret of ["הערה-סודית", "2031-07-07", "שם-פנימי-סודי", "חוזה-פנימי", "check_meta", "c_s"]) assert.ok(!flat.includes(secret), "דלף: " + secret);
  assert.deepEqual(J(gs.clientView_(lead, plan, [], [], d.settings, [])), J(ts));
  assert.equal(ts.readiness, readiness(view(plan)).pct);
  assert.ok(ts.steps!.some((s) => s.label === "החוזה נחתם" && s.done)); // הלקוח רואה את השם שלו, לא את השם הפנימי
});

console.log(`כל ${n} בדיקות הצ'קליסט עברו`);
