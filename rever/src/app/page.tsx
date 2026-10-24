import { About } from "@/components/About";
import { Consent } from "@/components/Consent";
import { Contact } from "@/components/Contact";
import { Dialogs } from "@/components/Dialogs";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Night } from "@/components/Night";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <div className="theme-ivory">
          <About />
        </div>
        <Services />
        <Night />
        <div className="theme-ivory">
          <Gallery />
        </div>
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
      <Dialogs />
      <Consent />
    </>
  );
}
