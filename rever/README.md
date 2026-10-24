# Rever הפקות אירועים — אתר נחיתה

אתר One-Page ל-Rever, בנוי ב-Next.js 16 + Tailwind 4 + Framer Motion, באותה מערכת כמו `site/` (ייצוא סטטי).

## הרצה מקומית

```bash
cd rever
npm install
npm run dev        # http://localhost:3000
npm run build      # ייצוא סטטי לתיקיית out/
```

## איפה משנים מה

| מה | קובץ |
|---|---|
| כל הטקסטים, הטלפון, השירותים, שאלות נפוצות, המלצות | `src/content/site.ts` |
| תמונות | `public/images/` (אותם שמות קבצים = אין צורך לגעת בקוד) |
| צבעים ופונטים | `src/app/globals.css` (משתני `:root`) |

## מבנה האתר (גרסת זכוכית יוקרתית)

1. **פתיחה:** סרטון עמדת הלוטוס בקשת, מעל עותק מטושטש של עצמו, וטקסט על לוח זכוכית אחד.
2. **מי אנחנו:** רקע שמנת, צילום כלה בקשת, ולוח זכוכית שמנת שחופף אותו.
3. **מה אנחנו עושים:** צילום מסך מלא שמתחלף בגלילה, וכרטיס זכוכית אחד לכל תחום.
4. **הרחבה:** קולאז' לילה מהצילומים שלהם, עם כיתוב זכוכית.
5. **גלריה:** 12 תמונות בטורים (masonry), עם הגדלה בלחיצה.
6. **צור קשר:** צילום חתונת הגן ברקע, וטופס זכוכית.

## לפני עלייה לאוויר

- התמונות ב-`public/images/` הן placeholders שנוצרו ב-`scripts/generate-placeholder-images.py`. להחליף בתמונות אמיתיות של Rever באותם שמות.
- לאמת מול דף ה-Canva: טלפון (`054-664-6923`), טקסטים, המלצות ומספרים ב-`stats`.
- לעדכן את הדומיין ב-`brand.url`.
- טופס יצירת הקשר שולח את הפרטים לוואטסאפ של העסק (אין צורך בשרת).

## חומרים מקוריים (איכות)

```bash
cd rever
npm run media -- /path/to/Rever-folder   # מייבא תמונות וסרטונים מקוריים ומעבד אותם
npm run media                            # מעבד מחדש את כל התמונות ב-public/images
```

- **תמונות:** מסובבות לפי EXIF, נשמרות כ-JPEG מאסטר ברוחב 2400 וכ-WebP ברוחבים 640/1080/1600/2400. הטוען המותאם (`src/lib/image-loader.ts`) מגיש לכל מסך את הגודל המתאים.
- **סרטונים:** MP4 בפורמט H.264 ב-1080p וב-720p, בלי סאונד, עם faststart, ותמונת פוסטר. סרטונים ארוכים מאחסנים מחוץ לגיט (Bunny, Cloudflare Stream או R2).
- **שמות קבצים:** כדי שתמונה תופיע במקום מסוים באתר, שומרים אותה בשם של מקום התמונה הזמנית (למשל `reception-1.jpg`), או מעדכנים את הנתיב ב-`src/content/site.ts`.

## החומרים האמיתיים באתר

התמונות נמשכו מתיקיית Drive "Rever - Marketing - Almog" ועובדו עם `npm run media`. שמות הקבצים ב-`public/images` הם לפי התפקיד:

| קובץ | איפה באתר |
|---|---|
| `about` | "מי אנחנו" |
| `service-*` | ארבעת התחומים |
| `night-1..4` | קולאז' הרחבה |
| `g01..g12` | גלריה |
| `contact-bg` | רקע צור קשר |
| `hero-poster` + `video/hero.mp4/.webm` | סרטון הפתיחה |
| `logo.png` | הלוגו האמיתי, זהב על שקוף |

הסרטונים (15 קבצים, עד 200MB) לא נכנסו: הם כבדים מדי לגיט. להכנת סרטון פתיחה: `npm run media -- <תיקייה עם הסרטון>`, ואז לאחסן בשירות סרטונים.

## Settings for going live

Set these in the host's environment before `npm run build`:

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The real domain, used for canonical links, Open Graph and structured data |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 id. Loads only after the visitor accepts the cookie bar |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel id. Same consent rule |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | Optional URL (Formspree, Make, a Google Apps Script) that receives each form submission as JSON, so leads are kept even if the visitor never presses send in WhatsApp |

With no tracking ids set, the cookie bar does not appear.

## Before launch

- Anything shown in green on the site is unverified (phone, address, accessibility coordinator, contact email). Replace it in `src/content/site.ts` and `src/components/Dialogs.tsx`.
- Confirm that the couples in the photos agreed to appear on the site.
