import { pages } from "@/content/routes";
import { brand } from "@/content/site";
import { Breadcrumbs, Closing, ContactSection } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { pageGraph, pageMetadata } from "@/lib/seo";

const m = pages.contact;
export const metadata = pageMetadata(m);
const crumbs = [{ name: "בית", path: "/" }, { name: "צור קשר", path: m.path }];

export default function Contact() {
  return (
    <>
      <main id="main" data-wa={m.wa} style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)" }}>
        <div className="wrap" style={{ paddingTop: 32 }}><Breadcrumbs crumbs={crumbs} /></div>
        <ContactSection headingLevel={1} />
      </main>
      <Closing />
      <JsonLd data={pageGraph(m.path, "צור קשר", crumbs, [{ "@type": "ContactPage", "@id": `${brand.url}${m.path}#contact` }])} />
    </>
  );
}
