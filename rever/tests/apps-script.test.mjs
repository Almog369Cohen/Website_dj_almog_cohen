// מריץ את apps-script/Code.gs מול גוגל שיטס מדומה, ובודק כניסה, הרשאות ושמירה.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash, createHmac, randomUUID } from "node:crypto";
import vm from "node:vm";

// ---- גוגל שיטס מדומה ----
class Range {
  constructor(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr, nc }); }
  getValues() { return Array.from({ length: this.nr }, (_, i) => Array.from({ length: this.nc }, (_, j) => this.sh.cell(this.r + i, this.c + j))); }
  setValues(v) { v.forEach((row, i) => row.forEach((x, j) => this.sh.set(this.r + i, this.c + j, x))); return this; }
  setFontWeight() { return this; } setBackground() { return this; } setFontColor() { return this; } setNumberFormat() { return this; }
}
class Sheet {
  constructor(name) { this.name = name; this.rows = []; }
  cell(r, c) { return this.rows[r - 1]?.[c - 1] ?? ""; }
  set(r, c, v) { while (this.rows.length < r) this.rows.push([]); this.rows[r - 1][c - 1] = v; }
  getLastRow() { return this.rows.length; }
  getLastColumn() { return Math.max(0, ...this.rows.map((r) => r.length)); }
  getMaxRows() { return 1000; } getMaxColumns() { return 26; }
  getRange(r, c, nr = 1, nc = 1) { return new Range(this, r, c, nr, nc); }
  appendRow(v) { this.rows.push([...v]); }
  deleteRow(n) { this.rows.splice(n - 1, 1); }
  setFrozenRows() {} setRightToLeft() {}
  getName() { return this.name; }
}
const sheets = {};
const ss = {
  getSheetByName: (n) => sheets[n] || null,
  insertSheet: (n) => (sheets[n] = new Sheet(n)),
  getSheets: () => Object.values(sheets),
  deleteSheet: (s) => delete sheets[s.name],
  getUrl: () => "https://docs.google.com/spreadsheets/d/TEST",
};
const props = {};
const ctx = {
  SpreadsheetApp: { getActive: () => ss },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null, setProperty: (k, v) => (props[k] = v) }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: { MimeType: { JSON: "json" }, createTextOutput: (s) => ({ s, setMimeType() { return this; } }) },
  Utilities: {
    getUuid: () => randomUUID(),
    base64EncodeWebSafe: (x) => Buffer.from(typeof x === "string" ? x : Buffer.from(x)).toString("base64url"),
    base64DecodeWebSafe: (s) => [...Buffer.from(s, "base64url")],
    base64Encode: (x) => Buffer.from(x).toString("base64"),
    newBlob: (bytes) => ({ getDataAsString: () => Buffer.from(bytes).toString() }),
    computeHmacSha256Signature: (s, k) => [...createHmac("sha256", k).update(s).digest()],
    computeDigest: (_a, s) => [...createHash("sha256").update(s).digest()],
    DigestAlgorithm: { SHA_256: "sha256" },
    formatDate: (d) => d.toISOString().slice(0, 10),
  },
};
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8"), ctx);
const call = (body) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(body) } }).s);

let n = 0;
const ok = (name, fn) => { fn(); console.log(`✓ ${++n}. ${name}`); };

ok("התקנה יוצרת לשוניות בעברית, תבניות והגדרות", () => {
  ctx.setup();
  for (const t of ["לידים", "היסטוריה", "יומן", "תבניות", "תשלומים", "הוצאות", "מסמכים", "הגדרות", "צוות"]) assert.ok(sheets[t], t);
  assert.equal(sheets["לידים"].rows[0][1], "שם");
  assert.equal(sheets["תבניות"].rows.length, 7);
  ctx.setup(); // הרצה חוזרת לא מכפילה
  assert.equal(sheets["תבניות"].rows.length, 7);
});

let gal, liel, sapir;
ok("הגדרה ראשונה: גל נכנס כמאסטר, ואי אפשר לעשות את זה שוב", () => {
  assert.equal(call({ action: "staff" }).setup, true);
  const r = call({ action: "setup_first", name: "גל", pin: "1111" });
  assert.ok(r.token); gal = r.token;
  assert.match(call({ action: "setup_first", name: "x", pin: "9999" }).error, /כבר הוגדרה/);
});
ok("גל מוסיף את ליאל (מאסטר) ואת ספיר (עובדת) עם קודים", () => {
  call({ action: "upsert", token: gal, table: "members", row: { id: "liel", name: "ליאל", role: "admin", active: true } });
  call({ action: "upsert", token: gal, table: "members", row: { id: "sapir", name: "ספיר", title: "מזכירה", role: "team", active: true } });
  assert.equal(call({ action: "set_pin", token: gal, staff_id: "liel", pin: "2222" }).ok, true);
  assert.equal(call({ action: "set_pin", token: gal, staff_id: "sapir", pin: "4444" }).ok, true);
  const staff = call({ action: "staff" }).staff;
  assert.deepEqual(staff.map((s) => s.name), ["גל", "ליאל", "ספיר"]);
  assert.ok(staff.every((s) => !("pin_hash" in s)));
});
ok("קוד שגוי נדחה, קוד נכון נכנס", () => {
  assert.match(call({ action: "login", staff_id: "sapir", pin: "0000" }).error, /שגוי/);
  sapir = call({ action: "login", staff_id: "sapir", pin: "4444" }).token;
  liel = call({ action: "login", staff_id: "liel", pin: "2222" }).token;
  assert.ok(sapir && liel);
});
ok("הקוד נשמר מוצפן בגיליון", () => {
  const flat = JSON.stringify(sheets["צוות"].rows);
  assert.ok(!flat.includes('"4444"') && !flat.includes('"1111"'));
});
ok("5 ניסיונות שגויים נועלים את העובד", () => {
  call({ action: "upsert", token: gal, table: "members", row: { id: "temp", name: "זמני", role: "team", active: true } });
  call({ action: "set_pin", token: gal, staff_id: "temp", pin: "5555" });
  for (let i = 0; i < 5; i++) call({ action: "login", staff_id: "temp", pin: "0000" });
  assert.match(call({ action: "login", staff_id: "temp", pin: "5555" }).error, /ניסיונות/);
});
ok("סשן מזויף נדחה", () => {
  const [p] = sapir.split(".");
  const forged = Buffer.from(JSON.stringify({ sid: ctx.readTable_("members").find((m) => m.name === "גל").id, exp: Date.now() + 1e7 })).toString("base64url");
  assert.equal(call({ action: "load", token: `${forged}.${sapir.split(".")[1]}` }).code, "auth");
  assert.equal(call({ action: "load", token: `${p}.xxx` }).code, "auth");
});

