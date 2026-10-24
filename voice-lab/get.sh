#!/bin/bash
# Bootstrap: download the voice-lab files to ~/almog-creator-lab/voice-lab (existing ref/ clips are kept) and run.
# Usage (paste in Terminal):
#   curl -sL https://raw.githubusercontent.com/Almog369Cohen/Website_dj_almog_cohen/claude/zen-dijkstra-et6qb6/voice-lab/get.sh | bash
set -euo pipefail
BASE="https://raw.githubusercontent.com/Almog369Cohen/Website_dj_almog_cohen/claude/zen-dijkstra-et6qb6/voice-lab"
DEST="${VOICE_LAB_DIR:-$HOME/almog-creator-lab/voice-lab}"
FILES="README.md START.command TASK.md common.py evaluate.py generate.py make_ref.sh report.py requirements-optional.txt requirements.txt run.sh scripts.txt setup.sh tests.txt"
mkdir -p "$DEST" && cd "$DEST"
echo "[get] downloading voice-lab into $DEST"
for f in $FILES; do curl -sSfL -o "$f" "$BASE/$f"; done
chmod +x run.sh setup.sh make_ref.sh START.command
rm -rf __pycache__
echo "[get] files ready:"; ls -1
if ! ls ref/prompt_*.wav >/dev/null 2>&1; then
  echo "[get] no ref/prompt_*.wav - building the reference from the Ableton recording"
  ./make_ref.sh || echo "[get] make_ref failed; run ./make_ref.sh \"<your recording.wav>\" and then ./run.sh"
fi
if [ "${NO_RUN:-0}" != "1" ]; then
  echo "[get] starting the pipeline (Mac stays awake). Log: $DEST/logs/run.log"
  exec caffeinate -dims ./run.sh
fi
