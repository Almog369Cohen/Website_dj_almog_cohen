/**
 * כל התוכן של האתר במקום אחד. הטקסטים מגיעים מדף הנחיתה של REVER PRODUCTIONS.
 * להחלפת טקסט, טלפון או תמונה מספיק לערוך כאן.
 */

export const brand = {
  name: "REVER",
  nameHe: "ריבר",
  tagline: "הפקות אירועים",
  fullName: "REVER PRODUCTIONS",
  // לא מאומתים: באתר הם מוצגים בירוק עד שהלקוח מאשר
  addressPlaceholder: "כתובת: להשלים",
  phoneDisplay: "054-664-6923",
  phoneIntl: "972546646923",
  whatsappMessage: "היי REVER! הגעתי מהאתר ואשמח לשמוע על הפקת האירוע שלי 🎉",
  url: "https://rever-events.co.il",
  logo: "/images/logo.png",
  logoSize: { width: 907, height: 524 },
};

export const nav = [
  { id: "about", label: "מי אנחנו" },
  { id: "services", label: "מה אנחנו עושים" },
  { id: "gallery", label: "גלריה" },
  { id: "contact", label: "צור קשר" },
];

export const hero = {
  ctaPrimary: "בואו נתכנן את האירוע שלכם",
  /** Lights off: the dance floor. Laser show, moving heads and an LED wall that carries the headline. */
  party: {
    eyebrow: "01:30 · על הרחבה",
    titleTop: "כשהאורות כבים,",
    titleBottom: "הרחבה שלכם מתחילה.",
    subtitle: "מוזיקה, ריקודים ואנרגיה עד השיר האחרון. אנחנו מנהלים את הלו״ז, הספקים והרזרבות מאחורי הקלעים, ואתם רק רוקדים.",
    toggle: "הדליקו את האור",
    hint: "כוונו את הלייזרים עם העכבר או בנגיעה",
    /** Words that scroll on the LED pillars beside the main wall */
    pillars: ["לוקיישן", "ספקים", "תקציב", "לו״ז", "עיצוב", "הושבה", "רזרבות", "ניהול יום האירוע"],
    images: ["/images/party-1.jpg", "/images/party-2.jpg", "/images/party-3.jpg"],
  },
  /** Lights on: the reception. Warm, designed, classy. */
  reception: {
    eyebrow: "19:00 · קבלת הפנים",
    titleTop: "וכשהאור נדלק,",
    titleBottom: "כל פרט כבר במקום.",
    subtitle: "לוקיישן, עיצוב, ספקים ותקציב, מתוכננים מהרעיון הראשון ועד הרגע האחרון. כבר 6 שנים ש-REVER מפיקה חתונות, ולכם נשאר רק ליהנות.",
    toggle: "חזרה לרחבה",
    images: ["/images/reception-1.jpg", "/images/reception-2.jpg", "/images/reception-3.jpg"],
  },
};

export const marquee = ["חתונות", "הפקת אירועים", "לוקיישנים וספקים", "ניהול יום האירוע", "עיצוב ואפיון", "ליווי מלא"];

export const about = {
  kicker: "מי אנחנו",
  title: "כבר 6 שנים יוצרים רגעים שנשארים.",
  paragraphs: [
    "כבר 6 שנים ש-REVER יוצרת ומפיקה אירועים מכל הסוגים, עם התמחות בעולם החתונות וליווי מלא מהרעיון הראשון ועד הרגע האחרון, עם אהבה גדולה לאנשים, לאירועים וליצירת חוויות שנשארות הרבה אחרי שהערב נגמר.",
    "אנחנו כאן כדי לקחת את כל מה שדמיינתם, לחבר את כל החלקים ולהפוך אותם לאירוע אחד מדויק, מרגש ובלתי נשכח, ולהגשים לכם את החלום. ולכם? נשאר רק ליהנות.",
  ],
  image: "/images/about.jpg",
  bullets: [
    "ליווי מלא מהרעיון הראשון ועד הרגע האחרון",
    "התמחות בעולם החתונות",
    "ספקים מובילים במחירים מתחת לגובה השוק",
    "ניהול מלא של יום האירוע",
  ],
  badgeValue: "6",
  badgeLabel: "שנות הפקה",
};

export const zoomFeature = {
  image: "/images/zoom-feature.jpg",
  lineTop: "ולכם?",
  lineBottom: "נשאר רק ליהנות.",
};

