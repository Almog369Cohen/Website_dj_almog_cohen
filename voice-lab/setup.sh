#!/bin/bash
# One-time setup: Python venv + all free/open-source deps + the Hebrew nikud model. Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

if ! command -v uv >/dev/null 2>&1; then
  echo "[setup] installing uv (python package manager)"
  curl -LsSf https://astral.sh/uv/install.sh | sh || python3 -m pip install --user -q uv
  export PATH="$HOME/.local/bin:$PATH"
fi
if [ ! -x .venv/bin/python ]; then
  echo "[setup] creating venv with Python 3.11 (uv downloads it if needed)"
  uv venv --python 3.11 .venv
fi
# shellcheck disable=SC1091
. .venv/bin/activate
echo "[setup] installing requirements (first time: ~3GB of wheels, a few minutes)"
uv pip install -r requirements.txt
uv pip install -r requirements-optional.txt || echo "[setup] optional speaker encoder failed to install - evaluate.py will fall back to Chatterbox's own encoder"

mkdir -p models logs sketches ref
if [ ! -s models/dicta-1.0.onnx ]; then
  echo "[setup] downloading Hebrew nikud model (dicta-onnx, ~1.1GB, once)"
  curl -L --fail -# -o models/dicta-1.0.onnx https://github.com/thewh1teagle/dicta-onnx/releases/download/model-files-v1.0/dicta-1.0.onnx \
    || curl -L --fail -# -o models/dicta-1.0.int8.onnx https://github.com/thewh1teagle/dicta-onnx/releases/download/model-files-v1.0/dicta-1.0.int8.onnx \
    || echo "[setup] WARNING: nikud model download failed - Hebrew will be synthesised without nikud"
fi
python - <<'PY'
import importlib
for m in ("chatterbox", "dicta_onnx", "parselmouth", "jiwer", "soundfile", "whisper", "torch"):
    importlib.import_module(m)
import torch
print("[setup] deps ok | torch", torch.__version__, "| mps:", bool(getattr(torch.backends, "mps", None) and torch.backends.mps.is_available()))
PY
ls ref/prompt_*.wav >/dev/null 2>&1 || echo "[setup] NOTE: no ref/prompt_*.wav yet - run ./make_ref.sh \"<path to your recording.wav>\""
echo "[setup] done"
