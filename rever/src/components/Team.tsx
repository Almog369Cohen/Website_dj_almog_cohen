import { about, team } from "@/content/site";
import { LitImage } from "./LitImage";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

/** Can we trust them: the people (name, role and face per person), the one confirmed number, and who they are. */
export function Team() {
  return (
    <section id="about" data-scene="dawn" data-wa="ראיתי באתר את הצוות" className="theme-ivory px-4 py-16 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <SectionKicker>{team.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05] [text-wrap:balance]">{team.title}</h2>
          <p className="mt-4 font-display text-[1.35rem] text-gold">{about.title}</p>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-[17px] leading-[1.8] text-ink-dim">
              {p}
            </p>
          ))}
        </Reveal>

        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-8">
          {team.people.map((p, i) => (
            <Reveal key={p.src} delay={i * 0.08}>
              <figure>
                <LitImage src={p.src} alt={p.alt} fill sizes="(min-width:768px) 30vw, 100vw" glow={i === 1 ? "rgba(170,190,130,.7)" : "rgba(240,160,64,.7)"} className="aspect-[4/5] rounded-[22px]" imgPosition={p.pos} />
                <figcaption className="mt-4">
                  <p className="text-[18px] font-medium">
                    <Todo>שם</Todo> · <Todo>תפקיד</Todo>
                  </p>
                  <p className="mt-1 text-[14px] text-ink-dim">{p.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 grid grid-cols-3 border-y border-line md:mt-20">
          {team.stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center px-2 py-6 text-center md:py-9 ${i ? "border-r border-line" : ""}`}>
              {s.verified ? (
                <span className="font-display text-[2.6rem] leading-none text-gold md:text-[4rem]">{s.n}</span>
              ) : (
                <span className="flex h-[2.6rem] items-center text-[13px] md:h-[4rem] md:text-[15px]">
                  <Todo>{s.n}</Todo>
                </span>
              )}
              <span className="mt-2 text-[13px] leading-snug text-ink-dim md:text-[15px]">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
