# Compaktt School – standalone academy site

A separate one-page site for the DJ school, split out from the `/academy` section of the
main site (`site/`, www.compaktt.com). The academy is its own brand: no Almog Cohen logo, colours
or event photos here; Almog appears only as the teacher. Live address: **https://school.compaktt.com**

- `index.html` – the whole site (HTML + CSS + a small vanilla JS script, no build step)
- `journey.js` – the opening motion: the heading's vinyl 0 becomes a record window that plays eight
  stations from the shoes to the booth, then opens onto the three tracks
- `scenes.js` – station drawings in code, used only for a station without a photo
- `club-audio.js` – club mode sound: a house loop synthesised with WebAudio that the scroll builds up, and
  the pads of the playable booth
- `club-gl.js` – club mode WebGL, built from `tools/gl/` (three.js, tree-shaken): the stations in a shader,
  the 3D booth in the hero, and the playable booth ("נגנו עכשיו"). Do not edit it by hand: change
  `tools/gl/*.js` and run `sh tools/build-gl.sh`
- `assets/` – the student audio recording; AI image crops for the stations go to `assets/zoom/`
- `fonts/` – self-hosted Karantina, IBM Plex Sans Hebrew and IBM Plex Mono (OFL, from @fontsource)
- `tools/` – `gen-images.py` (makes the AI images), `zoom-crops.py` + `zoom-scenes.json` (crops them),
  `gl/` + `build-gl.sh` (sources of `club-gl.js`); not deployed
- `AI-PROMPTS.md` – prompts for the AI images of the journey (not deployed)
- `vendor/` – GSAP 3.15 + ScrollTrigger (scroll animations) and Lenis 1.3 (smooth scrolling),
  copied from npm so the site has no CDN dependency
- `robots.txt`, `sitemap.xml`

Content (tracks, prices, FAQ, bio) is taken from `site/src/app/academy/page.tsx`,
`site/src/components/sections/FAQSection.tsx` and `site/src/app/about/page.tsx`.
When prices change, update both places.

## Opening motion

Motion D, "the record window" (`journey.js`), picked from the four sketches
(https://claude.ai/artifact/FkbCvgBSeyAY2T8296nEtg). The vinyl 0 in "מ-0 לעמדה." grows into a
round window; scrolling plays eight stations inside it (shoes, desk, power, headphones, jog, fader,
EQ, booth), each sweeping in like a tonearm over a label while the record turns. At the last station
the window opens to the full screen with the three tracks. The palette is UV purple, the academy's
own. With reduced motion, or without JS, only the static heading shows.

The stations are photos: eight AI images made with Codex (real DJ gear, the student's POV, UV light),
kept in the Drive folder `academy-ai` and cropped into `assets/zoom/`. `scenes.js` draws a station in
code only when its `.jr-scene` has no image. To swap one:

1. Make it with the prompts in `AI-PROMPTS.md` (Codex via the Drive folder `academy-ai`, or
   `python3 tools/gen-images.py` with Google's Gemini API, which needs `GEMINI_API_KEY` in the environment).
2. Download it to `../ai-images/`, set its entry in `tools/zoom-scenes.json` with its focus circle (the round
   thing that sits in the window, in source pixels) and run `python3 tools/zoom-crops.py`.
3. Paste the printed `data-src-p`, `data-size-p` and `data-focus-p` attributes on the matching
   `.jr-scene` in `index.html`. Wide screens use the same portrait image unless a station also has a 16:9
   one (`src_l` / `focus_l`). The window frames the same part of the photo on every screen size.
   `assets/` is cached for a week, so add `?v=2` to a replaced image's `data-src-p`.

## Club mode

On top of the journey, when the browser allows it:

- **Sound** (`club-audio.js`), only after a tap on "להיכנס עם סאונד" or the header button. A 124 BPM
  loop, synthesised (no samples, nothing licensed). The scroll builds it: a muffled pad outside, the
  filter opening as you walk in, the kick at "לוחצים פליי", hats and the next track in the left ear at
  the headphones, scratches on fast scrolls over the jog, bass at the fader, a high-pass build at EQ
  and the drop with the crowd at the booth. Past the opening it keeps playing quietly until muted.
  Hidden with reduced motion.
- **WebGL stage** (`club-gl.js`, WebGL 2): the same journey drawn by one shader, with a liquid sweep
  and light trail, a slow dolly in every station, chromatic split on fast scrolls, pointer and tilt
  parallax, a push on every beat, light leaks and grain. It reads `window.AcademyJourney.state`
  from `journey.js`; if WebGL 2 is missing, the photos don't load or the device is too slow, the CSS
  version stays.
- **3D booth**: a generic two-deck controller built from primitives (no model files, no brand). In the
  hero it turns under the heading (drag to turn it); on scroll the camera dives into the left jog,
  whose platter lands on the record window and becomes it.
- **"נגנו עכשיו"**: the booth again, playable: eight pads (also keys 1–8), a jog that scratches when
  dragged, and a button for the beat. Without WebGL the HTML pads still play.

## Scroll motion

All animation code is in `initMotion()` at the bottom of `index.html`:
word-by-word headings, photo reveals and parallax, LED meters and prices that
count up, and a progress bar under the header. Visitors with "reduce motion" turned on
get the static page, and the page still works if the scripts fail to load.

## Preview locally

```bash
cd academy-site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy (school.compaktt.com)

One-time setup, from a machine with `gcloud` logged in to the compaktt project:

```bash
./scripts/setup-school-subdomain.sh
```

It creates the `school-compaktt-com` bucket, routes `school.compaktt.com` through the
existing HTTPS load balancer, adds a managed SSL certificate, and prints the DNS
record to add (`A school → <load balancer IP>`).

After that, every push to `main` that changes `academy-site/` deploys automatically
(`.github/workflows/academy-site-deploy.yml`). It can also be run by hand from the
Actions tab. Until the bucket exists the workflow only prints a warning.

WhatsApp number used for all buttons: `972502427616` (set in the script at the
bottom of `index.html`).
