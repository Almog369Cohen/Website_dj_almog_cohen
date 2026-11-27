# REVER PRODUCTIONS | ריבר הפקות

האתר של ריבר הפקות (גל וליאל). Next.js 16 בייצוא סטטי, React 19, CSS רגיל ב-`globals.css`, ופונטים Bellefair ו-Heebo.

## הרצה

```bash
cd rever
npm install
npm run dev            # http://localhost:3000
npm run build          # ייצוא סטטי לתיקיית out/
npm run lint && npx tsc --noEmit
npm run check:launch   # אחרי build עם NEXT_PUBLIC_SITE_URL: בודק שהאתר מוכן לגוגל
```

## איפה משנים מה

| מה | קובץ |
| --- | --- |
| כל הטקסטים, המייסדים, וואטסאפ, תפריט, שלבי המסע בפתיחה | `src/content/site.ts` |
| אירועים (עמוד לכל אירוע) | `src/content/events.ts` |
| שאלות נפוצות (רק שאלות עם תשובה מוצגות באתר החי) | `src/content/faq.ts` |
| מדריכים ומקורות | `src/content/guides.ts` |
| סטטוס עמודים (מאומת / טיוטה) | `src/content/routes.ts` |
| מידות התמונות | `src/content/photos.ts` |
| חיתוכי הטלפון של שלבי הפתיחה | `src/content/journey-crops.json` |

כל מה שעוד לא אושר על ידי REVER מסומן בירוק (`<Todo>`). הוא מוצג רק בתצוגה המקדימה ולא באתר החי. עמוד עם סטטוס "draft" נשאר noindex.

## דף הבית

1. **הפתיחה, הערב כמסע:**
   - קבלת הפנים נפתחת מהחלון שבין REVER ל"הפקות".
   - כל תמונה מחזיקה חלון עם השלב הבא, והגלילה נכנסת לתוכו: כניסה לחופה, החופה, כניסה לריקודים, אפטר.
   - המסע נגמר בסרטון עמדת הלוטוס, ואחריו הסלוגן והכפתור.
   - הקוד: `Hero` ב-`src/components/home.tsx`, ו-`heroUpdate` ב-`src/components/Engine.tsx`.
2. **ההבדל:** רשימת המשימות, ה-wipe של "אצלנו / אצלכם" ו"לא צריך".
3. **גל וליאל:** המייסדים.
4. **איך זה עובד, הצוות, אירועים, שאלות נפוצות, יצירת קשר.**

בהעדפת "הפחתת תנועה", בלי JavaScript, או במסך נמוך: אין אנימציות. השלבים מוצגים כרשימת תמונות רגילה (`html[data-scenes="off"]`).

## תמונות וסרטונים

```bash
npm run media -- /path/to/folder   # מייבא מקוריים: JPEG מאסטר ו-WebP ב-640/1080/1280/1600/2400
node scripts/journey-crops.mjs     # חיתוכי טלפון לשלבי הפתיחה (<photo>-m-640/960.webp)
```

`PHOTOS.md` מפרט מאיזה אירוע כל תמונה, ומה עוד צריך לאשר מול REVER.

## הגדרות לעלייה לאוויר

מגדירים אצל ספק האחסון לפני `npm run build`:

| משתנה | מה הוא עושה |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | הדומיין האמיתי. בלעדיו האתר הוא תצוגה מקדימה: noindex, robots חוסם, והירוק מוצג |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | כתובת שמקבלת כל ליד לפני שהוואטסאפ נפתח. גיליון Google עובד: `scripts/lead-sheet.gs` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4. נטען רק אחרי הסכמה לעוגיות |

`npm run check:launch` נכשל אם:
- robots חוסם את האתר;
- עמוד שפתוח לגוגל מכיל ירוק;
- לעמוד חסרים כותרת, canonical עם סלאש בסוף, או H1 אחד בדיוק.

## תצוגה מקדימה

```bash
npm run build && python3 scripts/stage-preview.py out <תיקייה>
```

הסקריפט מעתיק את הייצוא לתיקייה שעובדת מכל נתיב: קבצי HTML שטוחים, נתיבים יחסיים, ורק התמונות שבשימוש.