export const servicesIntro = {
  title: "ארבעה תחומים.",
  titleAccent: "הפקה אחת.",
  text: "אנחנו מנהלים עבורכם את כל התהליך, כדי שתוכלו להיות רגועים, בטוחים ופנויים ליהנות מהדרך ומיום החתונה עצמו.",
};

export const services = [
  {
    id: "location-vendors",
    title: "לוקיישן וספקים בהתאמה אישית",
    text: "איתור לוקיישן מדויק לסגנון ולאופי הזוג, כולל סבב התרשמות בלוקיישנים המותאמים עבורכם יחד איתנו. בחירת ספקים מובילים (אולם, צלמים, DJ, עיצוב וכל הספקים הדרושים) במחירים אטרקטיביים ללקוחות REVER, מתחת לגובה השוק.",
    image: "/images/service-location.jpg",
    tags: ["אולם", "צלמים", "DJ", "עיצוב"],
  },
  {
    id: "planning",
    title: "תכנון וניהול מוקדם",
    text: "בניית תקציב מסודר וברור, בק אופיס ניהול כלכלי חכם ובקרה לאורך כל הדרך. יצירת לו״ז וגאנטים לכל הספקים באירוע, איגוד כל המסמכים הדרושים, מעבר על החוזים ואישורם וליווי תהליך ההפקה ליום החתונה עצמו.",
    image: "/images/service-planning.jpg",
    tags: ["תקציב", "לו״ז וגאנטים", "חוזים"],
  },
  {
    id: "day-of",
    title: "ניהול מלא של יום האירוע",
    text: "ניהול חברת ההפקה ביום החתונה: ניהול מלא של הלו״ז, פיקוח על הספקים, ניהול הושבה ובקרה על הרזרבות, תוך חיסכון כספי ומענה לכל צורך בזמן אמת.",
    image: "/images/service-day.jpg",
    tags: ["לו״ז", "פיקוח ספקים", "הושבה", "רזרבות"],
  },
  {
    id: "design",
    title: "עיצוב ואפיון האירוע",
    text: "תהליך שמתחיל מהרגע הראשון שהכרנו. אנחנו לומדים להכיר את הזוג לעומק, את החלומות ואת הסגנון, ומתרגמים אותם לתוכנית עבודה מסוגרת ומדויקת שמלווה את החתונה משלב הרעיונות והסיפור ועד הביצוע ביום האירוע עצמו.",
    image: "/images/service-design.jpg",
    tags: ["הכרות", "סיפור וסגנון", "תוכנית עבודה"],
  },
];

export const gallery = [
  { src: "/images/g01.jpg", alt: "זוג חוגג על הבמה עם זיקוקים", span: "wide" },
  { src: "/images/g02.jpg", alt: "מגדל שמפניה בחתונת גן", span: "tall" },
  { src: "/images/g03.jpg", alt: "מתחם אירוח מוצל עם אורות ומנורות", span: "" },
  { src: "/images/g04.jpg", alt: "שולחן אירוח עם פרחים", span: "" },
  { src: "/images/g05.jpg", alt: "במה מעוצבת עם כדורי דיסקו וצמחייה", span: "wide" },
  { src: "/images/g06.jpg", alt: "זוג מתחבק בין קשתות לבנות", span: "tall" },
  { src: "/images/g07.jpg", alt: "כניסת הזוג בין זיקוקים", span: "" },
  { src: "/images/g08.jpg", alt: "תקליטן ומוזיקה חיה על הבמה", span: "" },
  { src: "/images/g09.jpg", alt: "מבט מלמעלה על מתחם הישיבה", span: "wide" },
  { src: "/images/g10.jpg", alt: "שלט קבלת פנים מעוצב", span: "tall" },
  { src: "/images/g11.jpg", alt: "פינות ישיבה בין העצים", span: "" },
  { src: "/images/g12.jpg", alt: "שמפניה על הבמה", span: "" },
  { src: "/images/g13.jpg", alt: "שולחנות בחתונת גן בשעת שקיעה", span: "" },
  { src: "/images/g14.jpg", alt: "זוג בחיבוק", span: "" },
] as const;

export const contact = {
  title: "אתם מתרגשים מהאירוע, אנחנו דואגים לכל השאר",
  subtitle: "REVER, ליווי מלא ומקצועי משלב התכנון ועד רגע השיא ביום האירוע. השאירו פרטים ונחזור אליכם.",
  eventTypes: ["חתונה", "בר / בת מצווה", "אירוע חברה", "אירוע פרטי", "אחר"],
};
