"use client";

import { useEffect, useRef } from "react";
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

// Speed: pixels per second (lower = slower, higher = faster)
const SPEED = 30;

function LogoItem({ logo }: { logo: { src: string; alt: string } }) {
  return (
    <div
      style={{
        width: 120,
        height: 48,
        margin: "0 40px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const oneSetWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure: total scrollWidth / 2 = one set
    const measure = () => {
      oneSetWidthRef.current = track.scrollWidth / 3;
    };
    // Wait for images to load before measuring
    const images = track.querySelectorAll("img");
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded >= images.length) measure();
    };
    images.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener("load", onLoad);
      }
    });
    // Initial measure (in case all images already loaded)
    measure();

    let animId: number;
    let prev = 0;

    const tick = (time: number) => {
      if (!prev) prev = time;
      const dt = (time - prev) / 1000;
      prev = time;

      const setW = oneSetWidthRef.current;
      if (setW > 0) {
        posRef.current += SPEED * dt;
        if (posRef.current >= setW) {
          posRef.current -= setW;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", measure);
      images.forEach((img) => img.removeEventListener("load", onLoad));
    };
  }, []);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        ref={trackRef}
        style={{ display: "flex", width: "max-content", willChange: "transform" }}
      >
        {/* Set A */}
        {logos.map((logo, i) => (
          <LogoItem key={`a-${i}`} logo={logo} />
        ))}
        {/* Set B */}
        {logos.map((logo, i) => (
          <LogoItem key={`b-${i}`} logo={logo} />
        ))}
        {/* Set C — extra copy to ensure screen is never empty */}
        {logos.map((logo, i) => (
          <LogoItem key={`c-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}
