import { marquee } from "@/content/site";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="relative overflow-hidden border-y border-line bg-bg-soft py-6" aria-label="סוגי אירועים">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((m, i) => (
              <span key={i} className="flex items-center whitespace-nowrap font-display text-3xl font-bold md:text-5xl">
                <span className={i % 2 ? "text-transparent [-webkit-text-stroke:1px_var(--gold)]" : "text-ink"}>{m}</span>
                <span className="mx-8 text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
