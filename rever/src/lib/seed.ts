import type { DB, Lead, Member, Template } from "./types";
import { ymd } from "./format";

/** נתוני דמו — תאריכים יחסיים להיום כדי שהדמו תמיד ייראה עדכני */
const at = (days: number, h = 0, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const day = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return ymd(d);
};
const monthsAgo = (n: number, dd = 10) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n, dd);
  return ymd(d);
};

export const DEFAULT_TEMPLATES: Template[] = [
  { id: "t1", sort: 1, name: "👋 הודעת היכרות", description: "לליד חדש, בפעם הראשונה",
    body: "היי {שם}! 🎉 כאן {בעלים} מ{עסק}. ראינו שהשארתם פרטים ל{אירוע} ב-{תאריך}, מזל טוב! מתי נוח לכם לשיחה קצרה?" },
  { id: "t2", sort: 2, name: "🔁 פולואפ: לא ענו", description: "אחרי 2 ימים בלי תשובה",
    body: "היי {שם} 😊 רק מוודאת שההודעה הקודמת הגיעה. נשמח לשמוע על ה{אירוע} ולהתאים לכם הצעה. מתאים לכם לדבר מחר בערב?" },
  { id: "t3", sort: 3, name: "📅 אישור פגישה", description: "יום לפני הפגישה, עם שעה ומקום",
    body: "היי {שם}, רק מזכירה שנפגשים {פגישה}. מחכים לכם! אם משהו משתנה, תכתבו לי כאן 🙏" },
  { id: "t4", sort: 4, name: "📄 בדיקה אחרי הצעת מחיר", description: "3 ימים אחרי שליחת ההצעה",
    body: "היי {שם}, רציתי לבדוק אם יצא לכם לעבור על הצעת המחיר ששלחנו. יש שאלות? אשמח לעבור עליה יחד בטלפון." },
  { id: "t5", sort: 5, name: "💳 תזכורת מקדמה", description: "אחרי שסגרו",
    body: "היי {שם}, איזה כיף שסגרנו! 🥂 כדי לשריין את התאריך ({תאריך}) נשמח לקבל את המקדמה. פרטי ההעברה מצורפים." },
  { id: "t6", sort: 6, name: "🙏 תודה אחרי האירוע", description: "בקשת המלצה וביקורת בגוגל",
    body: "היי {שם}, תודה שבחרתם בנו! היה אירוע מדהים ❤️ נשמח מאוד אם תכתבו לנו כמה מילים בגוגל, זה עוזר לנו המון." },
];

const L = (p: Partial<Lead> & Pick<Lead, "id" | "name" | "phone" | "status">): Lead => ({
  event_type: "חתונה",
  source: "פייסבוק",
  created_at: at(-10),
  ...p,
});

