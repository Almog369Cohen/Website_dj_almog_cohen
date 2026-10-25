import { verifiedFaq } from "@/content/faq";
import { pages } from "@/content/routes";
import { Breadcrumbs, Closing, FaqList } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { faqGraph, pageGraph, pageMetadata } from "@/lib/seo";

const m = pages.faq;
export const metadata = pageMetadata(m);
const crumbs = [{ name: "בית", path: "/" }, { name: "שאלות נפוצות", path: m.path }];

export default function Faq() {
  return (
    <>
      <main id="main" data-wa={m.wa} style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)" }}>
        <div className="wrap" style={{ paddingTop: 32 }}><Breadcrumbs crumbs={crumbs} /></div>
        <FaqList title="שאלות נפוצות על הפקת חתונה" headingLevel={1} />
      </main>
      <Closing />
      <JsonLd data={pageGraph(m.path, "שאלות נפוצות", crumbs, [faqGraph(m.path, verifiedFaq)])} />
    </>
  );
}
