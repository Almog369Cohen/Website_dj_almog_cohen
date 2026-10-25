import type { Metadata } from "next";
import { IS_PRODUCTION, brand, founders } from "@/content/site";
import type { PageMeta } from "@/content/routes";
import type { Guide } from "@/content/guides";
import type { FaqItem } from "@/content/faq";

/** A page goes to search only on the real domain, and only once nothing on it waits for REVER. */
export const indexable = (status: "draft" | "verified") => IS_PRODUCTION && status === "verified";

const abs = (path: string) => brand.url + path;
const ogImage = (photo?: string) => (photo ? `/images/${photo}.jpg` : "/images/og.jpg");

export function pageMetadata(m: Pick<PageMeta, "path" | "title" | "description" | "status" | "photo">, type: "website" | "article" = "website"): Metadata {
  const image = ogImage(m.photo);
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: m.path },
    robots: indexable(m.status) ? { index: true, follow: true } : { index: false, follow: true },
    // openGraph merges shallowly across layouts, so every page passes the whole object
    openGraph: { type, locale: "he_IL", url: m.path, siteName: brand.entity, title: m.title, description: m.description, images: [{ url: image, alt: m.title }] },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [image] },
  };
}

/* JSON-LD: one graph per page, linked by stable @ids. */
export const ids = {
  org: abs("/#organization"),
  site: abs("/#website"),
  person: (id: string) => abs(`/about/#${id}`),
};

export function orgGraph() {
  return [
    {
      "@type": "Organization",
      "@id": ids.org,
      name: brand.fullName,
      alternateName: [brand.nameHe, brand.entity],
      url: abs("/"),
      logo: abs("/images/logo.png"),
      description: "הפקת חתונות ואירועים בליווי מלא: לוקיישן וספקים, תקציב וחוזים, עיצוב וניהול יום האירוע.",
      sameAs: [brand.instagram],
      founder: founders.map((f) => ({ "@id": ids.person(f.id) })),
    },
    ...founders.map((f) => ({
      "@type": "Person",
      "@id": ids.person(f.id),
      name: f.name,
      jobTitle: "מייסד",
      worksFor: { "@id": ids.org },
      image: abs(`/images/${f.photo}.jpg`),
    })),
    { "@type": "WebSite", "@id": ids.site, url: abs("/"), name: brand.entity, inLanguage: "he", publisher: { "@id": ids.org } },
  ];
}

export type Crumb = { name: string; path: string };

export function pageGraph(path: string, name: string, crumbs: Crumb[], extra: object[] = []) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name, inLanguage: "he", isPartOf: { "@id": ids.site }, about: { "@id": ids.org }, breadcrumb: { "@id": `${url}#breadcrumb` } },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
      },
      ...extra,
    ],
  };
}

export function faqGraph(path: string, items: (FaqItem & { answer: string })[]) {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function articleGraph(g: Guide) {
  const url = abs(`/guides/${g.slug}/`);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: g.title,
    description: g.description,
    inLanguage: "he",
    datePublished: g.updated,
    dateModified: g.updated,
    image: abs(`/images/${g.photo}.jpg`),
    author: { "@id": ids.org },
    publisher: { "@id": ids.org },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    citation: g.sources.map((s) => s.url),
  };
}

export function serviceGraph() {
  return {
    "@type": "Service",
    "@id": abs("/wedding-production/#service"),
    name: "הפקת חתונה",
    serviceType: "הפקת חתונות",
    provider: { "@id": ids.org },
    description: "ליווי מלא: אפיון ועיצוב, לוקיישן וספקים, תקציב וחוזים, לו״ז לכל ספק, וניהול מלא של יום האירוע.",
    inLanguage: "he",
  };
}
