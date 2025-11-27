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
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-background p-8 backdrop-blur-xl transition-all duration-500 hover:border-brand-green/40 hover:shadow-[0_20px_60px_rgba(3,178,140,0.2)] md:p-10 ${className}`}
    >
      {/* Top Gradient Border - Always Visible */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-green via-emerald-400 to-brand-blue opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Side Color Indicator - Always Visible */}
      <div className="absolute left-0 top-1/2 h-32 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-green via-emerald-400 to-brand-blue shadow-lg shadow-brand-green/50 transition-all duration-500 group-hover:h-40" />
      {/* Noise Overlay */}
      <div className="brand-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="mb-2 text-2xl font-black text-foreground-heading md:text-3xl" style={{ fontWeight: 900 }}>
          {titles[context]}
        </h3>
        <p className="mb-6 text-sm text-foreground-secondary">
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
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-right text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="טלפון *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-right text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="אימייל (אופציונלי)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-right text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <div>
              <textarea
                placeholder="ספרו לי קצת על האירוע / הציפיות *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-right text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition focus:border-[#059cc0] focus:outline-none focus:ring-2 focus:ring-[#059cc0]/50"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 font-bold text-white shadow-[0_0_30px_rgba(5,156,192,0.5)] transition hover:shadow-[0_0_50px_rgba(5,156,192,0.8)] disabled:opacity-50"
            >
              {isSubmitting ? "שולח..." : "שלח פנייה"}
            </motion.button>

            <p className="text-center text-xs text-foreground-secondary">
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
            <p className="mt-2 text-sm text-foreground-secondary">אחזור אליך בהקדם</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
