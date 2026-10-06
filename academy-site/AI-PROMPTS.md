# AI images for the opening motion ("מאפס לעמדה")

All imagery on the site is AI-generated: **hands and POV only, no faces, no logos, no Almog Cohen branding**.
The same text lives in Google Drive as `academy-ai/PROMPTS.txt`; generated images go into that
`academy-ai` folder and are pulled into `assets/zoom/` from there.

## Instruction for the image generator (Codex / "the brain")

Create the 16 images below: every station twice, vertical 9:16 (1080×1920) and horizontal 16:9
(1920×1080). Save each one as PNG in the Drive folder `academy-ai`, named exactly as listed.
Regenerate any image that comes out with text, a logo, a face or a malformed hand.

## Style (prepend to every prompt)

> Photorealistic first-person POV photo, seen through the eyes of a DJ student. Only hands and forearms
> appear, in a plain black long sleeve; no faces, no jewelry, no tattoos. Dark club studio lit by UV purple
> light (#8b6cff) with hot magenta accents (#ff4fd8) and near-black shadows (#0b0a12), light haze, shallow
> depth of field, cinematic 35mm look, natural skin tones. Generic unbranded DJ gear: no logos, no brand
> names, no readable text or numbers anywhere. When a hand is in the frame it enters from the bottom edge,
> and the fingertip sits at the horizontal centre, slightly below the vertical centre. One clear round shape
> (a light, button, ear cup, wheel or knob) sits near the centre of the frame.

Vertical files (`-p`) end with: *Vertical 9:16, 1080x1920.*
Horizontal files (`-l`) end with: *Horizontal 16:9, 1920x1080, the same scene with more room on the sides.*

## The 8 stations

| # | Files | Prompt |
|---|-------|--------|
| 1 | `01-shoes-p.png` · `01-shoes-l.png` | Looking straight down at my own black sneakers on a dark concrete studio floor, a few cables, the edge of a DJ desk at the top of the frame; a round pool of purple light on the floor just in front of the shoes. No hands. |
| 2 | `02-desk-p.png` · `02-desk-l.png` | Standing at a DJ desk looking down: an unbranded two-channel DJ controller, a closed laptop and a pair of headphones, everything switched off, only faint purple light from the side. No hands. |
| 3 | `03-power-p.png` · `03-power-l.png` | Close-up: an index finger presses a round power button on the DJ controller; the first LEDs light up purple and magenta in an otherwise dark room. |
| 4 | `04-headphones-p.png` · `04-headphones-l.png` | A hand lifts DJ headphones toward the lens; one large round ear cup faces the camera and fills the centre of the frame, purple rim light, background blurred. |
| 5 | `05-jog-p.png` · `05-jog-l.png` | Seen from straight above: a palm rests on a large round jog wheel, the ring around it glowing purple, the centre display lit. |
| 6 | `06-fader-p.png` · `06-fader-l.png` | Close-up: a finger pushes a channel fader mid-transition, LED level meters glowing purple to magenta, very shallow depth of field. |
| 7 | `07-eq-p.png` · `07-eq-l.png` | Macro: thumb and index finger turn a round EQ knob, level meters glowing softly behind it. |
| 8 | `08-crowd-p.png` · `08-crowd-l.png` | From behind the DJ booth at eye level: a hand raised toward a dancing crowd seen only as dark silhouettes from behind, UV purple light beams, haze, a round light at the centre. No faces. |

## Into the site

1. Download the folder's images to a scratch directory and check: right size, no text, logo or face.
2. Add each image and its circle to `tools/zoom-scenes.json` and run `python3 tools/zoom-crops.py`
   (WebP + JPG crops into `assets/zoom/`).
3. Fine-tune the circles with `#portal` on the local preview. The zoom engine caps the zoom at ×3.
