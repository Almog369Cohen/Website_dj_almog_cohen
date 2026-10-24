import { Consent } from "@/components/Consent";
import { Contact } from "@/components/Contact";
import { DayStory } from "@/components/DayStory";
import { Dialogs } from "@/components/Dialogs";
import { Evening } from "@/components/Evening";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LightField } from "@/components/LightField";
import { LightSwitch } from "@/components/LightSwitch";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";

/** Five questions, in the order a couple asks them: who are you, what do I get, can I trust you, who worked with you, how do we start. */
export default function Home() {
  return (
    <>
      <LightField />
      <Header />
      <main id="main">
        <Hero />
        <Evening />
        <LightSwitch />
        <DayStory />
        <Services />
        <Team />
        <div className="theme-ivory">
          <Gallery />
        </div>
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
      <Dialogs />
      <Consent />
    </>
  );
}
