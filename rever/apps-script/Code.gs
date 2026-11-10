/**
 * רבר הפקות · השרת של המערכת, בתוך גוגל שיטס (Apps Script)
 * ─────────────────────────────────────────────────────────
 * הגיליון הזה הוא מסד הנתונים: כל סוג מידע בלשונית משלו.
 * הקוד בודק את הקוד האישי של כל עובד ומחזיר לו רק את מה שמותר לו
 * (מחירים / כספים / מחיקה / תבניות), כך שהמספרים לא נשלחים למי שאין לו הרשאה.
 *
 * התקנה (פעם אחת):
 *   1. תוספים ← Apps Script ← להדביק את כל הקובץ הזה במקום מה שיש ← שמירה
 *   2. לבחור למעלה את הפונקציה setup ← הפעלה ← לאשר הרשאות
 *   3. פריסה ← פריסה חדשה ← סוג: אפליקציית אינטרנט
 *        הפעלה בתור: אני · למי יש גישה: כל אחד ← פריסה
 *   4. להעתיק את כתובת אפליקציית האינטרנט (…/exec) ולשלוח אותה
 *
 * אל תשנו את שמות הלשוניות או את שורת הכותרות.
 */

var VERSION = 1;
var SESSION_HOURS = 12;
var MAX_TRIES = 5;
var LOCK_MIN = 10;

/** טבלה → [שם הלשונית, [[מפתח, כותרת בעברית], ...]] */
var TABLES = {
  leads: ["לידים", [["id", "מזהה"], ["name", "שם"], ["phone", "טלפון"], ["email", "אימייל"], ["event_type", "סוג אירוע"], ["event_date", "תאריך אירוע"], ["guests", "מוזמנים"], ["venue", "מקום"], ["source", "מקור"], ["status", "סטטוס"], ["price", "מחיר"], ["next_followup", "פולואפ הבא"], ["followup_note", "מה לעשות בפולואפ"], ["pending_message", "הודעה מתוזמנת"], ["last_contact", "קשר אחרון"], ["notes", "הערות"], ["assigned_to", "מטפל"], ["lost_reason", "סיבה שלא נסגר"], ["created_at", "נוצר"]]],
  activities: ["היסטוריה", [["id", "מזהה"], ["lead_id", "ליד"], ["kind", "סוג"], ["text", "תיאור"], ["at", "מתי"], ["by", "מי"]]],
  calendar_items: ["יומן", [["id", "מזהה"], ["kind", "סוג"], ["title", "כותרת"], ["start", "מתי"], ["location", "מקום"], ["lead_id", "ליד"]]],
  templates: ["תבניות", [["id", "מזהה"], ["name", "שם"], ["description", "מתי משתמשים"], ["body", "הודעה"], ["sort", "סדר"]]],
  payments: ["תשלומים", [["id", "מזהה"], ["lead_id", "ליד"], ["kind", "סוג"], ["amount", "סכום"], ["date", "תאריך"], ["method", "אמצעי"], ["note", "הערה"]]],
  expenses: ["הוצאות", [["id", "מזהה"], ["date", "תאריך"], ["amount", "סכום"], ["category", "קטגוריה"], ["supplier", "ספק"], ["note", "הערה"], ["lead_id", "אירוע"]]],
  docs: ["מסמכים", [["id", "מזהה"], ["lead_id", "ליד"], ["type", "סוג"], ["number", "מספר"], ["amount", "סכום"], ["date", "תאריך"], ["status", "סטטוס"]]],
  settings: ["הגדרות", [["id", "מזהה"], ["business_name", "שם העסק"], ["owner_name", "שם בהודעות"], ["whatsapp_mode", "שליחת וואטסאפ"], ["make_webhook_url", "Make webhook"], ["vat_rate", "מעמ"], ["sheet_url", "גיליון לידים"], ["sheet_map", "מיפוי עמודות"], ["sheet_auto", "משיכה אוטומטית"], ["sheet_last_pull", "משיכה אחרונה"]]],
  members: ["צוות", [["id", "מזהה"], ["name", "שם"], ["title", "תפקיד"], ["role", "הרשאה"], ["can_prices", "מחירים"], ["can_finance", "כספים"], ["can_delete", "מחיקה"], ["can_templates", "תבניות"], ["active", "פעיל"], ["created_at", "נוצר"], ["pin_hash", "קוד מוצפן"], ["failed_attempts", "ניסיונות שגויים"], ["locked_until", "נעול עד"], ["last_login", "כניסה אחרונה"]]],
  event_plans: ["אירועים", [["id", "ליד"], ["timeline", "לוז"], ["suppliers", "ספקים"], ["checklist", "צקליסט"], ["extra_checks", "פריטים נוספים"], ["contact_name", "איש קשר"], ["contact_phone", "טלפון איש קשר"], ["requests", "בקשות מיוחדות"], ["notes", "הערות"], ["must_songs", "שירי חובה"], ["no_songs", "אסור לנגן"], ["moments", "רגעים"], ["equipment", "ציוד"], ["after", "אחרי האירוע"], ["updated_at", "עודכן"]]]
};
var NUMBERS = { guests: 1, price: 1, amount: 1, vat_rate: 1, sort: 1, failed_attempts: 1 };
var BOOLS = { can_prices: 1, can_finance: 1, can_delete: 1, can_templates: 1, active: 1, sheet_auto: 1 };
var FINANCE = { payments: 1, expenses: 1, docs: 1 };
var PRIVATE_MEMBER = { pin_hash: 1, failed_attempts: 1, locked_until: 1, last_login: 1 };

