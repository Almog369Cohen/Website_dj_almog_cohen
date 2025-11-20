"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setRotateX((y - 0.5) * 10);
    setRotateY((x - 0.5) * -10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function ServicesPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  
  const [activeService, setActiveService] = useState<string | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  return (
    <>
      {/* Fluid Typography */}
      <style jsx global>{`
        :root {
          --font-fluid-h1: clamp(3rem, 6vw + 1rem, 6rem);
          --font-fluid-h2: clamp(2rem, 4vw + 1rem, 4rem);
          --font-fluid-h3: clamp(1.5rem, 2.5vw + 1rem, 2.5rem);
        }
      `}</style>

    <div className="text-brand-white bg-[#0a0a0a]">
      {/* === CINEMATIC HERO === */}
      <section ref={heroRef} className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 -z-20"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="https://storage.googleapis.com/www.compaktt.com/assets/hero-main-optimized.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold uppercase tracking-[0.35em] text-brand-green"
          >
            DJ ALMOG COHEN • PROFESSIONAL SERVICES
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "var(--font-fluid-h1)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.95
            }}
            className="mt-4 bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-transparent"
          >
            השירותים שלי
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: "var(--font-fluid-p)" }}
            className="mx-auto mt-6 max-w-3xl leading-relaxed text-white/80"
          >
            מוזיקה שמייצרת רגעים. אנרגיה שמחזיקה קהל. מקצועיות ללא פשרות.
          </motion.p>
        </div>
      </section>

      {/* === SERVICES GRID WITH 3D CARDS === */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Wedding Card */}
          <TiltCard className="group">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-brand-green/10 to-transparent p-8 text-right backdrop-blur-xl transition-all duration-300 hover:border-brand-green/40 hover:shadow-[0_0_60px_rgba(3,178,140,0.4)]"
            >
              {/* Icon/Number */}
              <div className="mb-4 text-6xl font-black text-brand-green/20">01</div>
              
              <h2 className="mb-3 text-2xl font-black text-white md:text-3xl">חתונות</h2>
              
              <p className="mb-6 flex-1 leading-relaxed text-white/75">
                שביל חופה מרגש, ריקוד ראשון מושלם, ורחבה שלא מפסיקה לרקוד. 
                כל רגע מתוכנן, כל שיר במקום הנכון.
              </p>
              
              <ul className="mb-6 space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-brand-green">✓</span>
                  <span>פלייליסט מותאם אישית</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green">✓</span>
                  <span>ציוד premium + תאורה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-green">✓</span>
                  <span>ליווי מלא עד האירוע</span>
                </li>
              </ul>
              
              <Link 
                href="/services/weddings"
                className="group/link inline-flex items-center gap-2 text-sm font-bold text-brand-green transition hover:gap-3"
              >
                <span>למידע מלא</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              {/* Glow effect */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                   style={{ background: 'radial-gradient(circle at 50% 0%, rgba(3,178,140,0.15), transparent 70%)' }} 
              />
            </motion.div>
          </TiltCard>

          {/* Corporate Card */}
          <TiltCard className="group">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-brand-blue/10 to-transparent p-8 text-right backdrop-blur-xl transition-all duration-300 hover:border-brand-blue/40 hover:shadow-[0_0_60px_rgba(5,156,192,0.4)]"
            >
              <div className="mb-4 text-6xl font-black text-brand-blue/20">02</div>
              
              <h2 className="mb-3 text-2xl font-black text-white md:text-3xl">אירועים עסקיים</h2>
              
              <p className="mb-6 flex-1 leading-relaxed text-white/75">
                כנסים, השקות, ערבי חברה. מוזיקה שמחזיקה אנרגיה מקצועית 
                ומתאימה לקהל מגוון.
              </p>
              
              <ul className="mb-6 space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue">✓</span>
                  <span>התאמה לאופי החברה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue">✓</span>
                  <span>גמישות וזמינות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue">✓</span>
                  <span>תיאום מול מפיקים</span>
                </li>
              </ul>
              
              <Link 
                href="/services/corporate"
                className="group/link inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition hover:gap-3"
              >
                <span>למידע מלא</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                   style={{ background: 'radial-gradient(circle at 50% 0%, rgba(5,156,192,0.15), transparent 70%)' }} 
              />
            </motion.div>
          </TiltCard>

          {/* Private Events Card */}
          <TiltCard className="group">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/10 to-transparent p-8 text-right backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              <div className="mb-4 text-6xl font-black text-white/20">03</div>
              
              <h2 className="mb-3 text-2xl font-black text-white md:text-3xl">אירועים פרטיים</h2>
              
              <p className="mb-6 flex-1 leading-relaxed text-white/75">
                בר/בת מצווה, מסיבות, אפטרים. פסקול אישי שמרגיש כמו 
                במה גדולה.
              </p>
              
              <ul className="mb-6 space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-white">✓</span>
                  <span>חווייה מותאמת אישית</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white">✓</span>
                  <span>גמישות מלאה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white">✓</span>
                  <span>מחירים הוגנים</span>
                </li>
              </ul>
              
              <Link 
                href="/services/private"
                className="group/link inline-flex items-center gap-2 text-sm font-bold text-white transition hover:gap-3"
              >
                <span>למידע מלא</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                   style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 70%)' }} 
              />
            </motion.div>
          </TiltCard>
        </div>
      </section>

      {/* === VIDEO SHOWCASE === */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-blue">VIDEO SHOWCASE</p>
          <h2 
            style={{
              fontSize: "var(--font-fluid-h2)",
              fontWeight: 900,
              letterSpacing: "-0.05em"
            }}
            className="mt-3 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-transparent"
          >
            תראו אותי בפעולה
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Live Set */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-brand-green/20 bg-gradient-to-br from-brand-green/10 to-transparent backdrop-blur-xl transition-all hover:border-brand-green/40 hover:shadow-[0_0_40px_rgba(3,178,140,0.3)]"
          >
            {/* Video Embed */}
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/cLZaotSdbAg"
                title="Live Set"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Content */}
            <div className="p-6 text-right">
              <h3 className="mb-2 text-xl font-black text-white">Live Set</h3>
              <p className="mb-2 text-sm font-semibold text-brand-green">מיקס לייב מהרחבה</p>
              <p className="text-sm leading-relaxed text-white/70">
                סט חתונה מלא - מקבלת פנים ועד אפטר מטורף.
              </p>
            </div>
            
            {/* Glow on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                 style={{ background: 'radial-gradient(circle at 50% 0%, rgba(3,178,140,0.1), transparent 60%)' }}
            />
          </motion.div>

          {/* Behind the Decks */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-brand-blue/20 bg-gradient-to-br from-brand-blue/10 to-transparent backdrop-blur-xl transition-all hover:border-brand-blue/40 hover:shadow-[0_0_40px_rgba(5,156,192,0.3)]"
          >
            {/* Video Embed */}
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/cLZaotSdbAg"
                title="Behind the Decks"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Content */}
            <div className="p-6 text-right">
              <h3 className="mb-2 text-xl font-black text-white">Behind the Decks</h3>
              <p className="mb-2 text-sm font-semibold text-brand-blue">מאחורי הבמה</p>
              <p className="text-sm leading-relaxed text-white/70">
                צילומים מהקונסול בזמן אירוע – האנרגיה בזמן אמת.
              </p>
            </div>
            
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                 style={{ background: 'radial-gradient(circle at 50% 0%, rgba(5,156,192,0.1), transparent 60%)' }}
            />
          </motion.div>

          {/* Event Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl transition-all hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            {/* Video Embed */}
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/cLZaotSdbAg"
                title="Event Highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Content */}
            <div className="p-6 text-right">
              <h3 className="mb-2 text-xl font-black text-white">Event Highlights</h3>
              <p className="mb-2 text-sm font-semibold text-white/90">רגעים מהאירועים</p>
              <p className="text-sm leading-relaxed text-white/70">
                תקציר קצר מאירועים שונים – מוזיקה, אנשים, אנרגיה.
              </p>
            </div>
            
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                 style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 60%)' }}
            />
          </motion.div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-green">TESTIMONIALS</p>
          <h2 
            style={{
              fontSize: "var(--font-fluid-h2)",
              fontWeight: 900,
              letterSpacing: "-0.05em"
            }}
            className="mt-3 text-white"
          >
            מה אומרים לקוחות
          </h2>
        </motion.div>

        {/* Video Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-2 shadow-[0_0_60px_rgba(3,178,140,0.3)]">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/wtd6UuvGaGk"
                title="המלצה מזוג מרוצה"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6 text-center">
              <p className="text-lg font-semibold text-brand-green">המלצה מזוג מרוצה</p>
              <p className="mt-2 text-sm text-white/70">צפו בעדות של זוג שחגג איתנו את היום הכי חשוב</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-brand-green/20 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-1 text-brand-green">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-4 text-right leading-relaxed text-white/80">
              "אלמוג היה מעבר למושלם. החתונה שלנו הייתה כל כך מדויקת מבחינה מוזיקלית שאנשים דיברו על זה שבועות אחרי. הוא באמת יודע לקרוא קהל."
            </p>
            <div className="text-right">
              <p className="font-semibold text-white">שרה ויונתן</p>
              <p className="text-sm text-white/50">חתונה • יוני 2024</p>
            </div>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-brand-blue/20 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-1 text-brand-blue">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="mb-4 text-right leading-relaxed text-white/80">
              "הזמנו את אלמוג לאירוע השקה של החברה. הוא הבין בדיוק מה אנחנו צריכים - מוזיקה שמרימה אבל לא דומיננטית. מקצוען אמיתי."
            </p>
            <div className="text-right">
              <p className="font-semibold text-white">רועי כהן</p>
              <p className="text-sm text-white/50">אירוע עסקי • מרץ 2024</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="relative mx-auto w-full max-w-4xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-blue">FAQ</p>
          <h2 
            style={{
              fontSize: "var(--font-fluid-h2)",
              fontWeight: 900,
              letterSpacing: "-0.05em"
            }}
            className="mt-3 text-white"
          >
            שאלות נפוצות
          </h2>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              q: "כמה זמן לפני האירוע צריך להזמין?",
              a: "מומלץ להזמין 3-6 חודשים מראש, במיוחד לחתונות ב-high season. אבל אם יש זמינות, אני יכול לעזור גם בזמן קצר יותר."
            },
            {
              q: "האם אפשר לבחור את המוזיקה?",
              a: "בהחלט! אני בונה איתכם פלייליסט מותאם אישית לפני האירוע. אתם בוחרים את השירים החשובים לכם, ואני מוודא שהרחבה נשארת אנרגטית."
            },
            {
              q: "מה כלול בחבילה?",
              a: "ציוד קול ותאורה מקצועי, הגעה והרכבה לפני האירוע, ליווי מוזיקלי מלא, ותיאום מול המפיקים. הכל כלול במחיר אחד שקוף."
            },
            {
              q: "איך נראה התהליך?",
              a: "שיחת ייעוץ ראשונית (חינם) → בניית פלייליסט יחד → תיאום עם מפיק → הופעה ביום האירוע. אני זמין לאורך כל הדרך לשאלות ושינויים."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-right backdrop-blur-xl"
            >
              <h3 className="mb-3 text-lg font-bold text-white">{item.q}</h3>
              <p className="leading-relaxed text-white/70">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === MAGNETIC CTA === */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border-2 border-brand-blue/20 bg-gradient-to-br from-black/90 via-black/70 to-brand-blue/20 p-12 text-center shadow-[0_0_60px_rgba(5,156,192,0.3)]"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/20 blur-[100px]" />
          
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">רוצים לדבר על האירוע שלכם?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              שתפו אותי בתאריך, סוג האירוע והסגנון שחלמתם עליו – ונבין יחד איך הופכים את זה לערב שאנשים יזכרו.
            </p>
            <motion.a
              href={wa("שלום אלמוג, הייתי בעמוד השירותים ורוצה לקבל הצעת מחיר לאירוע.")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-10 py-4 text-base font-black text-black shadow-[0_0_40px_rgba(3,178,140,0.4)] transition-all hover:shadow-[0_0_60px_rgba(3,178,140,0.6)]"
            >
              <span>בקשת הצעת מחיר ב־WhatsApp</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
    </>
  );
}
