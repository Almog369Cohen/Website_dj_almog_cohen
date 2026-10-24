import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { CursorGlow, FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Preloader } from "@/components/Preloader";
import { Services } from "@/components/Services";
import { ZoomReveal } from "@/components/ZoomReveal";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <div className="theme-ivory">
          <About />
        </div>
        <ZoomReveal />
        <div className="theme-ivory">
          <Services />
        </div>
        <Gallery />
        <div className="theme-ivory">
          <Contact />
        </div>
      </main>
      <Footer />
      <FloatingActions />
      <CursorGlow />
    </>
  );
}
