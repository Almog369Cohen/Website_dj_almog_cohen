# ⚡ **Contrast Quick Reference - מדריך מהיר**

## 🎯 **החוקים בקצרה**

### **טקסט רגיל (< 18px):**
- ✅ **AAA**: `7:1` ומעלה
- ⚠️ **AA**: `4.5:1` ומעלה
- ❌ **FAIL**: פחות מ-`4.5:1`

### **טקסט גדול (≥ 18px או 14px bold):**
- ✅ **AAA**: `4.5:1` ומעלה
- ⚠️ **AA**: `3:1` ומעלה
- ❌ **FAIL**: פחות מ-`3:1`

---

## 🌓 **Dark Mode - צבעי טקסט**

```css
/* ✅ SAFE TO USE */
color: #ffffff;        /* Headings - 17.8:1 */
color: #ffffff95;      /* Body (95%) - 16.2:1 */
color: #a3a3a3;        /* Secondary - 8.5:1 */
color: #737373;        /* Muted - 4.6:1 */

/* ⚠️ BRAND COLORS (Large text only) */
color: #059cc0;        /* Blue - 5.2:1 */
color: #03b28c;        /* Green - 4.8:1 */

/* ❌ NEVER USE */
color: #ffffff60;      /* 60% opacity - FAILS */
color: #808080;        /* Generic gray - FAILS */
```

---

## ☀️ **Light Mode - צבעי טקסט**

```css
/* ✅ SAFE TO USE */
color: #0a2540;        /* Headings - 12.1:1 */
color: #1a1a1a;        /* Body - 15.8:1 */
color: #525252;        /* Secondary - 7.2:1 */
color: #737373;        /* Muted - 4.6:1 */

/* ⚠️ BRAND COLORS (Large text only) */
color: #0588a3;        /* Blue - 5.8:1 */
color: #028c6e;        /* Green - 5.2:1 */

/* ❌ NEVER USE */
color: #059cc0;        /* Dark mode blue - FAILS in light mode */
color: #cccccc;        /* Light gray - FAILS */
```

---

## 📐 **Opacity Rules**

| Opacity | Text Type | Allowed? |
|:--------|:----------|:--------:|
| 100% | Headings, Primary | ✅ |
| 95% | Body text | ✅ |
| 90% | Captions | ✅ |
| 85% | Tertiary | ⚠️ Test |
| 80% | Metadata | ⚠️ Test |
| < 80% | Any text | ❌ Never |

---

## 🎨 **Glass Effects**

```css
/* ✅ CORRECT - Always use backdrop-blur */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);  /* Essential! */
}

/* ❌ WRONG - Missing blur */
.bad-glass {
  background: rgba(255, 255, 255, 0.05);
  /* Missing backdrop-filter - text will be hard to read */
}
```

---

## 🚀 **Quick Test Commands**

### **בדיקה ידנית:**
1. פתח Chrome DevTools
2. Elements → בחר אלמנט
3. Styles → Accessibility → Contrast

### **בדיקה אוטומטית:**
```bash
# Run contrast validation
cd site
npm run validate:contrast

# Run full accessibility audit
npm run test:a11y
```

---

## 📋 **Checklist לפני Commit**

- [ ] כל טקסט עם opacity ≥ 85%
- [ ] כל glass effect עם `backdrop-filter: blur(12px)`
- [ ] כותרות ב-100% opacity
- [ ] Brand colors רק לטקסט גדול (≥18px)
- [ ] נבדק ב-Dark + Light modes
- [ ] נבדק במובייל

---

## 🔧 **Tailwind Classes - Safe to Use**

### **Dark Mode:**
```tsx
<h1 className="text-white">          {/* ✅ 17.8:1 */}
<p className="text-white/95">        {/* ✅ 16.2:1 */}
<span className="text-white/90">     {/* ✅ 14.5:1 */}
<small className="text-gray-400">    {/* ✅ #a3a3a3 - 8.5:1 */}
```

### **Light Mode:**
```tsx
<div className="light">
  <h1 className="text-foreground-heading">  {/* ✅ 12.1:1 */}
  <p className="text-foreground">            {/* ✅ 15.8:1 */}
  <span className="text-foreground-secondary"> {/* ✅ 7.2:1 */}
</div>
```

---

## ⚠️ **Common Mistakes**

### **1. Using Dark Mode Colors in Light Mode**
```tsx
/* ❌ WRONG */
<div className="light">
  <p className="text-[#059cc0]">Bad contrast!</p>
</div>

/* ✅ CORRECT */
<div className="light">
  <p className="text-[#0588a3]">Good contrast!</p>
</div>
```

### **2. Low Opacity Text**
```tsx
/* ❌ WRONG */
<p className="text-white/60">Too faint</p>

/* ✅ CORRECT */
<p className="text-white/90">Readable</p>
```

### **3. Missing Backdrop Blur**
```tsx
/* ❌ WRONG */
<div className="bg-white/5">
  <p>Hard to read</p>
</div>

/* ✅ CORRECT */
<div className="bg-white/5 backdrop-blur-xl">
  <p>Easy to read</p>
</div>
```

---

## 🎯 **יעדים:**

- ✅ **WCAG 2.1 Level AAA** - כל הטקסט
- ✅ **Mobile First** - בדיקה במובייל קודם
- ✅ **Dark + Light** - תמיכה מלאה בשני המצבים

---

**זכור**: אם אתה לא בטוח - **השתמש ב-100% opacity** ובדוק!
