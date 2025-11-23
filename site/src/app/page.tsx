"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { EnergyProvider, useEnergy } from "@/context/EnergyContext";

const AnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground"),
  { ssr: false }
);

import { HomeSections } from "@/components/home/HomeSections";
import { RevealText } from "@/components/ui/RevealText";
import { SmoothScrollLink } from "@/components/ui/SmoothScrollLink";

type Path = "none" | "school" | "events";

export default function Home() {
  return (
    <EnergyProvider>
      <HomeContent />
    </EnergyProvider>
  );
}

function HomeContent() {
  const { energyLevel, energyRatio, isRaveMode } = useEnergy();
  const [path, setPath] = useState<Path>("none");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Reactive Styles for Energy System
  const reactiveStyles = {
    "--energy": energyLevel,
    "--energy-ratio": energyRatio,
    "--glow-opacity": energyRatio, // 0 to 1
    "--anim-speed": `${1.2 - (energyRatio * 0.8)}s`, // Faster as energy goes up
    "--text-glow": `0 0 ${energyLevel / 2}px rgba(5, 156, 192, ${energyRatio})`,
    "--border-pulse": isRaveMode ? "pulse-border 1s infinite" : "none",
  } as React.CSSProperties;

  // Completely disable animations on mobile to prevent flickering
  const animationConfig = isMobile ? {
    duration: 0,
    ease: "linear"
  } : {
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1]
  };

  const carouselImages = [
    "/assets/almog/IMG_6561.jpg",
    "/assets/almog/מסיבת רחוב יד למעלה מעלה.jpg",
    "/assets/almog/מיקרופון מעלה אדומים.jpg",
    "/assets/almog/ידיים של מלך מעלה אדומים.jpg",
  ];

  const nextImage = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  const schoolVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1 },
  };

  const eventsVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1 },
  };

  const sectionAnimation: any = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: "easeOut" as const },
  };

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://www.compaktt.com/#person",
                name: "Almog Cohen",
                alternateName: "DJ Almog Cohen",
                description: "DJ מקצועי לחתונות ואירועים, מורה ומנטור DJ בתל אביב",
                url: "https://www.compaktt.com",
                image: "https://www.compaktt.com/assets/almog/IMG_6561.jpg",
                sameAs: [
                  "https://www.instagram.com/almog.dj",
                  "https://www.youtube.com/@djalmogcohen",
                  "https://soundcloud.com/almogcohen",
                ],
                jobTitle: "DJ & Music Producer",
                worksFor: {
                  "@type": "Organization",
                  name: "DJ Almog Cohen",
                },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "תל אביב",
                  addressCountry: "IL",
                },
              },
              {
                "@type": "LocalBusiness",
                "@id": "https://www.compaktt.com/#business",
                name: "DJ Almog Cohen",
                description: "DJ לחתונות ואירועים מובחרים, בית ספר DJ ומנטורינג לאמנים",
                url: "https://www.compaktt.com",
                telephone: "+972-50-242-7616",
                priceRange: "₪₪₪",
                image: "https://www.compaktt.com/assets/almog/IMG_6561.jpg",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "תל אביב",
                  addressCountry: "IL",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 32.0853,
                  longitude: 34.7818,
                },
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
                  opens: "10:00",
                  closes: "22:00",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "5",
                  reviewCount: "50",
                },
              },
              {
                "@type": "Service",
                "@id": "https://www.compaktt.com/#service-weddings",
                name: "DJ לחתונות",
                description: "ליווי מלא לחתונות מובחרות - מפגישת ייעוץ ועד מסיבה בלתי נשכחת",
                provider: {
                  "@id": "https://www.compaktt.com/#person",
                },
                areaServed: {
                  "@type": "Country",
                  name: "Israel",
                },
              },
              {
                "@type": "Course",
                "@id": "https://www.compaktt.com/courses#course",
                name: "קורס DJ",
                description: "קורסי DJ למתחילים ומתקדמים, מנטורינג ואימון אישי",
                provider: {
                  "@id": "https://www.compaktt.com/#person",
                },
                educationalLevel: "Beginner to Advanced",
              },
            ],
          }),
        }}
      />
      
      {/* Fluid Typography System - Mobile Optimized */}
      <style jsx global>{`
        :root {
          --font-fluid-h1: clamp(2.5rem, 10vw, 6rem);
          --font-fluid-h2: clamp(2rem, 6vw, 4rem);
          --font-fluid-h3: clamp(1.125rem, 3vw + 0.5rem, 3rem);
          --font-fluid-p: clamp(0.875rem, 1vw + 0.5rem, 1.25rem);
        }
        
        /* Prevent layout shifts on mobile */
        @media (max-width: 768px) {
          * {
            will-change: auto !important;
          }
        }
        
        /* Energy System Global Overrides */
        h1, h2, h3 {
          text-shadow: var(--text-glow) !important;
          transition: text-shadow 0.2s ease;
        }
        
        .brand-noise {
          opacity: calc(0.05 + (var(--energy) / 500)) !important; /* 0.05 to 0.25 */
        }
        
        /* Rave Mode Glitch Effect */
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        
        .rave-glitch {
           animation: ${isRaveMode ? "glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite" : "none"};
        }
      `}</style>
      
      <div className="overflow-x-hidden text-brand-white" style={reactiveStyles}>

      {/* --- FLOATING CTA FOR CHOGEG MENAGEN --- */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed bottom-8 right-8 z-50 hidden md:block"
      >
        <motion.a
          href={wa("היי אלמוג, מעוניינים בשירות 'חוגג מנגן'")}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full border-2 border-brand-green bg-gradient-to-r from-brand-green to-brand-blue px-6 py-4 shadow-[0_0_40px_rgba(3,178,140,0.6)] transition hover:shadow-[0_0_60px_rgba(3,178,140,0.9)]"
        >
          {!isMobile ? (
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl"
            >
              ⭐
            </motion.span>
          ) : (
            <span className="text-2xl">⭐</span>
          )}
          <div className="relative z-20 text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-black drop-shadow-sm">חדש!</div>
            <div className="text-sm font-bold text-black drop-shadow-sm">חוגג מנגן</div>
          </div>
          {/* Pulse ring */}
          <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-brand-green opacity-20" />
          {/* Shimmer - Subtle */}
          <div className="absolute inset-0 z-10 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1500 group-hover:translate-x-[100%]" />
        </motion.a>
      </motion.div>

      {/* --- NEW SERVICE BANNER --- */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative overflow-hidden border-b border-brand-green/30 bg-gradient-to-r from-brand-green/10 via-brand-blue/10 to-brand-green/10 py-3 hover:bg-brand-green/5 transition-colors"
      >
        <Link href="/chogeg-menagen" className="group block w-full">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-brand-green/5 to-transparent" />
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4">
            {!isMobile ? (
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl"
              >
                ⭐
              </motion.span>
            ) : (
              <span className="text-2xl">⭐</span>
            )}
            <div className="text-center">
              <span className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-green">
                חדש!
              </span>
              <span className="mx-2 text-xs font-semibold md:text-sm lg:text-base text-white">
                <span className="bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-transparent">
                  חוגג מנגן
                </span>
                <span className="hidden md:inline">{" "}- הקונספט שהופך את בעלי השמחה לכוכבי הערב</span>
                <span className="md:hidden">{" "}- קונספט חדש!</span>
              </span>
            </div>
            <span
              className="inline-block rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-3 py-1 text-xs md:px-4 md:py-1.5 font-bold text-black shadow-lg transition group-hover:scale-105 group-hover:shadow-brand-green/50"
            >
              גלה עוד →
            </span>
          </div>
        </Link>
      </motion.div>

      {/* --- STICKY SOCIAL SIDEBAR --- */}
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <a
          href={wa("שלום אלמוג, אשמח לשוחח בוואטסאפ")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="פתיחת שיחה בוואטסאפ"
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-brand-green/30 bg-black/60 backdrop-blur-sm transition hover:scale-110 hover:border-brand-green hover:bg-brand-green/10"
        >
          <Image src="/assets/icons/whatsapp.png" alt="WhatsApp" width={24} height={24} />
        </a>
        <a
          href="https://www.instagram.com/dj_almog_cohen/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="מעבר לאינסטגרם"
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-sm transition hover:scale-110 hover:border-brand-blue hover:bg-brand-blue/10"
        >
          <Image src="/assets/icons/instagram.png" alt="Instagram" width={24} height={24} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="מעבר ליוטיוב"
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-sm transition hover:scale-110 hover:border-brand-blue hover:bg-brand-blue/10"
        >
          <Image src="/assets/icons/youtube.png" alt="YouTube" width={24} height={24} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="מעבר לסאונדקלאוד"
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-sm transition hover:scale-110 hover:border-brand-blue hover:bg-brand-blue/10"
        >
          <Image src="/assets/icons/soundcloud.png" alt="SoundCloud" width={24} height={24} />
        </a>
      </div>

      {/* --- HERO SECTION (LEVEL 1000) --- */}
      <section className="relative flex h-dvh min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex-col items-center justify-center overflow-hidden text-center">
        {/* Fade masks for smooth transitions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        {/* Morphing Blobs Background - Desktop Only */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 120, 240, 360],
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 50% 40% 50%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-40 top-20 -z-20 h-[600px] w-[600px] bg-gradient-to-br from-brand-green/20 to-brand-blue/20 blur-3xl hidden md:block"
        />
        <motion.div
          animate={{ 
            scale: [1, 0.9, 1.3, 1],
            rotate: [360, 240, 120, 0],
            borderRadius: ["60% 40% 50% 60% / 50% 60% 40% 50%", "40% 60% 50% 40% / 50% 40% 60% 50%", "60% 40% 50% 60% / 50% 60% 40% 50%"]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-40 bottom-20 -z-20 h-[500px] w-[500px] bg-gradient-to-br from-brand-blue/20 to-brand-green/20 blur-3xl hidden md:block"
        />

        {/* Floating Particles - Desktop Only */}
        {!isMobile && [...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.sin(i) * 80, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            className="pointer-events-none absolute h-3 w-3 rounded-full bg-brand-green/30"
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + i * 8}%`,
            }}
          />
        ))}

        <div className="brand-noise opacity-30" aria-hidden="true" />
        
        {/* YouTube Video Background */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] -translate-x-1/2 -translate-y-1/2"
            style={{
              minWidth: "100vw",
              minHeight: "100vh",
              width: isMobile ? "300%" : "177.77vh", // 16:9 aspect ratio
              height: isMobile ? "56.25vw" : "100vh",
              pointerEvents: "none",
            }}
            src="https://www.youtube.com/embed/yarUtbqD0BI?autoplay=1&mute=1&loop=1&playlist=yarUtbqD0BI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=https://www.compaktt.com"
            title="DJ Almog Cohen - Hero Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Scanline Effect - Desktop Only */}
          {!isMobile && (
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent"
            />
          )}
        </div>
        
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <AnimatedBackground />

        {/* Main Content - Ultra */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4"
        >
          {/* Glass Card with Multi-layer Glow */}
          <div className="relative">
            <div className="absolute -inset-2 -z-10 animate-pulse rounded-[40px] bg-gradient-to-r from-brand-blue/40 via-brand-green/40 to-brand-blue/40 opacity-40 blur-2xl" />
            <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-r from-brand-green/30 via-brand-blue/30 to-brand-green/30 opacity-20 blur-3xl" />
            
            <div className="relative overflow-hidden rounded-[40px] border-2 border-white/30 bg-black/25 px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md md:px-10 md:py-12">
              {/* Title - Elegant Multi-line Design (Level 100) */}
              <div className="mb-8 space-y-4">
                {/* Line 1 - Lighter, elegant intro */}
                <RevealText delay={0}>
                  <motion.div 
                    className={`text-center ${isRaveMode ? "rave-glitch" : ""}`}
                    style={{
                      fontSize: "clamp(1.5rem, 5vw, 3rem)",
                      fontWeight: 300,
                      letterSpacing: "0.05em",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    לא מנגן בכל אירוע.
                  </motion.div>
                </RevealText>

                {/* Decorative Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-brand-blue to-transparent"
                />

                {/* Line 2 - Bold, powerful statement */}
                <RevealText delay={0.4}>
                  <motion.h1
                    whileHover={{ 
                      scale: 1.03,
                      textShadow: "0 0 30px rgba(5, 156, 192, 0.6), 0 0 60px rgba(3, 178, 140, 0.4)",
                      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ 
                      fontSize: "var(--font-fluid-h1)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      background: "linear-gradient(135deg, #059cc0 0%, #ffffff 50%, #03b28c 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      textAlign: "center",
                      cursor: "default",
                      transformOrigin: "center center",
                    }}
                  >
                    רק באלה שראויים.
                  </motion.h1>
                </RevealText>
              </div>

              {/* Subtitle - Fluid Typography */}
              <RevealText delay={0.7}>
                <h2
                  style={{
                    fontSize: "var(--font-fluid-p)",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    opacity: 0.9,
                  }}
                  className="mx-auto max-w-3xl"
                >
                  12 שנים, סטנדרטים ברזל, ואפס התנצלויות.
                </h2>
              </RevealText>

              {/* CTA Buttons - Ultra */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <motion.div whileHover={!isMobile ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                  <SmoothScrollLink
                    href="#events-section"
                    ariaLabel="גלילה לסקשן האירועים"
                    className="group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-6 py-3 md:px-12 md:py-4 text-sm md:text-base font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.7)] transition hover:scale-105 hover:shadow-[0_0_60px_rgba(3,178,140,1)]"
                  >
                    <span className="relative z-20">לאירוע הבא שלכם</span>
                    <svg 
                      className="relative z-20 h-5 w-5"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {!isMobile && (
                      <motion.div
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    )}
                  </SmoothScrollLink>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <SmoothScrollLink
                    href="#school-section"
                    ariaLabel="גלילה לסקשן בית הספר והקורסים"
                    className="group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden rounded-full border-2 border-brand-blue bg-brand-blue/20 px-6 py-3 md:px-12 md:py-4 text-sm md:text-base font-bold text-white backdrop-blur-md transition hover:scale-105 hover:bg-brand-blue/30 hover:shadow-[0_0_40px_rgba(5,156,192,0.5)]"
                  >
                    <span className="relative z-10">לקורסי DJ</span>
                    <svg 
                      className="relative z-10 h-5 w-5"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </SmoothScrollLink>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="z-10 mt-4 w-full max-w-4xl px-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 text-right">
            בין לקוחותינו
          </p>
          <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/40 py-4">
            <div className="flex animate-[marquee_30s_linear_infinite] items-center gap-8 pr-8">
              {/* First set of client logos */}
              {[
                "client-1.jpg",
                "client-2.jpg",
                "client-3.jpg",
                "client-4.jpg",
                "client-5.jpg",
                "client-6.jpg",
              ].map((logo, idx) => (
                <div
                  key={logo}
                  className="relative h-12 w-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={`/assets/clients/${logo}`}
                    alt={`לקוח ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[
                "client-1.jpg",
                "client-2.jpg",
                "client-3.jpg",
                "client-4.jpg",
                "client-5.jpg",
                "client-6.jpg",
              ].map((logo, idx) => (
                <div
                  key={`${logo}-dup`}
                  className="relative h-12 w-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={`/assets/clients/${logo}`}
                    alt={`לקוח ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- ALL BELOW-THE-FOLD SECTIONS (CODE SPLIT) --- */}
      <HomeSections />
      </div>
    </>
  );
}
