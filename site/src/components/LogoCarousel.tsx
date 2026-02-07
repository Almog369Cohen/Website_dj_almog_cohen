"use client";

import Image from "next/image";

const logos = [
  { src: "/assets/logos/april.jpeg", alt: "April" },
  { src: "/assets/logos/jerusalem.png", alt: "עיריית ירושלים" },
  { src: "/assets/logos/dhl.png", alt: "DHL" },
  { src: "/assets/logos/ort.png", alt: "ORT" },
  { src: "/assets/logos/bana.svg", alt: "Bana" },
  { src: "/assets/logos/kiryat-ono.png", alt: "קריית אונו" },
  { src: "/assets/logos/ariel.jpeg", alt: "אריאל" },
  { src: "/assets/logos/hamashbir.png", alt: "המשביר" },
  { src: "/assets/logos/ktm.svg", alt: "KTM" },
];

function LogoItem({ logo }: { logo: { src: string; alt: string } }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 120, height: 48, margin: "0 40px" }}>
      <Image
        src={logo.src}
        alt={logo.alt}
        width={120}
        height={48}
        className="object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      />
    </div>
  );
}

export default function LogoCarousel() {
  return (
    <div className="overflow-hidden w-full">
      <div className="flex w-max animate-scroll-logos">
        {logos.map((logo, i) => (
          <LogoItem key={`a-${i}`} logo={logo} />
        ))}
        {logos.map((logo, i) => (
          <LogoItem key={`b-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}
