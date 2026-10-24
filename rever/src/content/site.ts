/**
 * כל התוכן של האתר במקום אחד. הטקסטים מגיעים מדף הנחיתה של REVER PRODUCTIONS.
 * להחלפת טקסט, טלפון או תמונה מספיק לערוך כאן.
 */

export const brand = {
  name: "REVER",
  nameHe: "ריבר",
  fullName: "REVER PRODUCTIONS",
  // לא מאומתים: באתר הם מוצגים בירוק עד שהלקוח מאשר
  addressPlaceholder: "כתובת: להשלים",
  phoneDisplay: "054-664-6923",
  phoneIntl: "972546646923",
  whatsappMessage: "היי REVER, הגעתי מהאתר ואשמח לשמוע על הפקת האירוע שלנו.",
  // לאמת שהדומיין שלהם לפני עלייה לאוויר, או להגדיר NEXT_PUBLIC_SITE_URL
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rever-events.co.il",
  instagram: "https://www.instagram.com/rever_production/",
  instagramHandle: "@rever_production",
  logo: "/images/logo.webp",
  logoSize: { width: 907, height: 524 },
};

export const nav = [
  { id: "evening", label: "הערב שלכם" },
  { id: "services", label: "איך זה עובד" },
  { id: "about", label: "הצוות" },
  { id: "gallery", label: "אירועים" },
  { id: "contact", label: "דברו איתנו" },
];

export const hero = {
  video: "/video/hero.mp4",
  videoWebm: "/video/hero.webm",
  videoMobile: "/video/hero-m.mp4",
  videoMobileWebm: "/video/hero-m.webm",
  poster: "/images/hero-poster-1080.webp",
  eyebrow: "REVER PRODUCTIONS",
  titleTop: "מקבלת הפנים בגן",
  titleBottom: "ועד השיר האחרון על הרחבה",
  tagline: "אתם מתרגשים מהאירוע, אנחנו דואגים לכל מה שמסביב.",
  subtitle: "הפקת חתונות ואירועים מהרעיון הראשון ועד השיר האחרון: לוקיישן, ספקים, עיצוב וניהול מלא של יום האירוע.",
  ctaPrimary: "דברו איתנו בוואטסאפ",
  ctaSecondary: "לרגעים שהפקנו",
};

/** The light switch: what a couple runs alone, and what changes with one contact person. Every line comes from REVER's own copy. */
export const contrast = {
  kicker: "ההבדל",
  title: "הדליקו את האור",
  hint: "לחצו על המתג",
  phoneNote: "המחשה",
  vendors: ["האולם", "הצלם", "ה־DJ", "העיצוב"],
  off: {
    label: "בלי הפקה, את הכול מנהלים לבד",
    items: [
      "לוקיישן: איתור וסבב התרשמות",
      "ספקים: אולם, צלמים, DJ ועיצוב, כל אחד בנפרד",
      "חוזים: קריאה והשוואה",
      "תקציב: לבנות אותו ולשמור עליו",
      "ביום האירוע: לו״ז, הושבה ורזרבות, בזמן אמת",
    ],
  },
  on: {
    label: "עם REVER, איש קשר אחד",
    items: [
      "אנחנו מדברים עם כל הספקים, אתם איתנו",
      "אנחנו עוברים איתכם על החוזים",
      "תקציב ברור שנשמר לאורך כל הדרך",
      "ביום עצמו: הלו״ז, ההושבה והרזרבות אצלנו",
    ],
  },
  onPhone: "REVER · אנחנו על זה",
};

export const team = {
  kicker: "הצוות",
  title: "האנשים שמאחורי הערב",
  // only "6" is confirmed; the rest stay green until REVER sends numbers
  stats: [
    { n: "6", label: "שנים של הפקות", verified: true },
    { n: "להשלים", label: "אירועים שהפקנו", verified: false },
    { n: "להשלים", label: "ספקים בנבחרת שלנו", verified: false },
  ],
  people: [
    { src: "/images/team-founders.jpg", alt: "שני אנשי REVER ליד הבר באירוע", pos: "50% 30%", caption: "לאשר: האם אלה המייסדים?" },
    { src: "/images/team-day.jpg", alt: "מפיק REVER עם תג צוות ליד הזוג ביום האירוע", pos: "78% 40%", caption: "ביום האירוע, ליד הזוג" },
    { src: "/images/team-group.jpg", alt: "צוות REVER עם הזוג בסוף הערב", pos: "55% 40%", caption: "בסוף הערב, עם הזוג" },
  ],
};

/** One evening, two worlds: the hand-over from the light of the reception to the dark of the dance floor. */
export const evening = {
  kicker: "הערב שלכם",
  title: "שני עולמות, ערב אחד",
  lead: "קבלת פנים באור, ואחריה רחבה בחושך. אצלנו זה אותו צוות, מההתחלה ועד השיר האחרון.",
  reception: { src: "/images/ev-court-1.jpg", alt: "פינות ישיבה בין העצים תחת שרשראות אור", title: "קבלת פנים", text: "שולחנות, מנורות ופרחים בסגנון שלכם, בין עצים ושרשראות אור." },
  moment: { src: "/images/ev-couple-1.jpg", alt: "הזוג הולך בשביל בין ניצוצות", title: "הרגע שלכם", text: "אנחנו מחזיקים את הלו״ז, הספקים וההושבה. אתם רק נכנסים." },
};