var DEFAULT_TEMPLATES = [
  ["t1", "👋 הודעת היכרות", "לליד חדש, בפעם הראשונה", "היי {שם}! 🎉 כאן {בעלים} מ{עסק}. ראינו שהשארתם פרטים ל{אירוע} ב-{תאריך}, מזל טוב! מתי נוח לכם לשיחה קצרה?", 1],
  ["t2", "🔁 פולואפ: לא ענו", "אחרי 2 ימים בלי תשובה", "היי {שם} 😊 רק מוודאת שההודעה הקודמת הגיעה. נשמח לשמוע על ה{אירוע} ולהתאים לכם הצעה. מתאים לכם לדבר מחר בערב?", 2],
  ["t3", "📅 אישור פגישה", "יום לפני הפגישה, עם שעה ומקום", "היי {שם}, רק מזכירה שנפגשים {פגישה}. מחכים לכם! אם משהו משתנה, תכתבו לי כאן 🙏", 3],
  ["t4", "📄 בדיקה אחרי הצעת מחיר", "3 ימים אחרי שליחת ההצעה", "היי {שם}, רציתי לבדוק אם יצא לכם לעבור על הצעת המחיר ששלחנו. יש שאלות? אשמח לעבור עליה יחד בטלפון.", 4],
  ["t5", "💳 תזכורת מקדמה", "אחרי שסגרו", "היי {שם}, איזה כיף שסגרנו! 🥂 כדי לשריין את התאריך ({תאריך}) נשמח לקבל את המקדמה. פרטי ההעברה מצורפים.", 5],
  ["t6", "🙏 תודה אחרי האירוע", "בקשת המלצה וביקורת בגוגל", "היי {שם}, תודה שבחרתם בנו! היה אירוע מדהים ❤️ נשמח מאוד אם תכתבו לנו כמה מילים בגוגל, זה עוזר לנו המון.", 6]
];

/* ───────────── התקנה ───────────── */

/** יוצר את כל הלשוניות והכותרות. אפשר להריץ שוב בלי לאבד מידע. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(TABLES).forEach(function (t) {
    var name = TABLES[t][0], cols = TABLES[t][1];
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var have = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    var missing = cols.filter(function (c) { return have.indexOf(c[1]) < 0 && have.indexOf(c[0]) < 0; });
    if (missing.length) {
      var start = have.filter(String).length + 1;
      sh.getRange(1, start, 1, missing.length).setValues([missing.map(function (c) { return c[1]; })]);
    }
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight("bold").setBackground("#14171f").setFontColor("#ffffff");
    sh.setFrozenRows(1);
    sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).setNumberFormat("@"); // הכל טקסט: טלפונים ותאריכים לא משתנים
    sh.setRightToLeft(true);
  });
  if (!readTable_("settings").length) writeRow_("settings", { id: "main", business_name: "רבר הפקות", owner_name: "", whatsapp_mode: "link", vat_rate: 18 });
  if (!readTable_("templates").length) DEFAULT_TEMPLATES.forEach(function (r) { writeRow_("templates", { id: r[0], name: r[1], description: r[2], body: r[3], sort: r[4] }); });
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty("SECRET")) props.setProperty("SECRET", Utilities.getUuid() + Utilities.getUuid());
  var blank = ss.getSheetByName("Sheet1") || ss.getSheetByName("גיליון1");
  if (blank && ss.getSheets().length > 1 && blank.getLastRow() === 0) ss.deleteSheet(blank);
  return "✓ הגיליון מוכן. עכשיו: פריסה ← פריסה חדשה ← אפליקציית אינטרנט";
}

/* ───────────── בקשות מהמערכת ───────────── */

