import { preload } from "react-dom";
import { events } from "@/content/events";
import { verifiedFaq } from "@/content/faq";
import { SHOW_TODO } from "@/content/site";
import { EventsGallery } from "@/components/EventsGallery";
import { FromField, Hero, How, Night, PaperChapter, Team } from "@/components/home";
import { Closing, ContactSection, FaqList } from "@/components/sections";
import { JsonLd } from "@/components/ui";
import { faqGraph, pageGraph } from "@/lib/seo";

export default function Home() {
  // the opening's poster is the first thing on screen: fetch it before anything else
  preload("/images/hero-poster-640.webp", { as: "image", fetchPriority: "high" });
  return (
    <>
      <main id="main" data-wa="">
        <Hero />
        <PaperChapter />
        <Night />
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
