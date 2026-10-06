# Compaktt School – standalone academy site

A separate one-page site for Almog Cohen's DJ school, split out from the `/academy`
section of the main site (`site/`, www.compaktt.com). Live address: **https://school.compaktt.com**

- `index.html` – the whole site (HTML + CSS + a small vanilla JS script, no build step)
- `assets/` – optimized photos, logo and the student audio recording
- `vendor/` – GSAP 3.15 + ScrollTrigger (scroll animations) and Lenis 1.3 (smooth scrolling),
  copied from npm so the site has no CDN dependency
- `robots.txt`, `sitemap.xml`

Content (tracks, prices, FAQ, bio) is taken from `site/src/app/academy/page.tsx`,
`site/src/components/sections/FAQSection.tsx` and `site/src/app/about/page.tsx`.
When prices change, update both places.

## Scroll motion

All animation code is in `initMotion()` at the bottom of `index.html`:
hero intro, word-by-word headings, a statement that lights up while scrolling,
photo parallax, a scroll-linked ticker, LED meters and prices that count up,
and a progress bar under the header. Visitors with "reduce motion" turned on
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
