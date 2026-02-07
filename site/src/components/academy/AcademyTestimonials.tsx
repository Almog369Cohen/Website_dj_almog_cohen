"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface AudioTestimonial {
  id: string;
  name: string;
  /** e.g. "תלמיד מסלול PRO" */
  role: string;
  /** short transcribed quote */
  quote: string;
  /** path to audio file in /public */
  audioSrc: string;
  /** duration string e.g. "0:34" */
  duration: string;
}

interface ScreenshotTestimonial {
  id: string;
  /** path to screenshot image in /public */
  imageSrc: string;
  alt: string;
  name: string;
  /** optional context line */
  context?: string;
}

interface QuoteTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  /** e.g. "מסלול PRO" */
  package?: string;
}

/* ═══════════════════════════════════════════
   PLACEHOLDER DATA — replace with real content
   ═══════════════════════════════════════════ */

const audioTestimonials: AudioTestimonial[] = [
  {
    id: "audio-itay",
    name: "איתי",
    role: "אחרי שיעור ראשון",
    quote: "הקלטה אמיתית של איתי אחרי השיעור הראשון שלו",
    audioSrc: "/testimonials/itay-lesson1.m4a",
    duration: "0:30",
  },
  {
    id: "audio-2",
    name: "תלמיד 2",
    role: "חבילת בסיס",
    quote: "הציוד פה מטורף. עובדים על XDJ-RX3 אמיתי, לא על קונטרולר צעצוע.",
    audioSrc: "/testimonials/audio-2.mp3",
    duration: "0:22",
  },
  {
    id: "audio-3",
    name: "תלמיד 3",
    role: "התמחות שטח",
    quote: "היציאה לשטח שינתה לי את הראש. להיות באירוע אמיתי ולראות איך זה עובד – אין תחליף.",
    audioSrc: "/testimonials/audio-3.mp3",
    duration: "0:41",
  },
];

const screenshotTestimonials: ScreenshotTestimonial[] = [
  {
    id: "ss-1",
    imageSrc: "/testimonials/screenshot-1.jpg",
    alt: "הודעת וואטסאפ מתלמיד",
    name: "תלמיד 1",
    context: "אחרי השיעור השלישי",
  },
  {
    id: "ss-2",
    imageSrc: "/testimonials/screenshot-2.jpg",
    alt: "הודעת וואטסאפ מתלמיד",
    name: "תלמיד 2",
    context: "אחרי אירוע ראשון",
  },
  {
    id: "ss-3",
    imageSrc: "/testimonials/screenshot-3.jpg",
    alt: "הודעת וואטסאפ מתלמיד",
    name: "תלמיד 3",
  },
];

const quoteTestimonials: QuoteTestimonial[] = [
  {
    id: "q-1",
    name: "תלמיד 1",
    role: "בוגר מסלול PRO",
    quote: "אחרי 3 שיעורים כבר סגרתי אירוע ב-1,000 שקל. הגעתי עם אפס ניסיון על פלטה.",
    package: "מסלול PRO",
  },
  {
    id: "q-2",
    name: "תלמיד 2",
    role: "בוגר חבילת בסיס",
    quote: "הציוד פה ברמה אחרת. עובדים על XDJ-RX3 אמיתי. אלמוג מלמד בצורה שאתה מבין, לא סתם לוחץ כפתורים.",
    package: "חבילת בסיס",
  },
  {
    id: "q-3",
    name: "תלמיד 3",
    role: "בוגר התמחות שטח",
    quote: "היציאה לשטח שינתה לי את הראש. להיות באירוע אמיתי ולראות איך זה עובד – אין תחליף לזה.",
    package: "התמחות שטח",
  },
  {
    id: "q-4",
    name: "תלמיד 4",
    role: "בוגר מסלול PRO",
    quote: "הליווי הטלפוני והוואטסאפ עושים את ההבדל. יש לך שאלה? אלמוג עונה. פשוט ככה.",
    package: "מסלול PRO",
  },
];

/* ═══════════════════════════════════════════
   AUDIO PLAYER COMPONENT
   ═══════════════════════════════════════════ */

