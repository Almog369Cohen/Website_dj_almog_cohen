// יומן: קטגוריות צבע, תצוגות יום/שבוע/חודש, ופריסת פריטים חופפים
import assert from "node:assert/strict";
import { BUILTIN_CATS, MAX_CATS, agendaItems, calendarCats, catOf, endOf, layoutDay, sanitizeCats, stepCursor, viewDays, weekStart } from "../src/lib/agenda";
import type { DB } from "../src/lib/types";

let n = 0;
const ok = (name: string, fn: () => void) => (fn(), console.log(`✓ ${++n}. ${name}`));
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const at = (s: string) => new Date(s).toISOString(); // זמן מקומי

ok("קטגוריות: שלוש קבועות תמיד קיימות; שם וצבע ניתנים לשינוי; ערכים לא תקינים נזרקים", () => {
  assert.deepEqual(calendarCats({}), BUILTIN_CATS);
  assert.deepEqual(calendarCats({ calendar_cats: "{bad" }), BUILTIN_CATS);
  const c = sanitizeCats([{ id: "meeting", label: "פגישת מכירה", color: "blue" }, { id: "k1", label: " חזרות ", color: "teal" }, { id: "k2", label: "", color: "red" }, { id: "k3", label: "x", color: "#ff0000" }, { id: "k1", label: "כפול", color: "red" }, "junk"]);
  assert.deepEqual(c.map((x) => [x.id, x.label, x.color]), [["event", "אירוע", "green"], ["meeting", "פגישת מכירה", "blue"], ["followup", "פולואפ", "orange"], ["k1", "חזרות", "teal"], ["k3", "x", "gray"]]);
  const many = sanitizeCats(Array.from({ length: 30 }, (_, i) => ({ id: "k" + i, label: "c" + i, color: "red" })));
  assert.equal(many.length, MAX_CATS);
});

ok("צבע של פריט: לפי הקטגוריה שלו; קטגוריה שנמחקה חוזרת לצבע של הסוג", () => {
  const cats = sanitizeCats([{ id: "k1", label: "חזרות", color: "teal" }]);
  assert.equal(catOf(cats, "k1", "meeting").color, "teal");
  assert.equal(catOf(cats, "deleted", "followup").color, "orange");
  assert.equal(catOf(cats, "deleted").id, "meeting");
});

ok("פריטי היומן מקבלים קטגוריה: ידני לפי מה שנבחר, אירוע של לקוח = אירוע, פולואפ = פולואפ", () => {
  const db = {
    calendar_items: [{ id: "c1", kind: "meeting", title: "פגישה", start: at("2026-12-01T10:00"), cat: "k1", ends_at: at("2026-12-01T11:30") }, { id: "c2", kind: "followup", title: "תזכורת", start: at("2026-12-01T12:00") }],
    leads: [
      { id: "L1", name: "דנה", status: "won", event_type: "חתונה", event_date: "2026-12-10" },
      { id: "L2", name: "יוסי", status: "talk", event_type: "חתונה", next_followup: at("2026-12-02T09:00") },
    ],
  } as unknown as DB;
  const a = agendaItems(db);
  const by = (k: string) => a.find((x) => x.key === k)!;
  assert.equal(by("cc1").cat, "k1"); assert.equal(by("cc1").end, at("2026-12-01T11:30"));
  assert.equal(by("cc2").cat, "followup");
  assert.equal(by("eL1").cat, "event"); assert.equal(by("eL1").allDay, true);
  assert.equal(by("fL2").cat, "followup");
});

ok("תצוגות: יום = יום אחד, שבוע = ראשון עד שבת, חודש = שבועות שלמים", () => {
  const d = new Date(2026, 10, 26); // חמישי 26.11.26
  assert.deepEqual(viewDays("day", d).map(ymd), ["2026-11-26"]);
  const w = viewDays("week", d).map(ymd);
  assert.deepEqual([w[0], w[6], w.length], ["2026-11-22", "2026-11-28", 7]);
  assert.equal(weekStart(new Date(2026, 10, 22)).getDate(), 22); // ראשון נשאר ראשון
  const m = viewDays("month", d);
  assert.equal(m.length % 7, 0); assert.equal(ymd(m[0]), "2026-11-01"); assert.ok(m.some((x) => ymd(x) === "2026-11-30"));
  assert.equal(m[0].getDay(), 0);
});

ok("קדימה/אחורה: יום, שבוע וחודש (כולל מעבר שנה)", () => {
  const d = new Date(2026, 11, 31);
  assert.equal(ymd(stepCursor("day", d, 1)), "2027-01-01");
  assert.equal(ymd(stepCursor("week", d, -1)), "2026-12-24");
  assert.equal(ymd(stepCursor("month", d, 1)), "2027-01-01");
});

ok("סוף פריט: מה שנשמר; בלי סוף, או סוף לפני ההתחלה = שעה", () => {
  assert.equal(endOf({ start: at("2026-12-01T10:00"), end: at("2026-12-01T12:00") }).toISOString(), at("2026-12-01T12:00"));
  assert.equal(endOf({ start: at("2026-12-01T10:00") }).toISOString(), at("2026-12-01T11:00"));
  assert.equal(endOf({ start: at("2026-12-01T10:00"), end: at("2026-12-01T09:00") }).toISOString(), at("2026-12-01T11:00"));
});

ok("פריסה בתצוגת שעות: חופפים זה לצד זה, לא חופפים ברוחב מלא", () => {
  const day = new Date(2026, 11, 1);
  const r = layoutDay(
    [
      { key: "a", start: at("2026-12-01T10:00"), end: at("2026-12-01T12:00") },
      { key: "b", start: at("2026-12-01T11:00") },
      { key: "c", start: at("2026-12-01T11:30"), end: at("2026-12-01T13:00") },
      { key: "d", start: at("2026-12-01T15:00") },
    ],
    day,
  );
  const g = Object.fromEntries(r.map((x) => [x.it.key, x]));
  assert.equal(g.a.top, 600); assert.equal(g.a.bottom, 720);
  assert.notEqual(g.a.col, g.b.col); assert.notEqual(g.b.col, g.c.col); assert.notEqual(g.a.col, g.c.col);
  assert.equal(g.a.cols, 3); assert.equal(g.c.cols, 3);
  assert.deepEqual([g.d.col, g.d.cols], [0, 1]);
  // פריט שעובר את חצות נחתך בסוף היום
  const late = layoutDay([{ key: "x", start: at("2026-12-01T23:30"), end: at("2026-12-02T01:00") }], day)[0];
  assert.equal(late.bottom, 24 * 60);
});

console.log(`כל ${n} בדיקות היומן עברו`);
