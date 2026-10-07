# אתר תדמית חדש – סקיצות

תיקייה נפרדת לאתר התדמית החדש של אלמוג כהן. **לא נוגעת** באתר הקיים (`site/`, נפרס ל-GCS בכתובת www.compaktt.com) ולא ב-backoffice (`compakt/`).

## מבנה
- `index.html` – דף בחירה בין הסקיצות
- `sketch-1/` – "חופה": שנהב, זהב, סריף. עדין ויוקרתי
- `sketch-2/` – "רחבה": כהה, ניאון בצבעי המותג, כותרות ענק
- `sketch-3/` – "הסיפור שלכם": שחור-לבן + דואוטון, טיימליין של הערב, טופס
- `assets/img/` – תמונות מהריפו, מוקטנות ל-1600px

HTML/CSS סטטי בלבד, ללא build. פתיחה מקומית: `open promo/index.html`.

## פריסה
Workflow נפרד: `.github/workflows/deploy-promo.yml` → GitHub Pages
בכתובת https://almog369cohen.github.io/Website_dj_almog_cohen/

הפעלה חד-פעמית: Settings → Pages → Source: **GitHub Actions**.
ה-workflow רץ רק על שינויים בתיקיית `promo/` (או ידנית), ולא משפיע על הפריסות הקיימות.