ok("גל רושם ליד עם מחיר, תשלום והיסטוריה", () => {
  call({ action: "upsert", token: gal, table: "leads", row: { id: "L1", name: "דנה ויובל", phone: "0524418823", status: "won", price: 24500, event_type: "חתונה", event_date: "2027-09-09", source: "אתר", created_at: new Date().toISOString() } });
  call({ action: "upsert", token: gal, table: "payments", row: { id: "P1", lead_id: "L1", kind: "deposit", amount: 5000, date: "2026-11-10", method: "ביט" } });
  call({ action: "upsert", token: gal, table: "activities", row: { id: "A1", lead_id: "L1", kind: "note", text: "נשלחה הצעת מחיר ₪24,500", at: new Date().toISOString() } });
  const db = call({ action: "load", token: gal }).db;
  assert.equal(db.leads[0].price, 24500);
  assert.equal(db.leads[0].phone, "0524418823");
  assert.equal(db.payments.length, 1);
});
ok("ספיר לא מקבלת מחירים, תשלומים או סכומים בהיסטוריה", () => {
  const db = call({ action: "load", token: sapir }).db;
  assert.equal("price" in db.leads[0], false);
  assert.equal(db.payments.length, 0);
  assert.equal(db.activities[0].text, "נשלחה הצעת מחיר ₪•••");
  assert.ok(db.members.every((m) => !("pin_hash" in m)));
});
ok("ספיר מעדכנת סטטוס, והמחיר נשמר", () => {
  call({ action: "upsert", token: sapir, table: "leads", row: { id: "L1", name: "דנה ויובל", phone: "0524418823", status: "talk", event_type: "חתונה", source: "אתר" } });
  const lead = ctx.readTable_("leads")[0];
  assert.equal(lead.status, "talk");
  assert.equal(lead.price, 24500);
});
ok("ספיר לא יכולה: לשנות מחיר, לרשום תשלום, למחוק, לשנות הגדרות או להפוך למאסטר", () => {
  call({ action: "upsert", token: sapir, table: "leads", row: { ...ctx.readTable_("leads")[0], price: 1 } });
  assert.equal(ctx.readTable_("leads")[0].price, 24500);
  assert.match(call({ action: "upsert", token: sapir, table: "payments", row: { id: "P2", lead_id: "L1", amount: 1 } }).error, /כספים/);
  assert.match(call({ action: "remove", token: sapir, table: "leads", id: "L1" }).error, /למחוק/);
  assert.match(call({ action: "upsert", token: sapir, table: "settings", row: { id: "main", business_name: "x" } }).error, /מנהלים/);
  assert.match(call({ action: "upsert", token: sapir, table: "members", row: { id: "sapir", name: "ספיר", role: "admin", active: true } }).error, /מנהלים/);
});
ok("עדכון עובד מהמסך לא מוחק לו את הקוד", () => {
  call({ action: "upsert", token: gal, table: "members", row: { id: "sapir", name: "ספיר", title: "מזכירה", role: "team", can_prices: true, active: true } });
  assert.ok(call({ action: "login", staff_id: "sapir", pin: "4444" }).token);
  assert.equal(call({ action: "load", token: sapir }).db.leads[0].price, 24500); // עכשיו יש לה מחירים
});
ok("מאסטר לא יכול להוריד לעצמו מאסטר או למחוק את עצמו", () => {
  const galId = ctx.readTable_("members").find((m) => m.name === "גל").id;
  assert.match(call({ action: "upsert", token: gal, table: "members", row: { id: galId, name: "גל", role: "team", active: true } }).error, /מאסטר/);
  assert.match(call({ action: "remove", token: gal, table: "members", id: galId }).error, /למחוק/);
});
ok("עובד שהושבת מאבד גישה מיד", () => {
  call({ action: "upsert", token: gal, table: "members", row: { id: "sapir", name: "ספיר", role: "team", active: false } });
  assert.equal(call({ action: "load", token: sapir }).code, "auth");
});
ok("מחיקה ע\"י מאסטר עובדת", () => {
  call({ action: "remove", token: liel, table: "payments", id: "P1" });
  assert.equal(ctx.readTable_("payments").length, 0);
});
console.log(`\nכל ${n} בדיקות השרת בגוגל שיטס עברו`);
