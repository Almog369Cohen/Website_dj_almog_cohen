import { night } from "@/content/site";
import { LitImage } from "./LitImage";
import { Reveal, SectionKicker } from "./Reveal";
import { StringLights } from "./StringLights";
import { NightCta } from "./NightCta";

/** The party: the light goes down, stage beams in the colours of their own dance floors. */
export function Night() {
  const [a, b, c, d] = night.images;
  return (
    <section id="night" className="relative overflow-hidden px-4 pb-28 pt-32 text-[#f6f0e6] md:px-10 md:pb-36 md:pt-44">
      {/* Own dark stage, fading in and out at the edges, so the page light never turns dark under light-section text. */}
      <div aria-hidden="true" className="party-stage pointer-events-none absolute inset-0" />
      {/* beams live inside the fully dark part only, so they never smear over the light edges */}
      <div aria-hidden="true" className="beams pointer-events-none absolute inset-x-0 bottom-24 top-24 overflow-hidden">
        <span className="beam beam-1" />
        <span className="beam beam-2" />
        <span className="beam beam-3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-2xl md:mb-16">
          <SectionKicker>{night.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[1.05] [text-wrap:balance]">
            {night.title}
            <span className="block bg-gradient-to-l from-[#f3d9a4] via-[#e9a6c4] to-[#8fe0ea] bg-clip-text text-transparent">{night.titleAccent}</span>
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-[#f6f0e6]/90">{night.text}</p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-[repeat(3,minmax(0,13rem))] md:gap-5">
          <Reveal className="col-span-2 md:col-span-7 md:row-span-2">
            <LitImage src={a.src} alt={a.alt} fill sizes="(min-width:768px) 58vw, 100vw" glow="rgba(196,72,140,.6)" className="aspect-[3/2] h-full rounded-[18px] md:aspect-auto" />
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:row-span-3">
            <LitImage src={b.src} alt={b.alt} fill sizes="(min-width:768px) 40vw, 50vw" glow="rgba(63,198,214,.55)" className="aspect-[4/5] h-full rounded-[18px] md:aspect-auto [&_img]:object-[50%_20%]" />
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-3">
            <LitImage src={d.src} alt={d.alt} fill sizes="(min-width:768px) 25vw, 50vw" glow="rgba(232,160,146,.6)" className="aspect-[4/5] h-full rounded-[18px] md:aspect-auto [&_img]:object-top" />
          </Reveal>
          <Reveal delay={0.2} className="col-span-2 md:col-span-4">
            <LitImage src={c.src} alt={c.alt} fill sizes="(min-width:768px) 33vw, 100vw" glow="rgba(242,170,90,.6)" className="aspect-[3/2] h-full rounded-[18px] md:aspect-auto" />
          </Reveal>
        </div>
      </div>
      <NightCta />
      <StringLights dark className="relative mt-12 md:mt-20" />
    </section>
  );
}
