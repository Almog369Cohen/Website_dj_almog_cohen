/**
 * Every fixed page: its search title and description, its default WhatsApp context, and whether it is
 * ready for search. A "draft" page renders normally but carries noindex and stays out of the sitemap.
 */
export type PageMeta = {
  path: string;
  title: string;
  description: string;
  status: "draft" | "verified";
  photo?: string;
  wa?: string;
  updated: string;
};

export const pages = {
  home: {
    path: "/",
    title: "ריבר הפקות | הפקת חתונות ואירועים | REVER PRODUCTIONS",
    description: "גל וליאל מ-REVER מפיקים חתונות ואירועים כבר 6 שנים: לוקיישן וספקים, תקציב וחוזים, עיצוב וניהול מלא של יום האירוע.",
    status: "verified",
    updated: "2026-10-25",
  },
  weddingProduction: {
    path: "/wedding-production/",
    title: "הפקת חתונה בליווי מלא | ריבר הפקות",
    description: "הפקת חתונה מהפגישה הראשונה ועד השיר האחרון: מה כלול בכל שלב, מה נשאר אצלכם ומה אצלנו, ושאלות שזוגות שואלים.",
    status: "verified",
    photo: "ev-couple-1",
    wa: "קראתי באתר על הפקת חתונה",
    updated: "2026-10-25",
  },
  events: {
    path: "/events/",
    title: "חתונות ואירועים שהפקנו | ריבר הפקות",
    description: "חתונת גן בחצר אבן, חתונה בערב השנה החדשה, עמדת DJ בצורת לוטוס ומופע במה עם להקה חיה. האירועים של REVER בתמונות.",
    status: "verified",
    photo: "ev-court-1",
    wa: "ראיתי באתר את האירועים שהפקתם",
    updated: "2026-10-25",
  },
  guides: {
    path: "/guides/",
    title: "מדריכים לתכנון חתונה | ריבר הפקות",
    description: "תשובות ישירות לשאלות של זוגות: מה עושה מפיקת חתונות, איך נראה לו״ז של יום חתונה, וכמה עולה מפיק.",
    status: "verified",
    photo: "ev-lotus-2",
    wa: "קראתי את המדריכים באתר",
    updated: "2026-10-25",
  },
  faq: {
    path: "/faq/",
    title: "שאלות נפוצות על הפקת חתונה | ריבר הפקות",
    description: "מה כולל הליווי, מי ילווה אתכם, מה קורה ביום האירוע, ומה ההבדל בין מפיק למנהל האירוע של האולם.",
    status: "verified",
    photo: "ev-court-2",
    wa: "קראתי באתר את השאלות הנפוצות",
    updated: "2026-10-25",
  },
  about: {
    path: "/about/",
    title: "גל וליאל, המייסדים | ריבר הפקות",
    description: "גל וליאל הקימו את REVER, ומפיקים חתונות ואירועים כבר 6 שנים. הם אלה שעונים לכם בוואטסאפ.",
    status: "verified",
    photo: "team-group",
    wa: "קראתי עליכם באתר",
    updated: "2026-10-25",
  },
  contact: {
    path: "/contact/",
    title: "דברו עם גל וליאל | ריבר הפקות",
    description: "השאירו פרטים או שלחו הודעה בוואטסאפ לגל וליאל, המייסדים של REVER, ונחזור אליכם.",
    status: "verified",
    photo: "contact-bg",
    wa: "הגעתי לעמוד יצירת הקשר",
    updated: "2026-10-25",
  },
  privacy: {
    path: "/privacy/",
    title: "מדיניות פרטיות | ריבר הפקות",
    description: "איזה מידע האתר אוסף, למה, ואיך מבקשים לעיין בו או למחוק אותו.",
    status: "draft",
    updated: "2026-10-25",
  },
  accessibility: {
    path: "/accessibility/",
    title: "הצהרת נגישות | ריבר הפקות",
    description: "מה עשינו כדי שהאתר יהיה נגיש, ואיך פונים אלינו אם משהו לא עובד.",
    status: "draft",
    updated: "2026-10-25",
  },
} satisfies Record<string, PageMeta>;
