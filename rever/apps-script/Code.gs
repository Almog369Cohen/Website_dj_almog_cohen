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
  docs: ["מסמכים", [["id", "מזהה"], ["lead_id", "ליד"], ["type", "סוג"], ["number", "מספר"], ["amount", "סכום"], ["date", "תאריך"], ["status", "סטטוס"], ["show_client", "מוצג ללקוח"]]],
  settings: ["הגדרות", [["id", "מזהה"], ["business_name", "שם העסק"], ["owner_name", "שם בהודעות"], ["whatsapp_mode", "שליחת וואטסאפ"], ["make_webhook_url", "Make webhook"], ["vat_rate", "מעמ"], ["sheet_url", "גיליון לידים"], ["sheet_map", "מיפוי עמודות"], ["sheet_auto", "משיכה אוטומטית"], ["sheet_last_pull", "משיכה אחרונה"], ["contact_phone", "טלפון לפניות לקוחות"]]],
  members: ["צוות", [["id", "מזהה"], ["name", "שם"], ["title", "תפקיד"], ["phone", "טלפון"], ["role", "הרשאה"], ["can_prices", "מחירים"], ["can_finance", "כספים"], ["can_delete", "מחיקה"], ["can_templates", "תבניות"], ["can_portal", "קישור ללקוח"], ["active", "פעיל"], ["created_at", "נוצר"], ["pin_hash", "קוד מוצפן"], ["failed_attempts", "ניסיונות שגויים"], ["locked_until", "נעול עד"], ["last_login", "כניסה אחרונה"]]],
  event_plans: ["אירועים", [["id", "ליד"], ["timeline", "לוז"], ["suppliers", "ספקים"], ["checklist", "צקליסט"], ["extra_checks", "פריטים נוספים"], ["contact_name", "איש קשר"], ["contact_phone", "טלפון איש קשר"], ["requests", "בקשות מיוחדות"], ["notes", "הערות"], ["after", "אחרי האירוע"], ["portal_token", "קוד קישור ללקוח"], ["portal_enabled", "קישור פעיל"], ["portal_sections", "מה הלקוח רואה"], ["portal_seen_at", "הלקוח צפה"], ["client_steps", "שלבים ללקוח"], ["payment_plan", "תוכנית תשלומים"], ["contract_status", "חוזה"], ["internal_notes", "הערות פנימיות"], ["portal_code", "קוד כניסה ללקוח"], ["portal_code_ver", "גרסת קוד"], ["portal_fails", "ניסיונות שגויים"], ["portal_locked_until", "נעול עד"], ["client_tasks", "משימות הזוג"], ["client_tasks_rev", "גרסת משימות"], ["partner_a", "בן/בת זוג א"], ["partner_b", "בן/בת זוג ב"], ["dismissed_suggestions", "הצעות שנסגרו"], ["updated_at", "עודכן"]]]
};
var NUMBERS = { guests: 1, price: 1, amount: 1, vat_rate: 1, sort: 1, failed_attempts: 1, portal_code_ver: 1, portal_fails: 1, client_tasks_rev: 1 };
var BOOLS = { can_prices: 1, can_finance: 1, can_delete: 1, can_templates: 1, can_portal: 1, active: 1, sheet_auto: 1, portal_enabled: 1, show_client: 1 };
var PORTAL_FIELDS = ["portal_token", "portal_enabled", "portal_sections", "client_steps", "portal_code", "portal_code_ver"];
// נכתבים רק דרך מסלולים ייעודיים (צפייה, כניסה, שמירת משימות), לא בשמירה רגילה
var GUARDED = ["portal_seen_at", "portal_fails", "portal_locked_until", "client_tasks", "client_tasks_rev", "dismissed_suggestions"];
var SERVER_ONLY = ["portal_fails", "portal_locked_until"];
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
/** עמודות ישנות שכבר לא בשימוש (רבר היא חברת הפקות, לא דיג'יי): נמחקות מגיליון קיים */
var OBSOLETE = { event_plans: ["שירי חובה", "אסור לנגן", "רגעים", "ציוד", "must_songs", "no_songs", "moments", "equipment"] };
function removeColumns_(sh, names) {
  if (!names.length || !sh.getLastColumn()) return;
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  for (var i = head.length - 1; i >= 0; i--) if (names.indexOf(String(head[i])) >= 0) sh.deleteColumn(i + 1);
}

