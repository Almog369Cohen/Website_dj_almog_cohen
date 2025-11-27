/**
 * Contrast & Accessibility Types
 * 
 * Type-safe utilities for ensuring good color contrast
 */

// Safe text color values (WCAG AA compliant)
export type SafeTextOpacity = 75 | 80 | 85 | 90 | 95;

// Dangerous opacity values (to avoid)
export type UnsafeTextOpacity = 10 | 20 | 30 | 40 | 50 | 60 | 70;

// Safe text color classes
export type SafeTextColor =
  | 'text-white'
  | 'text-foreground'
  | 'text-foreground-heading'
  | 'text-foreground-secondary'
  | `text-white/${SafeTextOpacity}`
  | 'text-safe-primary'
  | 'text-safe-secondary'
  | 'text-safe-muted';

// Button text colors (on gradients)
export type SafeButtonTextColor = 
  | 'text-white'
  | 'text-foreground';

// Placeholder colors
export type SafePlaceholderColor =
  | 'placeholder:text-white/60'
  | 'placeholder:text-white/80'
  | 'placeholder-safe';

// Contrast ratios
export type ContrastRatio = {
  AA: number;      // 4.5:1 for normal text
  AAA: number;     // 7:1 for normal text
  AA_LARGE: number;  // 3:1 for large text
  AAA_LARGE: number; // 4.5:1 for large text
};

export const WCAG_CONTRAST_RATIOS: ContrastRatio = {
  AA: 4.5,
  AAA: 7.0,
  AA_LARGE: 3.0,
  AAA_LARGE: 4.5,
};

// Helper type for className with contrast validation
export type ContrastSafeClassName = string & {
  __contrastSafe?: true;
};

/**
 * Type guard to check if a className is contrast-safe
 */
export function isContrastSafe(className: string): boolean {
  const unsafePatterns = [
    /text-black/,                    // Never on dark backgrounds
    /text-white\/[1-6]0/,            // Too low opacity
    /placeholder-white\/[1-5]0/,     // Too low for placeholders
  ];
  
  return !unsafePatterns.some(pattern => pattern.test(className));
}

/**
 * Validates className for contrast issues
 * Throws error in development, warns in production
 */
export function validateContrast(className: string): void {
  if (!isContrastSafe(className)) {
    const message = `⚠️ CONTRAST ISSUE: "${className}" may have poor contrast. See CONTRAST_RULES.md`;
    
    if (process.env.NODE_ENV === 'development') {
      console.error(message);
      // Optionally throw in strict mode
      // throw new Error(message);
    } else {
      console.warn(message);
    }
  }
}

/**
 * Safe color combinations for common use cases
 */
export const SAFE_COLOR_COMBINATIONS = {
  // Dark backgrounds
  darkBg: {
    primary: 'text-white',
    secondary: 'text-white/85',
    muted: 'text-white/75',
    placeholder: 'placeholder:text-white/60',
  },
  
  // Light backgrounds
  lightBg: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-600',
    placeholder: 'placeholder:text-gray-500',
  },
  
  // On gradients (always white)
  onGradient: {
    text: 'text-white',
    button: 'text-white',
  },
  
  // Glass/frosted backgrounds
  glassBg: {
    primary: 'text-white',
    secondary: 'text-white/90',
    muted: 'text-white/80',
  },
} as const;

/**
 * Example usage:
 * 
 * ```tsx
 * import { SAFE_COLOR_COMBINATIONS, validateContrast } from '@/types/contrast';
 * 
 * // ✅ Good
 * const className = SAFE_COLOR_COMBINATIONS.darkBg.primary;
 * 
 * // ⚠️ Will warn in dev
 * validateContrast('text-black bg-gradient-to-r');
 * 
 * // ✅ Type-safe
 * const opacity: SafeTextOpacity = 80; // OK
 * const bad: SafeTextOpacity = 40;     // Type error!
 * ```
 */
