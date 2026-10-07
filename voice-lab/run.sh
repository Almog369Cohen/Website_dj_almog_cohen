#!/bin/bash
# Full pipeline: setup -> calibrate prompt -> generate all sketches -> evaluate -> report. Everything is logged.
# Safe to re-run: generation skips sketches that already exist.
cd "$(dirname "$0")"
mkdir -p logs
exec > >(tee -a logs/run.log) 2>&1
echo "=== voice-lab run started $(date)"
ONLY="${ONLY:-all}"            # ONLY=tests ./run.sh  or  ONLY=scripts ./run.sh
VARIANTS="${VARIANTS:-calm,expressive}"
ENGINE="${ENGINE:-chatterbox}" # ENGINE=dry ./run.sh = smoke test without the model

./setup.sh || { echo "=== SETUP FAILED $(date)"; exit 1; }
# shellcheck disable=SC1091
. .venv/bin/activate
export PYTORCH_ENABLE_MPS_FALLBACK=1 TOKENIZERS_PARALLELISM=false

if [ ! -f calibration.json ] && [ "$ENGINE" != "dry" ]; then
  echo "=== calibration: choosing the best reference clip"
  python generate.py --engine "$ENGINE" --calibrate || echo "calibration failed, continuing with default prompt"
fi
echo "=== generation"
python generate.py --engine "$ENGINE" --only "$ONLY" --variants "$VARIANTS"
GEN=$?
echo "=== evaluation"
python evaluate.py || python evaluate.py --no-asr || echo "evaluation failed"
echo "=== report"
python report.py || echo "report failed"
echo "=== voice-lab run finished $(date) (generate exit $GEN)"
echo "Open REPORT.md and review.html in: $(pwd)"
