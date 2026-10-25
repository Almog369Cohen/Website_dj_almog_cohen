import Link from "next/link";
import { pages } from "@/content/routes";
import { includes, steps } from "@/content/site";
import { verifiedFaq } from "@/content/faq";
import { CtaBand, Closing, FaqList, PageHero } from "@/components/sections";
import { JsonLd, Pic } from "@/components/ui";
import { faqGraph, pageGraph, pageMetadata, serviceGraph } from "@/lib/seo";

const m = pages.weddingProduction;
export const metadata = pageMetadata(m);
const crumbs = [{ name: "בית", path: "/" }, { name: "הפקת חתונה", path: m.path }];

export default function WeddingProduction() {
  return (
    <>
      <main id="main" data-wa={m.wa}>
        <PageHero
          title="הפקת חתונה, מהפגישה הראשונה ועד השיר האחרון"
          answer="הפקת חתונה ב-REVER היא ליווי מלא: אפיון ועיצוב, לוקיישן וספקים, תקציב וחוזים, לו״ז לכל ספק, וניהול של יום החתונה עצמו. אתם מתרגשים מהאירוע, אנחנו דואגים לכל מה שמסביב."
          crumbs={crumbs}
          photo={m.photo}
        />
        <div className="page-body wrap">
          <div className="prose">
            <h2>מה כולל הליווי?</h2>
            <ul>{includes.map((i) => <li key={i}>{i}</li>)}</ul>
            <h2>מה נשאר אצלכם, ומה אצלנו?</h2>
            <p>בכל שלב יש משהו שהיה נשאר על השולחן שלכם, ומשהו שאנחנו לוקחים.</p>
            <div className="tbl">
              <table>
                <thead><tr><th scope="col">שלב</th><th scope="col">על השולחן שלכם</th><th scope="col">אצלנו</th></tr></thead>
                <tbody>{steps.map((s) => <tr key={s.id}><th scope="row">{s.title}</th><td>{s.yours}</td><td>{s.ours}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
          {steps.map((s) => (
            <section key={s.id} className="prose" style={{ marginTop: 56 }}>
              <h2>{s.title}</h2>
              <div className="reveal" style={{ aspectRatio: "16 / 10", margin: "8px 0 20px" }} data-reveal>
                <Pic name={s.photo} alt={s.alt} sizes="(min-width: 760px) 720px, 92vw" />
              </div>
              <p>{s.text}</p>
            </section>
          ))}
          <div className="prose" style={{ marginTop: 56 }}>
            <h2>מה כדאי לקרוא לפני שמחליטים?</h2>
            <div className="related">
              <Link href="/guides/what-a-wedding-producer-does/">מה עושה מפיקת חתונות, ומה לא?</Link>
              <Link href="/guides/wedding-day-schedule/">איך נראה לו״ז של יום חתונה?</Link>
              <Link href="/events/">אירועים שהפקנו</Link>
            </div>
            <CtaBand />
          </div>
        </div>
        <FaqList />
      </main>
      <Closing />
      <JsonLd data={pageGraph(m.path, "הפקת חתונה", crumbs, [serviceGraph(), faqGraph(m.path, verifiedFaq)])} />
    </>
  );
}
