import { Reveal, SectionKicker } from "./Reveal";
import { Todo } from "./Todo";

/**
 * Words from couples. Placeholders until REVER sends real quotes (first names, venue, date);
 * shown in green, like every other unverified detail on the site.
 */
const QUOTES = [1, 2, 3];

export function Testimonials() {
  return (
    <section id="words" data-scene="golden" data-wa="קראתי באתר מה זוגות אומרים" className="theme-ivory px-4 py-16 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <SectionKicker>מה אומרים עלינו</SectionKicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.08]">הזוגות שלנו מספרים</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {QUOTES.map((q, i) => (
            <Reveal key={q} delay={i * 0.08}>
              <figure className="glass-ivory lit flex h-full flex-col rounded-[22px] p-6 md:p-8" style={{ "--glow": "rgba(240,150,70,.5)" } as React.CSSProperties}>
                <span aria-hidden="true" className="font-display text-5xl leading-none text-[#b08d57]">”</span>
                <blockquote className="mt-2 flex-1 text-[17px] leading-[1.75]">
                  <Todo>ציטוט אמיתי מזוג: להשלים</Todo>
                </blockquote>
                <figcaption className="mt-5 text-[14px] text-ink-dim">
                  <Todo>שם הזוג</Todo> · <Todo>מקום</Todo> · <Todo>חודש</Todo>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
