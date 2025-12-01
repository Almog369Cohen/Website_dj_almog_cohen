"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const weddingFAQs: FAQItem[] = [
  {
    question: "כמה זמן לפני החתונה צריך לסגור?",
    answer: "מומלץ 4-6 חודשים מראש. תאריכים פופולריים (קיץ, חגים) נתפסים מהר. ככל שתסגרו מוקדם יותר, כך יש יותר זמן לתכנון מוזיקלי מושלם."
  },
  {
    question: "מה כלול במחיר?",
    answer: "פגישת ייעוץ מקדימה, בניית playlist מותאם אישית, ציוד DJ מקצועי, נוכחות מהחופה ועד הסיום, וגמישות מלאה במהלך הערב."
  },
  {
    question: "אתה מתאים גם לקהל מבוגר?",
    answer: "בהחלט! ההתמחות שלי היא בדיוק בקהל מעורב. אני יודע לנוע חלק בין להיטים ישראליים, מזרחית, שנות ה-80 וטכנו - הכל תלוי בקהל שעל הרחבה."
  },
  {
    question: "מה קורה אם יש שינויים ברגע האחרון?",
    answer: "גמישות זה שם המשחק. אני מגיע עם ספריית מוזיקה ענקית ויודע להתאים בזמן אמת. שינויים הם חלק מהעבודה."
  },
];

const academyFAQs: FAQItem[] = [
  {
    question: "צריך ניסיון קודם?",
    answer: "לא! קורס המתחילים מתחיל מאפס מוחלט. כל מה שצריך זה אהבה למוזיקה ורצון ללמוד."
  },
  {
    question: "מה הציוד הנדרש?",
    answer: "בשיעורים אתם מתרגלים על ציוד מקצועי של Pioneer. לתרגול בבית - מספיק בהתחלה תוכנת DJ חינמית ואוזניות."
  },
  {
    question: "כמה זמן עד שאוכל לנגן באירועים?",
    answer: "תלוי בקצב ההתקדמות האישי. בממוצע, אחרי 3-4 חודשים של תרגול רציף אפשר להתחיל עם אירועים קטנים."
  },
  {
    question: "יש ליווי אחרי הקורס?",
    answer: "כן! בוגרי הקורס מקבלים גישה לקהילת הבוגרים, ייעוץ מקצועי, והזדמנויות להופעות ראשונות."
  },
];

interface FAQSectionProps {
  faqs?: FAQItem[];
  type?: "wedding" | "academy" | "general";
  title?: string;
}

export const FAQSection = ({ 
  faqs,
  type = "general",
  title = "שאלות נפוצות"
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const items = faqs || (type === "wedding" ? weddingFAQs : type === "academy" ? academyFAQs : weddingFAQs);

  return (
    <section className="relative mx-auto w-full max-w-4xl px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl md:text-4xl font-bold text-white mb-12"
      >
        {title}
      </motion.h2>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex w-full items-center justify-between gap-4 p-5 text-right transition hover:bg-white/5"
              aria-expanded={openIndex === idx}
            >
              <span className="flex-1 text-base md:text-lg font-bold text-white">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-brand-blue"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-white/80 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
