// לידים שנופלים בין הכיסאות + ערך הצנרת
import assert from "node:assert/strict";
import { pipeline, stuckLeads } from "../src/lib/leads";
import type { Doc, Lead } from "../src/lib/types";

const NOW = new Date("2026-11-12T10:00:00Z").getTime();
const ago = (d: number) => new Date(NOW - d * 864e5).toISOString();
const L = (p: Partial<Lead> & { id: string }) => ({ name: p.id, phone: "0", event_type: "חתונה", source: "x", status: "new", created_at: ago(5), ...p }) as Lead;
let n = 0;
const ok = (name: string, fn: () => void) => (fn(), console.log(`✓ ${++n}. ${name}`));

ok("ליד עם פולואפ (גם באיחור) או סגור לא מופיע; בלי פולואפ כן", () => {
  const s = stuckLeads({ leads: [L({ id: "a", next_followup: ago(2) }), L({ id: "b", status: "won" }), L({ id: "c", status: "talk", last_contact: ago(1) })], docs: [] }, NOW);
  assert.deepEqual(s.map((x) => [x.lead.id, x.reason]), [["c", "no_followup"]]);
});
ok("ליד חדש שלא נגעו בו 24 שעות קודם; חדש מהשעה האחרונה לא נחשב 'לא טופל'", () => {
  const s = stuckLeads({ leads: [L({ id: "old" }), L({ id: "fresh", created_at: ago(0.1) }), L({ id: "t", status: "talk", last_contact: ago(1) })], docs: [] }, NOW);
  assert.deepEqual(s.map((x) => [x.lead.id, x.reason]), [["old", "new_untouched"], ["t", "no_followup"], ["fresh", "no_followup"]]);
});
ok("הצעת מחיר: שקט 3 ימים ומעלה (לפי קשר אחרון או תאריך ההצעה)", () => {
  const docs = [{ id: "d", lead_id: "q2", type: "quote", number: "1", amount: 1, date: ago(1).slice(0, 10), status: "sent" }] as Doc[];
  const s = stuckLeads({ leads: [L({ id: "q1", status: "quote", last_contact: ago(4) }), L({ id: "q2", status: "quote", last_contact: ago(10) })], docs }, NOW);
  assert.deepEqual(s.map((x) => [x.lead.id, x.reason]), [["q1", "quote_silent"], ["q2", "no_followup"]]);
  assert.match(s[0].text, /4 ימים/);
});
ok("ערך הצנרת: רק הצעות מחיר עם מחיר; חודשיים קרובים בנפרד", () => {
  const p = pipeline([L({ id: "a", status: "quote", price: 20000, event_date: "2026-12-01" }), L({ id: "b", status: "quote", price: 10000, event_date: "2027-06-01" }), L({ id: "c", status: "talk", price: 5000 }), L({ id: "d", status: "quote" })], new Date(NOW));
  assert.deepEqual(p, { count: 2, total: 30000, nearCount: 1, near: 20000 });
});
console.log(`\nכל ${n} בדיקות הלידים עברו`);
