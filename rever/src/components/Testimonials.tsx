import { testimonials } from "@/content/site";
import { SectionKicker } from "./Reveal";

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="mx-3 w-[320px] shrink-0 rounded-3xl border border-line bg-bg-soft p-7 md:w-[420px]">
      <div className="mb-4 text-gold" aria-label="5 כוכבים">★★★★★</div>
      <blockquote className="text-lg leading-relaxed">״{t.quote}״</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-display font-bold text-gold">{t.name[0]}</span>
        <span>
          <span className="block font-bold">{t.name}</span>
          <span className="text-sm text-ink-dim">{t.event}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const row = [...testimonials, ...testimonials];
  return (
    <section className="relative overflow-hidden py-28 md:py-36" aria-labelledby="testimonials-title">
      <div className="mx-auto mb-14 max-w-7xl px-5 text-center md:px-8">
        <SectionKicker>מה אומרים עלינו</SectionKicker>
        <h2 id="testimonials-title" className="font-display text-4xl font-bold md:text-6xl">
          הלקוחות <span className="text-gold-grad">מספרים</span>
        </h2>
      </div>
      <div className="relative [mask-image:linear-gradient(to_left,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee py-2 hover:[animation-play-state:paused]">
          {[0, 1].map((k) => (
            <div key={k} className="flex" aria-hidden={k === 1}>
              {row.map((t, i) => (
                <Card key={i} t={t} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