export function demoDB(): DB {
  // 3 לקוחות לדוגמה, מספרים עגולים: ליד חדש · הצעת מחיר · אירוע סגור
  const leads: Lead[] = [
    L({ id: "l1", assigned_to: "m-arad", name: "דנה ויובל", phone: "050-0000001", event_type: "חתונה", event_date: day(300), guests: 300, source: "פייסבוק",
      status: "new", next_followup: at(0, 10), followup_note: "ליד חדש: לשלוח הודעת היכרות", created_at: at(-1, 20) }),
    L({ id: "l2", assigned_to: "m-liel", name: "משפחת לוי", phone: "050-0000002", event_type: "בר מצווה", event_date: day(120), guests: 150, source: "המלצה",
      status: "quote", price: 20000,
      money_items: JSON.stringify([{ id: "mq1", service: "הפקת בר מצווה", supplier: "רבר הפקות", price: 20000, show_client: true }]), next_followup: at(0, 12), followup_note: "לבדוק אם ראו את הצעת המחיר", last_contact: at(-3, 12), created_at: at(-10) }),
    L({ id: "l3", assigned_to: "m-gal", name: "שירן ועומר", phone: "050-0000003", event_type: "חתונה", event_date: day(20), guests: 400, source: "אינסטגרם",
      venue: "אולם הגן", status: "won", price: 30000, last_contact: at(-5), created_at: at(-60),
      money_items: JSON.stringify([
        { id: "mi1", service: "הפקה וניהול האירוע", supplier: "רבר הפקות", price: 9000, show_client: true },
        { id: "mi2", service: "צילום", supplier: "סטודיו לדוגמה", price: 8000, show_client: true },
        { id: "mi3", service: "דיג׳יי", supplier: "די ג׳יי לדוגמה", price: 8000, show_client: true },
        { id: "mi4", service: "תאורה והגברה", supplier: "תאורה והגברה", price: 5000, show_client: true },
      ]),
      money_plan: JSON.stringify([
        { id: "mp1", name: "מקדמה", amount: 10000, due: monthsAgo(1), paid: { date: monthsAgo(1), amount: 10000, method: "transfer" } },
        { id: "mp2", name: "תשלום ביניים", amount: 5000, due: day(-2), paid: { date: day(-2), amount: 5000, method: "bit" } },
        { id: "mp3", name: "תשלום סופי", amount: 15000, due: day(13) },
      ]),
      contacts: JSON.stringify([{ id: "c1", name: "שירן", role: "כלה", phone: "050-0000003" }, { id: "c2", name: "עומר", role: "חתן", phone: "050-0000015" }, { id: "c3", name: "רונית", role: "אמא של הכלה", phone: "050-0000013" }]) }),
  ];

  return {
    leads,
    activities: [
      { id: "a1", lead_id: "l1", kind: "created", text: "ליד חדש נכנס מפייסבוק", at: at(-1, 20) },
      { id: "a2", lead_id: "l2", by: "m-liel", kind: "status", text: "נשלחה הצעת מחיר ₪20,000", at: at(-3, 12) },
      { id: "a3", lead_id: "l3", by: "m-gal", kind: "status", text: 'סטטוס שונה ל"נסגר"', at: at(-45) },
      { id: "a4", lead_id: "l3", by: "m-gal", kind: "payment", text: "💳 נרשם תשלום: מקדמה ₪10,000 (העברה)", at: at(-45) },
    ],
    calendar_items: [
      { id: "c1", kind: "meeting", title: "פגישה: משפחת לוי", start: at(1, 18), location: "במשרד", lead_id: "l2" },
    ],
    templates: DEFAULT_TEMPLATES,
    payments: [],
    expenses: [],
    docs: [],
    settings: [{ id: "main", business_name: "רבר הפקות", owner_name: "גל", whatsapp_mode: "link", vat_rate: 18, contact_phone: "050-0000000" }],
    members: DEMO_MEMBERS,
    event_plans: [
      {
        id: "l3",
        timeline: JSON.stringify([
          { id: "t1", time: "16:00", title: "הגעת ספקים והקמה", who: "גל", show_client: false },
          { id: "t2", time: "18:30", title: "צילומי זוג ומשפחה", who: "צלם" },
          { id: "t3", time: "19:30", title: "קבלת פנים", who: "אולם" },
          { id: "t4", time: "21:00", title: "חופה", who: "רב · גל" },
          { id: "t5", time: "21:30", title: "כניסה לאולם וריקוד ראשון", who: "DJ" },
          { id: "t6", time: "22:00", title: "מנה ראשונה", who: "קייטרינג" },
          { id: "t7", time: "22:45", title: "רחבת ריקודים", who: "DJ" },
          { id: "t8", time: "00:30", title: "סיום ופירוק", who: "גל", show_client: false },
        ]),
        suppliers: JSON.stringify([
          { id: "s1", category: "venue", role: "אולם וקייטרינג", name: "אולם הגן", phone: "050-0000014", confirmed: true, show_client: true },
          { id: "s2", category: "photo", role: "צילום", name: "סטודיו לדוגמה", phone: "050-0000011", cost: 6000, confirmed: true, show_client: true },
          { id: "s3", category: "dj", role: "DJ", name: "די ג'יי לדוגמה", phone: "050-0000010", cost: 8000, confirmed: true, show_client: true },
          { id: "s4", category: "light", role: "תאורה והגברה", name: "תאורה והגברה", phone: "050-0000012", cost: 5000, confirmed: false, show_client: false },
        ]),
        checklist: JSON.stringify({ contract: true, deposit: true, meeting: true, suppliers: false, venue: true }),
        extra_checks: JSON.stringify(["c_demo1", "c_demo2"]),
        check_meta: JSON.stringify({
          items: {
            suppliers: { due: day(-2), note: "התאורה עוד לא אישרה. לחזור אליהם עד סוף השבוע" },
            timeline: { due: day(10) },
            venue: { note: "האולם מבקש הגעת ספקים לא לפני 16:00" },
            "x:c_demo1": { label: "הזמנת שאטלים לאורחים", due: day(7) },
            invoice: { section: "after" },
            "x:c_demo2": { label: "החזרת ציוד מהאולם", section: "after", due: day(21) },
          },
        }),
        contact_name: "אמא של הכלה",
        contact_phone: "050-0000013",
        requests: "בלי עשן כבד · הפתעה לחתן ברחבה אחרי הריקוד הראשון",
        contract_status: "signed",
        internal_notes: "לתאם הכל דרך הכלה. האולם מבקש הגעת ספקים לא לפני 16:00.",
        portal_token: "demo-shiran-omer-xxxxxxxxxxxxxxx",
        portal_enabled: true,
        portal_code: "482913",
        portal_code_ver: 0,
        client_tasks_rev: 0,
        client_tasks: JSON.stringify([
          { id: "k1", title: "אישורי הגעה מהמוזמנים", owner: "both", category: "guests", status: "on_it", start: day(-8), done: false, section: "before", order: 0 },
          { id: "k2", title: "פתיחת תיק ברבנות", owner: "b", category: "rabbinate", status: "todo", start: day(-9), note: "להביא תעודות זהות + אישור רווקות", done: false, section: "before", order: 1 },
          { id: "k3", title: "מדידה אחרונה לשמלה", owner: "a", category: "outfit", status: "todo", start: day(3), done: false, section: "before", order: 2 },
          { id: "k4", title: "סידורי ישיבה", owner: "none", category: "guests", status: "todo", start: day(10), done: false, section: "before", order: 3 },
          { id: "k5", title: "בחירת חליפה", owner: "b", category: "outfit", status: "doing", start: day(-20), done: false, section: "before", order: 4 },
          { id: "k6", title: "הכנת רשימת מוזמנים", owner: "both", category: "guests", status: "todo", start: day(-130), done: true, section: "before", order: 5 },
          { id: "k7", title: "רכישת טבעות", owner: "both", category: "rings", status: "todo", start: day(-70), done: true, section: "before", order: 6 },
          { id: "k8", title: "בחירת שמלה", owner: "a", category: "outfit", status: "todo", start: day(-100), done: true, section: "before", order: 7 },
          { id: "k9", title: "הודעות תודה לאורחים", owner: "both", category: "after", status: "todo", start: day(23), done: false, section: "after", order: 8 },
          { id: "k10", title: "בחירת תמונות לאלבום", owner: "a", category: "after", status: "todo", start: day(34), done: false, section: "after", order: 9 },
        ]),
      },
    ],
  };
}

