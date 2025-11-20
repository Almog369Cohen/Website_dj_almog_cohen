# About Page - Level 150 Documentation

## 🎬 Overview
עמוד האודות של DJ Almog Cohen בסגנון Level 150 - קינמטי, אפל, וביטחוני.
**Theme:** "Netflix Documentary meets Underground Techno Club"

---

## 🎨 Design System

### Color Palette
- **Background:** `#0a0a0a` (Deep Charcoal)
- **Primary Blue:** `#059cc0` (Electric Blue - neon accents)
- **Primary Green:** `#03b28c` (Acid Green - glows & active states)
- **Text:** White with opacity variants

### Typography
```css
--font-fluid-h1: clamp(3.5rem, 8vw + 1rem, 9rem);
--font-fluid-h2: clamp(2.5rem, 5vw + 1rem, 5rem);
--font-fluid-h3: clamp(1.5rem, 3vw + 1rem, 3rem);
--font-fluid-p: clamp(1rem, 1vw + 0.5rem, 1.25rem);
```

- **Font:** Heebo (Hebrew RTL)
- **Headlines:** Font-weight 900, letter-spacing -0.05em, line-height 0.95
- **Body:** Font-weight 300, line-height 1.8

### Visual Effects
1. **Noise Texture** - 5% opacity overlay for gritty feel
2. **Glassmorphism** - backdrop-blur-xl on cards
3. **Neon Glows** - text-shadow and box-shadow animations
4. **Kinetic Reveals** - skewY + translateY animations
5. **Parallax** - scroll-based scale transforms

---

## 📐 Section Breakdown

### 1. Hero: "ארכיטקט של אנרגיה"
**Tech:**
- Full-screen video background (`/assets/hero-main-optimized.mp4`)
- Dark gradient overlay (80%→60%→80%)
- `mix-blend-mode: overlay` on headline
- Kinetic typography with `RevealText` component
- Animated scroll indicator

**Mobile:**
- Video plays on mobile (autoPlay, muted, playsInline)
- Reduced font sizes via clamp
- Touch-optimized spacing

---

### 2. Split Story: "אובססיה לקצב"
**Tech:**
- **Sticky positioning** on image (desktop only)
- **Parallax zoom:** scale transforms from 1 → 1.1 on scroll
- B&W image filters: `grayscale contrast-125 brightness-90`
- Vignette gradient overlay
- Story content with fluid typography
- Glassmorphism quick facts box

**Mobile:**
- Sticky disabled (stacks vertically)
- Image height: 350px (vs 600px desktop)
- Reduced padding: py-20 (vs py-32)

**Image Requirements:**
- Photo: `/assets/almog/IMG_6561.jpg`
- High-contrast B&W portrait
- Minimum resolution: 1200x1600px

---

### 3. Sonic Timeline: "מסע הקול"
**Tech:**
- Vertical gradient line with **scroll progress fill**
- Years with **neon blue glow** animation
- `text-shadow` pulse: 0px → 30px → 15px (2s loop)
- Connection dots that pulse (scale 1 → 1.5 → 1)
- Stagger animation (delay: i * 0.1)
- Items slide from right (x: 50 → 0)

**Mobile:**
- Thinner line: w-0.5 (vs w-1)
- Smaller year font: clamp(1.25rem → 2.5rem)
- Reduced gap: gap-4 (vs gap-8)
- Smaller dots: 3x3 (vs 4x4)

**Timeline Data:**
```typescript
[
  { year: "2012", title: "החוג שהדליק את הכל", description: "..." },
  { year: "2013", title: "הכניסה לחיי הלילה", description: "..." },
  { year: "2013", title: "האירוע הראשון - מסיבת תיכון בפייר", description: "..." },
  { year: "2014", title: "מועדון WYNN - השלב הבא", description: "..." },
  { year: "2016-18", title: "במות חו\"ל ואלפי אנשים", description: "..." },
  { year: "2020", title: "הקמת העסק ובית הספר", description: "..." }
]
```

---

### 4. Philosophy Cards: "הפילוסופיה"
**Tech:**
- 3 Glassmorphism cards (backdrop-blur-xl)
- **Green glow on hover:** `border-color: #03b28c` + `box-shadow`
- Scale animation: 1.02 on hover
- Text sharpen: h3 scales to 1.05
- Stagger reveal (0.1s, 0.2s, 0.3s)

**Mobile:**
- Grid: 2 columns on sm (vs 3 on md)
- Reduced heading: text-xl (vs text-2xl)
- Smaller body text: text-sm (vs text-base)

**Card Content:**
1. **"אנרגיה זה לא מה ששומעים"**
   - זה מה שמרגישים. כל שיר הוא החלטה...
2. **"כל אירוע הוא עולם"**
   - אין תבניות. יש רק קשב...
3. **"לא DJ - שותף מוזיקלי"**
   - אתם לא שוכרים מישהו להפעיל פלייליסט...

---

### 5. Mic Drop CTA: "אתם לא מחפשים DJ..."
**Tech:**
- **Massive headline:** fluid-h1 with gradient (white → white/60)
- Background glow: 600px blur circle
- **Magnetic button** with:
  - Gradient: green → blue
  - Hover scale: 1.05
  - Shimmer animation (3s linear loop)
  - Animated arrow (x: 0 → 5 → 0)
- Social links with blue glow hover

**Mobile:**
- Smaller button: px-8 py-4 (vs px-12 py-6)
- Reduced font: text-base (vs text-xl)
- Smaller icon: h-5 w-5 (vs h-6 w-6)
- Wrapped social links: flex-wrap

