import { Consent } from "@/components/Consent";
import { Contact } from "@/components/Contact";
import { Dialogs } from "@/components/Dialogs";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LightField } from "@/components/LightField";
import { LightSwitch } from "@/components/LightSwitch";
import { Night } from "@/components/Night";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { Value } from "@/components/Value";

export default function Home() {
  return (
    <>
      <LightField />
      <Header />
      <main id="main">
        <Hero />
        <Value />
        <Team />
        <LightSwitch />
        <Services />
        <Night />
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
