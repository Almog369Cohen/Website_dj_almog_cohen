# אתר תדמית חדש – סקיצות

תיקייה נפרדת לאתר התדמית החדש של אלמוג כהן. **לא נוגעת** באתר הקיים (`site/`, נפרס ל-GCS בכתובת www.compaktt.com) ולא ב-backoffice (`compakt/`).

## מבנה
- `index.html` – דף בחירה בין הסקיצות
- `sketch-1/` – "חופה": שנהב, זהב, סריף. עדין ויוקרתי
- `sketch-2/` – "רחבה": כהה, ניאון בצבעי המותג, כותרות ענק
- `sketch-3/` – "הסיפור שלכם": שחור-לבן + דואוטון, טיימליין של הערב, טופס
- `assets/photos/` – סט תמונות מכוון מחומרי הגלם (זוגות, חתונות, אווירה, אלמוג)
- `assets/testimonials/` – צילומי מסך אמיתיים של הודעות מזוגות
- `assets/logos/` – לוגואים של לקוחות
- `assets/video/hero.mp4` – וידאו ה-hero (720p, ללא סאונד)
- `assets/css/base.css`, `assets/js/site.js` – בסיס משותף (ניווט, חשיפה בגלילה, לייטבוקס, מונים, טופס וואטסאפ)

HTML/CSS סטטי בלבד, ללא build. פתיחה מקומית: `open promo/index.html`.

## פריסה
Workflow נפרד: `.github/workflows/deploy-promo.yml` → GitHub Pages
בכתובת https://almog369cohen.github.io/Website_dj_almog_cohen/

הפעלה חד-פעמית: Settings → Pages → Source: **GitHub Actions**.
ה-workflow רץ רק על שינויים בתיקיית `promo/` (או ידנית), ולא משפיע על הפריסות הקיימות.
