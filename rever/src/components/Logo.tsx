import Image from "next/image";
import { brand } from "@/content/site";

/** The real REVER script logo (gold on transparent). */
export function Logo({ className = "h-12", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={brand.logo}
      alt="REVER Dream Productions"
      width={brand.logoSize.width}
      height={brand.logoSize.height}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}
