"use client";

import { motion } from "framer-motion";
import React from "react";

export const RevealText = ({ 
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
