#!/usr/bin/env node

/**
 * סקריפט בדיקת ניגודיות אוטומטי
 * בודק את כל הדפים ב-Dark ו-Light mode
 * 
 * שימוש:
 * node scripts/test-contrast.js
 */

const fs = require('fs');
const path = require('path');

// צבעים לטרמינל
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// רשימת דפים לבדיקה
const pagesToTest = [
  '/events',
  '/events/weddings-dj',
  '/events/bar-mitzvah-dj',
  '/events/bat-mitzvah-dj',
  '/events/henna-dj',
  '/events/corporate-events',
  '/events/chogeg-menagen',
  '/events/live-on-dj',
  '/academy',
  '/academy/dj-course',
  '/academy/groom-dj',
  '/academy/premium',
  '/blog',
  '/blog/how-to-choose-wedding-dj',
  '/blog/chuppah-20-songs',
  '/blog/dj-course-5-mistakes',
  '/blog/dj-or-band-guide',
  '/blog/pro-gear-behind-the-scenes',
  '/music',
  '/contact',
  '/about',
  '/services',
];

// פטרנים לחיפוש
const problematicPatterns = {
  hardcodedColors: {
    pattern: /(?:text-white(?![a-z-])|bg-black(?![a-z-])|bg-\[#[0-9a-fA-F]{3,8}\]|text-\[#[0-9a-fA-F]{3,8}\])/g,
    severity: 'warning',
    message: 'צבע hardcoded שעלול לגרום לבעיות במעבר בין modes'
  },
  whiteOnWhite: {
    pattern: /text-white[^-].*bg-white|bg-white.*text-white[^-]/g,
    severity: 'critical',
    message: 'לבן על לבן - לא קריא!'
  },
  blackOnDark: {
    pattern: /text-black.*bg-\[#[0-2][0-9a-f]{5}\]|bg-\[#[0-2][0-9a-f]{5}\].*text-black/g,
    severity: 'critical',
    message: 'שחור על רקע כהה - לא קריא!'
  },
  missingVariables: {
    pattern: /(?:background|color|border-color|text):\s*(?:white|black|#[0-9a-fA-F]{3,8})(?![a-zA-Z])/g,
    severity: 'warning',
    message: 'CSS ישיר במקום CSS variables'
  }
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('\n' + '='.repeat(70));
  log(message, 'bright');
  console.log('='.repeat(70) + '\n');
}

function findFilePath(pagePath) {
  const appDir = path.join(__dirname, '..', 'src', 'app');
  
  if (pagePath === '/') {
    return path.join(appDir, 'page.tsx');
  }
  
  const parts = pagePath.split('/').filter(Boolean);
  const filePath = path.join(appDir, ...parts, 'page.tsx');
  
  return fs.existsSync(filePath) ? filePath : null;
}

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { found: false };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // בדיקת כל פטרן
  Object.entries(problematicPatterns).forEach(([key, config]) => {
    const matches = content.match(config.pattern);
    if (matches && matches.length > 0) {
      issues.push({
        type: key,
        severity: config.severity,
        count: matches.length,
        message: config.message,
        examples: matches.slice(0, 3) // רק 3 דוגמאות ראשונות
      });
    }
  });
  
  return {
    found: true,
    path: filePath,
    issues,
    linesOfCode: content.split('\n').length
  };
}

function generateReport(results) {
  const summary = {
    total: results.length,
    checked: results.filter(r => r.found).length,
    withIssues: results.filter(r => r.found && r.issues.length > 0).length,
    critical: 0,
    warnings: 0
  };
  
  results.forEach(result => {
    if (result.found && result.issues.length > 0) {
      result.issues.forEach(issue => {
        if (issue.severity === 'critical') summary.critical++;
        else if (issue.severity === 'warning') summary.warnings++;
      });
    }
  });
  
  return summary;
}

async function main() {
  logHeader('🔍 בדיקת ניגודיות אוטומטית - Dark & Light Mode');
  
  log(`📁 בודק ${pagesToTest.length} דפים...`, 'cyan');
  console.log('');
  
  const results = [];
  
  for (const pagePath of pagesToTest) {
    const filePath = findFilePath(pagePath);
    const result = analyzeFile(filePath);
    
    result.pagePath = pagePath;
    results.push(result);
    
    // הצג תוצאה
    if (!result.found) {
      log(`❌ ${pagePath} - קובץ לא נמצא`, 'red');
    } else if (result.issues.length === 0) {
      log(`✅ ${pagePath} - תקין (${result.linesOfCode} שורות)`, 'green');
    } else {
      const critical = result.issues.filter(i => i.severity === 'critical').length;
      const color = critical > 0 ? 'red' : 'yellow';
      const icon = critical > 0 ? '🔴' : '⚠️';
      
      log(`${icon} ${pagePath} - ${result.issues.length} בעיות`, color);
      
      result.issues.forEach(issue => {
        const issueColor = issue.severity === 'critical' ? 'red' : 'yellow';
        console.log(`   ${colors[issueColor]}→ ${issue.message} (${issue.count} מופעים)${colors.reset}`);
        if (issue.examples.length > 0) {
          console.log(`     דוגמאות: ${issue.examples.join(', ')}`);
        }
      });
    }
  }
  
  // סיכום
  const summary = generateReport(results);
  
  logHeader('📊 סיכום תוצאות');
  
  console.log(`סה"כ דפים:        ${summary.total}`);
  console.log(`נבדקו:            ${summary.checked}`);
  log(`✅ תקינים:         ${summary.checked - summary.withIssues}`, 'green');
  log(`⚠️  עם אזהרות:     ${summary.warnings}`, 'yellow');
  log(`🔴 קריטי:          ${summary.critical}`, 'red');
  
  console.log('');
  
  // ציון כללי
  const score = ((summary.checked - summary.withIssues) / summary.checked * 100).toFixed(1);
  log(`📈 ציון כללי: ${score}%`, score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red');
  
  // המלצות
  if (summary.critical > 0 || summary.warnings > 0) {
    console.log('');
    logHeader('💡 המלצות לתיקון');
    
    if (summary.critical > 0) {
      log('🔴 בעיות קריטיות:', 'red');
      console.log('   - תקן מיד! בעיות אלו גורמות לחוסר קריאות');
      console.log('   - החלף צבעים hardcoded ב-CSS variables');
      console.log('   - וודא ניגודיות מספקת (WCAG AA: 4.5:1)');
    }
    
    if (summary.warnings > 0) {
      log('\n⚠️  אזהרות:', 'yellow');
      console.log('   - שקול להחליף ב-CSS variables לגמישות');
      console.log('   - בדוק ניגודיות ידנית בכלי Lighthouse');
    }
  } else {
    log('\n🎉 מעולה! כל הדפים תקינים!', 'green');
  }
  
  // שמירת דוח
  const reportPath = path.join(__dirname, '..', 'contrast-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    date: new Date().toISOString(),
    summary,
    results: results.map(r => ({
      page: r.pagePath,
      found: r.found,
      issuesCount: r.issues.length,
      issues: r.issues
    }))
  }, null, 2));
  
  log(`\n💾 דוח מפורט נשמר ב: ${reportPath}`, 'cyan');
  
  // Exit code
  process.exit(summary.critical > 0 ? 1 : 0);
}

main().catch(error => {
  log(`\n❌ שגיאה: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
