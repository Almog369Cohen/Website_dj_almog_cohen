import Link from "next/link";
import { notFound } from "next/navigation";
import { guideBySlug, guides } from "@/content/guides";
import { Blocks, CtaBand, Closing, PageHero, Sources } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { articleGraph, pageGraph, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return pageMetadata({ path: `/guides/${g.slug}/`, title: `${g.title} | ריבר הפקות`, description: g.description, status: g.status, photo: g.photo }, "article");
}

const date = (iso: string) => new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}/`;
  const crumbs = [{ name: "בית", path: "/" }, { name: "מדריכים", path: "/guides/" }, { name: g.title, path }];
  return (
    <>
      <main id="main" data-wa={`קראתי באתר את המדריך "${g.title}"`}>
        <PageHero title={g.title} answer={g.answer} crumbs={crumbs} photo={g.photo} cta={false} />
        <article className="page-body wrap">
          <div className="prose">
            <p className="updated">עודכן ב-<time dateTime={g.updated}>{date(g.updated)}</time> · נכתב על ידי צוות REVER</p>
            {g.sections.map((s) => (
              <section key={s.h2}>
                <h2>{s.h2}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            ))}
            <Sources sources={g.sources} />
            <div className="related" aria-label="מדריכים נוספים">
              {g.related.map((slug) => {
                const r = guideBySlug(slug);
                return r ? <Link key={slug} href={`/guides/${slug}/`}>{r.title}</Link> : null;
              })}
              <Link href="/wedding-production/">הפקת חתונה ב-REVER</Link>
            </div>
            <CtaBand />
          </div>
        </article>
      </main>
      <Closing />
      <JsonLd data={pageGraph(path, g.title, crumbs, [articleGraph(g)])} />
    </>
  );
}
