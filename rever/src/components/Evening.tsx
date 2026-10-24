import { evening, night } from "@/content/site";
import { LitImage } from "./LitImage";
import { NightCta } from "./NightCta";
import { Reveal, SectionKicker } from "./Reveal";
import { StringLights } from "./StringLights";

/**
 * One evening, two worlds. The light part (reception, the couple's moment) is a light scene;
 * the dance floor is its own dark stage, so the page goes dark exactly where the party starts.
 */
export function Evening() {
  const [, , c, d] = night.images;
  return (
    <>
      <section id="evening" data-scene="dawn" data-wa="ראיתי באתר את הערב שלכם, מקבלת הפנים ועד הרחבה" className="theme-ivory relative pb-14 md:pb-28">
        {/* the night warming into dawn: continues the hero's bottom glow onto the light */}
        <div aria-hidden="true" className="h-28 bg-gradient-to-b from-[#2a1a0c] via-[#c98a4a]/25 to-transparent md:h-40" />
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <Reveal className="max-w-2xl">
            <SectionKicker>{evening.kicker}</SectionKicker>
            <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05] [text-wrap:balance]">{evening.title}</h2>
            <p className="mt-5 max-w-lg text-[17px] leading-[1.75] text-ink-dim">{evening.lead}</p>
          </Reveal>

          <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-14">
            {[evening.reception, evening.moment].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className={i ? "md:mt-24" : ""}>
                <figure>
                  <LitImage src={p.src} alt={p.alt} fill sizes="(min-width:768px) 45vw, 100vw" glow={i ? "rgba(233,170,150,.75)" : "rgba(240,160,64,.7)"} className="aspect-[4/3] rounded-[22px] md:rounded-[28px]" />
                  <figcaption className="mt-5">
                    <h3 className="font-display text-[1.75rem] font-medium leading-[1.15]">{p.title}</h3>
                    <p className="mt-2 text-[16px] leading-[1.7] text-ink-dim md:text-[17px]">{p.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="night" data-wa="ראיתי באתר את הרחבה" className="relative overflow-hidden px-4 pb-24 pt-32 text-[#f6f0e6] md:px-10 md:pb-32 md:pt-44">
        {/* its own dark stage, with soft edges, so the page light never turns dark under light-section text */}
        <div aria-hidden="true" className="party-stage pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="beams pointer-events-none absolute inset-x-0 bottom-24 top-24 overflow-hidden">
          <span className="beam beam-1" />
          <span className="beam beam-2" />
          <span className="beam beam-3" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <SectionKicker>הרחבה</SectionKicker>
            <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05] [text-wrap:balance]">
              {night.title}
              <span className="block text-[#e3bf7c]">{night.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-[#f6f0e6]/90">{night.text}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-12 md:gap-5">
            <Reveal className="col-span-2 md:col-span-8">
              <LitImage src="/images/ev-nye-5.jpg" alt="הזוג רוקד בין ניצוצות" fill sizes="(min-width:768px) 66vw, 100vw" glow="rgba(196,72,140,.6)" className="aspect-[3/2] rounded-[18px]" />
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-4">
              <LitImage src={d.src} alt={d.alt} fill sizes="(min-width:768px) 30vw, 50vw" glow="rgba(232,160,146,.6)" className="aspect-[4/5] h-full rounded-[18px] [&_img]:object-top" />
            </Reveal>
            <Reveal delay={0.12} className="md:col-span-12 md:hidden">
              <LitImage src={c.src} alt={c.alt} fill sizes="50vw" glow="rgba(242,170,90,.6)" className="aspect-[4/5] rounded-[18px]" />
            </Reveal>
          </div>
          <NightCta />
        </div>
        <StringLights dark className="relative mt-14 md:mt-20" />
      </section>
    </>
  );
}
