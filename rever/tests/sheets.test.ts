import assert from "node:assert/strict";
import { buildLeads, guessMapping, parseCsv, parseDate, toCsvUrl } from "../src/lib/sheets";
import type { Lead } from "../src/lib/types";

let n = 0;
const ok = (name: string, fn: () => void) => (fn(), console.log(`✓ ${++n}. ${name}`));

ok("קישור רגיל לגיליון → קישור CSV של אותה לשונית", () => {
  assert.equal(toCsvUrl("https://docs.google.com/spreadsheets/d/AbC_123/edit#gid=456"), "https://docs.google.com/spreadsheets/d/AbC_123/export?format=csv&gid=456");
  assert.equal(toCsvUrl("https://docs.google.com/spreadsheets/d/AbC_123/edit?usp=sharing"), "https://docs.google.com/spreadsheets/d/AbC_123/export?format=csv&gid=0");
  assert.equal(toCsvUrl("https://example.com/x"), null);
});
ok("CSV עם מרכאות, פסיקים ושורה בתוך תא", () => {
  const r = parseCsv('﻿שם,הערות\n"כהן, דנה","שורה1\nשורה2"\nיוסי,רגיל\n');
  assert.deepEqual(r, [["שם", "הערות"], ["כהן, דנה", "שורה1\nשורה2"], ["יוסי", "רגיל"]]);
});
ok("זיהוי עמודות בעברית", () => {
  const m = guessMapping(["חותמת זמן", "שם מלא", "מספר טלפון", "סוג האירוע", "תאריך האירוע", "כמות מוזמנים", "הערות"]);
  assert.deepEqual(m, { name: 1, phone: 2, event_type: 3, event_date: 4, guests: 5, notes: 6, created_at: 0 });
});
ok("זיהוי עמודות של טופס לידים בפייסבוק", () => {
  const m = guessMapping(["id", "created_time", "campaign_name", "full_name", "phone_number", "email"]);
  assert.equal(m.name, 3); assert.equal(m.phone, 4); assert.equal(m.email, 5); assert.equal(m.source, 2); assert.equal(m.created_at, 1);
});
ok("תאריכים בפורמטים ישראליים", () => {
  assert.equal(parseDate("09/09/2027"), "2027-09-09");
  assert.equal(parseDate("9.9.27"), "2027-09-09");
  assert.equal(parseDate("2027-9-9"), "2027-09-09");
  assert.equal(parseDate("בקרוב"), undefined);
});
ok("ייבוא בלי כפילויות: מול המערכת ובתוך הגיליון", () => {
  const rows = parseCsv("שם,טלפון,סוג אירוע,תאריך\nדנה,052-4418823,חתונה,09/09/2027\nיוסי,+972 50 111 2233,בר מצווה,\nיוסי שוב,0501112233,,\nבלי טלפון,,חתונה,\n");
  const existing = [{ id: "x", name: "דנה", phone: "0524418823" } as Lead];
  const r = buildLeads(rows.slice(1), guessMapping(rows[0]), existing);
  assert.equal(r.fresh.length, 1);
  assert.equal(r.fresh[0].name, "יוסי");
  assert.equal(r.fresh[0].event_type, "בר מצווה");
  assert.equal(r.fresh[0].status, "new");
  assert.ok(r.fresh[0].next_followup);
  assert.equal(r.duplicates, 2);
  assert.equal(r.invalid, 1);
});
console.log(`\nכל ${n} בדיקות הגיליון עברו`);
