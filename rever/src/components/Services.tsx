import { services, servicesIntro } from "@/content/site";
import { LitImage } from "./LitImage";
import { Reveal, SectionKicker } from "./Reveal";

/**
 * Each service is its own lit scene. Phones: a tall photo with an ivory caption card
 * overlapping it, alternating sides and crops. Desktop: photo and copy side by side, alternating.
 */
const GLOWS = ["rgba(170,190,130,.75)", "rgba(242,170,80,.7)", "rgba(233,170,150,.75)", "rgba(242,170,80,.7)"];
const CROPS = ["aspect-[4/5]", "aspect-[3/2]", "aspect-[4/5]", "aspect-[3/2]"];

export function Services() {
  return (
    <section id="services" data-scene="day" className="theme-ivory px-4 pb-16 pt-10 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <SectionKicker>{servicesIntro.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[1.05] [text-wrap:balance]">{servicesIntro.title}</h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-ink-dim">{servicesIntro.text}</p>
        </Reveal>

        <ol className="mt-10 flex flex-col gap-14 md:mt-24 md:gap-32">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.id} className="md:grid md:grid-cols-12 md:items-center md:gap-12">
                <Reveal className={`md:col-span-7 ${flip ? "md:order-2 ml-6 md:ml-0" : "mr-6 md:mr-0"}`}>
                  <LitImage src={s.image} alt="" fill sizes="(min-width:768px) 55vw, 90vw" glow={GLOWS[i]} className={`${CROPS[i]} rounded-[22px] md:aspect-[5/4] md:rounded-[28px]`} />
                </Reveal>
                <Reveal delay={0.1} className={`relative z-10 -mt-16 md:col-span-5 md:mt-0 ${flip ? "mr-6 md:mr-0" : "ml-6 md:ml-0"}`}>
                  <div className="glass-ivory rounded-[20px] p-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
                    <p className="text-[13px] font-medium tracking-[0.2em] text-[#8d6b2c]">0{i + 1} ·</p>
                    <h3 className="mt-2 font-display text-[clamp(1.6rem,2.8vw,2.5rem)] font-medium leading-[1.12] [text-wrap:balance]">{s.title}</h3>
                    <div className="hairline my-4 w-20 md:my-5" />
                    <p className="text-[16px] leading-[1.8] text-ink-dim md:text-[17px]">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
