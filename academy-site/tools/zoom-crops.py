#!/usr/bin/env python3
"""Make portrait (9:16) and landscape (16:9) crops for the zoom journey.

Reads tools/zoom-scenes.json, writes WebP + JPG into assets/zoom/, and prints the
data attributes to paste on each scene in index.html. Each crop is centred on the
scene's portal circle (or its focus point) so the circle survives both crops.

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
        src = os.path.join(ROOT, sc["src"])
        sw, sh = size(src)
        px, py, pr = sc.get("portal", [None, None, None])
        fx, fy = (px, py) if px is not None else sc["focus"]
        attrs = []
        for name, aspect, max_w in (("portrait", 9 / 16, 1080), ("landscape", 16 / 9, 1920)):
            x, y, cw, ch = crop_box(sw, sh, aspect, fx, fy)
            ow = min(cw, max_w)
            oh = round(ow * ch / cw)
            base = os.path.join(out_dir, f"{sc['id']}-{name}")
            common = ["convert", src + "[0]", "-auto-orient", "-crop", f"{cw}x{ch}+{x}+{y}", "+repage",
                      "-resize", f"{ow}x{oh}!", "-strip"]
            subprocess.check_call(common + ["-quality", "76", base + ".webp"])
            subprocess.check_call(common + ["-interlace", "Plane", "-quality", "78", base + ".jpg"])
            key = "p" if name == "portrait" else "l"
            attrs.append(f'data-size-{key}="{ow},{oh}"')
            if px is not None:
                nx, ny, nr = (px - x) / cw, (py - y) / ch, pr / cw
                inside = pr <= px - x <= cw - pr and pr <= py - y <= ch - pr
                if not inside:
                    print(f"  ! {sc['id']} {name}: portal touches the crop edge", file=sys.stderr)
                attrs.append(f'data-portal-{key}="{nx:.4f},{ny:.4f},{nr:.4f}"')
            kb = os.path.getsize(base + ".webp") // 1024
            print(f"  {sc['id']}-{name}: {ow}x{oh}, {kb} KB webp", file=sys.stderr)
        print(f"{sc['id']}: " + " ".join(attrs))


if __name__ == "__main__":
    main()
