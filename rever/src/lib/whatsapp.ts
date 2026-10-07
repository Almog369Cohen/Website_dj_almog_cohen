import { brand } from "@/content/site";

export function waLink(message: string = brand.whatsappMessage) {
  return `https://wa.me/${brand.phoneIntl}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+${brand.phoneIntl}`;