function setup() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(TABLES).forEach(function (t) {
    var name = TABLES[t][0], cols = TABLES[t][1];
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    removeColumns_(sh, OBSOLETE[t] || []);
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
  // ---- הזוג (בלי קוד עובד): כניסה, צפייה, שמירת המשימות שלהם בלבד ----
  if (a === "portal_login") return portalLogin_(req.phone, req.code);
  if (a === "portal_view") return portalView_(req.session);
  if (a === "portal_tasks") return portalTasks_(req.session, req);
  if (a === "portal_preview") return portalPreview_(req.portal_token); // תצוגה מקדימה לצוות: קריאה בלבד
  var me = auth_(req.token);
  if (a === "me") return { me: publicMember_(me) };
  if (a === "load") return { db: loadAll_(me), sheet_url: me.role === "admin" ? SpreadsheetApp.getActive().getUrl() : null };
  if (a === "upsert") return withLock_(function () { upsert_(me, req.table, req.row); return { ok: true }; });
  if (a === "remove") return withLock_(function () { remove_(me, req.table, req.id); return { ok: true }; });
  if (a === "set_pin") return withLock_(function () { setPin_(me, req.staff_id, req.pin); return { ok: true }; });
  if (a === "tasks_save") return withLock_(function () { return saveTasks_(findRow_("event_plans", req.id) || { id: req.id }, req, false); });
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
  if (perm === "portal") return !!m.can_portal;
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
    if (t === "event_plans" && !(prices && finance)) rows.forEach(function (r) { delete r.payment_plan; }); // תוכנית בלי תשלומים = "באיחור" מזויף
    if (t === "event_plans") rows.forEach(function (r) {
      SERVER_ONLY.forEach(function (k) { delete r[k]; });
      if (!can_(me, "portal")) { delete r.portal_token; delete r.portal_code; }
    });
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
  if (table === "event_plans" && !(can_(me, "prices") && can_(me, "finance"))) row.payment_plan = prev ? prev.payment_plan : "";
  if (table === "event_plans" && !can_(me, "portal")) PORTAL_FIELDS.forEach(function (k) { row[k] = prev ? prev[k] : ""; });
  if (table === "event_plans") GUARDED.forEach(function (k) { row[k] = prev && prev[k] !== undefined ? prev[k] : ""; }); // נשמר הערך הקיים
  if (table === "event_plans" && row.portal_token) {
    var clash = readTable_("event_plans").filter(function (p) { return p.portal_token === row.portal_token && p.id !== row.id; });
    if (clash.length) throw err_("קוד קישור כפול");
  }
  if (table === "members") {
    if (row.id === me.id && (row.role !== "admin" || !row.active)) throw err_("אי אפשר להוריד לעצמך הרשאת מאסטר");
    if (row.role !== "admin" && row.role !== "team") row.role = "team";
    ["can_prices", "can_finance", "can_delete", "can_templates", "can_portal", "active"].forEach(function (k) { row[k] = !!row[k]; });
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

/* ───────────── קישור ללקוח (קריאה בלבד) ───────────── */
// חייב להתאים ל-src/lib/portal.ts (הבדיקות משוות בין השניים)
var CHECK_IDS = ["contract", "deposit", "meeting", "suppliers", "timeline", "venue", "invoice", "final_payment"];
var CLIENT_STEP_LABELS = { contract: "החוזה נחתם", deposit: "מקדמה התקבלה", meeting: "פגישת תיאום", suppliers: "הספקים נסגרו", timeline: "לו״ז סופי", venue: "תיאום עם המקום", invoice: "חשבונית", final_payment: "תשלום אחרון" };
var DEFAULT_CLIENT_STEPS = ["contract", "deposit", "meeting", "suppliers", "timeline"];
var DOC_LABELS = { quote: "הצעת מחיר", invoice: "חשבונית מס", receipt: "קבלה" };
var SUP_CATS = { venue: ["אולם / מקום", "🏛️"], catering: ["קייטרינג", "🍽️"], design: ["עיצוב ופרחים", "💐"], photo: ["צילום", "📸"], dj: ["DJ", "🎧"], light: ["תאורה והגברה", "💡"], attraction: ["אטרקציות", "🎉"], other: ["אחר", "🤝"] };

var CLIENT_DAYS = 90, CLIENT_MAX_TRIES = 5, CLIENT_LOCK_MIN = 15, CLIENT_LOGIN_ERROR = "טלפון או קוד שגויים";

function makeClientToken_(pid, ver) {
  var payload = Utilities.base64EncodeWebSafe(JSON.stringify({ pid: pid, v: ver, exp: Date.now() + CLIENT_DAYS * 86400000 }));
  return payload + "." + sign_("client:" + payload);
}
function verifyClientToken_(t) {
  if (!t || typeof t !== "string") return null;
  var p = t.split(".");
  if (p.length !== 2 || sign_("client:" + p[0]) !== p[1]) return null;
  try {
    var o = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(p[0])).getDataAsString());
    return typeof o.pid === "string" && o.exp > Date.now() ? { pid: o.pid, v: Number(o.v) || 0 } : null;
  } catch (x) { return null; }
}
function normPhone_(p) { var d = String(p == null ? "" : p).replace(/\D/g, ""); return d.indexOf("972") === 0 ? "0" + d.slice(3) : d; }

/** האירוע של הזוג לפי האסימון ("קוד חדש" מנתק אסימונים ישנים) */
function planBySession_(session) {
  var s = verifyClientToken_(session);
  if (!s) return null;
  var plan = findRow_("event_plans", s.pid);
  if (!plan || !plan.portal_enabled || (Number(plan.portal_code_ver) || 0) !== s.v) return null;
  var lead = findRow_("leads", plan.id);
  if (!lead || lead.status !== "won") return null;
  return { plan: plan, lead: lead };
}
function viewOf_(lead, plan) { return clientView_(lead, plan, readTable_("payments"), readTable_("docs"), readTable_("settings"), readTable_("members")); }

function portalLogin_(phone, code) {
  var p = normPhone_(phone), c = String(code == null ? "" : code).trim();
  if (p.length < 9 || !/^\d{6}$/.test(c)) throw err_(CLIENT_LOGIN_ERROR);
  return withLock_(function () {
    var leads = readTable_("leads"), now = Date.now(), candidates = [], match = null;
    readTable_("event_plans").forEach(function (pl) {
      var l = leads.filter(function (x) { return x.id === pl.id; })[0];
      if (l && l.status === "won" && pl.portal_enabled && normPhone_(l.phone) === p) {
        candidates.push(pl);
        if (!match && pl.portal_code && String(pl.portal_code) === c) match = pl;
      }
    });
    if (candidates.some(function (pl) { return pl.portal_locked_until && new Date(pl.portal_locked_until).getTime() > now; })) throw err_("יותר מדי ניסיונות. נסו שוב בעוד " + CLIENT_LOCK_MIN + " דקות");
    if (!match) {
      candidates.forEach(function (pl) {
        var fails = (Number(pl.portal_fails) || 0) + 1, lock = fails >= CLIENT_MAX_TRIES;
        pl.portal_fails = lock ? 0 : fails; pl.portal_locked_until = lock ? new Date(now + CLIENT_LOCK_MIN * 60000).toISOString() : "";
        writeRow_("event_plans", pl);
      });
      throw err_(CLIENT_LOGIN_ERROR);
    }
    match.portal_fails = 0; match.portal_locked_until = ""; writeRow_("event_plans", match);
    return { session: makeClientToken_(match.id, Number(match.portal_code_ver) || 0) };
  });
}

/** הדף של הזוג (אחרי כניסה). רושם צפייה בהיסטוריה, לכל היותר פעם ב-6 שעות */
function portalView_(session) {
  var d = planBySession_(session);
  if (!d) throw err_("נדרשת כניסה מחדש", "auth");
  withLock_(function () {
    var p = findRow_("event_plans", d.plan.id), now = new Date().toISOString(), prev = p.portal_seen_at;
    p.portal_seen_at = now; writeRow_("event_plans", p);
    if (!prev || new Date(now) - new Date(prev) >= 6 * 3600e3) writeRow_("activities", { id: Utilities.getUuid(), lead_id: d.plan.id, kind: "note", text: "👀 הלקוח צפה בדף האירוע", at: now });
  });
  return { view: viewOf_(d.lead, d.plan) };
}

/** תצוגה מקדימה לצוות לפי הקישור הסודי: קריאה בלבד, לא נרשמת צפייה */
function portalPreview_(token) {
  if (!token || String(token).length < 20) throw err_("הקישור לא פעיל");
  var plan = null;
  readTable_("event_plans").forEach(function (p) { if (p.portal_token === token) plan = p; });
  if (!plan || !plan.portal_enabled) throw err_("הקישור לא פעיל");
  var lead = findRow_("leads", plan.id);
  if (!lead || lead.status !== "won") throw err_("הקישור לא פעיל");
  return { view: viewOf_(lead, plan) };
}

/** הפעולה היחידה שהלקוח כותב: המשימות שלהם */
function portalTasks_(session, req) {
  return withLock_(function () {
    var d = planBySession_(session);
    if (!d) throw err_("נדרשת כניסה מחדש", "auth");
    return saveTasks_(d.plan, req, true);
  });
}

/* ───── המשימות של הזוג: ולידציה ושמירה (חייב להתאים ל-src/lib/tasks.ts + portal.ts) ───── */
var TASK_LIMITS = { count: 100, title: 120, note: 300, id: 40, dismissed: 200 };
var TASK_OWNERS = ["a", "b", "both", "none"], TASK_STATUSES = ["todo", "doing", "on_it"];
var TASK_CATS = ["guests", "rabbinate", "outfit", "rings", "transport", "day", "money", "after", "other"];
var TASKS_LOG_PREFIX = "✅ הזוג עדכן משימות";

function str_(v, max) { return typeof v === "string" ? v.trim().slice(0, max) : ""; }
function sanitizeTasks_(input) {
  if (!Array.isArray(input)) throw err_("רשימה לא תקינה");
  if (input.length > TASK_LIMITS.count) throw err_("עד " + TASK_LIMITS.count + " משימות");
  var seen = {};
  return input.map(function (raw, i) {
    var r = raw && typeof raw === "object" ? raw : {};
    var id = str_(r.id, TASK_LIMITS.id), title = str_(r.title, TASK_LIMITS.title + 1);
    if (!id || seen[id]) throw err_("משימה בלי מזהה");
    if (!title) throw err_("משימה בלי שם");
    if (title.length > TASK_LIMITS.title) throw err_("שם משימה עד " + TASK_LIMITS.title + " תווים");
    seen[id] = 1;
    if (TASK_OWNERS.indexOf(r.owner) < 0) throw err_("אחראי לא תקין");
    if (TASK_STATUSES.indexOf(r.status) < 0) throw err_("סטטוס לא תקין");
    if (r.section !== "before" && r.section !== "after") throw err_("חלק לא תקין");
    var start = str_(r.start, 10);
    if (start && !/^\d{4}-\d{2}-\d{2}$/.test(start)) throw err_("תאריך לא תקין");
    var note = str_(r.note, TASK_LIMITS.note), order = Number(r.order);
    var t = { id: id, title: title, owner: r.owner, category: TASK_CATS.indexOf(r.category) >= 0 ? r.category : "other", status: r.status, done: r.done === true, section: r.section, order: isFinite(order) ? Math.round(order) : i };
    if (start) t.start = start;
    if (note) t.note = note;
    return t;
  });
}
function sanitizeDismissed_(input) {
  if (!Array.isArray(input)) return [];
  var out = [];
  input.forEach(function (x) { if (typeof x === "string" && /^[a-z0-9-]{1,40}$/.test(x) && out.indexOf(x) < 0) out.push(x); });
  return out.slice(0, TASK_LIMITS.dismissed);
}
function describeChange_(prev, next) {
  var before = {}, after = {};
  prev.forEach(function (t) { before[t.id] = t; });
  next.forEach(function (t) { after[t.id] = t; });
  var done = next.filter(function (t) { return t.done && before[t.id] && !before[t.id].done; }).map(function (t) { return t.title; });
  var added = next.filter(function (t) { return !before[t.id]; }).map(function (t) { return t.title; });
  var removed = prev.filter(function (t) { return !after[t.id]; }).map(function (t) { return t.title; });
  var parts = [];
  if (done.length) parts.push("סימנו: " + done.join(", "));
  if (added.length) parts.push("הוסיפו: " + added.join(", "));
  if (removed.length) parts.push("מחקו: " + removed.join(", "));
  return parts.join(" · ") || "עדכנו פרטים";
}
function saveTasks_(plan, req, client) {
  var sections = { tasks: true }, s = parse_(plan.portal_sections, {});
  if (s.tasks === false) sections.tasks = false;
  if (client && !sections.tasks) throw err_("המשימות לא פתוחות לעריכה");
  var cur = Number(plan.client_tasks_rev) || 0;
  if (Number(req.rev) !== cur) throw err_("הרשימה עודכנה בינתיים. טוענים מחדש", "conflict");
  var tasks = sanitizeTasks_(req.tasks), prev = parse_(plan.client_tasks, []);
  if (!Array.isArray(prev)) prev = [];
  var row = findRow_("event_plans", plan.id) || { id: plan.id };
  row.client_tasks = JSON.stringify(tasks);
  row.client_tasks_rev = cur + 1;
  row.dismissed_suggestions = JSON.stringify(sanitizeDismissed_(req.dismissed !== undefined ? req.dismissed : parse_(plan.dismissed_suggestions, [])));
  writeRow_("event_plans", row);
  if (client) {
    var now = new Date().toISOString(), change = describeChange_(prev, tasks);
    var last = readTable_("activities").filter(function (a) { return a.lead_id === plan.id && String(a.text).indexOf(TASKS_LOG_PREFIX) === 0; }).sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); })[0];
    if (last && String(last.text).indexOf(TASKS_LOG_PREFIX) === 0 && new Date(now) - new Date(last.at) < 3600e3) {
      last.text = (last.text + " · " + change).slice(0, 400); last.at = now; writeRow_("activities", last);
    } else writeRow_("activities", { id: Utilities.getUuid(), lead_id: plan.id, kind: "note", text: (TASKS_LOG_PREFIX + ": " + change).slice(0, 400), at: now });
  }
  return { rev: cur + 1 };
}
function partners_(lead, plan) {
  var parts = String(lead.name || "").split(/\s+ו(?=\S)|\s*&\s*|\s*\+\s*/);
  var a = plan.partner_a || (parts.length > 1 ? parts[0].trim() : "");
  var b = plan.partner_b || (parts.length > 1 ? parts[1].trim() : "");
  return { a: a || "צד א׳", b: b || "צד ב׳" };
}