const M = (p: Partial<Member> & Pick<Member, "id" | "name" | "role">): Member => ({
  can_prices: false, can_finance: false, can_delete: false, can_templates: false, active: true, has_pin: true, ...p,
});
/** קודים בדמו: גל 1111 · ליאל 2222 · ארד 3333 · ספיר 4444 */
export const DEMO_MEMBERS: Member[] = [
  M({ id: "m-gal", name: "גל", title: "בעלים", phone: "050-0000101", role: "admin", pin: "1111" }),
  M({ id: "m-liel", name: "ליאל", title: "בעלים", phone: "050-0000102", role: "admin", pin: "2222" }),
  M({ id: "m-arad", name: "ארד", title: "עוזר ומנהל תפעול · חזרה ללקוחות", phone: "050-0000103", role: "team", can_templates: true, can_portal: true, pin: "3333" }),
  M({ id: "m-sapir", name: "ספיר", title: "מזכירה", phone: "050-0000104", role: "team", pin: "4444" }),
];

export function emptyDB(): DB {
  return {
    leads: [], activities: [], calendar_items: [], templates: DEFAULT_TEMPLATES, payments: [], expenses: [], docs: [],
    settings: [{ id: "main", business_name: "רבר הפקות", owner_name: "", whatsapp_mode: "link", vat_rate: 18 }],
    members: [],
    event_plans: [],
  };
}
