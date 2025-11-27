# 🔍 מדריך בדיקת ניגודיות - Light & Dark Mode

## סקירה כללית

יש לך 2 כלי בדיקה אוטומטיים לוודא שכל הדפים באתר קריאים ב-Dark וב-Light mode:

1. **סקריפט CLI** - בדיקה מהטרמינל (מהיר)
2. **כלי דפדפן** - בדיקה ויזואלית (מפורט יותר)

---

## 🚀 שיטה 1: בדיקה מהטרמינל (מומלץ)

### הרצה:
```bash
npm run test:contrast
```

### מה זה עושה:
- ✅ סורק את כל 22 הדפים שתוקנו
- ✅ מחפש צבעים hardcoded (text-white, bg-black, etc.)
- ✅ מזהה שימוש ב-CSS ישיר במקום variables
- ✅ מתריע על בעיות פוטנציאליות
- ✅ יוצר דוח JSON מפורט

### פלט לדוגמה:
```
======================================================================
🔍 בדיקת ניגודיות אוטומטית - Dark & Light Mode
======================================================================

📁 בודק 22 דפים...

✅ /events - תקין (245 שורות)
✅ /events/weddings-dj - תקין (189 שורות)
⚠️  /events/bar-mitzvah-dj - 2 בעיות
   → צבע hardcoded שעלול לגרום לבעיות במעבר בין modes (3 מופעים)
     דוגמאות: text-white, bg-black, text-[#ffffff]
✅ /academy - תקין (312 שורות)
...

======================================================================
📊 סיכום תוצאות
======================================================================
סה"כ דפים:        22
נבדקו:            22
✅ תקינים:         20
⚠️  עם אזהרות:     2
🔴 קריטי:          0

📈 ציון כללי: 90.9%

💾 דוח מפורט נשמר ב: contrast-report.json
```

### קריאת הדוח:
```bash
npm run test:contrast:report
```

---

## 🌐 שיטה 2: כלי דפדפן (ויזואלי)

### הרצה:
1. הפעל את האתר:
   ```bash
   npm run dev
   ```

2. פתח בדפדפן:
   ```
   http://localhost:3000/test-contrast.html
   ```

3. לחץ על "▶️ התחל בדיקה"

### מה זה עושה:
- ✅ טוען כל דף ב-iframe
- ✅ בודק בפועל Dark ו-Light mode
- ✅ מחשב ניגודיות (contrast ratio) אמיתית
- ✅ מציג תוצאות חזותיות
- ✅ מאפשר ייצוא דוח JSON

### תכונות:
- **בדיקה אמיתית** - בודק את הדפים הרצים בפועל
- **חישוב WCAG** - מוודא עמידה בתקן WCAG 2.1 AA
- **פרוגרס בר** - מראה התקדמות
- **סיכום ויזואלי** - גרפים ומספרים
- **ייצוא** - שמירת תוצאות לקובץ JSON

### דרישות WCAG:
- ✅ טקסט רגיל: ניגודיות מינימלית **4.5:1**
- ✅ טקסט גדול (18px+ או 14px bold): **3:1**
- ✅ AAA (מומלץ): **7:1** / **4.5:1**

---

## 📊 הבנת התוצאות

### סטטוסים:

#### ✅ PASS (תקין)
- אין בעיות קריטיות
- פחות מ-5 אזהרות קלות
- ניגודיות עומדת ב-WCAG AA

#### ⚠️ WARNING (אזהרה)
- יש 5+ אזהרות
- ניגודיות גבולית (3:1 - 4.5:1)
- שימוש בצבעים hardcoded

#### ❌ FAIL (כשל)
- בעיות קריטיות
- ניגודיות מתחת ל-3:1
- טקסט לא קריא

---

## 🔧 תיקון בעיות נפוצות

### בעיה: `text-white` hardcoded
❌ **לפני:**
```tsx
<h1 className="text-white">כותרת</h1>
```

✅ **אחרי:**
```tsx
<h1 className="text-foreground-heading">כותרת</h1>
```

### בעיה: `bg-black` hardcoded
❌ **לפני:**
```tsx
<div className="bg-black">
```

