"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useMediaQuery";

const AnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground"),
  { ssr: false }
);

type Path = "none" | "school" | "events";

// RevealText - Kinetic Typography Component (Level 1000)
const RevealText = ({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "30%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 0.4, 
          delay: delay * 0.5,
          ease: "easeOut"
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

// A simple component for smooth scrolling
const SmoothScrollLink = ({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  ariaLabel?: string;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default function Home() {
  const [path, setPath] = useState<Path>("none");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
      {/* Fluid Typography System - Mobile Optimized */}
      <style jsx global>{`
        :root {
          --font-fluid-h1: clamp(1.75rem, 8vw + 1rem, 9rem);
          --font-fluid-h2: clamp(1.5rem, 5vw + 0.5rem, 5rem);
          --font-fluid-h3: clamp(1.125rem, 3vw + 0.5rem, 3rem);
          --font-fluid-p: clamp(0.875rem, 1vw + 0.5rem, 1.25rem);
        }
        
        /* Prevent layout shifts on mobile */
        @media (max-width: 768px) {
          * {
            will-change: auto !important;
          }
        }
      `}</style>
      
      <div className="text-brand-white">
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
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl"
          >
            ⭐
          </motion.span>
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
        className="relative overflow-hidden border-b border-brand-green/30 bg-gradient-to-r from-brand-green/10 via-brand-blue/10 to-brand-green/10 py-3"
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-brand-green/5 to-transparent" />
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl"
          >
            🎉
          </motion.span>
          <div className="text-center">
            <span className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-green">
              חדש!
            </span>
            <span className="mx-2 text-xs font-semibold md:text-sm lg:text-base">
              <span className="bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-transparent">
                חוגג מנגן
              </span>
              <span className="hidden md:inline">{" "}- הקונספט שהופך את בעלי השמחה לכוכבי הערב</span>
              <span className="md:hidden">{" "}- קונספט חדש!</span>
            </span>
          </div>
          <Link
            href="/chogeg-menagen"
            className="inline-block rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-3 py-1 text-xs md:px-4 md:py-1.5 font-bold text-black shadow-lg transition hover:scale-105 hover:shadow-brand-green/50"
          >
            גלה עוד →
          </Link>
        </div>
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
      <section className="relative flex h-dvh min-h-[500px] md:min-h-[700px] flex-col items-center justify-center overflow-hidden text-center">
        {/* Fade masks for smooth transitions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        {/* Morphing Blobs Background */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 120, 240, 360],
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 50% 40% 50%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-40 top-20 -z-20 h-[600px] w-[600px] bg-gradient-to-br from-brand-green/20 to-brand-blue/20 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 0.9, 1.3, 1],
            rotate: [360, 240, 120, 0],
            borderRadius: ["60% 40% 50% 60% / 50% 60% 40% 50%", "40% 60% 50% 40% / 50% 40% 60% 50%", "60% 40% 50% 60% / 50% 60% 40% 50%"]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-40 bottom-20 -z-20 h-[500px] w-[500px] bg-gradient-to-br from-brand-blue/20 to-brand-green/20 blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
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
        
        {/* Video with Scanline */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/almog/hero-poster.jpg"
          >
            <source src="https://storage.googleapis.com/www.compaktt.com/assets/hero-main-optimized.mp4" type="video/mp4" />
          </video>
          {/* Scanline Effect */}
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent"
          />
        </div>
        
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-dark/95 via-brand-dark/70 to-transparent" />
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
              {/* Title - Fluid Typography with Kinetic Reveal (Level 1000) */}
              <RevealText 
                className="mb-6" 
                delay={0}
              >
                <motion.h1 
                  style={{ 
                    fontSize: "var(--font-fluid-h1)",
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                    background: "linear-gradient(135deg, #059cc0 0%, #ffffff 50%, #03b28c 100%)",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  DJ ALMOG COHEN
                </motion.h1>
              </RevealText>

              {/* Subtitle - Fluid Typography */}
              <RevealText delay={0.3}>
                <h2
                  style={{
                    fontSize: "var(--font-fluid-p)",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    opacity: 0.8,
                  }}
                  className="mx-auto max-w-3xl"
                >
                  הפסקול המדויק של הרגעים הכי חשובים בחיים שלכם
                </h2>
              </RevealText>

              {/* CTA Buttons - Ultra */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <SmoothScrollLink
                    href="#events-section"
                    ariaLabel="גלילה לסקשן האירועים"
                    className="group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-6 py-3 md:px-12 md:py-4 text-sm md:text-base font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.7)] transition hover:scale-105 hover:shadow-[0_0_60px_rgba(3,178,140,1)]"
                  >
                    <span className="relative z-20">לאירוע הבא שלכם</span>
                    <motion.svg 
                      className="relative z-20 h-5 w-5"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                    <motion.div
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </SmoothScrollLink>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <SmoothScrollLink
                    href="#school-section"
                    ariaLabel="גלילה לסקשן בית הספר והקורסים"
                    className="group relative inline-flex items-center gap-2 md:gap-3 overflow-hidden rounded-full border-2 border-brand-blue bg-brand-blue/20 px-6 py-3 md:px-12 md:py-4 text-sm md:text-base font-bold text-white backdrop-blur-md transition hover:scale-105 hover:bg-brand-blue/30 hover:shadow-[0_0_40px_rgba(5,156,192,0.5)]"
                  >
                    <span className="relative z-10">לקורסים ולבית הספר</span>
                    <svg className="relative z-10 h-5 w-5 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            TRUSTED BY
          </p>
          <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/40 py-3">
            <div className="flex animate-[marquee_28s_linear_infinite] items-center gap-10 pr-10">
              {[
                "Zappa",
                "Hangar 11",
                "KTM",
                "DHL",
                "April",
                "Ort Network",
              ].map((name) => (
                <span
                  key={name}
                  className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.25em] text-white/60"
                >
                  {name}
                </span>
              ))}
              {[
                "Zappa",
                "Hangar 11",
                "KTM",
                "DHL",
                "April",
                "Ort Network",
              ].map((name) => (
                <span
                  key={`${name}-dup`}
                  className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.25em] text-white/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- WHO IS THIS FOR (LEVEL 1000) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-20">
        {/* Animated brand element */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -left-10 top-4 hidden h-24 w-24 opacity-30 md:block"
        >
          <Image src="/assets/brand/arrows-color.png" alt="אלמנט חצים מותגי" fill className="object-contain" />
        </motion.div>
        
        {/* Header with kinetic typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-right"
        >
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-white/50"
          >
            למי זה מתאים
          </motion.p>
          <RevealText delay={0.1}>
            <h2 
              style={{
                fontSize: "var(--font-fluid-h2)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                background: "linear-gradient(90deg, #03b28c 0%, #ffffff 50%, #059cc0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              className="mt-2"
            >
              שתי דרכים, מטרה אחת: לנצח על הרחבה.
            </h2>
          </RevealText>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-base leading-relaxed text-white/85 md:text-lg"
          >
            בין אם אתם עולים לעמדה ובין אם אתם אלו ששורפים את הרחבה למטה – הגעתם למקום שמדבר אנרגיה.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
          {/* Card 1 - Events */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -12, 
              scale: 1.02,
              rotateY: 3,
              rotateX: -3,
              z: 50
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="group relative overflow-hidden rounded-3xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/10 via-black/50 to-transparent p-5 md:p-8 text-right backdrop-blur-xl"
          >
            {/* Multi-layer glow */}
            <div className="absolute -inset-1 -z-10 animate-pulse rounded-3xl bg-gradient-to-r from-brand-green/40 to-transparent opacity-50 blur-xl" />
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-brand-green/20 to-transparent opacity-30 blur-2xl" />
            
            <div className="relative">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-brand-green"
              >
                לאירוע שלכם
              </motion.p>
              <h3 className="mt-3 text-2xl font-black text-white md:text-3xl lg:text-4xl">לחגוג</h3>
              <p className="mt-2 text-sm font-semibold text-brand-green/90">לזוגות שרוצים ללכת על בטוח.</p>
              <p className="mt-4 leading-relaxed text-white/85">
                האירוע שלכם הוא חד פעמי. האחריות שלי היא לוודא שהמוזיקה תהיה מדויקת, שהאנרגיה לא תיפול לרגע, ושאתם תהיו עסוקים רק בליהנות. אני דואג לווייב, אתם דואגים לאורחים.
              </p>
              
              <div className="mt-6 flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <SmoothScrollLink
                    href="#events-section"
                    ariaLabel="גלילה לסקשן האירועים"
                    className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(3,178,140,0.6)] transition hover:shadow-[0_0_50px_rgba(3,178,140,0.9)]"
                  >
                    <span className="relative z-10">בואו נרים אירוע</span>
                    <svg className="relative z-10 h-4 w-4 transition group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <motion.div
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />
                  </SmoothScrollLink>
                </motion.div>
              </div>
            </div>

            {/* Decorative corner element */}
            <div className="pointer-events-none absolute -bottom-10 -left-10 -z-10 h-32 w-32 rounded-full bg-brand-green/10 blur-2xl" />
          </motion.div>

          {/* Card 2 - School */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -12, 
              scale: 1.02,
              rotateY: -3,
              rotateX: -3,
              z: 50
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="group relative overflow-hidden rounded-3xl border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 via-black/50 to-transparent p-8 text-right backdrop-blur-xl"
          >
            {/* Multi-layer glow */}
            <div className="absolute -inset-1 -z-10 animate-pulse rounded-3xl bg-gradient-to-r from-brand-blue/40 to-transparent opacity-50 blur-xl" />
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-brand-blue/20 to-transparent opacity-30 blur-2xl" />
            
            <div className="relative">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue"
              >
                לעתיד שלך כדיג'יי
              </motion.p>
              <h3 className="mt-3 text-2xl font-black text-white md:text-3xl lg:text-4xl">ללמוד</h3>
              <p className="mt-2 text-sm font-semibold text-brand-blue/90">למי שרוצה להפוך תשוקה למקצוע.</p>
              <p className="mt-4 leading-relaxed text-white/85">
                רוצים לדעת להחזיק רחבה באמת? אני אלמד אתכם את כל מה שלא כתוב בספרים. טכניקה, פסיכולוגיה של קהל, ואיך לבנות לעצמכם שם בתעשייה. לא חוג, קריירה.
              </p>
              
              <div className="mt-6 flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <SmoothScrollLink
                    href="#school-section"
                    ariaLabel="גלילה לסקשן בית הספר והקורסים"
                    className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-brand-blue bg-brand-blue/10 px-6 py-3 text-sm font-bold text-brand-blue backdrop-blur-sm transition hover:bg-brand-blue/20 hover:shadow-[0_0_40px_rgba(5,156,192,0.5)]"
                  >
                    <span className="relative z-10">לפרטים על הקורסים</span>
                    <svg className="relative z-10 h-4 w-4 transition group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </SmoothScrollLink>
                </motion.div>
              </div>
            </div>

            {/* Decorative corner element */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-32 w-32 rounded-full bg-brand-blue/10 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* --- QUICK ACTION ICONS (LEVEL 1000) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-16">
        {/* Fade mask at bottom only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-16 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-between text-sm text-white/60"
        >
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px flex-1 bg-gradient-to-l from-white/20 via-white/10 to-transparent"
          />
          <span className="px-4 font-bold uppercase tracking-[0.3em]">פעולות מהירות</span>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent"
          />
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {/* WhatsApp */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={wa("שלום אלמוג, אשמח לשוחח בוואטסאפ לגבי אירוע / חתונה / קורס.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="פתיחת שיחה בוואטסאפ עם אלמוג"
            className="group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 -z-10 rounded-full bg-brand-green/20 blur-xl"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/20 to-black/40 backdrop-blur-sm transition group-hover:border-brand-green group-hover:shadow-[0_0_30px_rgba(3,178,140,0.6)]">
                <svg className="h-8 w-8 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/90 transition group-hover:text-brand-green">וואטסאפ</span>
          </motion.a>

          {/* Phone */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="tel:+972502427616"
            aria-label="התקשרות טלפונית לאלמוג"
            className="group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -inset-2 rounded-full bg-white/10 blur-xl"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-sm transition group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                <svg className="h-8 w-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/90 transition group-hover:text-white">טלפון</span>
          </motion.a>

          {/* Instagram */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/dj_almog_cohen/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="מעבר לעמוד האינסטגרם של אלמוג"
            className="group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -inset-2 -z-10 rounded-full bg-brand-blue/20 blur-xl"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/20 to-black/40 backdrop-blur-sm transition group-hover:border-brand-blue group-hover:shadow-[0_0_30px_rgba(5,156,192,0.6)]">
                <svg className="h-8 w-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/90 transition group-hover:text-brand-blue">אינסטגרם</span>
          </motion.a>

          {/* Email */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:almogmusiccohen@gmail.com"
            aria-label="שליחת מייל לאלמוג"
            className="group relative flex flex-col items-center gap-3"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="absolute -inset-2 rounded-full bg-white/10 blur-xl"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-sm transition group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                <svg className="h-8 w-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-white/90 transition group-hover:text-white">מייל</span>
          </motion.a>
        </div>
      </section>

      {/* --- COLLAPSIBLE SCHOOL SECTION --- */}
      <section id="school-section" className="relative mx-auto w-full max-w-6xl px-4 py-12">
        {/* Fade mask at bottom only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-12 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        <button
          onClick={() => setSchoolOpen(!schoolOpen)}
          className="group w-full rounded-2xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 px-6 py-5 text-right transition hover:border-brand-blue/50 hover:from-brand-blue/15 hover:to-brand-blue/10"
          aria-expanded={schoolOpen}
          aria-controls="school-content"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">
                למי שרוצה ללמוד לתקלט
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">בית הספר של אלמוג – מאפס ועד רחבה מלאה</h2>
              <p className="mt-2 text-sm text-white/60">10+ שנים מלמד • עשרות תלמידים מופיעים היום • מתחילים ועד מתקדמים</p>
            </div>
            <motion.div
              animate={{ rotate: schoolOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-brand-blue"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        <motion.div
          id="school-content"
          initial={false}
          animate={{
            height: schoolOpen ? "auto" : 0,
            opacity: schoolOpen ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-2 pt-8 pb-4">
            {/* Authority indicators */}
            <div className="mb-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3 md:grid-cols-3">
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3">
                <div className="text-2xl font-bold text-brand-blue">10+</div>
                <div className="text-xs text-white/60">שנים מלמד DJ'ים</div>
              </div>
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3">
                <div className="text-2xl font-bold text-brand-blue">50+</div>
                <div className="text-xs text-white/60">תלמידים הופיעו ברחבות</div>
              </div>
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3">
                <div className="text-2xl font-bold text-brand-blue">100%</div>
                <div className="text-xs text-white/60">ליווי אישי מותאם</div>
              </div>
            </div>

            {/* Course cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="card-glow rounded-2xl border border-brand-blue/20 bg-white/5 p-6 text-center shadow-[0_0_30px_-10px_rgba(5,156,192,0.35)] backdrop-blur"
              >
                <h3 className="mb-2 text-xl font-semibold">קורס מתחילים</h3>
                <p className="mb-4 text-sm text-white/70">מאפס מוחלט ועד המיקס הראשון שלך. כל מה שצריך כדי להתחיל נכון.</p>
                <Link className="font-medium text-brand-blue hover:underline" href="/courses">פרטים נוספים →</Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="card-glow rounded-2xl border border-brand-blue/20 bg-white/5 p-6 text-center shadow-[0_0_30px_-10px_rgba(5,156,192,0.35)] backdrop-blur"
              >
                <h3 className="mb-2 text-xl font-semibold">קורס מתקדמים</h3>
                <p className="mb-4 text-sm text-white/70">טכניקות מתקדמות, בניית סט מקצועי והבנת דינמיקת רחבה.</p>
                <Link className="font-medium text-brand-blue hover:underline" href="/courses">פרטים נוספים →</Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="card-glow rounded-2xl border border-brand-blue/20 bg-white/5 p-6 text-center shadow-[0_0_30px_-10px_rgba(5,156,192,0.35)] backdrop-blur"
              >
                <h3 className="mb-2 text-xl font-semibold">ליווי אישי</h3>
                <p className="mb-4 text-sm text-white/70">Artist Development מלא - מיתוג, שיווק, הפקה ובניית קריירה.</p>
                <a href={wa("היי, אשמח לפרטים על ליווי אישי")} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-blue hover:underline">קבע פגישת ייעוץ →</a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- MUSIC / LISTEN NOW (LEVEL 1000) --- */}
      <section id="music-section" className="relative py-24">
        {/* Fade mask at bottom only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-12 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        {/* Morphing background blobs */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            borderRadius: ["50% 50%", "40% 60%", "50% 50%"]
          }}
          transition={{ duration: 22, repeat: Infinity }}
          className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 bg-brand-blue/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 60, 0],
            borderRadius: ["50% 50%", "60% 40%", "50% 50%"]
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-96 w-96 bg-brand-green/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4">
          {/* Header with kinetic typography */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-right"
          >
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue"
            >
              LISTEN NOW
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-2xl font-bold text-transparent md:text-4xl lg:text-5xl"
            >
              לשמוע את אלמוג לפני שפוגשים אותו
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-lg text-white/80"
            >
              סטים חיים מהרחבה, מיקסים לאפטרים וקלאסים לחופות. כך תוכלו להרגיש את העולם המוזיקלי לפני הפגישה.
            </motion.p>
          </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Video 1 */}
          <a
            href="https://youtu.be/cLZaotSdbAg"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl shadow-black/40 backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/50">
              <Image
                src="https://img.youtube.com/vi/cLZaotSdbAg/maxresdefault.jpg"
                alt="תמונה ממוזערת של סרטון יוטיוב"
                fill
                className="object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-lg transition group-hover:scale-110">
                  <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-brand-blue/80">Live Set</p>
              <h3 className="mt-1 text-base font-semibold">מיקס לייב מהרחבה</h3>
              <p className="mt-2 text-xs text-white/70">סט חתונה מלא - מקבלת פנים ועד אפטר מטורף.</p>
            </div>
          </a>

          {/* Video 2 */}
          <a
            href="https://youtu.be/Y0j0n9UopIg"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl shadow-black/40 backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/50">
              <Image
                src="https://img.youtube.com/vi/Y0j0n9UopIg/maxresdefault.jpg"
                alt="תמונה ממוזערת של סרטון יוטיוב"
                fill
                className="object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-lg transition group-hover:scale-110">
                  <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-brand-blue/80">Behind the Decks</p>
              <h3 className="mt-1 text-base font-semibold">מאחורי הבמה</h3>
              <p className="mt-2 text-xs text-white/70">צילומים מהקונסול בזמן אירוע – האנרגיה בזמן אמת.</p>
            </div>
          </a>

          {/* Video 3 */}
          <a
            href="https://youtu.be/IlXhyfptrX8"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl shadow-black/40 backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/50">
              <Image
                src="https://img.youtube.com/vi/IlXhyfptrX8/maxresdefault.jpg"
                alt="תמונה ממוזערת של סרטון יוטיוב"
                fill
                className="object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/90 shadow-lg transition group-hover:scale-110">
                  <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-brand-blue/80">Event Highlights</p>
              <h3 className="mt-1 text-base font-semibold">רגעים מהאירועים</h3>
              <p className="mt-2 text-xs text-white/70">תקציר קצר מאירועים שונים – מוזיקה, אנשים, אנרגיה.</p>
            </div>
          </a>
        </div>
        </div>
      </section>

      {/* --- CASE STUDIES (LEVEL 1000) --- */}
      <section id="case-studies" className="relative mx-auto w-full max-w-6xl px-4 pb-24">
        {/* Fade mask at bottom only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-16 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        {/* Animated brand element */}
        <motion.div 
          animate={{ 
            rotate: [0, 180, 360],
            y: [0, -20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -left-8 top-6 hidden h-24 w-24 opacity-30 md:block"
        >
          <Image src="/assets/brand/triangle-color.png" alt="אלמנט משולש מותגי" fill className="object-contain" />
        </motion.div>

        {/* Header with kinetic typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-right"
        >
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-white/50"
          >
            REAL WORLD CASE STUDIES
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          >
            סיפורי רחבה מהעולם האמיתי
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl text-lg text-white/80"
          >
            כדי להבין באמת מה קורה באירוע, צריך לראות איך פותרים אתגרים בשטח – עם קהל אמיתי, מגבלות אמיתיות ורגעים שלא חוזרים.
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          <div className="relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5/90 p-6 shadow-xl shadow-black/50 backdrop-blur-lg md:grid-cols-2 md:p-8">
            <div className="brand-noise" aria-hidden="true" />
            <div className="relative space-y-4 text-right">
              <h3 className="text-xl font-semibold">סגירת מעגל: כשהמרצים שלי בחרו בי</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">GAL & DIMA • REAL STORY</p>
              <div className="border-r-2 border-white/20 pr-3 text-sm text-white/75">
                <div className="text-xs font-semibold text-[#059cc0]">הרקע</div>
                <p className="mt-1">קורונה. עולם האירועים ב-Mute. נרשמתי לקורס שיווק כדי להתפתח. המרצים היו גל ודימה. הם זיהו אצלי את התשוקה למוזיקה עוד לפני ששמעו אותי מנגן.</p>
              </div>
              <div className="border-r-2 border-white/20 pr-3 text-sm text-white/75">
                <div className="text-xs font-semibold text-[#059cc0]">המהלך</div>
                <p className="mt-1">הם בחרו בי להוביל את האירוע הכי חשוב שלהם. המעבר מסטודנט בכיתה ל-DJ ששולט ברחבה שלהם היה טבעי ומחשמל.</p>
              </div>
              <div className="border-r-2 border-brand-green pr-3 text-sm text-white">
                <div className="text-xs font-semibold text-[#03b28c]">התוצאה</div>
                <p className="mt-1">חתונה בלתי נשכחת שבה המרצים הפכו לרוקדים, והתלמיד הפך למאסטר על העמדה.</p>
              </div>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-lg shadow-black/60">
              <div className="brand-noise" aria-hidden="true" />
              <Image src="/assets/almog/wedding-1.jpg" alt="החתונה של גל ודימה" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-6 shadow-xl shadow-black/50 backdrop-blur-lg md:grid-cols-2 md:p-8">
            <div className="brand-noise" aria-hidden="true" />
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {/* Interactive Carousel */}
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full"
              >
                <Image src={carouselImages[carouselIndex]} alt={`מסיבת רחוב מעלה אדומים ${carouselIndex + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </motion.div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 md:p-3 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="תמונה קודמת"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 md:p-3 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="תמונה הבאה"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2 w-2 rounded-full transition ${
                      idx === carouselIndex ? "bg-brand-blue w-6" : "bg-white/40"
                    }`}
                    aria-label={`מעבר לתמונה ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Gallery Badge */}
              <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                📸 {carouselIndex + 1} / {carouselImages.length}
              </div>
            </div>
            <div className="relative space-y-4 text-right">
              <h3 className="text-xl font-semibold">מסיבת רחוב במעלה אדומים</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">CITY EVENT • MAALEH ADUMIM</p>
              <div className="border-r-2 border-white/20 pr-3 text-sm text-white/75">
                <div className="text-xs font-semibold text-[#059cc0]">הזמנה</div>
                <p className="mt-1">עיריית מעלה אדומים הזמינו אותי לסט.</p>
              </div>
              <div className="border-r-2 border-brand-green pr-3 text-sm text-white">
                <div className="text-xs font-semibold text-[#03b28c]">התוצאה</div>
                <p className="mt-1">רחוב שלם רקד, מאות אנשים בהילוך גבוה מהתחלה ועד סוף.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DJ EVENTS SECTION (LEVEL 1000) --- */}
      <section id="events-section" className="relative bg-section-events py-24">
        {/* Fade mask at bottom only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-16 bg-gradient-to-t from-brand-dark/60 to-transparent" />
        {/* Morphing background blobs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            borderRadius: ["40% 60%", "60% 40%", "40% 60%"]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="pointer-events-none absolute right-0 top-20 -z-10 h-96 w-96 bg-brand-green/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            borderRadius: ["60% 40%", "40% 60%", "60% 40%"]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="pointer-events-none absolute left-0 bottom-20 -z-10 h-96 w-96 bg-brand-blue/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4">
          {/* Header with kinetic typography */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="brand-shape-ring flex items-center justify-center p-[3px]"
              >
                <span className="brand-shape-dot" />
              </motion.span>
              <motion.span 
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="brand-shape-triangle"
              />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-brand-green"
            >
              DJ ALMOG COHEN
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-4 bg-gradient-to-r from-brand-green via-white to-brand-blue bg-clip-text text-5xl font-bold text-transparent"
            >
              אירועים שהם חוויה
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-2xl text-xl text-white/80"
            >
              התאמה מוזיקלית מדויקת שיוצרת אווירה, מרגשת ומרימה את הרחבה.
            </motion.p>
          </motion.div>
          
          <div className="space-y-8">
            {/* FEATURED: חוגג מנגן - Full Width Hero Card */}
            <motion.div
              whileHover={{ 
                y: -12, 
                scale: 1.05,
                rotateY: 5,
                rotateX: -5,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="group relative overflow-hidden rounded-2xl border-2 border-brand-green bg-gradient-to-br from-brand-green/20 via-black/50 to-brand-blue/20 p-8 text-center backdrop-blur-xl"
            >
              {/* Animated gradient glow */}
              <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-brand-green/30 via-brand-blue/30 to-brand-green/30 opacity-50 blur-2xl" />
              
              {/* Spotlight effect on hover */}
              <motion.div
                className="pointer-events-none absolute -inset-1 -z-10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at center, rgba(3,178,140,0.4) 0%, transparent 70%)",
                }}
              />

              {/* Floating stars */}
              <div className="absolute left-4 top-4 text-2xl opacity-60 transition group-hover:opacity-100 group-hover:animate-pulse">⭐</div>
              <div className="absolute right-6 top-6 text-xl opacity-60 transition group-hover:opacity-100 group-hover:animate-pulse delay-100">🎵</div>
              <div className="absolute bottom-6 left-6 text-xl opacity-60 transition group-hover:opacity-100 group-hover:animate-pulse delay-200">🎤</div>

              {/* Premium badge */}
              <motion.div
                initial={{ rotate: -12 }}
                whileHover={{ rotate: 0, scale: 1.1 }}
                className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg"
              >
                EXCLUSIVE
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ z: 0 }}
                whileHover={{ z: 50 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <h3 className="mb-3 bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-2xl font-bold text-transparent">
                  חוגג מנגן
                </h3>
                <p className="mb-6 text-base leading-relaxed text-white/90">
                  הקונספט הייחודי שבו <span className="font-bold text-brand-green">בעל/ת השמחה</span> הופכים ל<span className="font-bold text-brand-blue">כוכבי הערב</span>.
                </p>

                {/* Animated CTA */}
                <Link
                  href="/chogeg-menagen"
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-6 py-3 font-bold text-black shadow-[0_0_20px_rgba(3,178,140,0.5)] transition hover:scale-110 hover:shadow-[0_0_40px_rgba(3,178,140,0.8)]"
                >
                  <span className="relative z-10">מה זה חוגג מנגן?</span>
                  <motion.svg 
                    className="relative z-10 h-5 w-5"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -z-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-[100%]" />
                </Link>
              </motion.div>

              {/* Noise texture */}
              <div className="brand-noise opacity-20" aria-hidden="true" />
            </motion.div>

            {/* Other Services - 2 Column Grid */}
            <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="card-glow-green rounded-2xl border border-brand-green/25 bg-white/5 p-6 text-center shadow-[0_0_30px_-10px_rgba(3,178,140,0.35)] backdrop-blur"
              >
                <h3 className="mb-2 text-xl font-semibold">חתונות</h3>
                <p className="mb-4 text-white/70">ליווי מלא, מפגישת ייעוץ, דרך בחירת שיר חופה ועד מסיבה בלתי נשכחת.</p>
                <Link className="font-medium text-brand-green hover:underline" href="/services/weddings">
                  חבילות חתונה
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="card-glow-green rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-lg shadow-black/30 backdrop-blur"
              >
                <h3 className="mb-2 text-xl font-semibold">אירועים עסקיים ופרטיים</h3>
                <p className="mb-4 text-white/70">אירועי חברה, השקות, כנסים ומסיבות פרטיות בכל סגנון.</p>
                <Link className="font-medium text-brand-green hover:underline" href="/services/corporate">
                  פרטים נוספים
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT THE ARTIST (LEVEL 1000 ULTRA) --- */}
      <section className="relative overflow-hidden py-40">
        {/* Fade masks for clean transitions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-32 bg-gradient-to-b from-brand-dark to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-brand-dark to-transparent" />
        {/* Dynamic Gradient Background with Animation */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(5,156,192,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(3,178,140,0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(5,156,192,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(3,178,140,0.15) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="brand-noise opacity-20" aria-hidden="true" />
        
        {/* Morphing Blobs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-32 top-20 h-96 w-96 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 0.8, 1.2, 1],
            rotate: [360, 270, 180, 90, 0],
            borderRadius: ["70% 30% 30% 70% / 30% 70% 70% 30%", "30% 70% 70% 30% / 70% 30% 30% 70%", "70% 30% 30% 70% / 30% 70% 70% 30%"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-32 bottom-20 h-96 w-96 bg-gradient-to-br from-brand-green/20 to-brand-blue/20 blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="pointer-events-none absolute h-2 w-2 rounded-full bg-brand-green/40"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}

        <div className="relative mx-auto w-full max-w-7xl px-4">
          <div className="grid items-center gap-8 md:gap-16 md:grid-cols-2">
            {/* Left: Image with 3D Effects */}
            <motion.div
              initial={{ opacity: 0, x: -80, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative"
            >
              {/* Multi-layer Glow */}
              <div className="absolute -inset-2 animate-pulse rounded-[40px] bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue opacity-60 blur-2xl" />
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-brand-green via-brand-blue to-brand-green opacity-40 blur-3xl" />
              
              <motion.div 
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative overflow-hidden rounded-[32px] border-2 border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                <Image 
                  src="/assets/almog/IMG_6561.jpg" 
                  alt="DJ Almog Cohen" 
                  width={700} 
                  height={900} 
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-brand-blue/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-blue/10 opacity-0 transition duration-500 group-hover:opacity-100" />
                
                {/* Animated Badge - ULTRA */}
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-4 right-4 md:bottom-8 md:right-8 overflow-hidden rounded-full border-2 border-brand-green/60 bg-black/90 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-brand-green/20 to-brand-blue/20" />
                  <div className="relative flex items-center gap-2 px-4 py-2 md:gap-3 md:px-5 backdrop-blur-md">
                    <span className="relative flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                      <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-brand-green opacity-75" style={{ animationDelay: "0.5s" }} />
                      <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-green shadow-[0_0_15px_rgba(3,178,140,0.8)]" />
                    </span>
                    <span className="text-xs md:text-base font-bold text-brand-green">זמין לאירועים</span>
                  </div>
                </motion.div>

                {/* Scanline Effect */}
                <motion.div
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-brand-green/10 to-transparent"
                />
              </motion.div>
            </motion.div>

            {/* Right: Kinetic Typography */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-8 text-right"
            >
              {/* Animated Tag */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                className="inline-flex items-center gap-3 overflow-hidden rounded-full border border-brand-blue/40 bg-gradient-to-r from-brand-blue/15 to-brand-green/15 px-5 py-2 backdrop-blur-md"
              >
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-2 w-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(5,156,192,0.8)]"
                />
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-brand-blue">About The Artist</span>
              </motion.div>

              {/* Title - Split Letter Animation */}
              <div className="overflow-hidden">
                <motion.h2 
                  className="text-5xl font-bold leading-tight md:text-7xl"
                  style={{ 
                    background: "linear-gradient(135deg, #059cc0 0%, #ffffff 50%, #03b28c 100%)",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {["המוזיקה", "זה", "אני."].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.6 + i * 0.15,
                        ease: "easeOut"
                      }}
                      className="inline-block"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                  <br />
                  {["האנשים", "זה", "אתם."].map((word, i) => (
                    <motion.span
                      key={i + 3}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 1.1 + i * 0.15,
                        ease: "easeOut"
                      }}
                      className="inline-block"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </motion.h2>
              </div>

              {/* Description - Static Highlights (NO false affordance) */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 }}
                className="text-xl leading-relaxed text-white/95"
              >
                שמי{" "}
                <span className="font-bold text-brand-green">
                  אלמוג כהן
                </span>
                , ואני לא סתם DJ.{" "}
                אני{" "}
                <span className="relative inline-block">
                  <motion.span 
                    className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-brand-blue/40 to-brand-green/40"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2, duration: 0.8 }}
                  />
                  <span className="relative font-bold">מנהל מוזיקלי</span>
                </span>{" "}
                שמאמין שכל אירוע זה סיפור –{" "}
                ואני כאן כדי לתת לו את{" "}
                <span className="font-bold text-brand-blue">
                  הפסקול המושלם
                </span>
                .
              </motion.p>

              {/* Stats - 3D Cards */}
              <div className="grid grid-cols-3 gap-4 py-6">
                {[
                  { num: "10+", label: "שנים", color: "blue", delay: 1.8 },
                  { num: "500+", label: "אירועים", color: "green", delay: 1.9 },
                  { num: "100%", label: "מחויבות", color: "white", delay: 2 },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotateX: -45 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: stat.delay, type: "spring" }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 10,
                      z: 50
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm ${
                      stat.color === "blue" ? "border-brand-blue/30 bg-brand-blue/10" :
                      stat.color === "green" ? "border-brand-green/30 bg-brand-green/10" :
                      "border-white/30 bg-white/10"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative p-5 text-center">
                      <div className={`text-4xl font-black ${
                        stat.color === "blue" ? "text-brand-blue" :
                        stat.color === "green" ? "text-brand-green" :
                        "text-white"
                      }`}>
                        {stat.num}
                      </div>
                      <div className="mt-1 text-xs font-medium text-white/70">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button - ULTRA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.1, type: "spring" }}
              >
                <Link 
                  href="/about"
                  className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue px-10 py-5 text-xl font-black text-black shadow-[0_0_60px_rgba(3,178,140,0.6)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_80px_rgba(3,178,140,0.9)]"
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <span className="relative z-10">הסיפור המלא שלי</span>
                  <motion.svg 
                    className="relative z-10 h-6 w-6"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                  
                  {/* Shimmer */}
                  <motion.div
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FROM THE BLOG (LEVEL 1000) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24" aria-labelledby="home-blog-heading">
        {/* Fade mask at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-12 bg-gradient-to-t from-brand-dark/80 to-transparent" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="text-right">
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue"
            >
              מהבלוג
            </motion.p>
            <motion.h2 
              id="home-blog-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-2xl font-bold text-transparent md:text-4xl lg:text-5xl"
            >
              מדריכים וטיפים לאירוע המושלם
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 max-w-2xl text-lg text-white/80"
            >
              תוכן מקצועי לזוגות, מפיקים ו-DJ&apos;ים – בחירת DJ, פלייליסט לחופה, קורסים ועוד.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-blue bg-brand-blue/10 px-6 py-3 text-sm font-bold text-brand-blue backdrop-blur-sm transition hover:bg-brand-blue/20 hover:shadow-[0_0_30px_rgba(5,156,192,0.4)]"
            >
              לכל המאמרים
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
          >
            <div className="space-y-3">
              <p className="text-xs text-brand-blue/80">חתונות</p>
              <h3 className="text-lg font-semibold">איך לבחור DJ לחתונה: 5 שאלות חובה לפני שסוגרים</h3>
              <p className="text-sm text-white/75">המדריך לזוגות שמחפשים DJ ברמה הגבוהה ביותר – עם 5 שאלות מפתח לפגישת הייעוץ.</p>
            </div>
            <div className="mt-4">
              <Link href="/blog/how-to-choose-wedding-dj" className="text-sm font-semibold text-brand-blue hover:underline">
                לקריאת המאמר →
              </Link>
            </div>
          </motion.article>

          <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
          >
            <div className="space-y-3">
              <p className="text-xs text-brand-blue/80">חופה</p>
              <h3 className="text-lg font-semibold">20 שירי כניסה לחופה שישברו את הרשת</h3>
              <p className="text-sm text-white/75">פלייליסט חופה מחולק לקטגוריות – קלאסיים, ייחודיים ושירים לכניסת הורים וסבים.</p>
            </div>
            <div className="mt-4">
              <Link href="/blog/chuppah-20-songs" className="text-sm font-semibold text-brand-blue hover:underline">
                לקריאת המאמר →
              </Link>
            </div>
          </motion.article>

          <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
          >
            <div className="space-y-3">
              <p className="text-xs text-brand-blue/80">החלטות מוזיקליות</p>
              <h3 className="text-lg font-semibold">DJ או להקה? המדריך המאוזן שיעזור לכם להחליט</h3>
              <p className="text-sm text-white/75">סקירה של היתרונות, החסרונות והפתרון המנצח – DJ עם נגנים חיים.</p>
            </div>
            <div className="mt-4">
              <Link href="/blog/dj-or-band-guide" className="text-sm font-semibold text-brand-blue hover:underline">
                לקריאת המאמר →
              </Link>
            </div>
          </motion.article>
        </div>
      </section>

      {/* --- COLLAPSIBLE FAQ (LEVEL 1000) --- */}
      <section id="faq" className="relative mx-auto w-full max-w-4xl px-4 pb-20">
        <button
          onClick={() => setFaqOpen(!faqOpen)}
          className="group w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-right backdrop-blur-sm transition hover:border-white/20 hover:bg-black/50"
          aria-expanded={faqOpen}
          aria-controls="faq-content"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">FAQ</p>
              <h2 className="text-xl font-bold md:text-2xl">שאלות נפוצות – לפני שסוגרים תאריך</h2>
              <p className="mt-2 text-sm text-white/60">
                8 שאלות שתעזרנה לכם להחליט • לחצו להרחבה
              </p>
            </div>
            <motion.div
              animate={{ rotate: faqOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        <motion.div
          id="faq-content"
          initial={false}
          animate={{
            height: faqOpen ? "auto" : 0,
            opacity: faqOpen ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/40">
          {[
            {
              q: "איך אנחנו בוחרים את המוזיקה לאירוע?",
              a: "אנחנו בונים יחד את ה-DNA המוזיקלי שלכם. בפגישת האפיון נצלול לטעמים שלכם, נגדיר 'שחורים' (מה לא לנגן) ו'לבנים' (שירי חובה), ואני אדאג לחבר את הכל לזרימה מושלמת בזמן אמת.",
            },
            {
              q: "מה קורה אם חלילה אתה חולה ביום האירוע?",
              a: "אני מגיע עם רשת ביטחון מלאה. כחלק מהחוזה, ישנו DJ גיבוי ברמה שלי שנמצא בכוננות ומכיר את התיק המוזיקלי שלכם, כך שהאירוע שלכם מבוטח ב-100%.",
            },
            {
              q: "האם אפשר לשלב נגנים חיים?",
              a: "בהחלט. זהו אחד הבידולים שלי. אני עובד קבוע עם סקסופוניסטים, כנרים ומתופפים שיודעים להשתלב על הסט שלי בדיוק ברגעים הנכונים ולהרים את האנרגיה.",
            },
            {
              q: "כמה אתה מעורב בבניית לוח הזמנים של הערב?",
              a: "אני מעורב ממש בבנייה של הערב. מעבר למוזיקה, נעבור יחד על לוח הזמנים – מתי נכון לפתוח את הרחבה, איפה למקם נאומים וברכות, ואיך לתכנן רגעי שיא כך שהערב יהיה זורם, רגוע ומדויק לכם.",
            },
            {
              q: "מה ההבדל בין DJ 'טכני' לבין DJ שמנהל את הרחבה?",
              a: "DJ טכני בא, מנגן והולך – לפעמים בלי גיבוי ובלי לחשוב על סיכונים באירוע. DJ שמנהל רחבה מסתכל על כל הערב: קורא אנשים, שולט באנרגיה, מתכונן מראש לתקלות וגם מגיע עם תוכנית גיבוי. אני מתייחס לכל ערב כמו להופעה חיה שאתם במרכז שלה, לא כעוד סט ברשימה.",
            },
            {
              q: "איך אתה מתמודד עם בקשות בזמן אמת מהמשפחה והחברים?",
              a: "בקשות הן חלק מהכיף. התפקיד שלי הוא לסנן בעדינות מה מתאים עכשיו ומה ישבור את הווייב – כך שכולם ירגישו שקיבלו מקום, והרחבה עדיין תישאר מלאה.",
            },
            {
              q: "האם אתה נפגש איתנו לפני האירוע או שהכול בטלפון?",
              a: "אפשר להיפגש, לדבר בטלפון או זום – מה שנוח לכם. היו לי זוגות שכל כך סמכו עליי שעשינו זום ראשון, ורק חודש לפני החתונה נפגשנו פיזית לבחור יחד שירי חופה, סלואו ושירים לרגעים המיוחדים שלכם.",
            },
            {
              q: "מה חשוב שתדע עלינו לפני שאתה בונה את הסט?",
              a: "חשוב לי לדעת את ההעדפות המוזיקליות שלכם: מי חמשת הזמרים או האמנים שאתם הכי אוהבים, מה אתם ממש לא רוצים לשמוע באירוע, ואיך אתם מדמיינים את האנרגיה ברחבה. את כל השאר נשאיר לפגישה – שם נרכיב את התמונה המלאה ונבנה את הסט.",
            },
          ].map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                key={item.q}
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                className="w-full text-right transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold md:text-base">{item.q}</h3>
                    {isOpen && <p className="mt-2 text-xs text-white/75 md:text-sm">{item.a}</p>}
                  </div>
                  <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                    <span className={`inline-block text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      ˅
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 px-2 pb-2 text-center">
            <p className="text-xs text-white/70 md:text-sm">
              עברנו על השאלות? אם זה מרגיש מתאים, בואו נבדוק ביחד תאריך פנוי.
            </p>
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={wa("היי אלמוג, עברנו על השאלות באתר ורוצים לבדוק אם אתה פנוי לתאריך שלנו.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-green bg-transparent px-6 py-2 text-xs font-semibold text-brand-green shadow-sm shadow-brand-green/30 transition hover:bg-brand-green/10 md:text-sm"
            >
              <span>בדיקת תאריך ב־WhatsApp</span>
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* --- FINAL CTA (LEVEL 1000) --- */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-24">
        {/* Fade mask at bottom only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-12 bg-gradient-to-t from-brand-dark/70 to-transparent" />
        {/* Morphing blobs */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            borderRadius: ["40% 60%", "60% 40%", "40% 60%"]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="pointer-events-none absolute -left-32 -top-20 -z-10 h-96 w-96 bg-brand-green/15 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            borderRadius: ["60% 40%", "40% 60%", "60% 40%"]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="pointer-events-none absolute -bottom-20 -right-32 -z-10 h-96 w-96 bg-brand-blue/15 blur-3xl"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-black/90 via-black/70 to-brand-blue/20 p-12 text-center shadow-2xl backdrop-blur-xl md:p-16">
            {/* Multi-layer glow */}
            <div className="absolute -inset-2 -z-10 animate-pulse rounded-3xl bg-gradient-to-r from-brand-green/30 via-brand-blue/30 to-brand-green/30 opacity-50 blur-2xl" />
            
            <div className="brand-noise opacity-20" aria-hidden="true" />
            
            <div className="relative">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
              >
                תפסיקו לגלול. מצאתם.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/95 md:text-xl md:leading-relaxed"
              >
                האירוע שלכם הוא לא &quot;עוד תאריך&quot; ביומן. אני יודע כמה השקעתם בערב הזה. האחריות שלי היא לוודא שהכול יעבוד מושלם – מהשיר הראשון ועד אחרון הרוקדים. בואו נכיר, נתאם ציפיות, ונבנה לכם ראש שקט ומסיבה מנצחת.
              </motion.p>
              
              <motion.a
                href={wa("שלום אלמוג, אשמח לבדוק זמינות לאירוע שלי")}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-10 py-5 text-lg font-bold text-black shadow-[0_0_50px_rgba(3,178,140,0.6)] transition hover:shadow-[0_0_80px_rgba(3,178,140,1)]"
              >
                <span className="relative z-20 drop-shadow-sm">לבדיקת זמינות ב-WhatsApp</span>
                <motion.svg 
                  className="relative z-20 h-6 w-6 drop-shadow-sm"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- MOBILE STICKY ACTION BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] md:hidden">
        <div className="mx-auto flex w-full max-w-6xl gap-3 px-4">
          <a
            href={wa("שלום אלמוג, אשמח לשיחה בוואטסאפ")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="פתיחת שיחה בוואטסאפ עם אלמוג"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#03b28c] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/40"
          >
            <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
              <Image src="/assets/icons/whatsapp.png" alt="אייקון וואטסאפ" width={24} height={24} />
            </span>
            <span>וואטסאפ ישיר</span>
          </a>
          <a
            href={wa("היי אלמוג, אנחנו רוצים לבדוק תאריך פנוי לאירוע")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="בדיקת תאריך פנוי בוואטסאפ"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#059cc0] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/40"
          >
            <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
              <Image src="/assets/icons/whatsapp.png" alt="אייקון לוח שנה" width={24} height={24} />
            </span>
            <span>בדיקת תאריך</span>
          </a>
        </div>
      </div>

      {/* --- DESKTOP STICKY AUDIO PLAYER --- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 hidden border-t border-white/10 bg-black/80/90 px-4 py-3 md:flex">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between text-xs text-white/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "הפסקת ניגון הסט" : "ניגון הסט"}
              aria-pressed={isPlaying}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 ${isPlaying ? "animate-pulse" : ""}`}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <span className="text-sm">
              מנגן עכשיו: <span className="font-semibold">סט חתונות 2025</span>
            </span>
          </div>
          <span className="hidden text-[11px] text-white/50 md:inline">
            חוויה מלאה עם סאונד – מומלץ לשמוע בווליום נמוך בזמן הגלילה באתר
          </span>
        </div>
      </div>
      </div>
    </>
  );
}
