import { about, team } from "@/content/site";
import { LitImage } from "./LitImage";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

/** The people behind the night: the founders, the team at work, the team with a couple at the end. */
export function Team() {
  return (
    <section id="about" data-scene="dawn" className="theme-ivory px-4 py-16 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12 md:gap-14">
        <Reveal className="md:col-span-5">
          <figure>
            <LitImage src={team.founders.src} alt={team.founders.alt} fill sizes="(min-width:768px) 40vw, 100vw" glow="rgba(240,160,64,.7)" className="arch aspect-[4/5] [&_img]:object-[50%_30%]" />
            <figcaption className="mt-4 text-center text-[15px]">
              <Todo>שמות ותפקידים: להשלים</Todo>
            </figcaption>
          </figure>
        </Reveal>

        <div className="md:col-span-7 md:pt-6">
          <Reveal>
            <SectionKicker>{team.kicker}</SectionKicker>
            <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05] [text-wrap:balance]">{team.title}</h2>
            <p className="mt-3 font-display text-[1.35rem] text-gold">{about.title}</p>
            <div className="hairline my-6 w-24" />
            {about.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-[17px] leading-[1.8] text-ink-dim">
                {p}
              </p>
            ))}
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 md:gap-5">
            <Reveal>
              <figure>
                <LitImage src={team.day.src} alt={team.day.alt} fill sizes="(min-width:768px) 28vw, 48vw" glow="rgba(170,190,130,.7)" className="aspect-[4/5] rounded-[18px] [&_img]:object-[78%_40%]" />
                <figcaption className="mt-2 text-[14px] text-ink-dim">ביום האירוע, ליד הזוג</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.08}>
              <figure>
                <LitImage src={team.group.src} alt={team.group.alt} fill sizes="(min-width:768px) 28vw, 48vw" glow="rgba(240,160,64,.7)" className="aspect-[4/5] rounded-[18px] [&_img]:object-[55%_40%]" />
                <figcaption className="mt-2 text-[14px] text-ink-dim">בסוף הערב, עם הזוג</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
