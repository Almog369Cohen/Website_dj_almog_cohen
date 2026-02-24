"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    nameHe: "חינם",
    price: 0,
    period: "",
    description: "להתחלה ולהתנסות",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "עד 2 אירועים בחודש",
      "3 שאלות מותאמות",
      "ספריית שירים ברירת מחדל",
      "שיתוף WhatsApp",
    ],
    missing: [
      "העלאת שירים",
      "מיתוג אישי",
      "ייצוא PDF",
      "דשבורד אנליטיקס",
    ],
    cta: "התחל בחינם",
    href: "/signup",
    popular: false,
    gradient: "from-white/5 to-white/[0.02]",
  },
  {
    id: "basic",
    name: "Basic",
    nameHe: "בסיס",
    price: 8,
    period: "/חודש",
    description: "לדי.ג׳יי שרוצה לצמוח",
    icon: <Star className="w-6 h-6" />,
    features: [
      "עד 8 אירועים בחודש",
      "10 שאלות מותאמות",
      "העלאת שירים עד 10GB",
      "מיתוג בסיסי (לוגו + צבע)",
      "עד 3 כרטיסי שדרוג",
      "ייצוא Music Brief ל-PDF",
      "שיתוף WhatsApp",
      "דשבורד אנליטיקס בסיסי",
    ],
    missing: [],
    cta: "בחר Basic",
    href: "/checkout?plan=basic",
    popular: true,
    gradient: "from-brand-blue/10 to-brand-green/5",
  },
  {
    id: "studio",
    name: "Studio",
    nameHe: "סטודיו",
    price: 35,
    period: "/חודש",
    description: "חבילת ביניים (בקרוב)",
    icon: <Star className="w-6 h-6" />,
    features: [
      "עד 14 אירועים בחודש",
      "שאלות ללא הגבלה",
      "העלאת שירים עד 10GB",
      "מיתוג מלא",
      "דשבורד אנליטיקס מתקדם",
    ],
    missing: [],
    cta: "בקרוב",
    href: "",
    popular: false,
    comingSoon: true,
    gradient: "from-white/5 to-white/[0.02]",
  },
  {
    id: "pro",
    name: "Pro",
    nameHe: "פרו",
    price: 20,
    period: "/חודש",
    description: "לדי.ג׳יי מקצועי",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "עד 20 אירועים בחודש",
      "שאלות ללא הגבלה",
      "העלאת שירים עד 10GB",
      "מיתוג מלא (לוגו, צבעים, טקסט)",
      "כרטיסי שדרוג ללא הגבלה",
      "ייצוא Music Brief ל-PDF",
      "שיתוף WhatsApp",
      "דשבורד אנליטיקס מתקדם",
      "תמיכה בעדיפות",
    ],
    missing: [],
    cta: "בחר Pro",
    href: "/checkout?plan=pro",
    popular: false,
    gradient: "from-brand-blue/15 to-purple-500/10",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh gradient-hero">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            חזרה
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-black mb-3 text-gold">
            בחרו את המסלול שלכם
          </h1>
          <p className="text-secondary text-lg max-w-md mx-auto">
            התחילו בחינם, שדרגו כשתרצו. בלי התחייבות.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card p-6 flex flex-col ${plan.popular
                  ? "ring-2 ring-brand-blue/40 shadow-gold-md"
                  : ""
                }`}
            >
              {plan.comingSoon && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-white/10 border border-glass text-muted backdrop-blur-sm">
                  בקרוב
                </div>
              )}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-brand-blue/20 border border-brand-blue/40 text-brand-blue backdrop-blur-sm">
                  הכי פופולרי
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${plan.gradient} border border-glass-strong`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg">{plan.nameHe}</h3>
                  <p className="text-xs text-muted">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-black">
                  {plan.price === 0 ? "חינם" : `$${plan.price}`}
                </span>
                {plan.period && (
                  <span className="text-muted text-sm mr-1">{plan.period}</span>
                )}
              </div>

              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="text-secondary">{f}</span>
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm opacity-40">
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">—</div>
                    <span className="text-muted line-through">{f}</span>
                  </div>
                ))}
              </div>

              {plan.comingSoon ? (
                <button
                  type="button"
                  disabled
                  className="w-full text-center py-3 rounded-2xl font-bold text-sm transition-all btn-secondary opacity-50 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href ?? `/checkout?plan=${plan.id}`}
                  className={`w-full text-center py-3 rounded-2xl font-bold text-sm transition-all ${plan.popular
                      ? "btn-primary"
                      : "btn-secondary"
                    }`}
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ / Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 space-y-2"
        >
          <p className="text-sm text-muted">
            יש לכם קופון? תוכלו להזין אותו בעמוד התשלום
          </p>
          <p className="text-xs text-muted">
            כל החבילות כוללות גישה מלאה לכל העדכונים והפיצ׳רים החדשים
          </p>
        </motion.div>
      </div>
    </div>
  );
}