function parse_(s, d) { if (!s) return d; try { return JSON.parse(s); } catch (x) { return d; } }
function timeKey_(t) { var p = String(t || "").split(":"); var h = Number(p[0]) || 0, m = Number(p[1]) || 0; return (h < 6 ? h + 24 : h) * 60 + m; }

function clientView_(lead, plan, payments, docs, settingsRows, members) {
  var sections = { status: true, tasks: true, timeline: true, payments: true, suppliers: true, details: true };
  var s = parse_(plan.portal_sections, {});
  Object.keys(s).forEach(function (k) { sections[k] = s[k]; });
  var checklist = parse_(plan.checklist, {}), extra = parse_(plan.extra_checks, []);
  var ids = CHECK_IDS.concat(extra.map(function (x) { return "x:" + x; }));
  var settings = settingsRows[0] || {};
  var owner = members.filter(function (m) { return m.id === lead.assigned_to; })[0];
  var view = {
    business: settings.business_name || "",
    event: { name: lead.name, type: lead.event_type, date: lead.event_date, venue: lead.venue, guests: lead.guests },
    sections: sections,
    contact: { name: String((owner && owner.name) || settings.owner_name || settings.business_name || "").split(" ")[0], phone: (owner && owner.phone) || settings.contact_phone || undefined }
  };
  if (sections.status) {
    view.readiness = ids.length ? Math.round(ids.filter(function (i) { return checklist[i]; }).length / ids.length * 100) : 0;
    view.steps = parse_(plan.client_steps, DEFAULT_CLIENT_STEPS).filter(function (id) { return CLIENT_STEP_LABELS[id]; })
      .map(function (id) { return { label: CLIENT_STEP_LABELS[id], done: !!checklist[id] }; });
  }
  if (sections.tasks) {
    var list = parse_(plan.client_tasks, []);
    view.tasks = { list: Array.isArray(list) ? list : [], rev: Number(plan.client_tasks_rev) || 0, partners: partners_(lead, plan), dismissed: parse_(plan.dismissed_suggestions, []) };
  }
  if (sections.timeline) {
    view.timeline = parse_(plan.timeline, []).filter(function (t) { return t.show_client !== false && t.title; })
      .sort(function (a, b) { return timeKey_(a.time) - timeKey_(b.time); })
      .map(function (t) { return { time: t.time, title: t.title }; });
  }
  if (sections.payments) {
    var total = Number(lead.price) || 0;
    var paid = payments.filter(function (p) { return p.lead_id === lead.id; }).reduce(function (a, p) { return a + (p.kind === "refund" ? -p.amount : p.amount); }, 0);
    var left = paid;
    view.payments = {
      total: total, paid: paid, balance: Math.max(0, total - paid),
      plan: parse_(plan.payment_plan, []).map(function (p) { var ok = left >= p.amount - 0.5; left -= p.amount; return { name: p.name, amount: p.amount, due: p.due, paid: ok }; }),
      docs: docs.filter(function (d) { return d.lead_id === lead.id && d.show_client && d.status !== "cancelled"; })
        .map(function (d) { return { label: DOC_LABELS[d.type], number: d.number, date: d.date }; })
    };
  }
  if (sections.suppliers) {
    view.suppliers = parse_(plan.suppliers, []).filter(function (x) { return x.show_client && x.name; }).map(function (x) {
      var c = SUP_CATS[x.category];
      return { category: (c && c[0]) || x.role || "", icon: (c && c[1]) || "🤝", name: x.name, phone: x.phone || undefined };
    });
  }
  if (sections.details) {
    var tl = view.timeline || [], arrival;
    tl.forEach(function (t) { if (!arrival && /קבלת פנים|הגעת אורחים/.test(t.title)) arrival = t.time; });
    view.details = { venue: lead.venue, arrival: arrival, guests: lead.guests, day_contact: plan.contact_name || undefined, requests: plan.requests || undefined };
  }
  return JSON.parse(JSON.stringify(view)); // מסיר undefined, כמו JSON בצד השני
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
