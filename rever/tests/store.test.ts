// טעינה מול שמירה: תשובה ישנה לא דורסת את המסך (גם בטעינה רגילה, למשל ב-StrictMode)
import assert from "node:assert/strict";
import { freshLoad } from "../src/lib/freshLoad";

let n = 0;
const ok = async (name: string, fn: () => Promise<void>) => (await fn(), console.log(`✓ ${++n}. ${name}`));

/** "שרת" מדומה: המתג נשמר במסד באמצע הטעינה הראשונה */
function scenario() {
  let dbValue = "דלוק", seq = 0, pending = 0, calls = 0;
  let writeDone: Promise<void> = Promise.resolve();
  const loadAll = async () => {
    calls++;
    const snapshot = dbValue; // נקרא לפני השמירה
    if (calls === 1) {
      // בזמן שהתשובה בדרך: המשתמש מכבה את המתג
      seq++; pending++;
      writeDone = new Promise((r) => setTimeout(() => { dbValue = "כבוי"; pending--; r(); }, 5));
    }
    await new Promise((r) => setTimeout(r, 1));
    return snapshot;
  };
  return { loadAll, waitWrites: () => writeDone, seq: () => seq, pending: () => pending, calls: () => calls };
}

(async () => {
  await ok("טעינה רגילה: התשובה הישנה נזרקת, מחכים לשמירה וטוענים שוב", async () => {
    const s = scenario();
    assert.equal(await freshLoad({ ...s, background: false }), "כבוי");
    assert.equal(s.calls(), 2);
  });
  await ok("טעינה ברקע: מוותרים (לא דורסים), הרענון הבא יביא את העדכני", async () => {
    const s = scenario();
    assert.equal(await freshLoad({ ...s, background: true }), null);
  });
  await ok("בלי שמירה באמצע: תשובה אחת", async () => {
    let calls = 0;
    const r = await freshLoad({ loadAll: async () => (++calls, "x"), waitWrites: async () => {}, seq: () => 0, pending: () => 0, background: false });
    assert.deepEqual([r, calls], ["x", 1]);
  });
  console.log(`כל ${n} בדיקות הטעינה עברו`);
})();