export const about = {
  kicker: "מי אנחנו",
  title: "כבר 6 שנים יוצרים רגעים שנשארים.",
  paragraphs: [
    "REVER יוצרת ומפיקה אירועים מכל הסוגים, עם התמחות בעולם החתונות וליווי מלא לאורך כל הדרך, מתוך אהבה גדולה לאנשים, לאירועים ולחוויות שמלוות אתכם הרבה אחרי שהערב נגמר.",
    "אנחנו לוקחים את כל מה שדמיינתם, מחברים את כל החלקים והופכים אותם לאירוע אחד מרגש ובלתי נשכח, כדי שאתם תוכלו פשוט ליהנות.",
  ],
  image: "/images/about.jpg",
};

export const servicesIntro = {
  kicker: "איך זה עובד",
  title: "מהפגישה הראשונה ועד השיר האחרון",
  text: "אנחנו מנהלים עבורכם את כל התהליך, כדי שתוכלו להיות רגועים, בטוחים ופנויים ליהנות מהדרך ומהאירוע עצמו.",
};

export const services = [
  {
    id: "design",
    step: "היכרות",
    title: "עיצוב ואפיון האירוע",
    text: "תהליך שמתחיל מהרגע הראשון שהכרנו. אנחנו לומדים להכיר אתכם לעומק, את החלומות ואת הסגנון, ומתרגמים אותם לתוכנית עבודה ברורה שמלווה את האירוע עד הביצוע.",
    image: "/images/service-design.jpg",
  },
  {
    id: "location-vendors",
    step: "בחירה",
    title: "לוקיישן וספקים בהתאמה אישית",
    text: "איתור לוקיישן שמתאים לסגנון ולאופי שלכם, כולל סבב התרשמות בלוקיישנים המותאמים עבורכם יחד איתנו. בחירת ספקים מובילים, מאולם וצלמים ועד DJ ועיצוב, בתנאים מועדפים ללקוחות REVER.",
    image: "/images/service-location.jpg",
  },
  {
    id: "planning",
    step: "תכנון",
    title: "תכנון וניהול מוקדם",
    text: "אנחנו בונים איתכם תקציב ברור ושומרים עליו לאורך כל הדרך. מכינים לו״ז לכל הספקים, מרכזים את המסמכים, עוברים על החוזים, ומלווים את ההפקה עד היום הגדול.",
    image: "/images/service-planning.jpg",
  },
  {
    id: "day-of",
    step: "היום הגדול",
    title: "ניהול מלא של יום האירוע",
    text: "ביום האירוע אנחנו מנהלים הכול: הלו״ז, הספקים, ההושבה והרזרבות, ועונים לכל צורך בזמן אמת.",
    image: "/images/service-day.jpg",
  },
];

/** The party, done with restraint: their own night photos in an editorial collage. */
export const night = {
  kicker: "על הרחבה",
  title: "כשהאורות כבים,",
  titleAccent: "הרחבה שלכם מתחילה.",
  text: "מוזיקה, ריקודים ואנרגיה עד השיר האחרון. אנחנו מחזיקים את הערב, אתם רוקדים.",
  images: [
    { src: "/images/night-1.jpg", alt: "הזוג רוקד ליד עמדת התקליטן" },
    { src: "/images/night-2.jpg", alt: "כניסת הזוג לרחבה" },
    { src: "/images/night-3.jpg", alt: "שמפניה על הבמה" },
    { src: "/images/night-4.jpg", alt: "כלה רוקדת בז'קט פאייטים" },
  ],
  stage: { src: "/images/stage-1.jpg", alt: "אולם בתאורה ורודה עם עצים וקריסטלים" },
  stageCaption: "מחתונת גן אינטימית ועד הפקת במה מלאה",
};

type Photo = { src: string; w: number; h: number; alt: string };
const ph = (src: string, w: number, h: number, alt: string): Photo => ({ src: `/images/${src}.jpg`, w, h, alt });

/**
 * REVER's photos sorted into the real events they come from (by EXIF date, faces and setting).
 * Descriptions say only what the photos show; places and dates stay green until REVER confirms them.
 */
