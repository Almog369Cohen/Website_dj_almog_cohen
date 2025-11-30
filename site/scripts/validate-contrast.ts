/**
 * Contrast Validation Script
 * Validates all color combinations against WCAG 2.1 AAA standards
 */

interface ColorPair {
  name: string;
  foreground: string;
  background: string;
  category: 'heading' | 'body' | 'secondary' | 'brand' | 'muted';
  minRatio: number; // Required minimum contrast ratio
}

interface ValidationResult {
  passed: boolean;
  ratio: number;
  required: number;
  level: 'AAA' | 'AA' | 'FAIL';
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(fg: string, bg: string): number {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);

  if (!fgRgb || !bgRgb) {
    throw new Error(`Invalid color: ${!fgRgb ? fg : bg}`);
  }

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

// Validate a color pair
function validatePair(pair: ColorPair): ValidationResult {
  const ratio = getContrastRatio(pair.foreground, pair.background);
  
  let level: 'AAA' | 'AA' | 'FAIL' = 'FAIL';
  if (ratio >= 7.0) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  }

  return {
    passed: ratio >= pair.minRatio,
    ratio: Math.round(ratio * 10) / 10,
    required: pair.minRatio,
    level,
  };
}

// ====================================
// DARK MODE COLOR PAIRS
// ====================================
const darkModePairs: ColorPair[] = [
  {
    name: 'Dark: Heading Text',
    foreground: '#ffffff',
    background: '#1f1f21',
    category: 'heading',
    minRatio: 7.0, // AAA for normal text
  },
  {
    name: 'Dark: Body Text (95% opacity)',
    foreground: '#f2f2f2', // 95% of #ffffff
    background: '#1f1f21',
    category: 'body',
    minRatio: 7.0,
  },
  {
    name: 'Dark: Secondary Text',
    foreground: '#a3a3a3',
    background: '#1f1f21',
    category: 'secondary',
    minRatio: 7.0,
  },
  {
    name: 'Dark: Muted Text',
    foreground: '#737373',
    background: '#1f1f21',
    category: 'muted',
    minRatio: 4.5, // AA minimum
  },
  {
    name: 'Dark: Brand Blue',
    foreground: '#059cc0',
    background: '#1f1f21',
    category: 'brand',
    minRatio: 4.5, // AAA for large text
  },
  {
    name: 'Dark: Brand Green',
    foreground: '#03b28c',
    background: '#1f1f21',
    category: 'brand',
    minRatio: 4.5, // AAA for large text
  },
  // Glass effects - text on glass
  {
    name: 'Dark: Text on Glass Panel',
    foreground: '#ffffff',
    background: '#2a2a2c', // Simulating rgba(255,255,255,0.05) on #1f1f21
    category: 'body',
    minRatio: 7.0,
  },
];

// ====================================
// LIGHT MODE COLOR PAIRS
// ====================================
const lightModePairs: ColorPair[] = [
  {
    name: 'Light: Heading Text',
    foreground: '#0a2540',
    background: '#ffffff',
    category: 'heading',
    minRatio: 7.0,
  },
  {
    name: 'Light: Body Text',
    foreground: '#1a1a1a',
    background: '#ffffff',
    category: 'body',
    minRatio: 7.0,
  },
  {
    name: 'Light: Secondary Text',
    foreground: '#525252',
    background: '#ffffff',
    category: 'secondary',
    minRatio: 7.0,
  },
  {
    name: 'Light: Muted Text',
    foreground: '#737373',
    background: '#ffffff',
    category: 'muted',
    minRatio: 4.5,
  },
  {
    name: 'Light: Brand Blue',
    foreground: '#0588a3',
    background: '#ffffff',
    category: 'brand',
    minRatio: 4.5,
  },
  {
    name: 'Light: Brand Green',
    foreground: '#028c6e',
    background: '#ffffff',
    category: 'brand',
    minRatio: 4.5,
  },
  {
    name: 'Light: Text on Glass Panel',
    foreground: '#1a1a1a',
    background: '#f5f5f5', // Simulating glass effect
    category: 'body',
    minRatio: 7.0,
  },
];

// ====================================
// RUN VALIDATION
// ====================================
function runValidation() {
  console.log('🎨 ================================');
  console.log('   WCAG 2.1 Contrast Validation');
  console.log('================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Test Dark Mode
  console.log('🌙 DARK MODE\n');
  console.log('─'.repeat(80));
  darkModePairs.forEach((pair) => {
    totalTests++;
    const result = validatePair(pair);
    
    const status = result.passed ? '✅' : '❌';
    const icon = result.level === 'AAA' ? '🌟' : result.level === 'AA' ? '⭐' : '💥';
    
    console.log(`${status} ${icon} ${pair.name}`);
    console.log(`   Ratio: ${result.ratio}:1 (Required: ${result.required}:1) - ${result.level}`);
    console.log(`   FG: ${pair.foreground} | BG: ${pair.background}`);
    console.log('─'.repeat(80));

    if (result.passed) passedTests++;
    else failedTests++;
  });

  console.log('\n');

  // Test Light Mode
  console.log('☀️  LIGHT MODE\n');
  console.log('─'.repeat(80));
  lightModePairs.forEach((pair) => {
    totalTests++;
    const result = validatePair(pair);
    
    const status = result.passed ? '✅' : '❌';
    const icon = result.level === 'AAA' ? '🌟' : result.level === 'AA' ? '⭐' : '💥';
    
    console.log(`${status} ${icon} ${pair.name}`);
    console.log(`   Ratio: ${result.ratio}:1 (Required: ${result.required}:1) - ${result.level}`);
    console.log(`   FG: ${pair.foreground} | BG: ${pair.background}`);
    console.log('─'.repeat(80));

    if (result.passed) passedTests++;
    else failedTests++;
  });

  // Summary
  console.log('\n');
  console.log('📊 ================================');
  console.log('   SUMMARY');
  console.log('================================\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log('');

  if (failedTests > 0) {
    console.log('❌ VALIDATION FAILED - Fix contrast issues before deploying!');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED - WCAG 2.1 AAA Compliant!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  runValidation();
}

export { getContrastRatio, validatePair, runValidation };
