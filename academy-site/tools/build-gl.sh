#!/bin/sh
# Bundle the WebGL part of club mode (tools/gl/*.js + three.js, tree-shaken and minified) into club-gl.js.
# Run from academy-site/:  sh tools/build-gl.sh      (needs Node; fetches esbuild and three on first run)
set -e
cd "$(dirname "$0")/.."
DIR=tools/gl/node_modules
if [ ! -d "$DIR/three" ] || [ ! -d "$DIR/esbuild" ]; then
  (cd tools/gl && npm install --no-save --silent three@0.186.1 esbuild@0.25.10)
fi
"$DIR/.bin/esbuild" tools/gl/main.js --bundle --format=esm --minify --target=es2019 \
  --legal-comments=eof --outfile=club-gl.js
ls -l club-gl.js
