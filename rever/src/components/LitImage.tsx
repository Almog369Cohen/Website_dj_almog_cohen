import Image, { type ImageProps } from "next/image";

/** A photo with a soft glow in its own colour beneath it. No motion: the page has one movement of light, and it is not here. */
export function LitImage({ glow = "rgba(242,184,102,.55)", className = "", imgPosition, ...img }: ImageProps & { glow?: string; imgPosition?: string }) {
  return (
    <div className={`lit relative overflow-hidden ${className}`} style={{ "--glow": glow } as React.CSSProperties}>
      <Image {...img} alt={img.alt} className="object-cover" style={imgPosition ? { objectPosition: imgPosition } : undefined} />
    </div>
  );
}
