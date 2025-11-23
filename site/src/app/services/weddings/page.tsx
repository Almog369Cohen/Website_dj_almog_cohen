"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WeddingsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  return (
    <div className="relative overflow-hidden bg-white text-slate-900">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="brand-noise absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-slate-100 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-32">
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
               borderColor: 'rgba(5, 156, 192, 0.2)'
             }}>
          <div className="mb-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#059cc0]/80">
              WEDDINGS
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900" style={{ fontWeight: 900 }}>חתונות</h1>
          </div>
          <p className="mb-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            מוזיקה שמרגישה בדיוק אתם – מהשנייה הראשונה של שביל החופה, דרך הריקוד הראשון, ועד רחבה
            מלאה באנשים שלא רוצים ללכת הביתה. ביחד נבחר את השירים לרגעים הגדולים ונבנה ערב שמספר
            את הסיפור שלכם.
          </p>
          <ul className="mb-6 list-disc pr-6 text-base sm:text-lg text-slate-700 leading-relaxed space-y-2">
            <li className="marker:text-[#059cc0]">ליווי בבחירת שירים לחופה ולריקוד ראשון (קלאסיקות, מודרני וגרסאות ייחודיות)</li>
            <li className="marker:text-[#059cc0]">פלייליסט מושקע לקבלת פנים שמכין את האווירה לערב</li>
            <li className="marker:text-[#059cc0]">סטים לרחבת ריקודים – מרימים, מגוונים ומותאמים לקהל שלכם</li>
          </ul>
          {/* Video Testimonial */}
          <div className="mb-10">
            <h3 className="mb-4 text-center text-2xl sm:text-3xl font-black text-[#059cc0]" style={{ fontWeight: 900 }}>שמעו מזוג שחגג איתנו</h3>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card overflow-hidden rounded-2xl p-2"
              style={{
                background: 'linear-gradient(135deg, rgba(5,156,192,0.08) 0%, rgba(255,255,255,0.95) 100%)',
                borderColor: 'rgba(5, 156, 192, 0.3)',
                borderWidth: '2px',
                boxShadow: '0 0 40px rgba(5,156,192,0.2)'
              }}
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/wtd6UuvGaGk"
                  title="המלצה מחתונה"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-[#059cc0]">"החתונה הכי טובה שהיינו בה" 💙</p>
              </div>
            </motion.div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card overflow-hidden rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.6)',
                borderColor: 'rgba(5, 156, 192, 0.2)'
              }}
            >
              <Image src="/assets/almog/wedding-1.jpg" alt="רגעים מהחופה" width={1200} height={900} className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card overflow-hidden rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.6)',
                borderColor: 'rgba(5, 156, 192, 0.2)'
              }}
            >
              <Image src="/assets/almog/wedding-2.jpg" alt="רחבת ריקודים מרימה" width={1200} height={900} className="h-full w-full object-cover" />
            </motion.div>
          </div>
          <p className="mb-6 text-base sm:text-lg text-slate-700 leading-relaxed">
            רוצים להבין איך זה יכול להיראות אצלכם? תשלחו לי תאריך ולוקיישן, ונחשוב יחד על הפסקול של
            החתונה שלכם.
          </p>
          <motion.a
            href={wa("שלום, נשמח לשריין תאריך לחתונה")}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#059cc0] to-[#059cc0]/80 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all"
          >
            <span>שריינו תאריך ב־WhatsApp</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        </div>
      </section>
    </div>
  );
}
