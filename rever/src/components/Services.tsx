import { services, servicesIntro } from "@/content/site";
import { LitImage } from "./LitImage";
import { Reveal, SectionKicker } from "./Reveal";

/** Each service is its own scene: a lit photograph and the copy beside it, alternating sides. */
const GLOWS = ["rgba(196,201,160,.7)", "rgba(242,184,102,.65)", "rgba(236,180,160,.7)", "rgba(242,184,102,.65)"];

export function Services() {
  return (
    <section id="services" data-scene="day" className="theme-ivory px-4 py-20 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <SectionKicker>{servicesIntro.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[1.05] [text-wrap:balance]">{servicesIntro.title}</h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.75] text-ink-dim">{servicesIntro.text}</p>
        </Reveal>

        <ol className="mt-14 flex flex-col gap-16 md:mt-24 md:gap-32">
          {services.map((s, i) => (
            <li key={s.id} className="grid items-center gap-7 md:grid-cols-12 md:gap-12">
              <Reveal className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <LitImage src={s.image} alt="" fill sizes="(min-width:768px) 55vw, 100vw" glow={GLOWS[i]} className="aspect-[4/3] rounded-[22px] md:aspect-[5/4] md:rounded-[28px]" />
              </Reveal>
              <Reveal delay={0.1} className="md:col-span-5">
                <p className="font-display text-[3.5rem] font-normal leading-none text-[#b08d57]/70 md:text-[5rem]" dir="ltr" aria-hidden="true">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.7rem,2.8vw,2.5rem)] font-medium leading-[1.12] [text-wrap:balance]">{s.title}</h3>
                <div className="hairline my-5 w-20" />
                <p className="text-[17px] leading-[1.8] text-ink-dim">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
