#!/usr/bin/env python3
"""Make the WebP crops of the AI images for the opening journey.

Reads tools/zoom-scenes.json, writes WebP into assets/zoom/, and prints the data attributes
to paste on each .jr-scene in index.html (journey.js then shows the image instead of the
drawing). Each crop is centred on the scene's focus circle, the round thing that sits in
the record window. Every scene gets a portrait (9:16) crop; a landscape (16:9) one only when
the scene has its own wide image (src_l), otherwise wide screens use the portrait one.

Usage (from academy-site/):  python3 tools/zoom-crops.py
Needs ImageMagick (`convert`, `identify`).
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def size(path):
    out = subprocess.check_output(["identify", "-format", "%w %h", path + "[0]"]).decode()
    w, h = out.split()
    return int(w), int(h)


def crop_box(sw, sh, aspect, cx, cy):
    """Largest crop of the given aspect (w/h), centred on (cx, cy) as far as the edges allow."""
    if sw / sh > aspect:
        ch, cw = sh, round(sh * aspect)
    else:
        cw, ch = sw, round(sw / aspect)
    x = min(max(round(cx - cw / 2), 0), sw - cw)
    y = min(max(round(cy - ch / 2), 0), sh - ch)
    return x, y, cw, ch


def main():
    cfg = json.load(open(os.path.join(HERE, "zoom-scenes.json")))
    out_dir = os.path.join(ROOT, cfg["out"])
    os.makedirs(out_dir, exist_ok=True)
    for sc in cfg["scenes"]:
        attrs = []
        formats = [("portrait", 9 / 16, 1080)] + ([("landscape", 16 / 9, 1920)] if "src_l" in sc else [])
        for name, aspect, max_w in formats:
            wide = name == "landscape"
            src = os.path.join(ROOT, sc["src_l"] if wide else sc["src"])
            px, py, pr = sc["focus_l"] if wide else sc["focus"]
            sw, sh = size(src)
            x, y, cw, ch = crop_box(sw, sh, aspect, px, py)
            ow = min(cw, max_w)
            oh = round(ow * ch / cw)
            base = os.path.join(out_dir, f"{sc['id']}-{name}")
            common = ["convert", src + "[0]", "-auto-orient", "-crop", f"{cw}x{ch}+{x}+{y}", "+repage",
                      "-resize", f"{ow}x{oh}!", "-strip"]
            subprocess.check_call(common + ["-quality", "78", base + ".webp"])
            key = "p" if name == "portrait" else "l"
            attrs.append(f'data-src-{key}="{cfg["out"]}/{sc["id"]}-{name}.webp"')
            attrs.append(f'data-size-{key}="{ow},{oh}"')
            nx, ny, nr = (px - x) / cw, (py - y) / ch, pr / cw
            if not (pr <= px - x <= cw - pr and pr <= py - y <= ch - pr):
                print(f"  ! {sc['id']} {name}: the focus circle touches the crop edge", file=sys.stderr)
            attrs.append(f'data-focus-{key}="{nx:.4f},{ny:.4f},{nr:.4f}"')
            kb = os.path.getsize(base + ".webp") // 1024
            print(f"  {sc['id']}-{name}: {ow}x{oh}, {kb} KB webp", file=sys.stderr)
        print(f"{sc['id']}: " + " ".join(attrs))


if __name__ == "__main__":
    main()
