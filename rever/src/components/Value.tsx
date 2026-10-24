import { value } from "@/content/site";
import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

const ICONS: Record<string, React.ReactNode> = {
  one: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  budget: <path d="M4 7h16v12H4zM4 11h16M8 15h3" />,
  star: <path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.6 6.7 19.5l1.1-6L3.4 9.3l6-.8z" />,
  calm: <path d="M12 3v3m6.4-.4-2.1 2.1M21 12h-3M6 12H3m3.7-6.3 2.1 2.1M8 16a4 4 0 0 1 8 0M5 20h14" />,
};

/** What you get: four concrete outcomes and the numbers behind them. */
export function Value() {
  return (
    <section id="value" data-scene="dawn" className="theme-ivory relative pb-16 md:pb-28">
      {/* the night warming into dawn: continues the hero's bottom glow onto the light */}
      <div aria-hidden="true" className="h-28 bg-gradient-to-b from-[#2a1a0c] via-[#c98a4a]/25 to-transparent md:h-40" />
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <Reveal className="max-w-2xl">
          <SectionKicker>{value.kicker}</SectionKicker>
          <h2 className="font-display text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.05] [text-wrap:balance]">{value.title}</h2>
        </Reveal>

        <ul className="mt-10 grid gap-x-10 gap-y-8 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {value.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06}>
              <li className="flex gap-4 lg:flex-col">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff6e6] text-[#8d6b2c] shadow-[0_0_0_1px_rgba(176,141,87,.35),0_10px_30px_-6px_rgba(240,160,64,.7)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICONS[it.icon]}
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-[1.35rem] font-medium leading-[1.2]">{it.title}</h3>
                  <p className="mt-2 text-[16px] leading-[1.7] text-ink-dim">{it.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 grid grid-cols-3 border-y border-line md:mt-20">
          {value.stats.map((s, i) => (
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
