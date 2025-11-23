"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ContactFormProps {
  context?: "wedding" | "course" | "performer";
  className?: string;
}

export const ContactFormLevel100 = ({ context = "wedding", className = "" }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // WhatsApp integration
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
    const contextText = {
      wedding: "בקשת התאמה לחתונה",
      course: "פנייה לגבי קורס DJ",
      performer: "פנייה לגבי 'חוגג מנגן'",
    }[context];

    const message = `${contextText}

שם: ${formData.name}
טלפון: ${formData.phone}
${formData.email ? `אימייל: ${formData.email}` : ""}

הודעה:
${formData.message}`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 3000);
  };

  const titles = {
    wedding: "בואו נבדוק התאמה",
    course: "שריין את מקומך",
    performer: "תנו להם רגע שמגיע רק למי שעובד עליו",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#1f1f21] p-8 md:p-10 ${className}`}
    >
      {/* Noise Overlay */}
      <div className="brand-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="mb-2 text-2xl font-black text-white md:text-3xl" style={{ fontWeight: 900 }}>
          {titles[context]}
        </h3>
        <p className="mb-6 text-sm text-white/60">
          {context === "wedding" && "לא שולחים הודעות כפייה. זו אמת התאמה הדדית."}
          {context === "course" && "המקומות מוגבלים. זה לא אקראי."}
          {context === "performer" && "הזמינות מוגבלת. ככה זה עובד ברמה הזו."}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="שם מלא *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-right text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="טלפון *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-right text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="אימייל (אופציונלי)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-right text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <div>
              <textarea
                placeholder="ספרו לי קצת על האירוע / הציפיות *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-right text-white placeholder-white/40 backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 font-bold text-black shadow-[0_0_30px_rgba(5,156,192,0.5)] transition hover:shadow-[0_0_50px_rgba(5,156,192,0.8)] disabled:opacity-50"
            >
              {isSubmitting ? "שולח..." : "שלח פנייה"}
            </motion.button>

            <p className="text-center text-xs text-white/40">
              הפנייה תישלח ישירות ל-WhatsApp שלי
            </p>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-8 text-center"
          >
            <div className="mb-4 text-5xl">✓</div>
            <p className="text-xl font-bold text-[#03b28c]">הפנייה נשלחה!</p>
            <p className="mt-2 text-sm text-white/60">אחזור אליך בהקדם</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
