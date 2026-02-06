"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Video {
  id: string;
  label: string;
  title: string;
  description: string;
}

const defaultVideos: Video[] = [
  {
    id: "cLZaotSdbAg",
    label: "לייב",
    title: "Live Set - ים המלח",
    description: "סט מהרחבה - אנרגיה חיה מתחילה עד סוף."
  },
  {
    id: "Y0j0n9UopIg",
    label: "New Release",
    title: "Remix - הסוד שלי ממך",
    description: "רמיקס רשמי לשיר הקלאסי, בגרסת רחבות מחשמלת."
  },
  {
    id: "IlXhyfptrX8",
    label: "Mix Tape",
    title: "Mainstream Vol. 1",
    description: "אוסף להיטים ורגעים נבחרים במיקס אחד זורם."
  },
];

interface MusicVideosSectionProps {
  videos?: Video[];
  title?: string;
  subtitle?: string;
}

export const MusicVideosSection = ({ 
  videos = defaultVideos,
  title = "לא משמיע להיטים. יוצר אותם מחדש.",
  subtitle = "ההבדל בין שיר טוב לרגע שנשאר נמצא בגרסה המיוחדת שלא שמעתם בשום מקום אחר."
}: MusicVideosSectionProps) => {
  return (
    <section className="relative py-16 md:py-24 bg-depth-1">
      <div className="relative mx-auto w-full max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-right"
        >
          <h2 className="bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary font-medium">
            {subtitle}
          </p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="snap-x-container md:grid md:gap-6 md:grid-cols-3 md:overflow-visible">
          {videos.map((video, idx) => (
            <motion.a
              key={video.id}
              href={`https://youtu.be/${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="snap-x-item md:w-auto touch-target group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 shadow-xl backdrop-blur transition hover:scale-[1.02] hover:border-brand-blue/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                <Image
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
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
                <p className="text-xs text-brand-blue font-bold">{video.label}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{video.title}</h3>
                <p className="mt-2 text-xs text-foreground-secondary">{video.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicVideosSection;
