// כספים מכרטיס הלקוח: סה"כ / שולם / נותר, תשלומים שמגיעים, סיכום חודשי, ושמירת "שולם"
import assert from "node:assert/strict";
import { byMonth, duePays, keepPaid, moneyOf } from "../src/lib/money";
import type { Lead } from "../src/lib/types";

const L = (p: Partial<Lead> & { id: string }) => ({ name: p.id, phone: "0", event_type: "חתונה", source: "x", status: "won", created_at: "x", ...p }) as Lead;
const items = (...prices: number[]) => JSON.stringify(prices.map((price, i) => ({ id: "i" + i, service: "s" + i, price })));
const plan = (...rows: [number, string, number?][]) => JSON.stringify(rows.map(([amount, due, paid], i) => ({ id: "p" + i, name: "n" + i, amount, due, ...(paid ? { paid: { date: due, amount: paid, method: "transfer" } } : {}) })));
let n = 0;
const ok = (name: string, fn: () => void) => (fn(), console.log(`✓ ${++n}. ${name}`));

ok("סה״כ מהשורות; בלי שורות = מחיר הליד; שולם = רק מה שסומן; נותר לא שלילי", () => {
  const m = moneyOf(L({ id: "a", money_items: items(20000, 10000), money_plan: plan([10000, "2026-11-01", 10000], [20000, "2026-12-01"]) }), "2026-11-23");
  assert.deepEqual([m.total, m.paid, m.remaining, m.late], [30000, 10000, 20000, 0]);
  assert.equal(moneyOf(L({ id: "b", price: 15000 })).total, 15000);
  assert.equal(moneyOf(L({ id: "c", money_items: items(1000), money_plan: plan([2000, "2026-01-01", 2000]) })).remaining, 0);
  assert.equal(moneyOf(L({ id: "d", money_plan: plan([5000, "2026-11-20"]) }), "2026-11-23").late, 1);
  assert.equal(moneyOf(L({ id: "e", money_items: "garbage" })).total, 0);
});
ok("תשלומים שמגיעים: לא שולמו, מועד עבר או בתוך X ימים, ממוינים; לא מליד שלא רלוונטי", () => {
  const ls = [L({ id: "a", money_plan: plan([1, "2026-11-20"], [2, "2026-11-30"], [3, "2027-02-01"], [4, "2026-11-21", 4]) }), L({ id: "x", status: "lost", money_plan: plan([9, "2026-11-22"]) })];
  const d = duePays(ls, 14, "2026-11-23");
  assert.deepEqual(d.map((x) => [x.pay.amount, x.days, x.late]), [[1, -3, true], [2, 7, false]]);
});
ok("סיכום לפי חודש האירוע: רק סגורים עם תאריך", () => {
  const m = byMonth([L({ id: "a", event_date: "2026-12-02", money_items: items(30000), money_plan: plan([10000, "x", 10000]) }), L({ id: "b", event_date: "2026-12-20", price: 10000 }), L({ id: "c", event_date: "2027-01-05", status: "quote", price: 5 })]);
  assert.deepEqual(m, [{ month: "2026-12", events: 2, total: 40000, paid: 10000 }]);
});
ok("בלי הרשאת כספים: אי אפשר לסמן, לבטל או לשנות 'שולם' — שאר העריכה נשמרת", () => {
  const prev = plan([10000, "2026-11-01", 10000], [5000, "2026-12-01"]);
  const next = JSON.stringify([{ id: "p0", name: "שונה", amount: 10000, due: "2026-11-01" }, { id: "p1", name: "n1", amount: 6000, due: "2026-12-01", paid: { date: "x", amount: 6000, method: "cash" } }, { id: "p2", name: "חדש", amount: 1 }]);
  const r = JSON.parse(keepPaid(next, prev)!);
  assert.equal(r[0].name, "שונה"); assert.equal(r[0].paid.amount, 10000); // מחיקת "שולם" נדחתה
  assert.equal(r[1].amount, 6000); assert.equal(r[1].paid, undefined); // סימון "שולם" נדחה
  assert.equal(r.length, 3);
});
console.log(`\nכל ${n} בדיקות הכספים עברו`);
