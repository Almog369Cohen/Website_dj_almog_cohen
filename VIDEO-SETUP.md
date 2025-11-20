# Video & Assets Configuration

## Background Video

**File**: `hero-main-optimized.mp4` (12.7 MB)  
**Location**: Google Cloud Storage  
**URL**: `https://storage.googleapis.com/www.compaktt.com/assets/hero-main-optimized.mp4`

### Why GCS Instead of GitHub?

The video file is 12.7 MB, which is too large for GitHub repository (GitHub recommends files < 50MB, but keeping repo lean is best practice).

### Pages Using Background Video

1. **Home Page** (`/`) - Hero section background
2. **Services Page** (`/services`) - Hero section
3. **About Page** (`/about`) - Header background

### Fallback Poster Image

**File**: `hero-poster.jpg` (142 KB)  
**Location**: GCS  
**URL**: `https://storage.googleapis.com/www.compaktt.com/assets/almog/hero-poster.jpg`

Used as poster attribute for video tag - shows while video loads.

## Mobile Menu

**Component**: `MobileMenu.tsx`  
**Location**: `/site/src/components/MobileMenu.tsx`

### Features
- Animated burger icon (3 lines → X)
- Slide-in menu from right
- Full navigation links
- WhatsApp contact button
- Auto-closes on link click
- Backdrop overlay with blur

### Usage in Layout
```tsx
<MobileMenu waNumber={waNumber} waText={waText} />
```

Visible only on mobile (`md:hidden` class).

## Deployment Notes

- Video uploaded directly to GCS bucket
- Public read access configured
- Cached for 1 year (CDN optimization)
- Mobile menu included in all builds automatically via layout.tsx
