import { marquee } from "@/content/site";

/** Stage-front LED ticker carrying the service keywords. */
export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="led-ticker relative overflow-hidden border-y-4 border-[#111014] bg-[#0a0605] py-4" aria-label="מה אנחנו עושים">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((m, i) => (
              <span key={i} className="flex items-center whitespace-nowrap font-display text-2xl font-bold text-[#ffb347] [text-shadow:0_0_14px_rgba(255,170,60,0.75)] md:text-4xl">
                {m}
                <span className="mx-8 text-[#ff5ec4] [text-shadow:0_0_12px_rgba(255,94,196,0.8)]">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
