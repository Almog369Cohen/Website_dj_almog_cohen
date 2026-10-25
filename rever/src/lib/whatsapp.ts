import { brand, whatsapp } from "@/content/site";

export const waHref = (message: string = whatsapp.greeting + whatsapp.fallback) =>
  `https://wa.me/${brand.phoneIntl}?text=${encodeURIComponent(message)}`;

/**
 * What the couple is looking at, in words: the last `[data-wa]` element under the middle of the screen
 * (x and y, so a card in the sideways track counts), falling back to the page's `main[data-wa]`.
 */
export function waContextText(): string {
  if (typeof document === "undefined") return "";
  const x = window.innerWidth / 2, y = window.innerHeight / 2;
  let hit = "";
  document.querySelectorAll<HTMLElement>("[data-wa]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (el.dataset.wa && r.top <= y && r.bottom > y && r.left <= x && r.right > x) hit = el.dataset.wa;
  });
  return hit || document.querySelector<HTMLElement>("main[data-wa]")?.dataset.wa || "";
}

export const waContextMessage = () => {
  const what = waContextText();
  return whatsapp.greeting + (what ? `${what} ואשמח לשמוע על הפקת האירוע שלנו.` : whatsapp.fallback);
};
