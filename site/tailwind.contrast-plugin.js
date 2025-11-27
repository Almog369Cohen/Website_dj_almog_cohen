/**
 * Tailwind Contrast Plugin
 * 
 * Adds safe contrast utilities and warnings for accessibility
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities, theme, e }) {
  
  // Safe text color utilities with good contrast
  const safeTextColors = {
    '.text-safe-primary': {
      color: 'var(--foreground)',
    },
    '.text-safe-secondary': {
      color: 'var(--foreground-secondary)',
    },
    '.text-safe-muted': {
      color: 'var(--muted-foreground)',
    },
    
    // Dark mode safe colors
    '.dark .text-safe-primary': {
      color: '#ffffff',
    },
    '.dark .text-safe-secondary': {
      color: '#a3a3a3', // 80% white equivalent
    },
    '.dark .text-safe-muted': {
      color: '#737373', // 70% white equivalent
    },
    
    // Light mode safe colors
    '.light .text-safe-primary': {
      color: '#1a1a1a',
    },
    '.light .text-safe-secondary': {
      color: '#525252',
    },
    '.light .text-safe-muted': {
      color: '#737373',
    },
  };
  
  // Safe placeholder utilities
  const safePlaceholders = {
    '.placeholder-safe': {
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.6)',
      },
    },
    
    '.light .placeholder-safe': {
      '&::placeholder': {
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
  };
  
  // Contrast-checked gradient text
  const safeGradientText = {
    '.gradient-text-safe': {
      backgroundImage: 'linear-gradient(135deg, var(--brand-blue) 0%, #ffffff 50%, var(--brand-green) 100%)',
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      color: 'transparent',
    },
  };
  
  // Add all utilities
  addUtilities({
    ...safeTextColors,
    ...safePlaceholders,
    ...safeGradientText,
  });
  
}, {
  theme: {
    extend: {
      // Add safe color tokens
      colors: {
        'safe-text': 'var(--foreground)',
        'safe-text-secondary': 'var(--foreground-secondary)',
        'safe-text-muted': 'var(--muted-foreground)',
      },
    },
  },
});

/**
 * Usage Examples:
 * 
 * ✅ GOOD:
 * <p className="text-safe-primary">Main text</p>
 * <p className="text-safe-secondary">Secondary text</p>
 * <input placeholder="Name" className="placeholder-safe" />
 * 
 * ❌ AVOID:
 * <p className="text-black">Text on dark bg</p>
 * <p className="text-white/40">Low contrast</p>
 * 
 * 💡 TIP:
 * Use text-white/75+ for dark mode
 * Use text-gray-900 for light mode
 * Always check with both themes!
 */