function doGet() {
  return json_({ ok: true, app: "rever", version: VERSION });
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (x) { return json_({ error: "בקשה לא תקינה" }); }
  try {
    return json_(handle_(req));
  } catch (x) {
    return json_({ error: String(x && x.message || x), code: x && x.code });
  }
}

function handle_(req) {
  var a = req.action;
  if (a === "staff") return { staff: publicStaff_(), setup: readTable_("members").length === 0 };
  if (a === "setup_first") return setupFirst_(req.name, req.pin);
  if (a === "login") return login_(req.staff_id, req.pin);
  var me = auth_(req.token);
  if (a === "me") return { me: publicMember_(me) };
  if (a === "load") return { db: loadAll_(me), sheet_url: me.role === "admin" ? SpreadsheetApp.getActive().getUrl() : null };
  if (a === "upsert") return withLock_(function () { upsert_(me, req.table, req.row); return { ok: true }; });
  if (a === "remove") return withLock_(function () { remove_(me, req.table, req.id); return { ok: true }; });
  if (a === "set_pin") return withLock_(function () { setPin_(me, req.staff_id, req.pin); return { ok: true }; });
  throw err_("פעולה לא מוכרת");
}

/* ───────────── כניסה ───────────── */

function setupFirst_(name, pin) {
  return withLock_(function () {
    if (readTable_("members").length) throw err_("המערכת כבר הוגדרה");
    if (!name || !validPin_(pin)) throw err_("שם וקוד של 4-8 ספרות");
    var id = Utilities.getUuid();
    writeRow_("members", { id: id, name: String(name).trim(), title: "בעלים", role: "admin", can_prices: true, can_finance: true, can_delete: true, can_templates: true, active: true, created_at: new Date().toISOString(), pin_hash: hashPin_(pin), failed_attempts: 0 });
    return { ok: true, id: id, token: makeToken_(id) };
  });
}

function login_(staffId, pin) {
  if (!validPin_(pin)) throw err_("קוד לא תקין");
  return withLock_(function () {
    var m = findRow_("members", staffId);
    if (!m || !m.active) throw err_("העובד לא נמצא");
    if (m.locked_until && new Date(m.locked_until) > new Date()) throw err_("יותר מדי ניסיונות. נסו שוב בעוד " + LOCK_MIN + " דקות");
    if (!checkPin_(pin, m.pin_hash)) {
      var tries = (Number(m.failed_attempts) || 0) + 1;
      if (tries >= MAX_TRIES) { m.failed_attempts = 0; m.locked_until = new Date(Date.now() + LOCK_MIN * 60000).toISOString(); }
      else m.failed_attempts = tries;
      writeRow_("members", m);
      throw err_(tries >= MAX_TRIES ? "הקוד ננעל ל-" + LOCK_MIN + " דקות" : "קוד שגוי");
    }
    m.failed_attempts = 0; m.locked_until = ""; m.last_login = new Date().toISOString();
    writeRow_("members", m);
    return { ok: true, token: makeToken_(m.id) };
  });
}

function auth_(token) {
  var sid = verifyToken_(token);
  if (!sid) throw err_("נדרשת כניסה מחדש", "auth");
  var m = findRow_("members", sid);
  if (!m || !m.active) throw err_("העובד לא פעיל", "auth");
  return m;
}

function makeToken_(sid) {
  var payload = Utilities.base64EncodeWebSafe(JSON.stringify({ sid: sid, exp: Date.now() + SESSION_HOURS * 3600000 }));
  return payload + "." + sign_(payload);
}
function verifyToken_(t) {
  if (!t || typeof t !== "string") return null;
  var p = t.split(".");
  if (p.length !== 2 || sign_(p[0]) !== p[1]) return null;
  try {
    var o = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(p[0])).getDataAsString());
    return o.exp > Date.now() ? o.sid : null;
  } catch (x) { return null; }
}
function sign_(s) {
  var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!secret) throw err_("הגיליון לא הותקן. להריץ את setup");
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, secret));
}
function validPin_(p) { return typeof p === "string" && /^\d{4,8}$/.test(p); }
function hashPin_(pin, salt) {
  salt = salt || Utilities.getUuid();
  var h = pin + ":" + salt;
  for (var i = 0; i < 1000; i++) h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + salt));
  return salt + ":" + h;
}
function checkPin_(pin, stored) {
  if (!stored) return false;
  var salt = String(stored).split(":")[0];
  return hashPin_(pin, salt) === String(stored);
}

