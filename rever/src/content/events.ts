/**
 * REVER's real events, sorted from their photos (EXIF date, faces, setting; see PHOTOS.md).
 * Texts say only what the photos show. Venue, month and the couple's consent are not confirmed yet,
 * so every event page is a draft: visible, but kept out of search until REVER confirms them.
 */
export type EventPhoto = { src: string; alt: string };
export type RevEvent = {
  slug: string;
  tab: string;
  title: string;
  text: string;
  /** what the photos show, as plain facts for the fact box */
  setting: string;
  highlights: string[];
  photos: EventPhoto[];
  status: "draft" | "verified";
};

const p = (src: string, alt: string): EventPhoto => ({ src, alt });

export const events: RevEvent[] = [
  {
    slug: "stone-courtyard-garden-wedding",
    tab: "חצר האבן",
    title: "חתונת גן בחצר אבן",
    text: "חצר אבן בין עצים, שרשראות אור, מנורות שולחן ופינות ישיבה. האורחים בלבן, והערב נגמר על הרחבה.",
    setting: "חצר אבן פתוחה בין עצים",
    highlights: ["שרשראות אור מעל החצר", "מנורות שולחן ופינות ישיבה", "שולחנות ארוכים ועגולים", "רחבה בסוף הערב"],
    photos: [
      p("ev-court-1", "פינות ישיבה בין העצים תחת שרשראות אור"), p("ev-court-2", "שולחנות עם מנורות ופרחים בחצר"),
      p("ev-court-3", "מבט מלמעלה על החצר ערוכה לאירוע"), p("ev-court-4", "שולחן ארוך תחת חופת בד"),
      p("ev-court-7", "שולחנות ארוכים בין העצים"), p("ev-court-5", "כניסת הכלה בין האורחים בלבן"),
      p("ev-court-6", "הכלה רוקדת בז'קט פאייטים"), p("ev-court-8", "מבט מלמעלה על השולחנות העגולים"),
    ],
    status: "draft",
  },
  {
    slug: "new-years-eve-wedding",
    tab: "ערב 31.12",
    title: "חתונה בערב השנה החדשה",
    text: "אולם בתאורת מגנטה, צמחייה תלויה עם כדורי מראה, פמוטי קריסטל, ניצוצות ומגדל שמפניה.",
    setting: "אולם בהפקת במה, בערב השנה החדשה",
    highlights: ["תאורת מגנטה וצמחייה תלויה", "כדורי מראה מעל הרחבה", "פמוטי קריסטל ושולחנות שחורים", "ניצוצות ומגדל שמפניה"],
    photos: [
      p("ev-nye-2", "האולם בתאורת מגנטה עם עצים ופמוטים"), p("ev-nye-1", "שלט הכניסה בין עצי הדקל"),
      p("ev-nye-3", "צמחייה תלויה וכדורי מראה מעל הרחבה"), p("ev-nye-4", "שולחן עם פמוטי קריסטל ופרחים"),
      p("ev-nye-5", "הזוג רוקד בין ניצוצות"), p("ev-nye-6", "שמפניה למגדל הכוסות"),
      p("ev-nye-7", "הזוג בעמדת ה־DJ"), p("ev-nye-8", "שולחנות שחורים וכיסאות קריסטל"),
    ],
    status: "draft",
  },
  {
    slug: "lotus-booth-garden-wedding",
    tab: "עמדת הלוטוס",
    title: "חתונת גן עם עמדת הלוטוס",
    text: "שולחנות עץ ארוכים עם פרחי גן, מגדל שמפניה על הדשא, ועמדת DJ בצורת לוטוס עם תותחי עשן לרחבה.",
    setting: "גן אירועים עם דשא ועצים",
    highlights: ["שולחנות עץ ארוכים עם פרחי גן", "מגדל שמפניה על הדשא", "עמדת DJ מעוצבת בצורת לוטוס", "תותחי עשן לרחבה"],
    photos: [
      p("ev-lotus-4", "עמדת הלוטוס עם תותחי עשן"), p("ev-lotus-2", "שולחן עץ ארוך עם פרחי גן"),
      p("ev-lotus-5", "הזוג ליד מגדל השמפניה"), p("ev-lotus-3", "פרחים ורודים ולבנים על השולחן"),
      p("ev-lotus-1", "הכלה בשמלה ארוכה לפני האירוע"), p("ev-lotus-6", "עמדת הלוטוס מבעד לצמחייה"),
    ],
    status: "draft",
  },
  {
    slug: "live-band-stage-show",
    tab: "מופע במה",
    title: "מופע במה עם להקה חיה",
    text: "להקה חיה, נגן בוזוקי בעמדת ה־DJ, מסך לד ענק ותאורת לייזר מעל הרחבה.",
    setting: "במה עם מסך לד ותאורת לייזר",
    highlights: ["להקה חיה על הבמה", "נגן בוזוקי בעמדת ה־DJ", "מסך לד ענק", "תאורת לייזר מעל הרחבה"],
    photos: [
      p("ev-stage-1", "להקה חיה ומסך לד ענק על הבמה"), p("ev-stage-4", "לייזרים ירוקים מעל הקהל"),
      p("ev-stage-2", "נגן בוזוקי בעמדת ה־DJ"), p("ev-stage-3", "שולחן בקבוקים עם ורדים כחולים"),
    ],
    status: "draft",
  },
  {
    slug: "couple-moments",
    tab: "רגעים של זוגות",
    title: "רגעים של זוגות",
    text: "פגישה ראשונה בפארק מול הים, צילומים בין הקשתות, ושביל ניצוצות בדרך לחופה.",
    setting: "פארק מול הים, סטודיו קשתות ושביל לחופה",
    highlights: ["פגישה ראשונה מול הים", "צילומים בין קשתות לבנות", "שביל ניצוצות בדרך לחופה"],
    photos: [
      p("ev-couple-1", "הזוג הולך בשביל בין ניצוצות"), p("ev-couple-2", "פגישה ראשונה בפארק מול הים"),
      p("ev-couple-4", "הזוג בין הקשתות הלבנות"), p("ev-couple-3", "הזוג יוצא מבעד לקשת"),
      p("ev-couple-5", "הזוג מחובק בין הקשתות"),
    ],
    status: "draft",
  },
];

export const eventBySlug = (slug: string) => events.find((e) => e.slug === slug);
