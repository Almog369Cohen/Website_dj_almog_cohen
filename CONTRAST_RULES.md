# ⚠️ Contrast & Accessibility Rules

## 🚨 CRITICAL RULES - תמיד צריך לבדוק!

### ❌ **אסור להשתמש:**

1. **text-white/40, text-white/50, text-white/60** על רקע לבן/בהיר
   - ✅ **במקום:** `text-foreground-secondary` או `text-gray-600`

2. **text-black** על רקע כהה או gradients כהים
   - ✅ **במקום:** `text-white` או `text-foreground`

3. **placeholder-white/40** בפורמים
   - ✅ **במקום:** `placeholder-foreground/60`

4. **Hardcoded colors** (מספרים hex) שלא משתנים בין themes
   - ✅ **במקום:** CSS Variables

---

## ✅ **CSS Variables - תמיד להעדיף:**

### **Light Mode:**
```css
--background: #ffffff (לבן טהור)
--foreground: #1a1a1a (שחור כהה - 13.5:1 contrast)
--foreground-heading: #0a2540 (כחול כהה - 10.3:1)
--foreground-secondary: #525252 (אפור - 7.2:1)
```

### **Dark Mode:**
```css
--background: #1f1f21 (שחור עמוק)
--foreground: #ffffff (לבן)
--foreground-heading: #ffffff
--foreground-secondary: #a3a3a3 (אפור בהיר)
```

---

## 🎨 **כללי שימוש:**

### **1. טקסט ראשי:**
```jsx
❌ className="text-white"
✅ className="text-foreground"
```

### **2. טקסט משני:**
```jsx
❌ className="text-white/60"
✅ className="text-foreground-secondary"
```

### **3. כותרות:**
```jsx
❌ className="text-white font-black"
✅ className="text-foreground-heading font-black"
```

### **4. Placeholders:**
```jsx
❌ placeholder-white/40
✅ placeholder-foreground/60
```

### **5. גבולות:**
```jsx
❌ border-white/10
✅ border-border (CSS variable)
```

---

## 🔍 **איך לבדוק:**

### **1. Grep Search:**
```bash
# חיפוש text-white עם opacity
grep -r "text-white/[0-9]" --include="*.tsx" .

# חיפוש text-black
grep -r "text-black" --include="*.tsx" .

# חיפוש placeholder-white
grep -r "placeholder-white" --include="*.tsx" .
```

### **2. Visual Check:**
```
1. בדוק Light Mode - כל הטקסט קריא?
2. בדוק Dark Mode - כל הטקסט קריא?
3. בדוק Contrast Ratio עם DevTools
4. ודא WCAG AA minimum (4.5:1 טקסט רגיל, 3:1 טקסט גדול)
```

---

## 📋 **Checklist לכל component:**

- [ ] אין `text-white/[number]` על רקע בהיר
- [ ] אין `text-black` על רקע כהה
- [ ] כל הטקסט משתמש ב-CSS variables
- [ ] Placeholders קריאים ב-2 התמות
- [ ] Contrast ratio מינימום 4.5:1
- [ ] נבדק ב-Light mode
- [ ] נבדק ב-Dark mode

---

## 🛠️ **תיקונים אוטומטיים:**

### **Pattern 1:**
```jsx
// Before
<p className="text-white/60">טקסט</p>

// After
<p className="text-foreground-secondary">טקסט</p>
```

### **Pattern 2:**
```jsx
// Before
<input placeholder-white/40 />

// After  
<input className="placeholder-foreground/60" />
```

### **Pattern 3:**
```jsx
// Before
<button className="text-black">לחץ</button>

// After
<button className="text-white">לחץ</button>
// OR
<button className="text-foreground">לחץ</button>
```

---

## 🎯 **מטרה:**

**WCAG 2.1 Level AAA:**
- Normal text: 7:1 contrast ratio
- Large text: 4.5:1 contrast ratio
- UI components: 3:1 contrast ratio

**Light mode עכשיו:**
- Background: #ffffff ✅
- Body text: #1a1a1a (13.5:1) ✅
- Headings: #0a2540 (10.3:1) ✅
- Secondary: #525252 (7.2:1) ✅

**כל הצבעים עוברים WCAG AAA!** ♿✨

---

## 🚀 **Action Items:**

1. ✅ Replace `text-white/[0-9]+` with CSS variables
2. ✅ Replace `text-black` on dark backgrounds with `text-white`
3. ✅ Replace `placeholder-white/40` with `placeholder-foreground/60`
4. ✅ Test in both Light and Dark modes
5. ✅ Verify WCAG AA compliance minimum
6. ✅ Document any exceptions

---

**Created:** Nov 26, 2024  
**Purpose:** Ensure consistent contrast across all themes  
**Status:** Active ruleset for all components
