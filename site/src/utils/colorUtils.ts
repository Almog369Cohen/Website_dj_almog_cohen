/**
 * Advanced Color Utilities - Level 1000
 * Supports OKLCH color space for perceptually uniform transitions
 */

// OKLCH Color type
export interface OKLCHColor {
  l: number; // Lightness 0-1
  c: number; // Chroma 0-0.4
  h: number; // Hue 0-360
}

// RGB Color type
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Convert OKLCH to RGB
 * Using simplified conversion for web (approximation)
 */
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  const { l, c, h } = oklch;
  
  // Convert to linear sRGB (simplified)
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  
  // Linear sRGB values (approximation)
  const lr = l + 0.3963377774 * a + 0.2158037573 * b;
  const lg = l - 0.1055613458 * a - 0.0638541728 * b;
  const lb = l - 0.0894841775 * a - 1.2914855480 * b;
  
  // Gamma correction
  const gammaCorrect = (val: number) => {
    const v = Math.max(0, Math.min(1, val));
    return v <= 0.0031308 
      ? 12.92 * v 
      : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  
  return {
    r: Math.round(gammaCorrect(lr) * 255),
    g: Math.round(gammaCorrect(lg) * 255),
    b: Math.round(gammaCorrect(lb) * 255),
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGBColor): string {
  const { r, g, b } = rgb;
  return `#${[r, g, b]
    .map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * Convert OKLCH to hex (convenience)
 */
export function oklchToHex(oklch: OKLCHColor): string {
  return rgbToHex(oklchToRgb(oklch));
}

/**
 * Interpolate between two OKLCH colors
 * @param color1 Start color
 * @param color2 End color
 * @param factor Progress 0-1
 * @param easing Optional easing function
 */
export function interpolateOKLCH(
  color1: OKLCHColor,
  color2: OKLCHColor,
  factor: number,
  easing?: (t: number) => number
): OKLCHColor {
  const t = easing ? easing(factor) : factor;
  
  // Handle hue interpolation (shortest path around circle)
  let h1 = color1.h;
  let h2 = color2.h;
  const hDiff = h2 - h1;
  
  if (hDiff > 180) {
    h1 += 360;
  } else if (hDiff < -180) {
    h2 += 360;
  }
  
  return {
    l: color1.l + (color2.l - color1.l) * t,
    c: color1.c + (color2.c - color1.c) * t,
    h: (h1 + (h2 - h1) * t) % 360,
  };
}

/**
 * Get relative luminance for WCAG contrast
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio
 */
export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG standards
 */
export function meetsWCAG(
  bg: RGBColor,
  text: RGBColor,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(bg, text);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Hex to RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}
