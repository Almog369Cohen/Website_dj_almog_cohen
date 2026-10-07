"""Shared helpers for the voice lab (item loading, Hebrew text normalisation, paths)."""
import json
import pathlib
import re
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent
REF_DIR = ROOT / "ref"
OUT_DIR = ROOT / "sketches"
MODELS_DIR = ROOT / "models"
LOG_DIR = ROOT / "logs"
MANIFEST = ROOT / "manifest.jsonl"
EVAL_JSON = ROOT / "eval.json"
CALIB_JSON = ROOT / "calibration.json"

NIKUD_RE = re.compile(r"[֑-ׇ]")
PUNCT_RE = re.compile(r"[^\w\s]", re.UNICODE)


def load_items(which: str = "all"):
    """Read tests.txt and scripts.txt. Lines: id|kind|text|note. Returns list of dicts."""
    files = []
    if which in ("all", "tests"):
        files.append(ROOT / "tests.txt")
    if which in ("all", "scripts"):
        files.append(ROOT / "scripts.txt")
    items = []
    for f in files:
        if not f.exists():
            continue
        for line in f.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split("|", 3)
            if len(parts) < 3:
                continue
            while len(parts) < 4:
                parts.append("")
            iid, kind, text, note = (p.strip() for p in parts)
            items.append(dict(id=iid, kind=kind, text=text, note=note))
    return items


def strip_nikud(text: str) -> str:
    return NIKUD_RE.sub("", unicodedata.normalize("NFC", text))


def normalize_for_cer(text: str) -> str:
    """Normalise Hebrew/English text so transcript vs. target comparison ignores nikud, punctuation and case."""
    t = strip_nikud(text).lower()
    t = t.replace("-", " ").replace("־", " ")
    t = PUNCT_RE.sub(" ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def read_manifest():
    rows = []
    if MANIFEST.exists():
        for line in MANIFEST.read_text(encoding="utf-8").splitlines():
            if line.strip():
                rows.append(json.loads(line))
    # keep the last record per path
    last = {}
    for r in rows:
        last[r["path"]] = r
    return list(last.values())


def append_manifest(row: dict):
    with MANIFEST.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def list_prompts():
    return sorted(p for p in REF_DIR.glob("prompt_*.wav"))


def ref_full():
    for name in ("ref_full_clean.wav", "ref_full.wav"):
        p = REF_DIR / name
        if p.exists():
            return p
    ps = list_prompts()
    return ps[0] if ps else None