**CTA Copy:**
```
אתם לא מחפשים DJ.
אתם מחפשים שקט נפשי.

הערב שלכם לא צריך להיות עוד פרויקט שמלחיץ. בואו נדבר, נבין מה אתם רוצים, 
ונבנה את הפסקול המדויק לרגעים הכי חשובים בחיים שלכם.
```

**WhatsApp Link:**
```typescript
wa("היי אלמוג, קראתי את העמוד ואני רוצה לדבר על האירוע שלנו")
```

---

## 🛠️ Components

### RevealText
Kinetic typography component with:
- Initial state: `y: "100%", skewY: 5, opacity: 0`
- Animated state: `y: "0%", skewY: 0, opacity: 1`
- Custom easing: `[0.22, 1, 0.36, 1]`
- Duration: 0.8s
- Viewport trigger: `{ once: true }`

### TimelineItem
Timeline milestone component with:
- IntersectionObserver trigger (amount: 0.3)
- Neon glow animation on year
- Pulsing connection dot
- Slide-in from right
- Responsive sizing

---

## 📱 Mobile Optimizations

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Key Adjustments
1. **Spacing:** py-20 (mobile) vs py-32 (desktop)
2. **Typography:** Smaller clamp min values
3. **Images:** Reduced heights (350px vs 600px)
4. **Grids:** Stack to 1-2 columns
5. **Buttons:** Smaller padding and icons
6. **Touch Targets:** Minimum 44x44px

### Performance
- Image optimization with Next.js Image component
- Priority loading on hero image
- Lazy load scroll animations (viewport once)
- GPU acceleration with `will-change` (sparingly)

---

## 🚀 Usage

### Install Dependencies
```bash
npm install framer-motion
```

### Import Component
```tsx
import AboutPage from '@/app/about/page';
```

### Environment Variables
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=972502427616
```

### Assets Required
- `/assets/hero-main-optimized.mp4` - Hero background video
- `/assets/almog/IMG_6561.jpg` - B&W portrait photo

---

## 🎯 Best Practices

### Accessibility
- ✅ Semantic HTML (sections, headings)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ High contrast text (WCAG AA)

### Performance
- ✅ Code splitting (dynamic imports ready)
- ✅ Image optimization (Next.js Image)
- ✅ Animation throttling (viewport once)
- ✅ Reduced motion media query ready

### SEO
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Descriptive alt text
- ✅ Semantic structure
- ✅ Mobile-first responsive

---

## 🔮 Future Enhancements

### Phase 2 (Optional)
1. **Magnetic Cursor** - Custom cursor that follows mouse
2. **3D Tilt Cards** - Perspective transforms on hover
3. **Video Testimonials** - Embedded client videos
4. **Horizontal Scroll Gallery** - Touch-swipe image carousel
5. **Audio Visualizer** - Waveform animation on hero

### Analytics Integration
```typescript
// Track CTA clicks
onClick={() => {
  gtag('event', 'cta_click', {
    'event_category': 'engagement',
    'event_label': 'about_page_whatsapp'
  });
}}
```

---

## 📊 Performance Metrics

### Target Goals
- **Load Time:** < 3s on 4G
- **Lighthouse:** 90+ Performance
- **First Contentful Paint:** < 1.5s
- **Cumulative Layout Shift:** < 0.1

### Optimization Checklist
- [x] Image optimization (WebP, srcset)
- [x] Code splitting
- [x] Animation throttling
- [x] Lazy loading
- [ ] Service worker (PWA)
- [ ] CDN delivery

---

## 🐛 Known Issues & Fixes

### Issue: Video not playing on iOS
**Solution:** Ensure `autoPlay muted playsInline` attributes

### Issue: Sticky positioning on Safari
**Solution:** Added `-webkit-sticky` fallback in global CSS

### Issue: Scroll animations janky
**Solution:** Use `will-change` sparingly, prefer `transform` over `top/left`

---

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Hero with video background + mix-blend-mode
- ✅ Split Story with sticky parallax
- ✅ Sonic Timeline with scroll progress
- ✅ Philosophy Cards with glassmorphism
- ✅ Mic Drop CTA with magnetic button
- ✅ Full mobile optimization
- ✅ RTL support (Hebrew)

---

## 👨‍💻 Developer Notes

### State Management
```typescript
const storyRef = useRef(null);
const timelineRef = useRef(null);
const { scrollYProgress } = useScroll({ target: storyRef });
const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
```

### Animation Patterns
- **Kinetic Reveals:** `RevealText` with skew
- **Scroll-based:** `useScroll` + `useTransform`
- **Viewport-based:** `useInView` with threshold
- **Hover states:** `whileHover` on motion components

### CSS Architecture
- **Tailwind:** Utility-first for layout/spacing
- **CSS Variables:** Fluid typography system
- **Inline Styles:** Dynamic values (fontSize, scale)
- **Motion:** Framer Motion for animations

---

## 🌟 Credits

**Design:** Level 150 Cinematic Style  
**Development:** Next.js 14 + Framer Motion  
**Typography:** Heebo (Hebrew RTL)  
**Inspiration:** Netflix Documentaries + Underground Techno Clubs

---

## 📞 Support

לשאלות או בעיות:
- WhatsApp: +972-50-242-7616
- Email: almogmusiccohen@gmail.com
- Instagram: [@dj_almog_cohen](https://www.instagram.com/dj_almog_cohen/)

---

**עמוד האודות Level 150 - Built with 🎵 by DJ Almog Cohen**
