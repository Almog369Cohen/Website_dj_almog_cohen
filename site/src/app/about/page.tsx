"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import dynamic from 'next/dynamic';

// Level 500 Components (Dynamic imports for performance)
const WebGLUniverse = dynamic(() => import('@/components/about/WebGLUniverse'), { ssr: false });
const AdaptiveSoundtrack = dynamic(() => import('@/components/about/AdaptiveSoundtrack'), { ssr: false });
const VoiceControl = dynamic(() => import('@/components/about/VoiceControl'), { ssr: false });

// RevealText Component (from homepage)
const RevealText = ({ 
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
        initial={{ y: "100%", skewY: 5, opacity: 0 }}
        whileInView={{ y: "0%", skewY: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ 
  year, 
  title, 
  description,
  delay = 0
}: { 
  year: string; 
  title: string; 
  description: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative grid grid-cols-[auto_1fr] gap-4 md:gap-8 text-right"
    >
      {/* Year - Left Side */}
      <motion.div
        animate={isInView ? { 
          textShadow: [
            "0 0 0px #059cc0",
            "0 0 15px #059cc0, 0 0 30px #059cc0",
            "0 0 15px #059cc0"
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontSize: "clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)",
          fontWeight: 900
        }}
        className={`text-left leading-none ${isInView ? 'text-brand-blue' : 'text-white/20'}`}
      >
        {year}
      </motion.div>

      {/* Content - Right Side */}
      <div className="space-y-2 pb-8 md:pb-12">
        <h3 className="text-base md:text-lg font-bold text-white">{title}</h3>
        <p className="text-xs md:text-sm leading-relaxed text-white/70">{description}</p>
      </div>

      {/* Connection Dot */}
      <motion.div
        animate={isInView ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`absolute -right-1 md:-right-2 top-2 h-3 w-3 md:h-4 md:w-4 rounded-full ${
          isInView ? 'bg-brand-blue shadow-[0_0_15px_#059cc0]' : 'bg-white/20'
        }`}
      />
    </motion.div>
  );
};

export default function AboutPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  
  const storyRef = useRef(null);
  const timelineRef = useRef(null);
  const pageRef = useRef(null);
  
  // Level 500 State
  const [isSoundtrackPlaying, setIsSoundtrackPlaying] = useState(false);
  
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: pageProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"]
  });
  
  const imageScale = useTransform(storyProgress, [0, 0.5, 1], [1, 1.1, 1]);
  
  const timeline = [
    {
      year: "2012",
      title: "החוג שהדליק את הכל",
      description: "חוג דיג'יי בבית הספר - הפעם הראשונה שנגעתי בציוד והבנתי שמוזיקה זה לא תחביב, זה חיים."
    },
    {
      year: "2013",
      title: "הכניסה לחיי הלילה",
      description: "התחלתי לעבוד כיחצן. מועדונים, קהל, אנרגיה - ידע שחזר אליי כש-עליתי לעמדה."
    },
    {
      year: "2013",
      title: "האירוע הראשון - מסיבת תיכון בפייר",
      description: "מסיבת תיכון במועדון פייר בירושלים. הפעם הראשונה מול קהל. כל ההתרגשות, החשש, וההבנה שאפשר להחזיק רחבה רק עם מוזיקה נכונה."
    },
    {
      year: "2014",
      title: "מועדון WYNN - השלב הבא",
      description: "ההופעה השנייה. התחלתי להבין שזה לא מקרי, שיש חיבור אמיתי בינייך לעמדה."
    },
    {
      year: "2016-18",
      title: "במות חו\"ל ואלפי אנשים",
      description: "איה נאפה בקפריסין, מרתון ירושלים, הדזרט, מדיסון, ארנה. רחבות פתוחות עם אלפים. נקודת המבחן האמיתית."
    },
    {
      year: "2020",
      title: "הקמת העסק ובית הספר",
      description: "לא רק תקלוט. בית ספר, ליווי אישי, קונספטים כמו חוגג מנגן, והפקות שלמות. כל אירוע עולם משלו."
    }
  ];

  return (
    <>
      {/* Fluid Typography System - Level 150 */}
      <style jsx global>{`
        :root {
          --font-fluid-h1: clamp(3.5rem, 8vw + 1rem, 9rem);
          --font-fluid-h2: clamp(2.5rem, 5vw + 1rem, 5rem);
          --font-fluid-h3: clamp(1.5rem, 3vw + 1rem, 3rem);
          --font-fluid-p: clamp(1rem, 1vw + 0.5rem, 1.25rem);
        }
        
        /* Noise Texture Overlay */
        .about-noise {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div ref={pageRef} className="relative bg-[#0a0a0a] text-brand-white">
        {/* Noise Texture */}
        <div className="about-noise" aria-hidden="true" />
        
        {/* === LEVEL 500 COMPONENTS === */}
        {/* WebGL Universe Background */}
        <WebGLUniverse scrollProgress={pageProgress.get()} />
        
        {/* Adaptive Soundtrack */}
        <AdaptiveSoundtrack 
          scrollProgress={pageProgress.get()} 
          isPlaying={isSoundtrackPlaying}
        />
        
        {/* Voice Control */}
        <VoiceControl />
      {/* === HERO: THE STATEMENT === */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-40"
          >
            <source src="https://storage.googleapis.com/www.compaktt.com/assets/hero-main-optimized.mp4" type="video/mp4" />
          </video>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <RevealText delay={0}>
            <h1 
              style={{
                fontSize: "var(--font-fluid-h1)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                mixBlendMode: "overlay"
              }}
              className="mb-6"
            >
              ארכיטקט של אנרגיה
            </h1>
          </RevealText>
          
          <RevealText delay={0.2}>
            <p 
              style={{
                fontSize: "var(--font-fluid-p)",
                fontWeight: 300,
                lineHeight: 1.6
              }}
              className="mx-auto max-w-3xl text-white/80"
            >
              10+ שנים מחדד חוויות קוליות. מהרחבה לעמדה, ומהעמדה לרחבות מלאות.
            </p>
          </RevealText>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg className="h-8 w-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* === SPLIT STORY: אובססיה לקצב === */}
      <section ref={storyRef} className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 md:py-32 md:grid-cols-2 md:gap-16">
        {/* Left - Sticky Image with Parallax */}
        <div className="relative h-[350px] md:sticky md:top-20 md:h-[600px]">
          <motion.div 
            style={{ scale: imageScale }}
            className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl"
          >
            <Image
              src="/assets/almog/IMG_6561.jpg"
              alt="אלמוג כהן - DJ"
              fill
              className="object-cover grayscale contrast-125 brightness-90"
              priority
            />
            {/* Vignette Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </motion.div>
        </div>

        {/* Right - Story Content */}
        <div className="space-y-10 text-right">
          <div>
            <RevealText delay={0.1}>
              <h2 
                style={{
                  fontSize: "var(--font-fluid-h2)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95
                }}
                className="bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-transparent"
              >
                אובססיה לקצב
              </h2>
            </RevealText>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p 
              style={{
                fontSize: "var(--font-fluid-p)",
                fontWeight: 300,
                lineHeight: 1.8
              }}
              className="text-white/85"
            >
              בגיל 14, חוג דיג'יי בבית הספר היה הרגע שבו הכל התחבר. לא רק שירים - איך לקרוא רחבה, 
              איך לבנות אנרגיה, איך רגע אחד נכון יכול לשנות הכל.
            </p>

            <p 
              style={{
                fontSize: "var(--font-fluid-p)",
                fontWeight: 300,
                lineHeight: 1.8
              }}
              className="text-white/85"
            >
              שנים עבדתי כיחצן. מועדונים, מסיבות, פסטיבלים - לומד את הקהל מהצד. אבל תמיד ידעתי 
              שאני רוצה להיות מאחורי העמדה, לא ליד הבר.
            </p>

            <p 
              style={{
                fontSize: "var(--font-fluid-p)",
                fontWeight: 300,
                lineHeight: 1.8
              }}
              className="text-white/85"
            >
              הרגע הראשון על הבמה? מפיק התקשר: "אתה פותח הערב". 900 איש, 15 שנים, והרגשתי שזה הבית. 
              מאז - איה נאפה בקפריסין, מרתון ירושלים, הדזרט, מדיסון, ארנה. רחבות של אלפים.
            </p>

            <p 
              style={{
                fontSize: "var(--font-fluid-p)",
                fontWeight: 300,
                lineHeight: 1.8
              }}
              className="text-white/85"
            >
              היום זה לא רק תקלוט. זה בית ספר, ליווי אישי, קונספטים כמו "חוגג מנגן", והפקות שלמות. 
              כל אירוע הוא עולם משלו.
            </p>
          </motion.div>

          {/* Quick Facts Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border-2 border-brand-blue/20 bg-gradient-to-br from-brand-blue/10 to-transparent p-6 backdrop-blur-xl"
          >
            <h3 className="mb-4 text-xl font-bold text-brand-blue">במבט מהיר</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-green">●</span>
                <span>10+ שנות ניסיון באירועים, חתונות ואירועי חברה</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-green">●</span>
                <span>מאות זוגות ולקוחות שחזרו או המליצו הלאה</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-green">●</span>
                <span>מנהל מוזיקלי בקונספטים ייחודיים - חוגג מנגן, חופות מותאמות אישית</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand-green">●</span>
                <span>מנטור ל-DJים בהתחלה - ליווי מהסטודיו לרחבה</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* === SONIC TIMELINE === */}
      <section ref={timelineRef} className="relative mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-right">
          <RevealText delay={0}>
            <h2 
              style={{
                fontSize: "var(--font-fluid-h2)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95
              }}
              className="mb-4 bg-gradient-to-l from-brand-blue via-white to-brand-green bg-clip-text text-transparent"
            >
              מסע הקול
            </h2>
          </RevealText>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-white/70"
          >
            הרגעים שעיצבו את הדרך
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line with Gradient Fill */}
          <div className="absolute right-0 top-0 h-full w-0.5 md:w-1 bg-white/10">
            <motion.div
              style={{ scaleY: timelineProgress }}
              className="h-full w-full origin-top bg-gradient-to-b from-brand-blue via-brand-green to-brand-blue"
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-0 pr-8 md:pr-12">
            {timeline.map((item, i) => (
              <TimelineItem
                key={i}
                year={item.year}
                title={item.title}
                description={item.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* === PHILOSOPHY CARDS === */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-20 md:py-32">
        <RevealText delay={0}>
          <h2 
            style={{
              fontSize: "var(--font-fluid-h2)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.95
            }}
            className="mb-16 bg-gradient-to-l from-brand-green via-white to-brand-blue bg-clip-text text-right text-transparent"
          >
            הפילוסופיה
          </h2>
        </RevealText>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ 
              borderColor: "#03b28c",
              boxShadow: "0 0 40px rgba(3,178,140,0.4)",
              scale: 1.02
            }}
            className="group rounded-3xl border-2 border-white/10 bg-white/5 p-8 text-right backdrop-blur-xl transition-all duration-300"
          >
            <motion.h3 
              className="mb-4 text-xl md:text-2xl font-black text-white"
              whileHover={{ scale: 1.05 }}
            >
              אנרגיה זה לא מה ששומעים
            </motion.h3>
            <p className="text-sm md:text-base leading-relaxed text-white/75">
              זה מה שמרגישים. כל שיר הוא החלטה - איך הרחבה נושמת, איפה היא הולכת, מתי לבנות ומתי לשבור.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ 
              borderColor: "#03b28c",
              boxShadow: "0 0 40px rgba(3,178,140,0.4)",
              scale: 1.02
            }}
            className="group rounded-3xl border-2 border-white/10 bg-white/5 p-8 text-right backdrop-blur-xl transition-all duration-300"
          >
            <motion.h3 
              className="mb-4 text-xl md:text-2xl font-black text-white"
              whileHover={{ scale: 1.05 }}
            >
              כל אירוע הוא עולם
            </motion.h3>
            <p className="text-sm md:text-base leading-relaxed text-white/75">
              אין תבניות. יש רק קשב - לאנשים, לאווירה, לרגע. הסט הטוב ביותר הוא זה שמותאם לערב הספציפי הזה.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ 
              borderColor: "#03b28c",
              boxShadow: "0 0 40px rgba(3,178,140,0.4)",
              scale: 1.02
            }}
            className="group rounded-3xl border-2 border-white/10 bg-white/5 p-8 text-right backdrop-blur-xl transition-all duration-300"
          >
            <motion.h3 
              className="mb-4 text-xl md:text-2xl font-black text-white"
              whileHover={{ scale: 1.05 }}
            >
              לא DJ - שותף מוזיקלי
            </motion.h3>
            <p className="text-sm md:text-base leading-relaxed text-white/75">
              אתם לא שוכרים מישהו להפעיל פלייליסט. אתם מביאים מישהו שיבין את האנשים שלכם ויחזיק את הערב מבפנים.
            </p>
          </motion.div>
        </div>
      </section>

      {/* === VIDEO TESTIMONIAL === */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
        <RevealText delay={0}>
          <h2 
            style={{
              fontSize: "var(--font-fluid-h2)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1.1
            }}
            className="mb-16 text-center text-white"
          >
            מה אומרים זוגות שחגגו איתי
          </h2>
        </RevealText>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <div className="group relative overflow-hidden rounded-3xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/5 to-transparent p-3 shadow-[0_0_80px_rgba(3,178,140,0.3)] transition-all duration-500 hover:border-brand-green/50 hover:shadow-[0_0_120px_rgba(3,178,140,0.5)]">
            {/* Glow effect on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                 style={{ background: 'radial-gradient(circle at 50% 0%, rgba(3,178,140,0.15), transparent 70%)' }}
            />
            
            {/* Video */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/wtd6UuvGaGk"
                title="המלצה מזוג מרוצה"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Caption */}
            <div className="relative z-10 p-6 text-center">
              <p className="text-lg font-bold text-brand-green md:text-xl">
                "החתונה הכי טובה שהיינו בה" 💚
              </p>
              <p className="mt-2 text-sm text-white/60 md:text-base">
                שמעו ישירות מזוג שחגג את היום הכי חשוב איתי
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* === MIC DROP CTA === */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-24 md:py-40">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/20 blur-[120px]" />
        </div>

        <div className="text-center">
          <RevealText delay={0}>
            <h2 
              style={{
                fontSize: "var(--font-fluid-h1)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.95
              }}
              className="mb-12 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
            >
              אתם לא מחפשים DJ.
              <br />
              אתם מחפשים שקט נפשי.
            </h2>
          </RevealText>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-2xl"
          >
            <p 
              style={{
                fontSize: "var(--font-fluid-p)",
                fontWeight: 300,
                lineHeight: 1.8
              }}
              className="mb-12 text-white/70"
            >
              הערב שלכם לא צריך להיות עוד פרויקט שמלחיץ. בואו נדבר, נבין מה אתם רוצים, ונבנה את הפסקול המדויק לרגעים הכי חשובים בחיים שלכם.
            </p>

            {/* Magnetic Button */}
            <motion.a
              href={wa("היי אלמוג, קראתי את העמוד ואני רוצה לדבר על האירוע שלנו")}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 60px rgba(3,178,140,0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 md:gap-4 overflow-hidden rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-8 py-4 md:px-12 md:py-6 text-base md:text-xl font-black text-black shadow-[0_0_40px_rgba(3,178,140,0.4)] transition-all duration-300"
            >
              <span className="relative z-20">בדיקת זמינות ב-WhatsApp</span>
              <motion.svg 
                className="relative z-20 h-5 w-5 md:h-6 md:w-6"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
              
              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
            <a 
              href="https://www.instagram.com/dj_almog_cohen/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded-full border border-brand-blue/40 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/10 hover:shadow-[0_0_20px_rgba(5,156,192,0.3)]"
            >
              Instagram
            </a>
            <a 
              href="#" 
              className="rounded-full border border-brand-blue/40 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/10 hover:shadow-[0_0_20px_rgba(5,156,192,0.3)]"
            >
              YouTube
            </a>
            <a 
              href="#" 
              className="rounded-full border border-brand-blue/40 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/10 hover:shadow-[0_0_20px_rgba(5,156,192,0.3)]"
            >
              Spotify
            </a>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}
