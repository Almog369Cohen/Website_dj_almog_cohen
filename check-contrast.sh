#!/bin/bash

# 🎨 Contrast Checker Script
# Usage: ./check-contrast.sh

echo "🔍 Scanning for contrast issues..."
echo ""

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Counter
issues=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Checking text-white with opacity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

results=$(grep -rn "text-white/[0-9]" --include="*.tsx" --include="*.ts" site/src 2>/dev/null)
if [ -n "$results" ]; then
    echo -e "${YELLOW}⚠️  Found text-white with opacity:${NC}"
    echo "$results" | head -20
    count=$(echo "$results" | wc -l)
    echo ""
    echo -e "${YELLOW}Total: $count occurrences${NC}"
    issues=$((issues + count))
else
    echo -e "${GREEN}✅ No text-white/[opacity] found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Checking text-black on dark backgrounds..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

results=$(grep -rn "text-black" --include="*.tsx" --include="*.ts" site/src 2>/dev/null | grep -v "text-black/")
if [ -n "$results" ]; then
    echo -e "${YELLOW}⚠️  Found text-black:${NC}"
    echo "$results" | head -20
    count=$(echo "$results" | wc -l)
    echo ""
    echo -e "${YELLOW}Total: $count occurrences${NC}"
    issues=$((issues + count))
else
    echo -e "${GREEN}✅ No text-black found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Checking placeholder-white with opacity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

results=$(grep -rn "placeholder-white/[0-9]" --include="*.tsx" --include="*.ts" site/src 2>/dev/null)
if [ -n "$results" ]; then
    echo -e "${YELLOW}⚠️  Found placeholder-white with opacity:${NC}"
    echo "$results"
    count=$(echo "$results" | wc -l)
    echo ""
    echo -e "${YELLOW}Total: $count occurrences${NC}"
    issues=$((issues + count))
else
    echo -e "${GREEN}✅ No placeholder-white/[opacity] found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Checking hardcoded hex colors..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

results=$(grep -rn "style.*color.*#[0-9a-fA-F]" --include="*.tsx" --include="*.ts" site/src 2>/dev/null | head -10)
if [ -n "$results" ]; then
    echo -e "${YELLOW}⚠️  Found hardcoded colors (sample):${NC}"
    echo "$results"
else
    echo -e "${GREEN}✅ No obvious hardcoded colors${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $issues -eq 0 ]; then
    echo -e "${GREEN}✨ Great! No contrast issues detected!${NC}"
else
    echo -e "${RED}⚠️  Found $issues potential contrast issues${NC}"
    echo ""
    echo "💡 Recommendations:"
    echo "   1. Replace text-white/[opacity] with CSS variables"
    echo "   2. Replace text-black on dark backgrounds with text-white"
    echo "   3. Use placeholder-foreground instead of placeholder-white"
    echo ""
    echo "📚 See CONTRAST_RULES.md for full guidelines"
fi

echo ""
echo "✅ Scan complete!"
