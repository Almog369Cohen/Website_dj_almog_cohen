"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * Testimonials Section - המלצות מלקוחות
 * Based on real WhatsApp conversations
 */

interface Testimonial {
  id: number;
  name: string;
  event: string;
  date: string;
  quote: string;
  highlight: string;
  emoji: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "שיראל & אופק",
    event: "חתונה",
    date: "נובמבר 2023",
    quote: "קיבלנו עשרות אם לא מאות מחמאות שהרחבה מפוצצת! צעירים שלא מפסיקים לרקוד שעות. ההפצצה אחרי הפצצה באמת לא נתנה לנו שנייה לנוח!",
    highlight: "זכינו בך, באנרגיות, בטעם המוזיקלי המעולה ובקליעה בול לזוג שאנחנו",
    emoji: "💍"
  },
  {
    id: 2,
    name: "אוריאל & יעל",
    event: "חתונה",
    date: "2023",
    quote: "בחיים לא הייתי בחתונה שגם שהייתי עייפה המוזיקה פשוט החזיקה אותי ברחבה!",
    highlight: "היתה חתונה פשוט וואו. נהננו בטירוף, והדיג׳יי שלכם היה פשוט מעולה",
    emoji: "🎉"
  },
  {
    id: 3,
    name: "הראל & אביב",
    event: "חתונה",
    date: "אפריל 2025",
    quote: "יאללה איזה אירוע עשית לנו! אני מקבל הודעות מאנשים שכואב להם הגוף ונשברו להם הרגליים מרוב ריקודים!",
    highlight: "אהוב שלנו היה לנו מושלם ואתה בעצמך מושלם. אין עליך בעולם ונהנינו בטירוף",
    emoji: "🔥"
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-brand-green/5 to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-green text-sm font-medium tracking-wider uppercase mb-2 block">
            מה אומרים עליי
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            הלקוחות מדברים
          </h2>
        </motion.div>

        {/* Testimonials Cards */}
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* WhatsApp Style Card */}
              <div className="bg-[#1f2c34] rounded-2xl p-6 border border-white/10 hover:border-brand-green/30 transition-colors">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-xl">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-white/50">{testimonial.event} • {testimonial.date}</p>
                  </div>
                  {/* WhatsApp Icon */}
                  <div className="mr-auto">
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-white/80 leading-relaxed mb-4 text-right">
                  "{testimonial.quote}"
                </p>

                {/* Highlight */}
                <div className="bg-brand-green/10 border-r-4 border-brand-green rounded-lg p-4">
                  <p className="text-brand-green font-medium text-right">
                    💚 {testimonial.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span className="text-white/70 text-sm">500+ אירועים מוצלחים</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