/* ───────────── הרשאות ───────────── */

function can_(m, perm) {
  if (!m || !m.active) return false;
  if (m.role === "admin") return true;
  if (perm === "prices") return !!(m.can_prices || m.can_finance);
  if (perm === "finance") return !!m.can_finance;
  if (perm === "delete") return !!m.can_delete;
  if (perm === "templates") return !!m.can_templates;
  return false;
}

function publicMember_(m) {
  var o = {};
  Object.keys(m).forEach(function (k) { if (!PRIVATE_MEMBER[k]) o[k] = m[k]; });
  o.has_pin = !!m.pin_hash;
  return o;
}
function publicStaff_() {
  return readTable_("members").filter(function (m) { return m.active; }).map(function (m) {
    return { id: m.id, name: m.name, title: m.title, role: m.role, has_pin: !!m.pin_hash };
  }).sort(function (a, b) { return a.role === b.role ? 0 : a.role === "admin" ? -1 : 1; });
}

function loadAll_(me) {
  var prices = can_(me, "prices"), finance = can_(me, "finance"), out = {};
  Object.keys(TABLES).forEach(function (t) {
    if (FINANCE[t] && !finance) return (out[t] = []);
    var rows = readTable_(t);
    if (t === "members") rows = rows.map(publicMember_);
    if (t === "leads" && !prices) rows.forEach(function (r) { delete r.price; });
    if (t === "activities" && !prices) rows = rows.filter(function (r) { return r.kind !== "payment"; }).map(function (r) { r.text = String(r.text).replace(/₪\s?[\d,.]+/g, "₪•••"); return r; });
    if (t === "settings" && me.role !== "admin") rows.forEach(function (r) { delete r.make_webhook_url; });
    if (t === "event_plans" && !prices) rows.forEach(function (r) { r.suppliers = stripCosts_(r.suppliers); });
    out[t] = rows;
  });
  return out;
}

function upsert_(me, table, input) {
  if (!TABLES[table]) throw err_("טבלה לא קיימת");
  if (!input || typeof input.id !== "string" || !input.id) throw err_("חסר מזהה");
  if (FINANCE[table] && !can_(me, "finance")) throw err_("אין הרשאת כספים");
  if (table === "templates" && !can_(me, "templates")) throw err_("אין הרשאה לערוך תבניות");
  if ((table === "settings" || table === "members") && me.role !== "admin") throw err_("רק מנהלים");
  var row = {};
  TABLES[table][1].forEach(function (c) { var k = c[0]; if (!PRIVATE_MEMBER[k]) row[k] = input[k] === undefined ? "" : input[k]; });
  var prev = findRow_(table, input.id);
  if (table === "leads" && !can_(me, "prices")) row.price = prev ? prev.price : "";
  if (table === "settings" && prev && !("make_webhook_url" in input)) row.make_webhook_url = prev.make_webhook_url;
  if (table === "event_plans" && !can_(me, "prices")) row.suppliers = keepCosts_(row.suppliers, prev && prev.suppliers);
  if (table === "members") {
    if (row.id === me.id && (row.role !== "admin" || !row.active)) throw err_("אי אפשר להוריד לעצמך הרשאת מאסטר");
    if (row.role !== "admin" && row.role !== "team") row.role = "team";
    ["can_prices", "can_finance", "can_delete", "can_templates", "active"].forEach(function (k) { row[k] = !!row[k]; });
    if (prev) Object.keys(PRIVATE_MEMBER).forEach(function (k) { row[k] = prev[k]; }); // הקוד לא משתנה מכאן
  }
  writeRow_(table, row);
}

