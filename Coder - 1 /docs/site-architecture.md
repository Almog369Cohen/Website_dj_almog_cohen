# Site Architecture (IA) & Content Plan v1

- **Routes**
  - /** – Homepage
    - Hero video/photo, headline + CTAs
    - Course preview
    - Testimonials (from IG)
    - Brands carousel
    - Events showcase (Weddings / After / Corporate)
    - Lead form
  - /courses – Courses & Mentorship
    - 3 tiers: Beginner (6,200₪ incl. controller+headphones), Advanced (10 lessons), Premium (10 lessons + 10 Mental Coaching)
    - Artist mentorship: 3m (4/mo), 6m (2/mo + Zoom)
    - CTA: Join the next course
  - /events – Events
    - Weddings, Bar/Bat Mitzvah, After/Private, Corporate
    - Emotional copy + video highlights + testimonials
    - CTA: Book your event
  - /rental – Equipment Rental
    - Controllers, speakers, lights, headphones
    - Free guide: "איך לבנות סטאפ דיג'יי מושלם" (PDF)
    - CTA: Request a quote
  - /about – About
    - Bio, brand logos/partners
    - Social carousel: YouTube | SoundCloud | Instagram | TikTok
  - /blog – Blog / Digital Content
    - Articles (tips, gear, playlists)
    - Wedding guides
    - Embedded videos (YouTube/Instagram)
    - Knowledge products (downloads, mini courses)
  - /contact – Contact
    - Simple form + WhatsApp floating button
    - Free gift: "5 טיפים לרחבה מושלמת"

- **Components**
  - Layout: Header/Nav (RTL), Footer, Mobile menu
  - UI: Button, Badge, Card, Carousel, Marquee, Testimonial, Form fields
  - Sections: Hero, Brands, Courses, Events, Testimonials, Lead form, IG feed

- **Content & data**
  - Blog: MDX via Contentlayer (or simple MDX) under /content/blog
  - Testimonials: JSON/MDX under /content/testimonials
  - Brands: /public/brands/*.svg
  - Downloads: /public/downloads/*.pdf

- **SEO & URLs**
  - Clean slugs: /courses /events /about /contact /rental /blog
  - Keywords: DJ for Weddings, DJ Course, DJ School, Artist Mentorship, DJ Equipment Rental, DJ Almog Cohen
  - Structured data: Organization, Person, Event, Course
  - OG images per page (generated)

- **Integrations**
  - Instagram: start with embed widget; consider Graph API later
  - Analytics: GA4 + Meta Pixel
  - Forms: connect to CRM (HubSpot/Airtable/Email)
  - WhatsApp: floating button with phone number

- **Accessibility & performance**
  - RTL-first, high-contrast theme
  - next/image, lazyload, prefetch routes, font optimization

- **Tech stack (proposed)**
  - Next.js (App Router) + TypeScript
  - Tailwind CSS + shadcn/ui
  - Contentlayer (blog) + MDX
  - Vercel hosting

- **Next steps**
  - Confirm stack, language (Hebrew-only or bilingual), CRM, analytics IDs, WhatsApp number
  - Scaffold project and implement global theme
  - Build Homepage and Courses pages first; then Events + Contact
