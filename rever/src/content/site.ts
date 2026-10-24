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
  { id: "about", label: "מי אנחנו" },
  { id: "services", label: "מה אנחנו עושים" },
  { id: "night", label: "הרחבה" },
  { id: "gallery", label: "גלריה" },
  { id: "contact", label: "צור קשר" },
];

export const hero = {
  video: "/video/hero.mp4",
  videoWebm: "/video/hero.webm",
  videoMobile: "/video/hero-m.mp4",
  videoMobileWebm: "/video/hero-m.webm",
  poster: "/images/hero-poster-1080.webp",
  eyebrow: "REVER · DREAM PRODUCTIONS",
  titleTop: "אתם מתרגשים מהאירוע,",
  titleBottom: "אנחנו דואגים לכל מה שמסביב.",
  subtitle: "הפקת חתונות ואירועים מהרעיון הראשון ועד השיר האחרון: לוקיישן, ספקים, עיצוב וניהול מלא של יום האירוע.",
  ctaPrimary: "בואו נתכנן את האירוע שלכם",
  ctaSecondary: "לגלריה",
};

export const about = {
  kicker: "מי אנחנו",
  title: "כבר 6 שנים יוצרים רגעים שנשארים.",
  paragraphs: [
    "REVER יוצרת ומפיקה אירועים מכל הסוגים, עם התמחות בעולם החתונות וליווי מלא מהרעיון הראשון ועד הרגע האחרון, עם אהבה גדולה לאנשים, לאירועים וליצירת חוויות שנשארות הרבה אחרי שהערב נגמר.",
    "אנחנו לוקחים את כל מה שדמיינתם, מחברים את כל החלקים והופכים אותם לאירוע אחד מדויק, מרגש ובלתי נשכח. ולכם? נשאר רק ליהנות.",
  ],
  image: "/images/about.jpg",
};

export const servicesIntro = {
  kicker: "מה אנחנו עושים",
  title: "ארבעה תחומים. הפקה אחת.",
  text: "אנחנו מנהלים עבורכם את כל התהליך, כדי שתוכלו להיות רגועים, בטוחים ופנויים ליהנות מהדרך ומיום החתונה עצמו.",
};

export const services = [
  {
    id: "location-vendors",
    title: "לוקיישן וספקים בהתאמה אישית",
    text: "איתור לוקיישן מדויק לסגנון ולאופי הזוג, כולל סבב התרשמות בלוקיישנים המותאמים עבורכם יחד איתנו. בחירת ספקים מובילים, מאולם וצלמים ועד DJ ועיצוב, בתנאים מועדפים ללקוחות REVER.",
    image: "/images/service-location.jpg",
  },
  {
    id: "planning",
    title: "תכנון וניהול מוקדם",
    text: "אנחנו בונים איתכם תקציב ברור ושומרים עליו לאורך כל הדרך. מכינים לו״ז לכל הספקים, מרכזים את המסמכים, עוברים על החוזים, ומלווים את ההפקה עד יום החתונה עצמו.",
    image: "/images/service-planning.jpg",
  },
  {
    id: "day-of",
    title: "ניהול מלא של יום האירוע",
    text: "ביום החתונה אנחנו מנהלים הכול: הלו״ז, הספקים, ההושבה והרזרבות, ועונים לכל צורך בזמן אמת.",
    image: "/images/service-day.jpg",
  },
  {
    id: "design",
    title: "עיצוב ואפיון האירוע",
    text: "תהליך שמתחיל מהרגע הראשון שהכרנו. אנחנו לומדים להכיר את הזוג לעומק, את החלומות ואת הסגנון, ומתרגמים אותם לתוכנית עבודה מדויקת שמלווה את החתונה מהרעיון ועד הביצוע.",
    image: "/images/service-design.jpg",
  },
];

/** The party, done with restraint: their own night photos in an editorial collage. */
export const night = {
  kicker: "על הרחבה",
  title: "כשהאורות כבים,",
  titleAccent: "הרחבה שלכם מתחילה.",
  text: "מוזיקה, ריקודים ואנרגיה עד השיר האחרון. ואתם? רק רוקדים.",
  images: [
    { src: "/images/night-1.jpg", alt: "הזוג רוקד ליד עמדת התקליטן" },
    { src: "/images/night-2.jpg", alt: "כניסת הזוג לרחבה" },
    { src: "/images/night-3.jpg", alt: "שמפניה על הבמה" },
    { src: "/images/night-4.jpg", alt: "כלה רוקדת בז'קט פאייטים" },
  ],
};

export const gallery = [
  { src: "/images/g01.jpg", w: 2048, h: 1366, alt: "פינות ישיבה בין העצים תחת אורות" },
  { src: "/images/g02.jpg", w: 1366, h: 2048, alt: "מבט מלמעלה על מתחם האירוע" },
  { src: "/images/g03.jpg", w: 1366, h: 2048, alt: "שולחן ארוך עם מנורות ופרחים" },
  { src: "/images/g04.jpg", w: 2400, h: 3600, alt: "מגדל שמפניה בחתונת גן" },
  { src: "/images/g06.jpg", w: 1600, h: 1067, alt: "הזוג בחיבוק בין הקשתות" },
  { src: "/images/g07.jpg", w: 2400, h: 3600, alt: "שמלת הכלה" },
  { src: "/images/g08.jpg", w: 1366, h: 2048, alt: "שולחנות ערוכים בחצר האבן" },
  { src: "/images/g09.jpg", w: 2400, h: 1600, alt: "שולחן אירוח עם פרחים ונרות" },
  { src: "/images/g10.jpg", w: 2048, h: 1366, alt: "מבט מלמעלה על השולחנות בין העצים" },
  { src: "/images/g11.jpg", w: 1600, h: 1067, alt: "הזוג בפתח הקשת" },
  { src: "/images/g12.jpg", w: 2048, h: 1362, alt: "שולחנות בחתונת גן בשעת שקיעה" },
];

export const contact = {
  kicker: "צור קשר",
  title: "בואו נתחיל לתכנן",
  titleAccent: "את האירוע שלכם.",
  subtitle: "REVER, ליווי מלא ומקצועי משלב התכנון ועד רגע השיא ביום האירוע. השאירו פרטים ונחזור אליכם.",
  image: "/images/contact-bg.jpg",
  eventTypes: ["חתונה", "בר / בת מצווה", "אירוע חברה", "אירוע פרטי", "אחר"],
  when: ["בחודשים הקרובים", "בעוד חצי שנה", "בעוד שנה", "יותר משנה", "עוד לא יודעים"],
};
