import Link from "next/link";
import { guides } from "@/content/guides";
import { pages } from "@/content/routes";
import { CtaBand, Closing, PageHero } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { pageGraph, pageMetadata } from "@/lib/seo";

const m = pages.guides;
export const metadata = pageMetadata(m);
const crumbs = [{ name: "בית", path: "/" }, { name: "מדריכים", path: m.path }];

export default function Guides() {
  return (
    <>
      <main id="main" data-wa={m.wa}>
        <PageHero title="מדריכים לתכנון חתונה" answer="תשובות ישירות לשאלות שזוגות שואלים אותנו, עם מקורות. כל מדריך נפתח בתשובה, ואחריה הפירוט." crumbs={crumbs} photo={m.photo} />
        <div className="page-body wrap">
          <div className="prose">
            <div className="related">
              {guides.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}/`}>{g.title}</Link>
              ))}
            </div>
            <CtaBand />
          </div>
        </div>
      </main>
      <Closing />
      <JsonLd data={pageGraph(m.path, "מדריכים", crumbs)} />
    </>
  );
}
