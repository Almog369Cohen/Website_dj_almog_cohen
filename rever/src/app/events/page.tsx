import Link from "next/link";
import { events } from "@/content/events";
import { pages } from "@/content/routes";
import { brand } from "@/content/site";
import { CtaBand, Closing, PageHero } from "@/components/sections";
import { JsonLd, Pic } from "@/components/ui";
import { pageGraph, pageMetadata } from "@/lib/seo";

const m = pages.events;
export const metadata = pageMetadata(m);
const crumbs = [{ name: "בית", path: "/" }, { name: "אירועים", path: m.path }];

export default function Events() {
  return (
    <>
      <main id="main" data-wa={m.wa}>
        <PageHero
          title="חתונות ואירועים שהפקנו"
          answer="חמישה אירועים אמיתיים מהתמונות של REVER: חתונת גן בחצר אבן, חתונה בערב השנה החדשה, עמדת DJ בצורת לוטוס, מופע במה עם להקה חיה, ורגעים של זוגות."
          crumbs={crumbs}
          photo={m.photo}
        />
        <div className="page-body wrap">
          <div className="cards">
            {events.map((e) => (
              <Link key={e.slug} className="ev-card" href={`/events/${e.slug}/`}>
                <div className="ph"><Pic name={e.photos[0].src} alt={e.photos[0].alt} sizes="(min-width: 900px) 45vw, 92vw" /></div>
                <h2>{e.title}</h2>
                <p>{e.text}</p>
              </Link>
            ))}
          </div>
          <CtaBand title="רוצים ערב כזה?" />
        </div>
      </main>
      <Closing />
      <JsonLd data={pageGraph(m.path, "אירועים שהפקנו", crumbs, [{ "@type": "CollectionPage", "@id": `${brand.url}${m.path}#collection`, name: "אירועים שהפקנו", hasPart: events.map((e) => ({ "@type": "ImageGallery", name: e.title, url: `${brand.url}/events/${e.slug}/` })) }])} />
    </>
  );
}