✅ **אחרי:**
```tsx
<div className="bg-background">
```

### בעיה: צבע inline
❌ **לפני:**
```tsx
<p style={{ color: '#ffffff' }}>טקסט</p>
```

✅ **אחרי:**
```tsx
<p className="text-foreground-secondary">טקסט</p>
```

### בעיה: צבע בקובץ CSS
❌ **לפני:**
```css
.title {
  color: white;
  background: #1f1f21;
}
```

✅ **אחרי:**
```css
.title {
  color: var(--foreground-heading);
  background: var(--background);
}
```

---

## 🎨 CSS Variables זמינים

### טקסט:
- `text-foreground` - טקסט רגיל
- `text-foreground-heading` - כותרות
- `text-foreground-secondary` - טקסט משני
- `text-muted-foreground` - טקסט מושתק

### רקעים:
- `bg-background` - רקע ראשי
- `bg-background/50` - רקע שקוף 50%

### גבולות:
- `border-border` - גבול סטנדרטי

### Brand Colors:
- `text-brand-blue` - כחול (#059cc0)
- `text-brand-green` - ירוק (#03b28c)

---

## 📋 Checklist ידני

לאחר הרצת הבדיקות האוטומטיות, עבור על:

### בדיקה ויזואלית:
- [ ] פתח כל דף בדפדפן
- [ ] החלף בין Dark ← → Light
- [ ] וודא שהמעבר חלק (ללא "הבהוב")
- [ ] כל הטקסט קריא
- [ ] כפתורים בולטים
- [ ] Forms עובדים טוב

### בדיקת מכשירים:
- [ ] Desktop (Chrome)
- [ ] Desktop (Firefox)
- [ ] Desktop (Safari)
- [ ] Mobile (iPhone)
- [ ] Mobile (Android)
- [ ] Tablet

### בדיקת Accessibility:
- [ ] הרץ Lighthouse (Chrome DevTools)
- [ ] נווט רק עם מקלדת (Tab)
- [ ] בדוק עם screen reader (אופציונלי)

---

## 🐛 Troubleshooting

### הסקריפט לא רץ:
```bash
# וודא שהקובץ הוא executable
chmod +x scripts/test-contrast.js

# הרץ ישירות
node scripts/test-contrast.js
```

### כלי הדפדפן לא נטען:
- וודא שהשרת רץ: `npm run dev`
- נסה לרענן את הדף
- פתח Console בדפדפן לבדוק שגיאות

### יותר מדי false positives:
- הכלי מחמיר - זה בסדר!
- בדוק ידנית את הדפים שמסומנים
- עדכן את הפטרנים ב-`scripts/test-contrast.js`

---

## 📈 יעדים

### שלב 1 (עכשיו):
- ✅ 90%+ דפים תקינים
- ✅ 0 בעיות קריטיות
- ✅ פחות מ-10 אזהרות

### שלב 2 (השבוע הבא):
- 🎯 100% דפים תקינים
- 🎯 WCAG AA מלא
- 🎯 0 אזהרות

### שלב 3 (עתיד):
- 🌟 WCAG AAA
- 🌟 בדיקות אוטומטיות ב-CI/CD
- 🌟 מוניטור תמידי

---

## 💡 טיפים

1. **הרץ לפני כל commit:**
   ```bash
   npm run test:contrast
   ```

2. **בדוק שינויים:**
   ```bash
   git diff contrast-report.json
   ```

3. **שמור דוחות היסטוריים:**
   ```bash
   cp contrast-report.json reports/$(date +%Y%m%d).json
   ```

4. **אינטגרציה עם Git:**
   הוסף ל-.git/hooks/pre-commit:
   ```bash
   #!/bin/bash
   npm run test:contrast || exit 1
   ```

---

## 🆘 קבלת עזרה

אם נתקעת:
1. בדוק את הדוחות המפורטים
2. השתמש בכלי DevTools של Chrome
3. הרץ Lighthouse
4. בדוק את התיעוד: https://www.w3.org/WAI/WCAG21/quickref/

---

**זכור:** ניגודיות טובה = חווית משתמש טובה = יותר לקוחות! 🚀
