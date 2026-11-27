/**
 * Everything the site says, in one place. Only facts REVER gave us live here as plain text;
 * anything still unverified is wrapped in <Todo> where it is used, and never shown in production.
 */

/** Production = a real domain is configured. Without it the site is a preview: noindex everywhere, green placeholders visible. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
export const IS_PRODUCTION = Boolean(SITE_URL);
export const SHOW_TODO = !IS_PRODUCTION;

export const brand = {
  name: "REVER",
  nameHe: "ריבר הפקות",
  fullName: "REVER PRODUCTIONS",
  /** The one way the business is named everywhere (search engines and AI answers match on it). */
  entity: "ריבר הפקות | REVER PRODUCTIONS",
  url: SITE_URL || "https://rever-events.co.il",
  // not verified yet: shown in green until REVER confirms
  phoneDisplay: "054-664-6923",
  phoneIntl: "972546646923",
  instagram: "https://www.instagram.com/rever_production/",
  instagramHandle: "@rever_production",
  years: 6,
};

export const founders = [
  { id: "gal", name: "גל", role: "מייסד REVER", photo: "gal", alt: "גל, ממייסדי REVER, בחולצה שחורה ליד הבר" },
  { id: "liel", name: "ליאל", role: "מייסד REVER", photo: "liel", alt: "ליאל, ממייסדי REVER, בחולצה לבנה בחתונת גן" },
] as const;

export const whatsapp = {
  greeting: "היי גל וליאל, ",
  fallback: "הגעתי מהאתר ואשמח לשמוע על הפקת האירוע שלנו.",
  cta: "דברו עם גל וליאל",
};

export const nav = [
  { href: "/wedding-production/", label: "הפקת חתונה" },
  { href: "/events/", label: "אירועים" },
  { href: "/guides/", label: "מדריכים" },
  { href: "/about/", label: "גל וליאל" },
  { href: "/faq/", label: "שאלות נפוצות" },
];

/**
 * Copy convention: *words between asterisks* are the few that matter. They render bold and gold (see Hl in ui.tsx).
 *
 * The one action on the site: a free consultation call. Every section ends here.
 * The message (Almog, 25.11.2026): "we are the rocket of productions; with us it's fire".
 */
export const consult = {
  cta: "קבעו שיחת ייעוץ ללא עלות",
  short: "קבעו שיחת ייעוץ ללא עלות",
  submit: "קבעו שיחת ייעוץ ללא עלות",
  promise: "השיחה בחינם, בלי שום התחייבות.",
};

export const hero = {
  h1: "הפקת חתונות ואירועים, בליווי מלא",
  displayTop: "טיל ההפקות.",
  displayBottom: "איתנו זה **אש.**",
  tagline: "אתם עושים כיף. האירוע נראה **מיליון דולר**. כל השאר עלינו.",
};

/** Right after the opening: what a couple gets, in three words, and the one action. */
export const fire = {
  kicker: "למה איתנו",
  title: "שלושה דברים שאנחנו *מבטיחים*.",
  pillars: [
    { n: "01", word: "כיף", line: "את הספקים, החוזים והטלפונים אנחנו מנהלים. לכם נשאר רק ליהנות." },
    { n: "02", word: "מיליון דולר", line: "עיצוב, תאורה ולו״ז לכל ספק. כל פרט סגור מראש." },
    { n: "03", word: "אש על הרחבה", line: "הצוות שלנו בשטח עד השיר האחרון. אתם לא יורדים מהרחבה." },
  ],
};

export const difference = {
  tasks: "לוקיישן, ספקים, חוזים, תקציב, לו״ז, הושבה, רזרבות.",
  after: "ואת כל זה לוקח עליו אצלנו *איש קשר אחד*.",
  ours: { title: "את כל הבלגן לוקחים אנחנו.", text: "הלו״ז, הספקים וההושבה, תוך כדי הערב. בתמונה: ארד מהצוות שלנו, צמוד לזוג." },
  yours: { title: "לכם נשאר רק ליהנות.", text: "נכנסים, רוקדים, ולא מסתכלים על השעון." },
  noNeed: ["לא תרדפו אחרי ספקים.", "לא תקראו חוזים באחת בלילה.", "ולא תענו לאף טלפון ביום האירוע."],
};

export const eventTypes = ["חתונות", "בר ובת מצווה", "אירועי חברה", "אירועים פרטיים"];

/**
 * The opening: the night as one journey. Each photo holds a window with the next stage, and the scroll
 * zooms into it. `at` is where the window sits in the photo (0..1 of its width and height), on something
 * real; `pos` is the object-position on a phone, in the phone crop when there is one (journey-crops.json),
 * and `pan` moves it before the zoom so the phone in the guest's hand comes into view; `desk` is the
 * object-position on wider screens; `S` is how far the camera goes in. The lotus video ends the journey.
 */
