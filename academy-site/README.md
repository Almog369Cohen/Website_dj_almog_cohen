# Compaktt School – standalone academy site

A separate one-page site for Almog Cohen's DJ school, split out from the `/academy`
section of the main site (`site/`, www.compaktt.com).

- `index.html` – the whole site (HTML + CSS + a small vanilla JS script, no build step)
- `assets/` – optimized photos, logo and the student audio recording

Content (tracks, prices, FAQ, bio) is taken from `site/src/app/academy/page.tsx`,
`site/src/components/sections/FAQSection.tsx` and `site/src/app/about/page.tsx`.
When prices change, update both places.

## Preview locally

```bash
cd academy-site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Any static host works (GCS bucket like the main site, Netlify, Cloudflare Pages).
Upload the contents of this folder as-is. A dedicated domain or subdomain
(e.g. `school.compaktt.com`) still needs to be chosen and pointed at the host.

WhatsApp number used for all buttons: `972502427616` (set in the script at the
bottom of `index.html`).
