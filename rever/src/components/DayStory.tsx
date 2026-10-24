import { dayStory } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

/** One real event day, in three beats. REVER gives the story; until then every line is green. */
export function DayStory() {
  return (
    <section id="story" data-scene="day" data-wa="קראתי באתר סיפור מיום אירוע" className="theme-ivory px-4 pb-16 md:px-10 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <SectionKicker>{dayStory.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.08] [text-wrap:balance]">{dayStory.title}</h2>
        </Reveal>
        <ol className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
          {dayStory.steps.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="glass-ivory lit h-full rounded-[22px] p-6 md:p-8" style={{ "--glow": "rgba(212,175,55,.5)" } as React.CSSProperties}>
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b8902a] gold-metal-bg font-display text-[1.1rem] text-[#1a1206]">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-[1.5rem] font-medium leading-[1.15]">{s.label}</h3>
                  <p className="mt-3 text-[16px] leading-[1.7]">
                    <Todo>{s.hint}: להשלים</Todo>
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
