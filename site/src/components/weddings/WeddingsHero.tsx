"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { buildWhatsAppLink, getEventsWhatsAppMessage } from "@/utils/whatsapp";
import { trackEvent } from "@/utils/analytics";

type WeddingsHeroProps = {
  ctaSource?: string;
};

export default function WeddingsHero({ ctaSource = "weddings_hero" }: WeddingsHeroProps) {
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waLink = buildWhatsAppLink(getEventsWhatsAppMessage("weddings_dj"));
  const isMobile = useIsMobile();

  const youtubeEmbedUrl =
    "https://www.youtube.com/embed/Sxfrs5Pzy8A?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=Sxfrs5Pzy8A";

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      const onChange = () => setPrefersReducedMotion(!!mq.matches);
      onChange();
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }
    return;
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked - fallback to poster
    });
  }, [isMobile]);

  const tryPlayHeroVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked - fallback to poster
    });
  };

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="absolute left-0 top-0 h-64 w-64 md:h-96 md:w-96 bg-[#059cc0]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 md:h-96 md:w-96 bg-[#03b28c]/10 blur-[120px]" />
      </div>

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {prefersReducedMotion ? (
          <Image src="/assets/almog/IMG_6561.jpg" alt="" fill priority className="object-cover" />
        ) : isMobile ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={youtubeEmbedUrl}
            title="DJ Almog Cohen Hero"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : !heroVideoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/almog/IMG_6561.jpg"
            onCanPlay={tryPlayHeroVideo}
            onError={() => setHeroVideoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectFit: "cover", aspectRatio: "16 / 9" }}
          >
            <source src="/assets/hero-main-optimized.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image src="/assets/almog/IMG_6561.jpg" alt="" fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:block"
          >
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl border-4 border-[#03b28c]/30">
              <Image
                src="/photo almog cohen website/D81CEFD1-F9B9-4D69-BD3A-C0C646DBD322.JPG"
                alt="DJ אלמוג כהן"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -right-4 rounded-2xl border border-white/20 bg-gradient-to-br from-[#059cc0] to-[#03b28c] p-5 backdrop-blur-xl"
            >
              <div className="text-3xl font-black">1000+</div>
              <div className="text-sm text-white">אירועים</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-right"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-xl">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#03b28c]" />
              <span className="text-xs font-bold text-white sm:text-sm">10+ שנות ניסיון | דירוג 5★</span>
            </div>

            <h1 className="mb-6 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              החתונה שלכם מגיעה רק פעם אחת
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white sm:text-xl md:mx-0 md:text-2xl">
              רחבה מלאה מהרגע הראשון. מובטח.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_whatsapp_click", { source: ctaSource })}
                className="group relative w-full sm:w-auto"
              >
                <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] blur-lg opacity-75 transition duration-300 group-hover:opacity-100" />
                <div className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black shadow-lg transition hover:scale-[1.02] sm:w-auto sm:text-lg">
                  <span>שלחו הודעה עכשיו</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </a>
              <a
                href="https://youtu.be/cLZaotSdbAg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto sm:text-base"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>צפו בסט מלא</span>
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white md:justify-start">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>תגובה תוך 5 דקות</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#03b28c]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>ללא התחייבות</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
