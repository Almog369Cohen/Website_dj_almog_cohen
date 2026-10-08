#!/usr/bin/env python3
"""Generate the AI images for the opening journey with Google's Gemini API (Imagen / Gemini image).

Reads the style block and the eight stations from AI-PROMPTS.md and writes, per station, a vertical
9:16 and a horizontal 16:9 PNG, named as in that file (01-shoes-p.png, 01-shoes-l.png, ...).
Then crop them with tools/zoom-crops.py.

Needs GEMINI_API_KEY in the environment (an API key from https://aistudio.google.com/apikey,
added in the environment settings, never in the code or the chat).

Usage (from academy-site/):
  python3 tools/gen-images.py --out ../ai-images            # all 16, skips files that exist
  python3 tools/gen-images.py --out ../ai-images --only 03 --force
  python3 tools/gen-images.py --list-models                 # image models this key can use
  python3 tools/gen-images.py --dry-run                     # print the prompts, call nothing
"""
import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
API = "https://generativelanguage.googleapis.com/v1beta"
FORMATS = {
    "p": ("9:16", "Vertical 9:16, 1080x1920."),
    "l": ("16:9", "Horizontal 16:9, 1920x1080, the same scene with more room on the sides."),
}
# Most realistic first; whichever of these the key can use wins unless --model is given
PREFERRED = ["imagen-4.0-ultra-generate", "imagen-4.0-generate", "imagen-4.0-fast-generate",
             "gemini-2.5-flash-image", "imagen-3.0-generate"]


def read_prompts():
    text = open(os.path.join(ROOT, "AI-PROMPTS.md"), encoding="utf-8").read()
    style_block = text.split("## Style", 1)[1].split("\n\n", 2)[1]
    style = " ".join(line.lstrip("> ").strip() for line in style_block.splitlines() if line.startswith(">"))
    stations = []
    for row in re.finditer(r"^\| (\d) \| `(\d\d-[a-z]+)-p\.png`.*?\| (.+?) \|$", text, re.M):
        stations.append({"num": row.group(1), "name": row.group(2), "prompt": row.group(3).strip()})
    if not style or len(stations) != 8:
        sys.exit("Could not read the style block and 8 stations from AI-PROMPTS.md")
    return style, stations


def call(method, path, key, body=None):
    req = urllib.request.Request(API + path, method=method, headers={"x-goog-api-key": key, "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:400]
            if e.code in (429, 500, 502, 503, 504) and attempt < 4:
                wait = 2 ** (attempt + 2)
                print(f"    {e.code}, retrying in {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            sys.exit(f"API error {e.code} on {path}: {detail}")


def image_models(key):
    out, token = [], ""
    while True:
        res = call("GET", "/models?pageSize=1000" + (f"&pageToken={token}" if token else ""), key)
        for m in res.get("models", []):
            name = m["name"].split("/", 1)[1]
            methods = m.get("supportedGenerationMethods", [])
            if ("imagen" in name and "predict" in methods) or ("image" in name and "generateContent" in methods):
                out.append(name)
        token = res.get("nextPageToken")
        if not token:
            return out


def pick_model(available):
    for pref in PREFERRED:
        hits = sorted(n for n in available if n.startswith(pref) and "preview" not in n) or \
               sorted(n for n in available if n.startswith(pref))
        if hits:
            return hits[-1]
    sys.exit("No image model available for this key. Models seen: " + ", ".join(available))


def generate(model, key, prompt, aspect):
    if model.startswith("imagen"):
        res = call("POST", f"/models/{model}:predict", key, {
            "instances": [{"prompt": prompt}],
            "parameters": {"sampleCount": 1, "aspectRatio": aspect, "personGeneration": "allow_adult"},
        })
        preds = res.get("predictions") or []
        if not preds or "bytesBase64Encoded" not in preds[0]:
            return None, json.dumps(res)[:300]
        return base64.b64decode(preds[0]["bytesBase64Encoded"]), None
    res = call("POST", f"/models/{model}:generateContent", key, {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}},
    })
    for cand in res.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            if "inlineData" in part:
                return base64.b64decode(part["inlineData"]["data"]), None
    return None, json.dumps(res)[:300]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default=os.path.join(ROOT, "..", "ai-images"), help="folder for the PNGs (default: ../ai-images)")
    ap.add_argument("--only", nargs="*", help="station numbers or names to make, e.g. 03 jog")
    ap.add_argument("--formats", default="pl", help="p, l or pl (default)")
    ap.add_argument("--model", help="model to use instead of the best available one")
    ap.add_argument("--force", action="store_true", help="overwrite images that already exist")
    ap.add_argument("--list-models", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    style, stations = read_prompts()
    if args.only:
        stations = [s for s in stations if any(o in (s["name"][:2], s["name"][3:], s["name"]) for o in args.only)]
    jobs = [(s, f) for s in stations for f in args.formats if f in FORMATS]

    if args.dry_run:
        for s, f in jobs:
            print(f"{s['name']}-{f}.png  [{FORMATS[f][0]}]\n  {style} {s['prompt']} {FORMATS[f][1]}\n")
        return

    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY is not set. Add it in the environment settings and start a new session.")
    available = image_models(key)
    if args.list_models:
        print("\n".join(available) or "(none)")
        return
    model = args.model or pick_model(available)
    os.makedirs(args.out, exist_ok=True)
    print(f"model: {model}, {len(jobs)} images -> {os.path.abspath(args.out)}", file=sys.stderr)
    failed = []
    for s, f in jobs:
        path = os.path.join(args.out, f"{s['name']}-{f}.png")
        if os.path.exists(path) and not args.force:
            print(f"  skip {os.path.basename(path)} (exists)", file=sys.stderr)
            continue
        data, why = generate(model, key, f"{style} {s['prompt']} {FORMATS[f][1]}", FORMATS[f][0])
        if data is None:
            print(f"  ! {os.path.basename(path)}: no image ({why})", file=sys.stderr)
            failed.append(os.path.basename(path))
            continue
        with open(path, "wb") as fh:
            fh.write(data)
        print(f"  {os.path.basename(path)}: {len(data) // 1024} KB", file=sys.stderr)
    if failed:
        sys.exit("No image for: " + ", ".join(failed))


if __name__ == "__main__":
    main()