function remove_(me, table, id) {
  if (!TABLES[table]) throw err_("טבלה לא קיימת");
  var ok = table === "templates" ? can_(me, "templates")
    : table === "members" ? me.role === "admin" && id !== me.id
    : table === "settings" ? false
    : FINANCE[table] ? can_(me, "finance") && can_(me, "delete")
    : can_(me, "delete");
  if (!ok) throw err_("אין הרשאה למחוק");
  if (table === "members") {
    var admins = readTable_("members").filter(function (m) { return m.role === "admin" && m.active; });
    if (admins.length <= 1 && admins[0] && admins[0].id === id) throw err_("חייב להישאר מנהל אחד");
  }
  deleteRow_(table, id);
}

function setPin_(me, staffId, pin) {
  if (!validPin_(pin)) throw err_("קוד של 4-8 ספרות");
  if (me.role !== "admin" && staffId !== me.id) throw err_("רק מנהלים");
  var m = findRow_("members", staffId);
  if (!m) throw err_("העובד לא נמצא");
  m.pin_hash = hashPin_(pin); m.failed_attempts = 0; m.locked_until = "";
  writeRow_("members", m);
}

function stripCosts_(json) {
  if (!json) return json;
  try { return JSON.stringify(JSON.parse(json).map(function (s) { delete s.cost; return s; })); } catch (x) { return json; }
}
function keepCosts_(next, prev) {
  if (!next) return next;
  try {
    var old = {};
    (prev ? JSON.parse(prev) : []).forEach(function (s) { old[s.id] = s.cost; });
    return JSON.stringify(JSON.parse(next).map(function (s) { s.cost = old[s.id]; if (s.cost === undefined) delete s.cost; return s; }));
  } catch (x) { return ""; }
}

/* ───────────── קריאה וכתיבה לגיליון ───────────── */

function sheet_(t) {
  var sh = SpreadsheetApp.getActive().getSheetByName(TABLES[t][0]);
  if (!sh) throw err_("חסרה הלשונית \"" + TABLES[t][0] + "\". להריץ את setup");
  return sh;
}
/** מספר העמודה (0..) לכל מפתח, לפי שורת הכותרות */
function headerIndex_(sh, t) {
  var head = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  var idx = {};
  TABLES[t][1].forEach(function (c) {
    var i = head.indexOf(c[1]);
    if (i < 0) i = head.indexOf(c[0]);
    if (i >= 0) idx[c[0]] = i;
  });
  return { idx: idx, width: head.length };
}
function fromCell_(k, v) {
  if (v === "" || v === null || v === undefined) return undefined;
  if (v instanceof Date) return /date$/.test(k) && k !== "updated" ? Utilities.formatDate(v, "UTC", "yyyy-MM-dd") : v.toISOString();
  if (BOOLS[k]) return v === true || String(v).toUpperCase() === "TRUE" || v === "כן";
  if (NUMBERS[k]) { var n = Number(String(v).replace(/[,₪\s]/g, "")); return isNaN(n) ? undefined : n; }
  return String(v);
}
function toCell_(k, v) {
  if (v === undefined || v === null) return "";
  if (BOOLS[k]) return v ? "TRUE" : "FALSE";
  return String(v);
}
function readTable_(t) {
  var sh = sheet_(t), last = sh.getLastRow();
  if (last < 2) return [];
  var h = headerIndex_(sh, t), vals = sh.getRange(2, 1, last - 1, h.width).getValues(), out = [];
  vals.forEach(function (r) {
    var o = {};
    Object.keys(h.idx).forEach(function (k) { var v = fromCell_(k, r[h.idx[k]]); if (v !== undefined) o[k] = v; });
    if (o.id) out.push(o);
  });
  return out;
}
function rowNumber_(sh, h, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var col = (h.idx.id || 0) + 1;
  var ids = sh.getRange(2, col, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}
function findRow_(t, id) {
  var all = readTable_(t);
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}
function writeRow_(t, row) {
  var sh = sheet_(t), h = headerIndex_(sh, t), n = rowNumber_(sh, h, row.id);
  var cur = n > 0 ? sh.getRange(n, 1, 1, h.width).getValues()[0] : new Array(h.width).fill("");
  Object.keys(h.idx).forEach(function (k) { if (k in row) cur[h.idx[k]] = toCell_(k, row[k]); });
  if (n > 0) sh.getRange(n, 1, 1, h.width).setValues([cur]);
  else sh.appendRow(cur);
}
function deleteRow_(t, id) {
  var sh = sheet_(t), n = rowNumber_(sh, headerIndex_(sh, t), id);
  if (n > 0) sh.deleteRow(n);
}

/* ───────────── עזר ───────────── */

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function err_(msg, code) { var e = new Error(msg); e.code = code; return e; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
