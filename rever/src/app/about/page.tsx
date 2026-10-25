import { pages } from "@/content/routes";
import { about, brand } from "@/content/site";
import { Founders } from "@/components/home";
import { CtaBand, Closing, PageHero } from "@/components/sections";
import { JsonLd, Pic } from "@/components/ui";
import { pageGraph, pageMetadata } from "@/lib/seo";

const m = pages.about;
export const metadata = pageMetadata(m);
const crumbs = [{ name: "בית", path: "/" }, { name: "גל וליאל", path: m.path }];

export default function About() {
  return (
    <>
      <main id="main" data-wa={m.wa}>
        <PageHero title="גל וליאל, המייסדים של REVER" answer={`גל וליאל הקימו את REVER, ומפיקים חתונות ואירועים כבר ${brand.years} שנים. הם אלה שעונים לכם בוואטסאפ, ואיתם צוות שעובד בשטח ביום האירוע.`} crumbs={crumbs} photo={m.photo} />
        <Founders intro={false} />
        <div className="page-body wrap">
          <div className="prose">
            <h2>מי אנחנו</h2>
            {about.map((p) => <p key={p}>{p}</p>)}
            <h2>הצוות בשטח</h2>
            <div className="reveal" style={{ aspectRatio: "3 / 2", margin: "8px 0 16px" }} data-reveal>
              <Pic name="team-day" alt="ארד מצוות REVER, עם תג צוות, ליד הזוג ביום החתונה בגן" sizes="(min-width: 760px) 720px, 92vw" />
            </div>
            <p>ביום האירוע הצוות שלנו בשטח, ליד הזוג. בתמונה: ארד מצוות REVER, עם תג הצוות.</p>
            <CtaBand />
          </div>
        </div>
      </main>
      <Closing />
      <JsonLd data={pageGraph(m.path, "גל וליאל, המייסדים", crumbs, [{ "@type": "AboutPage", "@id": `${brand.url}${m.path}#about`, name: "גל וליאל, המייסדים של REVER", about: { "@id": `${brand.url}/#organization` } }])} />
    </>
  );
}
