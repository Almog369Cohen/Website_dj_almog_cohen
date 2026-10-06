# Compaktt School – standalone academy site

A separate one-page site for the DJ school, split out from the `/academy` section of the
main site (`site/`, www.compaktt.com). The academy is its own brand: no Almog Cohen logo, colours
or event photos here; Almog appears only as the teacher. Live address: **https://school.compaktt.com**

- `index.html` – the whole site (HTML + CSS + a small vanilla JS script, no build step)
- `zoom.js` – the zoom-into-circles engine (motion option C); not loaded while the hero is interim
- `assets/` – the student audio recording; journey crops go to `assets/zoom/` once the AI images exist
- `fonts/` – self-hosted Karantina, IBM Plex Sans Hebrew and IBM Plex Mono (OFL, from @fontsource)
- `tools/` – `zoom-crops.py` + `zoom-scenes.json` for making journey crops (not deployed)
- `AI-PROMPTS.md` – prompts for the AI images of the journey (not deployed)
- `vendor/` – GSAP 3.15 + ScrollTrigger (scroll animations) and Lenis 1.3 (smooth scrolling),
  copied from npm so the site has no CDN dependency
- `robots.txt`, `sitemap.xml`

Content (tracks, prices, FAQ, bio) is taken from `site/src/app/academy/page.tsx`,
`site/src/components/sections/FAQSection.tsx` and `site/src/app/about/page.tsx`.
When prices change, update both places.

## Opening motion

The page currently opens with a static, brand-neutral hero ("מ-0 לעמדה." with the vinyl 0).
The scroll motion that replaces it is being chosen from four sketches: A "the hand leads",
B "scroll is the crossfader", C "dive into the circle" (`zoom.js`), D "the record window".
The sketches (videos + pick): https://claude.ai/artifact/FkbCvgBSeyAY2T8296nEtg
The interactive motion lab: https://claude.ai/artifact/NGKJeiZCkebMDcwMvDyiMR

All imagery is AI-generated (hands and POV only, UV purple). The prompts are in `AI-PROMPTS.md`
and in the Google Drive folder `academy-ai` (`PROMPTS.txt`); the generated images are saved to
that folder and pulled into the site from there.

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
