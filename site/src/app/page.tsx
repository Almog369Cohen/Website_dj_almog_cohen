"use client";
import { useState, useEffect, useRef } from "react";
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

// import { HomeSections } from "@/components/home/HomeSections"; // Full version
import { HomeSectionsLean } from "@/components/home/HomeSectionsLean"; // Conversion-focused
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force video playback on mount (helps with mobile)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked - user interaction required
        console.log("Video autoplay blocked - waiting for interaction");
      });
    }
  }, []);
  
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
      {/* Structured Data (JSON-LD) for SEO - Wedding-Focused */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": "https://www.compaktt.com/#almog",
                name: "Almog Cohen",
                alternateName: ["DJ Almog Cohen", "אלמוג כהן", "Energy Architect"],
                jobTitle: "Wedding DJ & Music Producer",
                description: "DJ לחתונות בישראל עם 12 שנות ניסיון. התמחות בחתונות בוטיק, קהלים מעורבים, טכנו והאוס. מייסד Compakt Academy – בית ספר ל-DJ והפקה מוזיקלית.",
                url: "https://www.compaktt.com",
                image: "https://www.compaktt.com/assets/almog/IMG_6561.jpg",
                sameAs: [
                  "https://www.instagram.com/dj_almog_cohen",
                  "https://www.youtube.com/@djalmogcohen",
                  "https://soundcloud.com/almogcohen",
                ],
                worksFor: {
                  "@type": "Organization",
                  name: "DJ Almog Cohen – Energy Architect",
                },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "תל אביב",
                  addressRegion: "Tel Aviv District",
                  addressCountry: "IL",
                },
                telephone: "+972-50-242-7616",
              },
              {
                "@type": "ProfessionalService",
                "@id": "https://www.compaktt.com/#wedding-dj-service",
                name: "DJ לחתונות בישראל – DJ Almog Cohen",
                alternateName: "Energy Architect – אדריכל האנרגיה",
                description: "שירות DJ מקצועי לחתונות יוקרה בישראל. התמחות בבניית פסקול מוזיקלי מותאם אישית, קריאת קהל מדויקת וחתונות קונספט. כולל ליווי מהחופה ועד האפטר פארטי עם סטים של Melodic Techno, Afro House וקהלים מעורבים.",
                url: "https://www.compaktt.com",
                areaServed: {
                  "@type": "Country",
                  name: "Israel",
                },
                provider: {
                  "@id": "https://www.compaktt.com/#almog",
                },
                serviceType: [
                  "Wedding DJ",
                  "DJ לחתונות",
                  "דיג'יי לחתונה",
                  "מוזיקה לחתונה",
                  "אפטר פארטי לחתונה",
                  "DJ לאירועים עסקיים",
                ],
                availableChannel: {
                  "@type": "ServiceChannel",
                  serviceUrl: "https://www.compaktt.com",
                  availableLanguage: ["he-IL", "en-US"],
                },
                telephone: "+972-50-242-7616",
                priceRange: "₪₪₪",
                image: "https://www.compaktt.com/assets/almog/IMG_6561.jpg",
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "5",
                  reviewCount: "50",
                },
              },
              {
                "@type": "EducationalOrganization",
                "@id": "https://www.compaktt.com/#academy",
                name: "Compakt Academy – DJ Almog Cohen",
                description: "Compakt Academy: בית ספר לדיג'ייז ואמנים. קורס DJ למתחילים, תכנית מנטורינג פרמיום לבניית קריירה בתחום הלילה, וחתן מתקלט - אטרקציה מיוחדת לחתונות. הכשרה מעשית על ציוד Pioneer מקצועי.",
                url: "https://www.compaktt.com/academy",
                founder: {
                  "@id": "https://www.compaktt.com/#almog",
                },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "תל אביב",
                  addressCountry: "IL",
                },
                courseOffered: [
                  {
                    "@type": "Course",
                    name: "קורס DJ למתחילים",
                    description: "תקלוט מהבסיס: ביט-מיקס, ציוד Pioneer, מבנה מוזיקלי, קריאת קהל ותרגול מעשי.",
                    provider: {
                      "@id": "https://www.compaktt.com/#academy",
                    },
                  },
                  {
                    "@type": "Course",
                    name: "תכנית מנטורינג פרמיום",
                    description: "ליווי אישי לבניית קריירה: מיתוג, עסקים, שיווק דיגיטלי וניהול קריירה בתחום הלילה.",
                    provider: {
                      "@id": "https://www.compaktt.com/#academy",
                    },
                  },
                ],
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
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex h-6 w-6 items-center justify-center"
            >
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
          <div className="relative z-20 text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-white drop-shadow-sm">חדש!</div>
            <div className="text-sm font-bold text-white drop-shadow-sm">חוגג מנגן</div>
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
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex h-6 w-6 items-center justify-center"
              >
                <svg className="h-5 w-5 text-brand-green" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </motion.div>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center">
                <svg className="h-4 w-4 text-brand-green" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 text-center">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-green">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                חדש!
              </span>
              <div className="mx-2">
                <span className="text-sm font-bold md:text-base lg:text-lg text-white">
                  הרגע שגונב את ההצגה
                </span>
                <span className="text-xs md:text-sm text-white/80">
                  {" "}– זה לא עוד סרטון לארכיון, זה הסטורי של המחר והשיחה של השבת
                </span>
              </div>
            </div>
            <span
              className="inline-block rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-4 py-2 text-xs md:px-5 md:py-2.5 md:text-sm font-bold text-white shadow-lg transition group-hover:scale-105 group-hover:shadow-brand-green/50 whitespace-nowrap"
            >
              בואו לראות איך זה נראה ←
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
          className="glass-panel flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-brand-green/30 transition hover:scale-110 hover:border-brand-green"
        >
          <Image src="/assets/icons/whatsapp.png" alt="WhatsApp" width={24} height={24} />
        </a>
        <a
          href="https://www.instagram.com/dj_almog_cohen/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="מעבר לאינסטגרם"
          className="glass-panel flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition hover:scale-110 hover:border-brand-blue"
        >
          <Image src="/assets/icons/instagram.png" alt="Instagram" width={24} height={24} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="מעבר ליוטיוב"
          className="glass-panel flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition hover:scale-110 hover:border-brand-blue"
        >
          <Image src="/assets/icons/youtube.png" alt="YouTube" width={24} height={24} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="מעבר לסאונדקלאוד"
          className="glass-panel flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition hover:scale-110 hover:border-brand-blue"
        >
          <Image src="/assets/icons/soundcloud.png" alt="SoundCloud" width={24} height={24} />
        </a>
      </div>

      {/* --- HERO SECTION (LEVEL 1000) --- */}
      <section className="snap-section relative flex h-dvh min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex-col items-center justify-center overflow-hidden text-center bg-black">
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
        
        {/* Video Background - z-index 0 to be above blobs but below content */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          >
            <source src="/assets/hero-main-optimized.mp4" type="video/mp4" />
          </video>
          {/* Light overlay on video - more transparent */}
          <div className="absolute inset-0 bg-black/30" />
          {/* Scanline Effect - Desktop Only */}
          {!isMobile && (
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent"
            />
          )}
        </div>
        
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
            
            <div className="relative overflow-hidden px-5 py-6 md:px-10 md:py-12 bg-black/30 backdrop-blur-sm border border-white/10" style={{ borderRadius: '40px' }}>
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
                    לא מחפש למלא יומן.
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
                    מחפש ליצור רגעים.
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
                  }}
                  className="mx-auto max-w-3xl text-center text-white/90"
                >
                  12 שנים בתחום לימדו אותי דבר אחד: מוזיקה טובה זה הבסיס, אבל חיבור אנושי זה הקסם. אני בוחר את האירועים שלי בפינצטה, כדי לוודא שכל ערב הוא לא סתם "עבודה", אלא הצגה.
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
                  <a
                    href={wa("היי אלמוג, רוצה לבדוק התאמה לאירוע")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon touch-target group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden px-6 py-3 md:px-12 md:py-4 text-sm md:text-base"
                  >
                    <span className="relative z-20">בואו נבדוק התאמה ב-WhatsApp</span>
                    <Image 
                      src="/assets/icons/whatsapp.png" 
                      alt="WhatsApp" 
                      width={20} 
                      height={20}
                      className="relative z-20"
                    />
                    {!isMobile && (
                      <motion.div
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    )}
                  </a>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/media"
                    className="btn-neon-outline touch-target group relative inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-12 md:py-4 text-sm md:text-base"
                  >
                    <span className="relative z-10">לשמוע סטים</span>
                    <svg 
                      className="relative z-10 h-5 w-5"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Client Logos - Static display, no animation */}
        <div className="z-10 mt-6 w-full max-w-4xl px-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50 text-center">
            בין לקוחותינו
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 py-4">
            {[
              { file: "logoapril.jpeg", name: "April" },
              { file: "logoעירייה.png", name: "עיריית ירושלים" },
              { file: "iconnbana.svg", name: "בנא משקאות" },
              { file: "אורט תעופה וחלל .png", name: "אורט תעופה וחלל" },
              { file: "DHL.png", name: "DHL" },
              { file: "קריית אונו .png", name: "עיריית קריית אונו" },
              { file: "אריאל .jpeg", name: "אריאל" },
            ].map((logo) => (
              <div
                key={logo.file}
                className="relative h-10 w-20 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={`/assets/clients/${logo.file}`}
                  alt={logo.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LEAN CONVERSION FUNNEL --- */}
      <HomeSectionsLean />
      </div>
    </>
  );
}
