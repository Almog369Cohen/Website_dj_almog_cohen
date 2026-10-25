import Link from "next/link";
import { notFound } from "next/navigation";
import { eventBySlug, events } from "@/content/events";
import { brand } from "@/content/site";
import { EventsGallery } from "@/components/EventsGallery";
import { CtaBand, Closing, PageHero } from "@/components/sections";
import { JsonLd, Todo } from "@/components/ui";
import { pageGraph, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">) {
  const e = eventBySlug((await params).slug);
  if (!e) return {};
  return pageMetadata({ path: `/events/${e.slug}/`, title: `${e.title} | ריבר הפקות`, description: `${e.text} מהאירועים ש-REVER הפיקו.`, status: e.status, photo: e.photos[0].src });
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const e = eventBySlug((await params).slug);
  if (!e) notFound();
  const path = `/events/${e.slug}/`;
  const crumbs = [{ name: "בית", path: "/" }, { name: "אירועים", path: "/events/" }, { name: e.title, path }];
  const others = events.filter((x) => x.slug !== e.slug).slice(0, 3);
  return (
    <>
      <main id="main" data-wa={`ראיתי באתר את ${e.title}`}>
        <PageHero title={e.title} answer={e.text} crumbs={crumbs} photo={e.photos[0].src} />
        <div className="page-body wrap">
          <dl className="facts">
            <div><dt>המקום</dt><dd>{e.setting} <Todo>שם המקום</Todo></dd></div>
            <div><dt>מתי</dt><dd><Todo>חודש ושנה</Todo></dd></div>
            <div><dt>מה רואים</dt><dd>{e.highlights.join(" · ")}</dd></div>
            <div><dt>מה הזוג רצה</dt><dd><Todo>מ-REVER</Todo></dd></div>
            <div><dt>מה עשינו</dt><dd><Todo>מ-REVER</Todo></dd></div>
          </dl>
          <EventsGallery events={[e]} tabs={false} meta={false} />
          <div className="prose" style={{ marginTop: 64 }}>
            <h2>עוד אירועים</h2>
            <div className="related">
              {others.map((o) => <Link key={o.slug} href={`/events/${o.slug}/`}>{o.title}</Link>)}
            </div>
            <CtaBand title="רוצים ערב כזה?" />
          </div>
        </div>
      </main>
      <Closing />
      <JsonLd data={pageGraph(path, e.title, crumbs, [{ "@type": "ImageGallery", "@id": `${brand.url}${path}#gallery`, name: e.title, image: e.photos.map((p) => `${brand.url}/images/${p.src}.jpg`) }])} />
    </>
  );
}
