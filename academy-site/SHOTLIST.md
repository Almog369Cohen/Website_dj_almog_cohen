# Shot list: "מ-0 לעמדה" zoom journey

The opener zooms through a chain of photos, seen from the student's eyes, from their shoes on
the floor to the booth in front of a crowd. **Every photo ends in a circle** (logo, ear cup, jog
wheel, knob, spotlight). Scrolling grows the circle until it opens into the next photo, so the
circle's position and sharpness matter most.

Visual version with the circles marked: https://claude.ai/artifact/HjaSF3MsyWmbRynmobkCBz

## Rules for every shot
- The circle is in sharp focus, 8–20% of the frame width, away from the edges.
- Shoot both portrait (9:16) and landscape (16:9), or one wide frame of 4000px+ that can be cut both ways.
- Same mood throughout: dark club, teal/blue/purple light, the same booth, Pioneer gear and outfit.
- POV: the camera is the eyes of whoever stands in the booth. No identifiable faces except the crowd and the last shot.

## Stations

| # | Station | What we see | The circle | Angle | Status |
|---|---------|-------------|-----------|-------|--------|
| 0 | מ-0 | Black screen, "מ-0 לעמדה." The 0 is a spinning record | Record label | Built in code | ✅ |
| 1 | Shoes | Looking straight down at sneakers on the stage floor, cables, edge of the booth | Round floor light or speaker woofer | POV from chest height, 24mm | ❌ shoot |
| 2 | Booth | Empty dance floor, the booth ahead with the lit logo | Round AC logo on the booth | Eye level, 35mm, empty booth | 🟡 `djavira/dj-booth.jpg` |
| 3 | Headphones | Headphones on the booth or hands putting them on | Ear cup facing the camera, large | Close, 50mm/macro | 🟡 `djavira/dj-almog.jpg` (cup too small) |
| 4 | Jog | Top-down on the Pioneer jog, centre display lit | Jog centre ring | Straight down, 35–50mm | 🟡 old hero photo (angled) |
| 5 | Mixer | Hand on the fader mid-transition, EQ knobs, meters lit | A large EQ/FX knob | Macro, shallow depth | ❌ shoot |
| 6 | Crowd from the booth | Decks at the bottom, crowd with hands up beyond | Spotlight lens or round lamp mid-frame | DJ eye level, wide, no DJ back in frame | 🟡 `almog/corporate-1.jpg` |
| 7 | לעמדה. | Wide: student/Almog at the booth, hands up, full crowd | none (last) | From the floor | ✅ `almog/ידיים של מלך…jpg` |

The current build uses the 🟡/✅ photos as stand-ins, in this order: 0 → booth → headphones →
crowd from the booth (circle: the jog on the laptop screen) → jog → לעמדה.

Optional upgrade: a continuous 10–15s POV video (walk in, reach the booth, put on headphones,
hands on the decks, look up at the crowd), gimbal/stabilised, 4K 60fps, slow steady movement.

## Swapping in new photos
1. Add the photo and its circle (in source pixels) to `tools/zoom-scenes.json`.
2. Run `python3 tools/zoom-crops.py` from `academy-site/`. It writes the crops to `assets/zoom/` and
   prints the `data-size-*` / `data-portal-*` attributes for the scene in `index.html`.
3. Fine-tune by opening the page with `#portal`: click the centre of the circle, drag to its edge,
   copy the attribute.
