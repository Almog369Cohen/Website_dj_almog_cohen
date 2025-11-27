# 🛡️ Contrast Enforcement System

## 📋 **Overview**

This project uses a **multi-layer contrast enforcement system** to ensure WCAG 2.1 AA+ compliance and prevent accessibility issues.

---

## 🔧 **System Components**

### **1. ESLint Rules** 🚨
**File:** `.eslintrc.contrast.json`

Catches contrast issues during development:
```bash
npm run lint
```

**Blocked patterns:**
- ❌ `text-black` on dark backgrounds
- ❌ `text-white/10-50` (too low opacity)
- ❌ `placeholder-white/10-50` (poor contrast)

---

### **2. Pre-commit Hook** 🪝
**File:** `.husky/pre-commit`

Automatically runs before every commit:
```bash
git commit -m "Your message"
# → 🔍 Checking for contrast issues...
# → ✅ Contrast check passed!
```

**Blocks commits** if critical issues found.

---

### **3. GitHub Actions** 🤖
**File:** `.github/workflows/contrast-check.yml`

Runs on every PR and push to main:
- ✅ Checks all files
- 📊 Generates report
- 💬 Comments on PR if issues found
- 📤 Uploads report artifact

**Triggers:**
- Pull requests to `main` or `develop`
- Pushes to `main`

---

### **4. Tailwind Plugin** 🎨
**File:** `site/tailwind.contrast-plugin.js`

Adds safe utility classes:
```jsx
// ✅ Use these instead
className="text-safe-primary"       // Auto-adapts to theme
className="text-safe-secondary"     // WCAG AA compliant
className="placeholder-safe"        // Good contrast
className="gradient-text-safe"      // Safe gradient text
```

**Installation:**
```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('./tailwind.contrast-plugin'),
  ],
}
```

---

### **5. TypeScript Types** 📘
**File:** `site/src/types/contrast.d.ts`

Type-safe color utilities:
```tsx
import { SafeTextOpacity, SAFE_COLOR_COMBINATIONS } from '@/types/contrast';

// ✅ Type-safe
const opacity: SafeTextOpacity = 80;  // OK
const bad: SafeTextOpacity = 40;      // ❌ Type error!

// ✅ Pre-defined safe combinations
const className = SAFE_COLOR_COMBINATIONS.darkBg.primary; // 'text-white'
```

---

### **6. VS Code Snippets** ⚡
**File:** `.vscode/contrast.code-snippets`

Quick shortcuts in VS Code:

| Prefix | Description |
|:---|:---|
| `text-safe` | Insert safe text color |
| `placeholder-safe` | Insert safe placeholder |
| `btn-gradient` | Button on gradient |
| `glass-safe` | Glass card with safe colors |
| `contrast-comment` | Add contrast docs |

**Usage:**
Type `text-safe` + Tab → Auto-complete with safe options!

---

### **7. Manual Check Script** 🔍
**File:** `check-contrast.sh`

Run anytime:
```bash
./check-contrast.sh
```

**Output:**
```
🔍 Scanning for contrast issues...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Checking text-black on dark backgrounds...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ No text-black found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Great! No contrast issues detected!
```

---

## 📚 **Quick Reference**

### **Safe Color Patterns:**

#### **Dark Mode:**
```jsx
✅ text-white           // 100% contrast
✅ text-white/90        // WCAG AAA (6.2:1)
✅ text-white/85        // WCAG AA+ (5.9:1)
✅ text-white/80        // WCAG AA (5.5:1)
✅ text-white/75        // WCAG AA (5.1:1)
```

#### **Light Mode:**
```jsx
✅ text-gray-900        // Very dark
✅ text-gray-800        // Dark
✅ text-gray-700        // Medium-dark
✅ text-gray-600        // Medium
```

#### **On Gradients:**
```jsx
✅ text-white           // ALWAYS white on gradients
❌ text-black           // NEVER on dark gradients
```

#### **Placeholders:**
```jsx
✅ placeholder:text-white/80   // Good
✅ placeholder:text-white/60   // Minimum
❌ placeholder:text-white/40   // Too low
```

---

## 🚀 **Setup Instructions**

### **1. Install Dependencies:**
```bash
npm install husky --save-dev
```

### **2. Initialize Husky:**
```bash
npx husky install
```

### **3. Make Scripts Executable:**
```bash
chmod +x check-contrast.sh
chmod +x .husky/pre-commit
```

### **4. Add Tailwind Plugin:**
```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('./tailwind.contrast-plugin'),
  ],
}
```

### **5. Enable GitHub Actions:**
```bash
# Already configured in .github/workflows/contrast-check.yml
# Will run automatically on PR/push
```

---

## 🔍 **How to Check Locally**

### **Method 1: Manual Script**
```bash
./check-contrast.sh
```

### **Method 2: ESLint**
```bash
npm run lint
```

### **Method 3: Pre-commit (automatic)**
```bash
git commit -m "feat: add new component"
# Automatically runs check
```

### **Method 4: VS Code**
- Install ESLint extension
- Warnings show inline

---

## 🛠️ **Fixing Issues**

### **Common Fixes:**

#### **1. text-black on gradient:**
```diff
- className="text-black bg-gradient-to-r..."
+ className="text-white bg-gradient-to-r..."
```

#### **2. Low opacity text:**
```diff
- className="text-white/40"
+ className="text-white/80"
```

#### **3. Low placeholder opacity:**
```diff
- placeholder-white/40
+ placeholder:text-white/60
```

#### **4. Hardcoded inline styles:**
```diff
- style={{ opacity: 0.5 }}
+ className="text-white/75"
```

---

## 📊 **Enforcement Levels**

| Level | Tool | When | Action |
|:---|:---|:---|:---|
| 🟢 **Advisory** | VS Code snippets | While typing | Suggests safe options |
| 🟡 **Warning** | ESLint | On save | Shows warning |
| 🟠 **Error** | Pre-commit hook | On commit | Blocks if critical |
| 🔴 **Blocker** | GitHub Actions | On PR | Blocks merge |

---

## 🎯 **Goals**

- ✅ **WCAG 2.1 AA** minimum compliance
- ✅ **WCAG 2.1 AAA** where possible
- ✅ **4.5:1** contrast ratio minimum (normal text)
- ✅ **3:1** contrast ratio minimum (large text)
- ✅ **Consistent** across light and dark modes

---

## 📖 **Additional Resources**

- **Full Guidelines:** [CONTRAST_RULES.md](./CONTRAST_RULES.md)
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Review:** https://color.review/

---

## 🆘 **Need Help?**

1. Read [CONTRAST_RULES.md](./CONTRAST_RULES.md)
2. Run `./check-contrast.sh` for diagnosis
3. Check TypeScript types for safe options
4. Use VS Code snippets for quick fixes

---

## 🎉 **Summary**

**7 layers of protection:**
1. ✅ ESLint rules
2. ✅ Pre-commit hooks
3. ✅ GitHub Actions
4. ✅ Tailwind plugin
5. ✅ TypeScript types
6. ✅ VS Code snippets
7. ✅ Manual check script

**Result:** Nearly impossible to introduce contrast issues! 🛡️

---

**Last Updated:** Nov 26, 2024  
**Status:** ✅ Active & Enforced
