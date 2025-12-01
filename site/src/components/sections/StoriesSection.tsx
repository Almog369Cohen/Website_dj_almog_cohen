"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Story {
  title: string;
  content: string[];
  image: string;
  label: string;
  color: "green" | "blue";
}

const defaultStories: Story[] = [
  {
    title: "כשהמרצים שלי הפכו לקהל שלי.",
    content: [
      "בקורונה נרשמתי ללמוד שיווק אצל גל ודימה. כשהם ביקשו שאנגן בחתונה שלהם, התהפכו היוצרות.",
      "כשהם לא הפסיקו לרקוד, ידעתי שקיבלתי את הציון הסופי."
    ],
    image: "/assets/almog/wedding-1.jpg",
    label: "גל ודימה • 2020",
    color: "green"
  },
];

interface StoriesSectionProps {
  stories?: Story[];
  title?: string;
}

export const StoriesSection = ({ 
  stories = defaultStories,
  title = "יותר ממוזיקה. סיפורים."
}: StoriesSectionProps) => {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-right"
      >
        <h2 className="bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-3xl md:text-4xl font-bold text-transparent">
          {title}
        </h2>
      </motion.div>

      <div className="space-y-8">
        {stories.map((story, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className={`group relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 md:grid-cols-2 md:p-8 ${
              story.color === "green" 
                ? "hover:border-brand-green/30 hover:shadow-[0_20px_60px_rgba(3,178,140,0.2)]"
                : "hover:border-brand-blue/30 hover:shadow-[0_20px_60px_rgba(5,156,192,0.2)]"
            }`}
          >
            <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
              story.color === "green"
                ? "from-brand-green via-emerald-400 to-brand-blue"
                : "from-brand-blue via-cyan-400 to-brand-green"
            }`} />
            
            <div className="relative space-y-4 text-right">
              <h3 className="text-2xl font-black text-white drop-shadow-md">
                {story.title}
              </h3>
              <div className="space-y-4">
                {story.content.map((p, i) => (
                  <p key={i} className="text-base font-medium leading-relaxed text-white/90">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-lg">
              <Image 
                src={story.image} 
                alt={story.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className={`absolute bottom-4 left-4 rounded-full border bg-black/80 px-3 py-1 backdrop-blur-sm ${
                story.color === "green" ? "border-brand-green/40" : "border-brand-blue/40"
              }`}>
                <span className={`text-xs font-semibold ${
                  story.color === "green" ? "text-brand-green" : "text-brand-blue"
                }`}>
                  {story.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StoriesSection;
