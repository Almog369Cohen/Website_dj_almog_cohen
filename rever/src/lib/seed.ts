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
  const leads: Lead[] = [
    L({ id: "l1", name: "דנה ויובל", phone: "052-4418823", event_date: day(300), guests: 280, source: "אתר", status: "new",
      next_followup: at(-2, 10), followup_note: "לא ענו אחרי ההודעה הראשונה", last_contact: at(-2, 14, 10), created_at: at(-2, 13, 52) }),
    L({ id: "l2", name: "משפחת לוי", phone: "054-7720914", event_date: day(270), guests: 320, status: "quote", price: 24500,
      next_followup: at(0, 9), followup_note: "לבדוק אם ראו את הצעת המחיר", last_contact: at(-5) }),
    L({ id: "l3", name: "עדי ושחר", phone: "050-3391027", event_date: day(260), guests: 220, source: "אינסטגרם", status: "talk",
      next_followup: at(0, 10), followup_note: "ביקשו שנחזור אליהם היום ב-10:00", last_contact: at(-3) }),
    L({ id: "l4", name: "מיכל כהן", phone: "058-6612470", event_type: "בת מצווה", event_date: day(115), guests: 120, source: "וואטסאפ", status: "new",
      next_followup: at(0, 12), followup_note: "ליד חדש מאתמול, לשלוח הודעת היכרות", created_at: at(-1, 21, 40) }),
    L({ id: "l5", name: "טק-וויז בע״מ", phone: "03-7651200", event_type: "אירוע חברה", event_date: day(40), guests: 200, source: "אינסטגרם", status: "meeting",
      next_followup: at(0, 17), followup_note: "פגישה בזום", last_contact: at(-4) }),
    L({ id: "l6", name: "נועה ועידן", phone: "052-9984130", event_date: day(195), guests: 400, status: "meeting", last_contact: at(-6) }),
    L({ id: "l7", name: "סטארט-אפ נובה", phone: "054-1180236", event_type: "כנס", event_date: day(67), guests: 150, source: "המלצה", status: "quote", price: 31000,
      next_followup: at(1, 11), followup_note: "לשלוח הצעה מעודכנת", last_contact: at(-6) }),
    L({ id: "l8", name: "משפחת אזולאי", phone: "050-7745561", event_type: "בר מצווה", event_date: day(162), guests: 180, status: "talk",
      next_followup: at(3, 12), last_contact: at(-1) }),
    L({ id: "l9", name: "רוני ומאיה", phone: "053-2210984", event_date: day(230), guests: 300, status: "meeting", last_contact: at(-3) }),
    L({ id: "l10", name: "אלביט – הרמת כוסית", phone: "04-8315500", event_type: "אירוע חברה", event_date: day(44), guests: 90, status: "won", price: 19400, last_contact: at(-7) }),
    L({ id: "l11", name: "שירן ועומר", phone: "052-6677120", event_date: day(1), guests: 350, status: "won", price: 27800, venue: "אולם הגן, ראשון לציון", last_contact: at(-12) }),
    L({ id: "l12", name: "ליה ותום", phone: "054-9913345", event_date: day(4), guests: 260, status: "won", price: 23900, venue: "גני התערוכה", last_contact: at(-9) }),
    L({ id: "l13", name: "אור ונוי", phone: "050-1182233", event_date: day(-3), guests: 240, status: "won", price: 22000, last_contact: at(-20) }),
    L({ id: "l14", name: "בר מצווה – כץ", phone: "052-8812004", event_type: "בר מצווה", event_date: day(-35), guests: 150, status: "won", price: 14500, last_contact: at(-40) }),
    L({ id: "l15", name: "אורי ברק", phone: "058-3301299", event_type: "יום הולדת", guests: 80, source: "אינסטגרם", status: "lost", last_contact: at(-15) }),
  ];

  return {
    leads,
    activities: [
      { id: "a1", lead_id: "l1", kind: "created", text: "ליד חדש נכנס מהאתר", at: at(-2, 13, 52) },
      { id: "a2", lead_id: "l1", kind: "message", text: "היי דנה ויובל! 🎉 כאן גל מרבר הפקות. ראינו שהשארתם פרטים לחתונה, מזל טוב! מתי נוח לכם לשיחה קצרה?", at: at(-2, 14, 10) },
      { id: "a3", lead_id: "l2", kind: "status", text: "נשלחה הצעת מחיר ₪24,500", at: at(-5, 12) },
      { id: "a4", lead_id: "l11", kind: "payment", text: "התקבלה מקדמה ₪5,000", at: at(-60) },
    ],
    calendar_items: [
      { id: "c1", kind: "meeting", title: "פגישה: טק-וויז בע״מ", start: at(0, 17), location: "זום", lead_id: "l5" },
      { id: "c2", kind: "meeting", title: "פגישה: נועה ועידן", start: at(0, 19, 30), location: "במשרד", lead_id: "l6" },
      { id: "c3", kind: "meeting", title: "פגישה: רוני ומאיה", start: at(2, 19, 30), location: "במשרד", lead_id: "l9" },
      { id: "c4", kind: "meeting", title: "פגישה: הלל ונטע", start: at(15, 18), location: "זום" },
    ],
    templates: DEFAULT_TEMPLATES,
    payments: [
      { id: "p1", lead_id: "l11", kind: "deposit", amount: 5000, date: monthsAgo(4), method: "העברה בנקאית" },
      { id: "p2", lead_id: "l11", kind: "payment", amount: 12000, date: monthsAgo(1), method: "העברה בנקאית" },
      { id: "p3", lead_id: "l12", kind: "deposit", amount: 5000, date: monthsAgo(3), method: "ביט" },
      { id: "p4", lead_id: "l13", kind: "deposit", amount: 4000, date: monthsAgo(5), method: "העברה בנקאית" },
      { id: "p5", lead_id: "l13", kind: "payment", amount: 9000, date: day(-2), method: "העברה בנקאית" },
      { id: "p6", lead_id: "l14", kind: "deposit", amount: 3000, date: monthsAgo(4), method: "אשראי" },
      { id: "p7", lead_id: "l14", kind: "payment", amount: 11500, date: monthsAgo(1, 2), method: "העברה בנקאית" },
      { id: "p8", lead_id: "l10", kind: "deposit", amount: 6000, date: day(-6), method: "העברה בנקאית" },
      { id: "p9", lead_id: "l13", kind: "payment", amount: 9000, date: monthsAgo(2), method: "צ׳ק", note: "תשלום ביניים" },
    ],
    expenses: [
      { id: "e1", date: day(-4), amount: 3200, category: "שיווק ופרסום", supplier: "Meta" },
      { id: "e2", date: day(-3), amount: 6500, category: "ספקים", supplier: "תאורה – אור והפקות", lead_id: "l13" },
      { id: "e3", date: monthsAgo(1), amount: 2900, category: "שיווק ופרסום", supplier: "Meta" },
      { id: "e4", date: monthsAgo(1, 15), amount: 7800, category: "ספקים", supplier: "DJ – הפקות סאונד", lead_id: "l14" },
      { id: "e5", date: monthsAgo(2), amount: 4100, category: "ציוד", supplier: "ציוד במה" },
      { id: "e6", date: monthsAgo(3), amount: 2600, category: "שיווק ופרסום", supplier: "Meta" },
      { id: "e7", date: monthsAgo(4), amount: 1900, category: "משרד", supplier: "מורנינג + תוכנות" },
      { id: "e8", date: monthsAgo(5), amount: 3300, category: "רכב והובלה", supplier: "הובלות דרום" },
    ],
    docs: [
      { id: "d1", lead_id: "l2", type: "quote", number: "Q-1042", amount: 24500, date: day(-5), status: "sent" },
      { id: "d2", lead_id: "l7", type: "quote", number: "Q-1043", amount: 31000, date: day(-6), status: "sent" },
      { id: "d3", lead_id: "l13", type: "invoice", number: "INV-2207", amount: 22000, date: day(-2), status: "paid" },
      { id: "d4", lead_id: "l10", type: "receipt", number: "R-3110", amount: 6000, date: day(-6), status: "paid" },
    ],
    settings: [{ id: "main", business_name: "רבר הפקות", owner_name: "גל", whatsapp_mode: "link", vat_rate: 18 }],
    members: DEMO_MEMBERS,
  };
}

export const DEMO_MEMBERS: Member[] = [
  { id: "gal@rever.co.il", name: "גל", role: "admin", can_finance: true, can_delete: true, can_templates: true, active: true },
  { id: "liel@rever.co.il", name: "ליאל", role: "admin", can_finance: true, can_delete: true, can_templates: true, active: true },
  { id: "noa@rever.co.il", name: "נועה", role: "team", can_finance: false, can_delete: false, can_templates: false, active: true },
];

export function emptyDB(): DB {
  return {
    leads: [], activities: [], calendar_items: [], templates: DEFAULT_TEMPLATES, payments: [], expenses: [], docs: [],
    settings: [{ id: "main", business_name: "רבר הפקות", owner_name: "", whatsapp_mode: "link", vat_rate: 18 }],
    members: [],
  };
}