function AudioPlayer({ testimonial }: { testimonial: AudioTestimonial }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [hasError, setHasError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const speeds = [1, 1.5, 2] as const;

  const cycleSpeed = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const currentIdx = speeds.indexOf(playbackRate as 1 | 1.5 | 2);
    const nextRate = speeds[(currentIdx + 1) % speeds.length];
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }, [playbackRate]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setHasError(true));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, hasError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);

      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60);
      setCurrentTime(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
    };

    const onError = () => setHasError(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // RTL: right edge is 0%
    const clickX = e.clientX - rect.left;
    const pct = 1 - clickX / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  // Generate pseudo-waveform bars
  const bars = 28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-background/50 p-5 backdrop-blur-xl"
    >
      <audio ref={audioRef} src={testimonial.audioSrc} preload="metadata" />

      {/* Header: name + role */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground-heading">{testimonial.name}</p>
          <p className="text-xs text-foreground-secondary">{testimonial.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleSpeed}
            className="rounded-full bg-foreground-secondary/10 px-2 py-0.5 text-[10px] font-bold text-foreground-secondary transition hover:bg-foreground-secondary/20"
            aria-label="שנה מהירות"
          >
            {playbackRate}x
          </button>
          <span className="text-xs text-foreground-secondary">{currentTime} / {testimonial.duration}</span>
        </div>
      </div>

      {/* Player */}
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          disabled={hasError}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand-blue to-brand-green text-white shadow-lg transition hover:scale-110 disabled:opacity-40"
          aria-label={isPlaying ? "השהה" : "נגן"}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="h-5 w-5 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Waveform / Progress */}
        <div
          className="flex flex-1 cursor-pointer items-end gap-[2px] h-10"
          onClick={handleSeek}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Array.from({ length: bars }).map((_, i) => {
            // pseudo-random heights for visual effect
            const h = [60, 80, 45, 95, 70, 55, 85, 40, 75, 90, 50, 65, 88, 42, 78, 58, 92, 48, 72, 83, 52, 68, 95, 38, 82, 62, 88, 55][i % 28];
            const barPct = ((bars - i) / bars) * 100; // RTL: rightmost bar = 0%
            const isActive = barPct <= progress;

            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors duration-150 ${
                  isActive
                    ? "bg-brand-blue"
                    : "bg-foreground-secondary/20"
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Quote */}
      <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Error fallback */}
      {hasError && (
        <p className="mt-2 text-xs text-foreground-secondary/60">
          קובץ שמע לא זמין כרגע
        </p>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SCREENSHOT CARD COMPONENT
   ═══════════════════════════════════════════ */

function ScreenshotCard({ testimonial }: { testimonial: ScreenshotTestimonial }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-2xl border border-border bg-background/50 backdrop-blur-xl"
    >
      {/* Screenshot */}
      <div className="relative aspect-[3/4] w-full bg-foreground-secondary/5">
        {imgError ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-4xl">📱</span>
            <p className="text-xs text-foreground-secondary">צילום מסך – {testimonial.name}</p>
          </div>
        ) : (
          <Image
            src={testimonial.imageSrc}
            alt={testimonial.alt}
            fill
            className="object-contain p-2"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>

      {/* Caption */}
      <div className="border-t border-border p-4">
        <p className="text-sm font-bold text-foreground-heading">{testimonial.name}</p>
        {testimonial.context && (
          <p className="text-xs text-foreground-secondary">{testimonial.context}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   QUOTE CARD COMPONENT
   ═══════════════════════════════════════════ */

function QuoteCard({ testimonial }: { testimonial: QuoteTestimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-xl"
    >
      {/* Quote mark */}
      <div className="mb-3 text-3xl leading-none text-brand-blue/30">&ldquo;</div>

      <p className="mb-4 text-base leading-relaxed text-foreground-secondary">
        {testimonial.quote}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground-heading">{testimonial.name}</p>
          <p className="text-xs text-foreground-secondary">{testimonial.role}</p>
        </div>
        {testimonial.package && (
          <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue">
            {testimonial.package}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════ */

type TabKey = "audio" | "screenshots" | "quotes";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "audio", label: "הקלטות", icon: "🎧" },
  { key: "screenshots", label: "צילומי מסך", icon: "📱" },
  { key: "quotes", label: "ציטוטים", icon: "💬" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export default function AcademyTestimonials() {
  const [activeTab, setActiveTab] = useState<TabKey>("audio");

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-black text-foreground-heading md:text-5xl">
            מה התלמידים אומרים
          </h2>
          <p className="text-foreground-secondary">
            עדויות אמיתיות מתלמידים – בקול שלהם
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-brand-blue text-white shadow-lg"
                  : "bg-foreground-secondary/10 text-foreground-secondary hover:bg-foreground-secondary/20"
              }`}
            >
              <span className="ml-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "audio" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {audioTestimonials.map((t) => (
                <AudioPlayer key={t.id} testimonial={t} />
              ))}
            </motion.div>
          )}

          {activeTab === "screenshots" && (
            <motion.div
              key="screenshots"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {screenshotTestimonials.map((t) => (
                <ScreenshotCard key={t.id} testimonial={t} />
              ))}
            </motion.div>
          )}

          {activeTab === "quotes" && (
            <motion.div
              key="quotes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {quoteTestimonials.map((t) => (
                <QuoteCard key={t.id} testimonial={t} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
