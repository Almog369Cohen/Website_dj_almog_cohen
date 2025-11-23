"use client";

import { motion } from "framer-motion";

interface TagsPillsProps {
  tags: string[];
  variant?: "green" | "blue";
  className?: string;
}

export const TagsPills = ({ 
  tags, 
  variant = "green",
  className = "" 
}: TagsPillsProps) => {
  
  const colorClasses = variant === "green" 
    ? "border-brand-green/30 text-brand-green/80 hover:bg-brand-green/10 hover:border-brand-green hover:text-brand-green hover:shadow-[0_0_10px_rgba(3,178,140,0.3)]"
    : "border-brand-blue/30 text-brand-blue/80 hover:bg-brand-blue/10 hover:border-brand-blue hover:text-brand-blue hover:shadow-[0_0_10px_rgba(5,156,192,0.3)]";

  return (
    <div className={`mt-4 flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`
            inline-block cursor-default rounded-full border px-3 py-1
            text-xs font-medium backdrop-blur-sm
            transition-all duration-300
            ${colorClasses}
          `}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
};
