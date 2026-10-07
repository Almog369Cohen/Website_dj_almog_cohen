# אלמוג כהן – אתר תדמית חדש (almog.compaktt.com)

A separate, static one-page portfolio site for DJ Almog Cohen (weddings, couples, atmosphere),
built the same way as `academy-site/`: plain HTML + CSS + a little vanilla JS, no build step,
deployed to its own GCS bucket behind the existing compaktt.com load balancer.

It does **not** touch the existing site (`site/`, www.compaktt.com) or the academy
(`academy-site/`, school.compaktt.com). Live address once set up: **https://almog.compaktt.com**

## Sketch phase

Right now the folder holds three complete design sketches and a chooser page:

- `index.html` – chooser (noindex) linking the three sketches
- `sketch-1/` – **הלילה**: cinematic dark editorial, Karantina headlines, one amber accent,
  the night told moment by moment with a sticky photo that changes on scroll
- `sketch-2/` – **ההזמנה**: light paper, Hebrew serif (Frank Ruhl Libre), chuppah-arch photo
  frames, couples first, the WhatsApp messages as letters
- `sketch-3/` – **הרחבה**: brand blue→green neon on a blue-black floor, bento hero,
  horizontal atmosphere reel, the night as an LED energy meter

All three use the same content: copy from `site/src/app/weddings`, `site/src/app/about` and the
FAQ, real WhatsApp messages from couples (`assets/testimonials/`), WhatsApp number
`972502427616`, Instagram `@djalmogcohen`, the wedding video `yarUtbqD0BI` on YouTube.
Every sketch has a date-check form that opens WhatsApp with a prefilled message.

Once a direction is chosen, that sketch moves to `index.html`, the others are deleted, and
`sitemap.xml` / `robots.txt` are already in place for the root.

## Folders

- `assets/img/` – photos resized from `site/public/assets/...` and `Coder - 1/Media Almog/...`
  (1600px or 1200px long edge, plus `-800` variants for `srcset`), logos and icons
- `assets/testimonials/` – WhatsApp screenshots, resized
- `fonts/` – self-hosted Karantina and IBM Plex Sans Hebrew (OFL, from @fontsource; see
  `fonts/LICENSE-OFL.txt`). Sketches 2 and 3 load Frank Ruhl Libre / Assistant / Heebo from
  Google Fonts.

## Preview locally

```bash
cd almog-site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy (almog.compaktt.com)

One-time setup, from a machine with `gcloud` logged in to the compaktt project:

```bash
./scripts/setup-almog-subdomain.sh
```

It creates the `almog-compaktt-com` bucket, routes `almog.compaktt.com` through the existing
HTTPS load balancer, adds a managed SSL certificate, and prints the DNS record to add
(`A almog → <load balancer IP>`).

After that, every push to `main` that changes `almog-site/` deploys automatically
(`.github/workflows/almog-site-deploy.yml`). It can also be run by hand from the Actions tab.
Until the bucket exists the workflow only prints a warning.

To use a different address (for example `dj.compaktt.com`), change `HOST`, `BUCKET_NAME`,
`BACKEND_BUCKET_NAME`, `SSL_CERT_NAME` and the path-matcher name in the script, `BUCKET_NAME`
in the workflow, and the `og:url` / canonical URLs in the HTML.
