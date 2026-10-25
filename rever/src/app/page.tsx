import { events } from "@/content/events";
import { verifiedFaq } from "@/content/faq";
import { SHOW_TODO } from "@/content/site";
import { EventsGallery } from "@/components/EventsGallery";
import { FromField, Hero, How, journeyPreload, PaperChapter, Team } from "@/components/home";
import { Closing, ContactSection, FaqList } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { faqGraph, pageGraph } from "@/lib/seo";

export default function Home() {
  // the first stage of the journey is the first thing on screen: fetch exactly the file the page will pick
  const lcp = journeyPreload();
  return (
    <>
      {/* React moves these to the head; each only applies on its own screen shape, so one file is fetched */}
      {lcp.phone && <link rel="preload" as="image" href={lcp.phone} media="(max-aspect-ratio: 3/4)" fetchPriority="high" />}
      <link rel="preload" as="image" href={lcp.href} imageSrcSet={lcp.wide.srcSet} imageSizes={lcp.wide.sizes} media={lcp.phone ? "(min-aspect-ratio: 3/4)" : undefined} fetchPriority="high" />
      <main id="main" data-wa="">
        <Hero />
        <PaperChapter />
        <How />
        <Team />
        <section className="events wrap" id="events" data-tone="paper" aria-labelledby="eventsTitle">
          <div className="kicker">אירועים</div>
          <h2 id="eventsTitle">אירועים שהפקנו.</h2>
          <EventsGallery events={events} />
        </section>
        {SHOW_TODO && <FromField />}
        <FaqList />
        <ContactSection />
      </main>
      <Closing photo />
      <JsonLd data={pageGraph("/", "ריבר הפקות", [{ name: "בית", path: "/" }], [faqGraph("/", verifiedFaq)])} />
    </>
  );
}
