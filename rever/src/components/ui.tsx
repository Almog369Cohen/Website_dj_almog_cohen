import Link from "next/link";
import { PHOTO_SIZES } from "@/content/photos";
import { SHOW_TODO, whatsapp } from "@/content/site";
import { waHref } from "@/lib/whatsapp";

const WIDTHS = [640, 1080, 1280, 1600, 2400];

/**
 * A photo from public/images in every processed size, so a phone never downloads the desktop file.
 * `sizes` says how wide it is drawn; the browser picks the smallest file that is sharp enough.
 */
export function Pic({ name, alt, sizes = "100vw", className, priority, id }: { name: string; alt: string; sizes?: string; className?: string; priority?: boolean; id?: string }) {
  const [w, h] = PHOTO_SIZES[name] ?? [1600, 1067];
  const widths = WIDTHS.filter((x) => x <= w);
  const list = widths.length ? widths : [WIDTHS[0]];
  const srcSet = list.map((x) => `/images/${name}-${x}.webp ${Math.min(x, w)}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: srcset is built from our own processed sizes
    <img
      id={id}
      src={`/images/${name}-${list[Math.min(1, list.length - 1)]}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={w}
      height={h}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

/** Green marker for anything REVER still has to confirm. Shown only in the preview, never on the live site. */
export function Todo({ children, dir }: { children: React.ReactNode; dir?: "ltr" | "rtl" }) {
  if (!SHOW_TODO) return null;
  return (
    <mark className="todo" dir={dir} title="מחכה לאישור מ-REVER">
      {children}
    </mark>
  );
}

export function WaIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5z" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

/** The one action on the site. The message is rewritten on tap to say what the couple was looking at. */
export function WaButton({ children = whatsapp.cta, className = "btn-gold", where }: { children?: React.ReactNode; className?: string; where: string }) {
  return (
    <a className={className} href={waHref()} target="_blank" rel="noopener" data-wa-link={where}>
      <WaIcon />
      {children}
    </a>
  );
}

/** Gal and Liel's faces, small and round, wherever the site asks the couple to write. */
export function Faces({ label = "גל וליאל, המייסדים", href }: { label?: React.ReactNode; href?: string }) {
  const inner = (
    <>
      <span className="faces" aria-hidden="true">
        <Pic name="gal-face" alt="" sizes="36px" />
        <Pic name="liel-face" alt="" sizes="36px" />
      </span>
      <span>{label}</span>
    </>
  );
  return href ? <Link className="sign" href={href}>{inner}</Link> : <div className="sign">{inner}</div>;
}

export function JsonLd({ data }: { data: object }) {
  // escape "<" so no string inside the data can close the script tag
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
