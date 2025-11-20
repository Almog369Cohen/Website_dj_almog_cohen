"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WeddingsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  return (
    <div className="text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-black/50 p-6 shadow-xl shadow-black/40 backdrop-blur-md">
          <div className="mb-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-green/80">
              WEDDINGS
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold">חתונות</h1>
          </div>
          <p className="mb-4 text-sm text-white/80 md:text-base">
            מוזיקה שמרגישה בדיוק אתם – מהשנייה הראשונה של שביל החופה, דרך הריקוד הראשון, ועד רחבה
            מלאה באנשים שלא רוצים ללכת הביתה. ביחד נבחר את השירים לרגעים הגדולים ונבנה ערב שמספר
            את הסיפור שלכם.
          </p>
          <ul className="mb-6 list-disc pr-6 text-sm text-white/75 md:text-base">
            <li className="marker:text-brand-green">ליווי בבחירת שירים לחופה ולריקוד ראשון (קלאסיקות, מודרני וגרסאות ייחודיות)</li>
            <li className="marker:text-brand-green">פלייליסט מושקע לקבלת פנים שמכין את האווירה לערב</li>
            <li className="marker:text-brand-green">סטים לרחבת ריקודים – מרימים, מגוונים ומותאמים לקהל שלכם</li>
          </ul>
          {/* Video Testimonial */}
          <div className="mb-10">
            <h3 className="mb-4 text-center text-2xl font-bold text-brand-green">שמעו מזוג שחגג איתנו</h3>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="overflow-hidden rounded-2xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/10 to-transparent p-2 shadow-[0_0_60px_rgba(3,178,140,0.3)]"
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
                <p className="text-sm font-semibold text-brand-green">"החתונה הכי טובה שהיינו בה" 💚</p>
              </div>
            </motion.div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/40 backdrop-blur-md"
            >
              <Image src="/assets/almog/wedding-1.jpg" alt="רגעים מהחופה" width={1200} height={900} className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/40 backdrop-blur-md"
            >
              <Image src="/assets/almog/wedding-2.jpg" alt="רחבת ריקודים מרימה" width={1200} height={900} className="h-full w-full object-cover" />
            </motion.div>
          </div>
          <p className="mb-4 text-sm text-white/80 md:text-base">
            רוצים להבין איך זה יכול להיראות אצלכם? תשלחו לי תאריך ולוקיישן, ונחשוב יחד על הפסקול של
            החתונה שלכם.
          </p>
          <motion.a
            href={wa("שלום, נשמח לשריין תאריך לחתונה")}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-green to-brand-blue px-8 py-4 text-base font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.4)] transition-all hover:shadow-[0_0_60px_rgba(3,178,140,0.6)]"
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