export type JourneyStage = { id: string; photo: string; label: string; line: string; wa: string; at: [number, number]; pos: [number, number]; pan?: [number, number]; desk?: [number, number]; S: number };
export const journey: JourneyStage[] = [
  { id: "reception", photo: "ev-court-1", label: "קבלת פנים", line: "אתם מחבקים אורחים. אנחנו דואגים לספקים, להושבה ולזמנים.", wa: "ראיתי באתר את קבלת הפנים", at: [0.52, 0.44], pos: [0.5, 0.5], S: 3 },
  { id: "aisle", photo: "ev-couple-1", label: "כניסה לחופה", line: "אנחנו מתזמנים את הכניסה עם כל הספקים. אתם רק צריכים ללכת.", wa: "ראיתי באתר את הכניסה לחופה", at: [0.53, 0.33], pos: [0.5, 0.5], S: 3 },
  { id: "chuppah", photo: "ev-court-4", label: "החופה", line: "אנחנו שומרים על הלו״ז, כדי שאתם תהיו שם, ברגע.", wa: "ראיתי באתר את החופה", at: [0.72, 0.31], pos: [0.7, 0.4], desk: [0.5, 0.38], S: 3 },
  { id: "dance", photo: "ev-court-5", label: "כניסה לריקודים", line: "המעבר לרחבה מתוכנן מראש עם הצוות. אתם פשוט נכנסים וחוגגים.", wa: "ראיתי באתר את הכניסה לריקודים", at: [0.745, 0.56], pos: [0.1, 0.5], pan: [1, 0.5], S: 4 },
  { id: "after", photo: "ev-stage-4", label: "אפטר", line: "הצוות שלנו בשטח עד הסוף. אתם לא יורדים מהרחבה.", wa: "ראיתי באתר את האפטר", at: [0.5, 0.61], pos: [0.5, 0.5], S: 3 },
];
export const journeyAlt: Record<string, string> = {
  "ev-court-1": "פינות ישיבה ומנורות בין העצים תחת שרשראות אור, בקבלת הפנים",
  "ev-couple-1": "הזוג הולך בשביל בין ניצוצות והאורחים מוחאים כפיים",
  "ev-court-4": "שולחן ארוך תחת סוככי בד, עם פרחים ומנורות",
  "ev-court-5": "הכלה נכנסת בין האורחים בלבן, והטלפונים למעלה",
  "ev-stage-4": "לייזרים ירוקים וכדורי מראה מעל הקהל באפטר",
};

/** REVER's four service steps, in their own words. */
export const steps = [
  { id: "design", label: "01 · היכרות", title: "מכירים אתכם ומעצבים את האירוע", photo: "service-design", alt: "שולחנות ערוכים עם מנורות ופרחים",
    text: "יושבים איתכם, מבינים מה אתם אוהבים ואיך אתם רואים את הערב, והופכים את זה לתוכנית עבודה ברורה.",
    yours: "לספר לנו מה אתם אוהבים", ours: "להפוך את זה לתוכנית מסודרת" },
  { id: "location", label: "02 · בחירה", title: "מוצאים לוקיישן וספקים", photo: "service-location", alt: "מבט מלמעלה על חצר ערוכה לאירוע",
    text: "מחפשים מקום שמתאים בדיוק לכם ויוצאים איתכם לראות אותו. את הספקים, מהצלם ועד הדי־ג׳יי, מביאים מהטובים בתחום, בתנאים מיוחדים ללקוחות שלנו.",
    yours: "לבחור את מה שאתם אוהבים", ours: "סבב לוקיישנים, וספקים בתנאים מועדפים" },
  { id: "planning", label: "03 · תכנון", title: "מתכננים הכול מראש", photo: "service-planning", alt: "שולחן ארוך עם פרחי גן",
    text: "בונים איתכם תקציב ושומרים עליו לאורך כל הדרך. עוברים על החוזים, מסדרים את המסמכים ומכינים לו״ז לכל ספק.",
    yours: "להחליט על התקציב", ours: "לשמור עליו, לעבור על החוזים ולבנות לו״ז" },
  { id: "day", label: "04 · היום הגדול", title: "ביום עצמו, אנחנו על זה", photo: "service-day", alt: "הזוג נכנס בשביל ניצוצות",
    text: "הלו״ז, הספקים, ההושבה והרזרבות אצלנו. צץ משהו? אנחנו מטפלים בו לפני שתשימו לב.",
    yours: "ליהנות", ours: "כל השאר, בזמן אמת" },
];

export const includes = ["אפיון ועיצוב", "סבב לוקיישנים", "ספקים בתנאים מועדפים", "תקציב ומעקב", "מעבר על חוזים", "לו״ז לכל ספק", "ניהול יום האירוע"];

export const about = [
  "REVER מפיקה אירועים מכל הסוגים, ובעיקר חתונות. מהשיחה הראשונה ועד סוף הערב, אנחנו איתכם.",
  "אתם מספרים לנו מה דמיינתם. אנחנו מחברים את כל החלקים לערב אחד, ואתם פשוט נהנים.",
];

export const contactCopy = {
  kicker: "בואו נדבר",
  title: "ספרו לנו על *האירוע שלכם*.",
  lead: "השאירו שם וטלפון, וגל וליאל יחזרו אליכם. תספרו מה דמיינתם, ונראה לכם איך עושים מזה אש.",
  points: ["נכיר אתכם ונשמע על האירוע", "ניתן לכם רעיונות ראשונים", "תחליטו בלי לחץ אם להמשיך"],
  eventTypes: ["חתונה", "בר / בת מצווה", "אירוע חברה", "אירוע פרטי", "אחר"],
  callTimes: ["בוקר", "צהריים", "ערב", "לא משנה"],
};
