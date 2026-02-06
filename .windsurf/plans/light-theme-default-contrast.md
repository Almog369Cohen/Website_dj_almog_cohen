# Light Theme Default + New Contrast Rules

This plan switches the site’s default theme to Light and rebuilds the light-mode contrast system so text/backgrounds remain readable across the key pages (mobile-first), without breaking Dark mode.

## 1) Current State (what’s causing the problem)
- The root HTML is hard-forced to Dark via `src/app/layout.tsx`:
  - `<html ... className="dark">`
- The Theme system also defaults to Dark in `src/components/ThemeProvider.tsx`:
  - `useState<Theme>("dark")`
- Light variables exist in `src/app/globals.css` under `.light { ... }`, but many components use hard-coded Tailwind colors (e.g. `text-white`, `bg-black/...`, `border-white/...`). Those override the CSS variables and make Light mode unreadable.
- Tailwind config file is not present; the project appears to use Tailwind via `@import "tailwindcss";` and relies heavily on CSS variables (`bg-background`, `text-foreground`, etc.).

## 2) Goals
- **Default theme = Light** for first-time visitors.
- **Dark remains fully supported** via toggle.
- **Readable Light mode** on mobile first (baseline WCAG AA).
- Remove reliance on hard-coded `text-white`/`bg-black` in shared components in favor of semantic tokens.

## 3) Implementation Plan

### A) Make Light the default theme (no UI changes)
- Change `src/app/layout.tsx` to stop forcing `className="dark"` on `<html>`.
  - Allow ThemeProvider to control the root class.
- Update `src/components/ThemeProvider.tsx` default state:
  - Change initial `theme` to `"light"`.
  - Change initial `resolvedTheme` to `"light"`.
  - Keep honoring `localStorage.getItem("theme")` (so returning users keep preference).

### B) Create a Light-Mode contrast rule set (design tokens)
- Consolidate and validate tokens in `src/app/globals.css`:
  - Ensure `--background`, `--foreground`, `--foreground-secondary`, `--muted-foreground`, `--border` are strong enough for readability.
  - Add missing semantic tokens if needed for:
    - elevated surfaces (cards)
    - overlay backgrounds (glass)
    - link colors
    - focus rings
- Add a small set of “semantic utility classes” (CSS) if needed for repeated patterns (e.g. `surface`, `surface-muted`, `text-on-surface`).

### C) Remove hard-coded colors from critical, always-visible UI (phase 1)
Target the parts users see immediately (mobile-first):
- Header / navigation / menus
- Hero sections (Home + Weddings)
- Primary CTA buttons
- Any sticky banners / badges

Rules:
- Replace `text-white` → `text-foreground` / `text-foreground-heading` / `text-foreground-secondary`.
- Replace `bg-black/...` → `bg-background` or a token-based surface.
- Replace `border-white/...` → `border-border` or token-based border.
- Keep brand accents (`brand-blue`, `brand-green`) but ensure contrast against Light background.

### D) Expand fixes to remaining main pages (phase 2)
- `/weddings` and `/weddings/fit-check` (known heavy usage of `text-white` etc.)
- Home sections (`HomeSectionsLean`, etc.)
- Other high-traffic pages (Services, Academy) as needed.

### E) QA checklist (mobile-first)
- Test at widths: 360px, 390px, 412px, 768px, 1024px.
- Verify:
  - body text contrast
  - headings
  - links
  - buttons (normal/hover/focus)
  - glass panels (background + text)
  - icons
  - overlay sections on media/video
- Confirm ThemeToggle still works and persists.

## 4) Deliverables
- Default Light theme for new users.
- Updated CSS variable system for Light mode.
- Removed hard-coded colors from critical UI; consistent readable tokens.
- Dark mode preserved.

## 5) Questions for you (to lock design before implementation)
- Light mode background will be **pure white** (`#fff`) with a “transparency play” approach (tinted glass/overlays). (Chosen)
- In Light mode, “glass” surfaces will be **tinted glass** (slight blue/green tint). (Chosen)
- Contrast target: baseline **WCAG AA** (AAA not required). (Chosen)
