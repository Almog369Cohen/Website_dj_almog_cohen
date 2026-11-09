#!/usr/bin/env bash
# בונה את הדמו כקבצים סטטיים (מצב דמו בלבד: נתונים בדפדפן, בלי שרת ובלי מסד נתונים).
# שימוש: scripts/build-demo.sh /demo/rever  →  out-demo/
set -euo pipefail
BASE="${1:-/demo/rever}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
( cd "$ROOT" && tar cf - --exclude=./node_modules --exclude=./.next --exclude=./out-demo --exclude=./.env.local . ) | ( cd "$TMP" && tar xf - )
rm -rf "$TMP/src/app/api"            # נתיבי שרת לא נכנסים לגרסה הסטטית
ln -s "$ROOT/node_modules" "$TMP/node_modules"
( cd "$TMP" && NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY= REVER_STATIC=1 REVER_BASE_PATH="$BASE" npx next build )
rm -rf "$ROOT/out-demo" && cp -r "$TMP/out" "$ROOT/out-demo"
echo "✓ demo built at out-demo/ for base path $BASE"
