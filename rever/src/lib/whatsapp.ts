import { brand } from "@/content/site";

export function waLink(message: string = brand.whatsappMessage) {
  return `https://wa.me/${brand.phoneIntl}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+${brand.phoneIntl}`;

/**
 * Where the visitor is on the page, in words: the text of the `data-wa` section under the middle of the screen.
 * Used for the WhatsApp message and for the lead record, so REVER knows what the couple was looking at.
 */
export function waContextText(): string {
  if (typeof document === "undefined") return "";
  const mid = window.innerHeight / 2;
  for (const el of document.querySelectorAll<HTMLElement>("[data-wa]")) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) return el.dataset.wa ?? "";
  }
  return "";
}

/** A WhatsApp message that says what the couple was looking at when they tapped. */
export function waContextMessage(): string {
  const what = waContextText();
  return what ? `היי REVER, ${what} ואשמח לשמוע על הפקת האירוע שלנו.` : brand.whatsappMessage;
}

/** onClick helper for a WhatsApp link: rewrites its href at tap time, before the browser follows it. */
export function waContext(e: { currentTarget: HTMLAnchorElement }) {
  e.currentTarget.href = waLink(waContextMessage());
}
