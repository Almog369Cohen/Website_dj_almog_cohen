"""Generate atmospheric stage-light placeholder photos for the Rever site."""
import math, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1]

def scene(name, w, h, seed, base, beams, accent, crowd=True, bokeh=60, horizon=0.78):
    rnd = random.Random(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # vertical gradient background
    t = yy / h
    img = np.zeros((h, w, 3), np.float32)
    top, bottom = np.array(base[0], np.float32), np.array(base[1], np.float32)
    for c in range(3):
        img[..., c] = top[c] * (1 - t) + bottom[c] * t
    # light beams from top sources
    for i in range(beams):
        sx = w * (0.08 + 0.84 * rnd.random())
        ang = math.radians(rnd.uniform(-35, 35))
        width = rnd.uniform(0.015, 0.05)
        col = np.array(accent[i % len(accent)], np.float32)
        dx, dy = math.sin(ang), math.cos(ang)
        px, py = xx - sx, yy + h * 0.02
        along = px * dx + py * dy
        perp = np.abs(px * dy - py * dx)
        spread = width * np.maximum(along, 1) + 4
        inten = np.exp(-(perp / spread) ** 2) * np.clip(along / h, 0, 1) ** 0.3 * np.exp(-along / (h * 1.4))
        img += inten[..., None] * col * rnd.uniform(0.35, 0.7)
    # stage glow at horizon
    gx = w * rnd.uniform(0.35, 0.65)
    glow = np.exp(-(((xx - gx) / (w * 0.35)) ** 2 + ((yy - h * horizon) / (h * 0.18)) ** 2))
    img += glow[..., None] * np.array(accent[0], np.float32) * 0.55
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    # haze
    im = im.filter(ImageFilter.GaussianBlur(6))
    # bokeh
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(bokeh):
        r = rnd.uniform(4, 28) * w / 1600
        x, y = rnd.uniform(0, w), rnd.uniform(0, h * horizon)
        c = accent[rnd.randrange(len(accent))]
        d.ellipse([x - r, y - r, x + r, y + r], fill=(c[0], c[1], c[2], rnd.randint(40, 120)))
    layer = layer.filter(ImageFilter.GaussianBlur(2))
    im = Image.alpha_composite(im.convert("RGBA"), layer)
    # crowd silhouette
    if crowd:
        sil = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(sil)
        x = -20
        while x < w + 40:
            hr = rnd.uniform(0.022, 0.034) * w
            cy = h * horizon + rnd.uniform(0.02, 0.12) * h
            d.ellipse([x, cy - hr, x + hr * 1.6, cy + hr], fill=(6, 5, 8, 255))
            d.rectangle([x - hr * 0.6, cy + hr * 0.6, x + hr * 2.2, h], fill=(6, 5, 8, 255))
            if rnd.random() < 0.18:  # raised hand
                hx = x + hr * 0.8
                d.line([hx, cy, hx + rnd.uniform(-30, 30), cy - hr * 4.5], fill=(6, 5, 8, 255), width=int(hr * 0.45))
            x += hr * rnd.uniform(1.2, 1.9)
        sil = sil.filter(ImageFilter.GaussianBlur(1.5))
        im = Image.alpha_composite(im, sil)
    # vignette + grain
    arr = np.asarray(im.convert("RGB")).astype(np.float32)
    v = 1 - 0.55 * (((xx - w / 2) / (w / 1.3)) ** 2 + ((yy - h / 2) / (h / 1.2)) ** 2)
    arr *= np.clip(v, 0.25, 1)[..., None]
    arr += np.random.default_rng(seed).normal(0, 4, arr.shape)
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(f"{OUT}/{name}.jpg", quality=82, optimize=True, progressive=True)
    print(name, w, h)

GOLD = [(255, 196, 110), (255, 220, 160), (240, 170, 80)]
WARM = [(255, 180, 90), (255, 140, 70), (255, 225, 170)]
COOL = [(120, 170, 255), (255, 200, 120), (170, 120, 255)]
PARTY = [(255, 80, 200), (90, 160, 255), (255, 200, 90)]

scene("hero-1", 2400, 1350, 1, [(8, 6, 10), (30, 18, 10)], 9, GOLD)
scene("hero-2", 2400, 1350, 2, [(10, 6, 8), (40, 20, 12)], 12, WARM)
scene("hero-3", 2400, 1350, 3, [(6, 8, 18), (16, 14, 30)], 10, COOL)
scene("weddings", 1600, 1200, 4, [(14, 10, 8), (44, 30, 18)], 6, GOLD, bokeh=140)
scene("corporate", 1600, 1200, 5, [(6, 8, 18), (14, 18, 36)], 8, COOL, bokeh=30)
scene("bar-mitzvah", 1600, 1200, 6, [(10, 4, 16), (24, 8, 30)], 14, PARTY, bokeh=90)
scene("private", 1600, 1200, 7, [(12, 6, 6), (36, 16, 10)], 11, WARM, bokeh=80)
scene("design", 1600, 1200, 8, [(10, 10, 8), (30, 26, 16)], 4, GOLD, crowd=False, bokeh=220, horizon=0.85)
scene("stage", 1600, 1200, 9, [(6, 6, 8), (26, 18, 10)], 16, GOLD, bokeh=50)
scene("about", 1600, 2000, 10, [(10, 8, 8), (34, 22, 14)], 7, WARM, bokeh=100)
scene("zoom-feature", 2400, 1500, 11, [(8, 6, 6), (36, 22, 12)], 13, GOLD, bokeh=120)
scene("og", 1200, 630, 12, [(8, 6, 10), (30, 18, 10)], 9, GOLD)