export const events = [
  {
    id: "courtyard",
    tab: "חצר האבן",
    title: "חתונת גן בחצר אבן",
    text: "חצר אבן בין עצים, שרשראות אור, מנורות שולחן ופינות ישיבה. האורחים בלבן, והערב נגמר על הרחבה.",
    photos: [
      ph("ev-court-1", 2048, 1366, "פינות ישיבה בין העצים תחת שרשראות אור"),
      ph("ev-court-2", 1366, 2048, "שולחנות עם מנורות ופרחים בחצר"),
      ph("ev-court-3", 1366, 2048, "מבט מלמעלה על החצר ערוכה לאירוע"),
      ph("ev-court-4", 1366, 2048, "שולחן ארוך תחת חופה בד"),
      ph("ev-court-7", 2048, 1362, "שולחנות ארוכים בין העצים"),
      ph("ev-court-5", 2048, 1366, "כניסת הכלה בין האורחים בלבן"),
      ph("ev-court-6", 1366, 2048, "הכלה רוקדת בז'קט פאייטים"),
      ph("ev-court-8", 2048, 1366, "מבט מלמעלה על השולחנות העגולים"),
    ],
  },
  {
    id: "nye",
    tab: "ערב 31.12",
    title: "חתונה בערב השנה החדשה",
    text: "Let's Celebrate New Year & New Love: אולם בתאורת מגנטה, צמחייה תלויה עם כדורי מראה, פמוטי קריסטל, ניצוצות ומגדל שמפניה.",
    photos: [
      ph("ev-nye-2", 1600, 1066, "האולם בתאורת מגנטה עם עצים ופמוטים"),
      ph("ev-nye-1", 1066, 1600, "שלט הכניסה בין עצי הדקל"),
      ph("ev-nye-3", 1600, 1066, "צמחייה תלויה וכדורי מראה מעל הרחבה"),
      ph("ev-nye-4", 1066, 1600, "שולחן עם פמוטי קריסטל ופרחים"),
      ph("ev-nye-5", 1600, 1067, "הזוג רוקד בין ניצוצות"),
      ph("ev-nye-6", 1600, 1067, "שמפניה למגדל הכוסות"),
      ph("ev-nye-7", 1600, 1067, "הזוג בעמדת ה־DJ"),
      ph("ev-nye-8", 1600, 1066, "שולחנות שחורים וכיסאות קריסטל"),
    ],
  },
  {
    id: "lotus",
    tab: "עמדת הלוטוס",
    title: "חתונת גן עם עמדת הלוטוס",
    text: "שולחנות עץ ארוכים עם פרחי גן, מגדל שמפניה על הדשא, ועמדת DJ בצורת לוטוס עם תותחי עשן לרחבה.",
    photos: [
      ph("ev-lotus-4", 2400, 3600, "עמדת הלוטוס עם תותחי עשן"),
      ph("ev-lotus-2", 2400, 1600, "שולחן עץ ארוך עם פרחי גן"),
      ph("ev-lotus-5", 2400, 3600, "הזוג ליד מגדל השמפניה"),
      ph("ev-lotus-3", 2400, 1600, "פרחים ורודים ולבנים על השולחן"),
      ph("ev-lotus-1", 2400, 3600, "הכלה בשמלה ארוכה לפני האירוע"),
      ph("ev-lotus-6", 2400, 3600, "עמדת הלוטוס מבעד לצמחייה"),
    ],
  },
  {
    id: "stage",
    tab: "מופע במה",
    title: "מופע במה עם להקה חיה",
    text: "להקה חיה, נגן בוזוקי בעמדת ה־DJ, מסך לד ענק ותאורת לייזר מעל הרחבה.",
    photos: [
      ph("ev-stage-1", 2048, 1366, "להקה חיה ומסך לד ענק על הבמה"),
      ph("ev-stage-4", 1600, 1067, "לייזרים ירוקים מעל הקהל"),
      ph("ev-stage-2", 2048, 1366, "נגן בוזוקי בעמדת ה־DJ"),
      ph("ev-stage-3", 2400, 3185, "שולחן בקבוקים עם ורדים כחולים"),
    ],
  },
  {
    id: "couples",
    tab: "רגעים של זוגות",
    title: "רגעים של זוגות",
    text: "פגישה ראשונה בפארק מול הים, צילומים בין הקשתות, ושביל ניצוצות בדרך לחופה.",
    photos: [
      ph("ev-couple-1", 1600, 1067, "הזוג הולך בשביל בין ניצוצות"),
      ph("ev-couple-2", 1067, 1600, "פגישה ראשונה בפארק מול הים"),
      ph("ev-couple-4", 1067, 1600, "הזוג בין הקשתות הלבנות"),
      ph("ev-couple-3", 1600, 1067, "הזוג יוצא מבעד לקשת"),
      ph("ev-couple-5", 1067, 1600, "הזוג מחובק בין הקשתות"),
    ],
  },
];

export const contact = {
  kicker: "דברו איתנו",
  title: "בואו נתחיל לתכנן",
  titleAccent: "את האירוע שלכם.",
  subtitle: "REVER, ליווי מלא ומקצועי משלב התכנון ועד רגע השיא ביום האירוע. השאירו פרטים ונחזור אליכם.",
  image: "/images/contact-bg.jpg",
  eventTypes: ["חתונה", "בר / בת מצווה", "אירוע חברה", "אירוע פרטי", "אחר"],
  when: ["בחודשים הקרובים", "בעוד חצי שנה", "בעוד שנה", "יותר משנה", "עוד לא יודעים"],
};
