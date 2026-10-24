import Image from "next/image";
import { night } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";

/** The party, kept elegant: their night photos in an editorial collage with one glass caption. */
export function Night() {
  const [a, b, c, d] = night.images;
  const tile = "zoom-img group relative overflow-hidden rounded-[6px]";
  return (
    <section id="night" className="relative bg-[#0e0c0a] px-4 py-24 text-[#f6f0e6] md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <SectionKicker>{night.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[1.08]">
            {night.title}
            <span className="block text-[#d9b26f]">{night.titleAccent}</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-[repeat(3,minmax(0,13rem))] md:gap-4">
          <Reveal className={`${tile} col-span-2 aspect-[3/2] md:col-span-7 md:row-span-2 md:aspect-auto`}>
            <Image src={a.src} alt={a.alt} fill sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
            <div className="glass-dark absolute inset-x-3 bottom-3 rounded-2xl px-5 py-4 md:inset-x-auto md:bottom-5 md:right-5 md:max-w-sm">
              <p className="text-[14px] font-light leading-[1.7] text-[#f6f0e6]/90 md:text-[15px]">{night.text}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className={`${tile} aspect-[2/3] md:col-span-5 md:row-span-3 md:aspect-auto`}>
            <Image src={b.src} alt={b.alt} fill sizes="(min-width:768px) 40vw, 50vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.15} className={`${tile} aspect-[2/3] md:col-span-3 md:aspect-auto`}>
            <Image src={d.src} alt={d.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover object-top" />
          </Reveal>
          <Reveal delay={0.2} className={`${tile} col-span-2 aspect-[3/2] md:col-span-4 md:aspect-auto`}>
            <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
