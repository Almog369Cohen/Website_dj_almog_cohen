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

export const hero = {
  h1: "הפקת חתונות ואירועים, בליווי מלא",
  displayTop: "מקבלת הפנים בגן",
  displayBottom: "ועד השיר האחרון על הרחבה",
  tagline: "אתם מתרגשים מהאירוע, אנחנו דואגים לכל מה שמסביב.",
};

export const difference = {
  tasks: "לוקיישן, ספקים, חוזים, תקציב, לו״ז, הושבה, רזרבות.",
  after: "את כל זה מחזיק איש קשר אחד.",
  ours: { title: "הכול אצלנו.", text: "הלו״ז, הספקים וההושבה, בזמן אמת. בתמונה: ארד מצוות REVER, ליד הזוג." },
  yours: { title: "אצלכם נשאר רק הערב.", text: "אתם נכנסים, רוקדים, ונהנים מכל רגע." },
  noNeed: ["לא צריך לרדוף אחרי ספקים.", "לא צריך לקרוא חוזים לבד בלילה.", "לא צריך לענות לטלפונים ביום האירוע."],
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
  { id: "reception", photo: "ev-court-1", label: "קבלת פנים", line: "הספקים, ההושבה והלו״ז אצלנו. אתם פוגשים את האורחים.", wa: "ראיתי באתר את קבלת הפנים", at: [0.52, 0.44], pos: [0.5, 0.5], S: 3 },
  { id: "aisle", photo: "ev-couple-1", label: "כניסה לחופה", line: "אנחנו מתזמנים את הכניסה מול הספקים. אתם רק הולכים.", wa: "ראיתי באתר את הכניסה לחופה", at: [0.53, 0.33], pos: [0.5, 0.5], S: 3 },
  { id: "chuppah", photo: "ev-court-4", label: "החופה", line: "אנחנו מחזיקים את הלו״ז. אתם נמצאים ברגע.", wa: "ראיתי באתר את החופה", at: [0.72, 0.31], pos: [0.7, 0.4], desk: [0.5, 0.38], S: 3 },
  { id: "dance", photo: "ev-court-5", label: "כניסה לריקודים", line: "המעבר לרחבה מתואם מראש עם הצוות. אתם פשוט נכנסים.", wa: "ראיתי באתר את הכניסה לריקודים", at: [0.745, 0.56], pos: [0.1, 0.5], pan: [1, 0.5], S: 4 },
  { id: "after", photo: "ev-stage-4", label: "אפטר", line: "הצוות שלנו בשטח עד הסוף. אתם נשארים על הרחבה.", wa: "ראיתי באתר את האפטר", at: [0.5, 0.61], pos: [0.5, 0.5], S: 3 },
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
  { id: "design", label: "01 · היכרות", title: "עיצוב ואפיון האירוע", photo: "service-design", alt: "שולחנות ערוכים עם מנורות ופרחים",
    text: "אנחנו לומדים להכיר אתכם לעומק, את החלומות ואת הסגנון, ומתרגמים אותם לתוכנית עבודה ברורה שמלווה את האירוע עד הביצוע.",
    yours: "החלומות והסגנון שלכם", ours: "לתרגם אותם לתוכנית עבודה ברורה" },
  { id: "location", label: "02 · בחירה", title: "לוקיישן וספקים בהתאמה אישית", photo: "service-location", alt: "מבט מלמעלה על חצר ערוכה לאירוע",
    text: "איתור לוקיישן שמתאים לסגנון שלכם, כולל סבב התרשמות יחד איתנו. ספקים מובילים, מאולם וצלמים ועד DJ ועיצוב, בתנאים מועדפים ללקוחות REVER.",
    yours: "לבחור לוקיישן ולהחליט על ספקים", ours: "סבב לוקיישנים, וספקים מובילים בתנאים מועדפים" },
  { id: "planning", label: "03 · תכנון", title: "תכנון וניהול מוקדם", photo: "service-planning", alt: "שולחן ארוך עם פרחי גן",
    text: "אנחנו בונים איתכם תקציב ברור ושומרים עליו לאורך הדרך. מכינים לו״ז לכל הספקים, מרכזים את המסמכים ועוברים על החוזים.",
    yours: "התקציב, החוזים והלו״ז של כל ספק", ours: "תקציב שנשמר, מעבר על החוזים, מסמכים ולו״ז" },
  { id: "day", label: "04 · היום הגדול", title: "ניהול מלא של יום האירוע", photo: "service-day", alt: "הזוג נכנס בשביל ניצוצות",
    text: "ביום האירוע אנחנו מנהלים הכול: הלו״ז, הספקים, ההושבה והרזרבות, ועונים לכל צורך בזמן אמת.",
    yours: "לדעת איפה כל ספק נמצא", ours: "הלו״ז, הספקים, ההושבה והרזרבות, בזמן אמת" },
];

export const includes = ["אפיון ועיצוב", "סבב לוקיישנים", "ספקים בתנאים מועדפים", "תקציב ומעקב", "מעבר על חוזים", "לו״ז לכל ספק", "ניהול יום האירוע"];

export const about = [
  "REVER יוצרת ומפיקה אירועים מכל הסוגים, עם התמחות בעולם החתונות וליווי מלא לאורך כל הדרך.",
  "אנחנו לוקחים את כל מה שדמיינתם, מחברים את כל החלקים והופכים אותם לאירוע אחד, כדי שאתם תוכלו פשוט ליהנות.",
];

export const contactCopy = {
  title: "בואו נתחיל לתכנן את האירוע שלכם.",
  lead: "ליווי מלא משלב התכנון ועד יום האירוע. השאירו פרטים ונחזור אליכם.",
  eventTypes: ["חתונה", "בר / בת מצווה", "אירוע חברה", "אירוע פרטי", "אחר"],
};
