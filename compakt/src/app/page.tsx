"use client";

import { motion } from "framer-motion";
import {
  Music,
  Zap,
  BarChart3,
  Upload,
  Smartphone,
  Heart,
  ArrowLeft,
  Star,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function HomePage() {
  return (
    <div className="min-h-dvh gradient-hero text-foreground overflow-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-card rounded-none border-x-0 border-t-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
            >
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Compakt</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-muted hover:text-foreground transition-colors">
              כניסת DJ
            </Link>
            <Link
              href="/event"
              className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
            >
              התחל בחינם
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(5,156,192,0.1)", border: "1px solid rgba(5,156,192,0.2)", color: "#059cc0" }}>
              <Zap className="w-3.5 h-3.5" />
              הכלי שחסר לכל DJ
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight"
          >
            תנו ללקוחות{" "}
            <span style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              לבחור את המוזיקה
            </span>
            <br />
            בצורה כיפית ומדויקת
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="text-lg sm:text-xl text-secondary mb-8 max-w-xl mx-auto"
          >
            שלחו לזוג לינק → הם סווייפ על שירים → אתם מקבלים בריף מוזיקלי מושלם.
            בלי וואטסאפ, בלי טפסים ארוכים.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/event"
              className="btn-primary text-base py-3.5 px-8 flex items-center gap-2 shadow-lg"
              style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
            >
              נסו עכשיו — בחינם
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="btn-secondary text-base py-3.5 px-8"
            >
              כניסה לפאנל DJ
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-10 text-xs text-muted"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" /> בחינם
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" /> בלי הרשמה
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" /> תוצאות מיידיות
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...fadeUp}
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
          >
            איך זה עובד?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: <Upload className="w-6 h-6" />,
                title: "העלו שירים",
                desc: "גררו תיקיית MP3 או ייבאו מ-Spotify. סדרו לפי קטגוריות — קבלת פנים, טקס, אוכל, רחבה.",
                color: "#059cc0",
              },
              {
                step: "2",
                icon: <Smartphone className="w-6 h-6" />,
                title: "שלחו לינק ללקוח",
                desc: "הזוג מקבל לינק → סווייפ על שירים כמו טינדר. לייק, דיסלייק, סופר לייק. כיף.",
                color: "#03b28c",
              },
              {
                step: "3",
                icon: <BarChart3 className="w-6 h-6" />,
                title: "קבלו בריף מוזיקלי",
                desc: "דשבורד עם כל התוצאות: אילו שירים אהבו, למה לא, פירוט לפי קטגוריה. ייצוא ל-CSV.",
                color: "#f5c542",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 * i }}
                className="glass-card p-6 text-center relative"
              >
                <div
                  className="absolute -top-3 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: item.color }}
                >
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...fadeUp}
            className="text-2xl sm:text-3xl font-bold text-center mb-4"
          >
            הכל מה ש-DJ צריך
          </motion.h2>
          <motion.p {...fadeUp} className="text-secondary text-center mb-12 max-w-lg mx-auto">
            כלי אחד שמחליף שעות של שיחות וואטסאפ
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Heart className="w-5 h-5" />, title: "סווייפ אינטואיטיבי", desc: "הלקוח סווייפ ימינה/שמאלה. לייק, דיסלייק, סופר לייק. פשוט ומהיר." },
              { icon: <Music className="w-5 h-5" />, title: "4 קטגוריות", desc: "קבלת פנים, טקס, אוכל, רחבה — כל חלק באירוע בנפרד." },
              { icon: <Upload className="w-5 h-5" />, title: "העלאה מרובה", desc: "גררו תיקייה שלמה של MP3. אוטו-זיהוי אמן ושם שיר." },
              { icon: <BarChart3 className="w-5 h-5" />, title: "דשבורד תוצאות", desc: "פירוט מלא: שירים אהובים, סיבות דחייה, אחוזי אישור לכל קטגוריה." },
              { icon: <Headphones className="w-5 h-5" />, title: "נגן מובנה", desc: "הלקוח שומע קטע מכל שיר — Play/Pause, דילוג 15 שניות." },
              { icon: <Star className="w-5 h-5" />, title: "ייצוא חכם", desc: "ייצוא לייקים ל-CSV, העתקה ללוח, JSON מלא. מוכן לעבודה." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.05 * i }}
                className="flex gap-4 p-4 rounded-2xl border border-glass hover:border-brand-blue/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(5,156,192,0.1)", color: "#059cc0" }}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-secondary leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <motion.div
          {...fadeUp}
          className="max-w-2xl mx-auto text-center glass-card p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }} />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              מוכנים לשדרג את תהליך העבודה?
            </h2>
            <p className="text-secondary mb-8 max-w-md mx-auto">
              התחילו לנהל את המוזיקה של האירועים שלכם בצורה מקצועית. בחינם, בלי הרשמה.
            </p>
            <Link
              href="/event"
              className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
            >
              התחילו עכשיו
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 border-t border-glass">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
            >
              <Music className="w-3 h-3 text-white" />
            </div>
            <span>Compakt © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-foreground transition-colors">ניהול</Link>
            <Link href="/event" className="hover:text-foreground transition-colors">אירוע חדש</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
