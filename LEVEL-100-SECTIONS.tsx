// ===============================================
// 🎯 LEVEL 100 BRAND SECTIONS
// Copy these sections into HomeSections.tsx
// ===============================================

// Import at the top of HomeSections.tsx:
// import { ContactFormLevel100 } from "@/components/ui/ContactFormLevel100";

// ===============================================
// 1️⃣ WEDDINGS SECTION - LEVEL 100
// Replace the existing events-section (around line 747)
// ===============================================

<section id="weddings-level-100" className="relative overflow-hidden bg-[#1f1f21] py-20 md:py-32">
  {/* Background Elements */}
  <div className="pointer-events-none absolute inset-0">
    <div className="brand-noise absolute inset-0 opacity-40" aria-hidden="true" />
    <div className="absolute left-0 top-0 h-96 w-96 bg-[#059cc0]/10 blur-[120px]" />
    <div className="absolute right-0 bottom-0 h-96 w-96 bg-[#03b28c]/10 blur-[120px]" />
  </div>

  <div className="relative z-10 mx-auto max-w-6xl px-6">
    {/* Headline - MASSIVE */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-12 text-center"
    >
      <h2 
        className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
        style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
      >
        לא כל זוג מתאים אליי.
        <br />
        <span className="text-[#03b28c]">וזה בסדר.</span>
      </h2>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
        אם אתם רוצים חוויה שמייצגת מי שאתם באמת — אז בואו נבדוק אם זה הדדי. 
        <br className="hidden md:inline" />
        אני לא מנגן כדי לעשות בלגן. אני מנגן כדי לעשות רושם שנשאר גם כשהשמפניה נגמרת.
      </p>
    </motion.div>

    {/* Two Column Layout */}
    <div className="grid gap-8 md:grid-cols-2">
      {/* Left: Who Fits? */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
      >
        <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative z-10">
          <h3 className="mb-6 text-2xl font-black text-[#059cc0]" style={{ fontWeight: 900 }}>
            למי זה מתאים?
          </h3>
          <ul className="space-y-4">
            {[
              "זוגות שיודעים להעריך איכות",
              "אנשים שמאמינים שמוזיקה היא החלטה",
              "כאלה שלא מתנצלים על הטעם שלהם",
            ].map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-3 text-right"
              >
                <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#03b28c]/20 text-[#03b28c]">
                  ✓
                </span>
                <span className="flex-1 text-white/90">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Right: Contact Form */}
      <ContactFormLevel100 context="wedding" />
    </div>
  </div>
</section>

// ===============================================
// 2️⃣ COURSES SECTION - LEVEL 100 (The Academy)
// Replace the existing school-section (around line 360)
// ===============================================

<section id="academy-level-100" className="relative overflow-hidden bg-brand-dark py-20 md:py-32">
  {/* Background */}
  <div className="pointer-events-none absolute inset-0">
    <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
  </div>

  <div className="relative z-10 mx-auto max-w-7xl px-6">
    {/* Headline */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-16 text-center"
    >
      <h2 
        className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl"
        style={{ fontWeight: 900 }}
      >
        כאן לא לומדים לנגן.
        <br />
        <span className="text-[#059cc0]">לומדים להיות מישהו ששמים עליו את האירוע.</span>
      </h2>
      <p className="mx-auto max-w-2xl text-lg text-white/70">
        אם אתה מחפש "קורס מגניב", תמשיך הלאה. 
        אם אתה רוצה לשלוט באווירה — תשאיר תירוצים בחוץ.
      </p>
    </motion.div>

    {/* 3 Packages */}
    <div className="grid gap-8 md:grid-cols-3">
      {/* Package 1 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -8 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1f1f21] p-8"
      >
        <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-4 inline-block rounded-full bg-white/5 px-4 py-1 text-sm font-bold text-white/60">
            חבילה 1
          </div>
          <h3 className="mb-3 text-3xl font-black text-white" style={{ fontWeight: 900 }}>
            1,250 ₪
          </h3>
          <p className="mb-6 text-white/80">
            טעימה שמראה אם זה בשבילך. בוא תגלה אם יש לך את זה.
          </p>
          <ul className="mb-8 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>היכרות עם הציוד</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>המיקס הראשון</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>הבנה אם זה בשבילך</span>
            </li>
          </ul>
          <Link
            href="/courses"
            className="block w-full rounded-full border-2 border-[#059cc0] bg-[#059cc0]/10 px-6 py-3 text-center font-bold text-[#059cc0] transition hover:bg-[#059cc0]/20"
          >
            פרטים נוספים
          </Link>
        </div>
      </motion.div>

      {/* Package 2 - FEATURED */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -8 }}
        className="relative overflow-hidden rounded-3xl border-2 border-[#03b28c] bg-[#1f1f21] p-8 shadow-[0_0_40px_rgba(3,178,140,0.3)]"
      >
        <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="absolute right-4 top-4 rounded-full bg-[#03b28c] px-3 py-1 text-xs font-bold text-black">
          הכי פופולרי
        </div>
        <div className="relative z-10">
          <div className="mb-4 inline-block rounded-full bg-[#03b28c]/20 px-4 py-1 text-sm font-bold text-[#03b28c]">
            חבילה 2
          </div>
          <h3 className="mb-3 text-3xl font-black text-white" style={{ fontWeight: 900 }}>
            3,500 ₪
          </h3>
          <p className="mb-6 text-white/80">
            השלב שבו מפסיקים להיראות כמו תלמיד ומתחילים להישמע כמו מקצוען.
          </p>
          <ul className="mb-8 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>טכניקות מיקס מתקדמות</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>קריאת קהל</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>בניית סט מקצועי</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>ציוד מומלץ</span>
            </li>
          </ul>
          <Link
            href="/courses"
            className="block w-full rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-6 py-3 text-center font-bold text-black shadow-[0_0_30px_rgba(3,178,140,0.5)] transition hover:shadow-[0_0_50px_rgba(3,178,140,0.8)]"
          >
            שריין מקום
          </Link>
        </div>
      </motion.div>

      {/* Package 3 - PRO */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -8 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1f1f21] p-8"
      >
        <div className="brand-noise absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-4 inline-block rounded-full bg-white/5 px-4 py-1 text-sm font-bold text-white/60">
            PRO
          </div>
          <h3 className="mb-3 text-3xl font-black text-white" style={{ fontWeight: 900 }}>
            6,000-7,000 ₪
          </h3>
          <p className="mb-6 text-white/80">
            מי שבקצה הזה לא שואל כמה זה עולה. הוא שואל איך נכנסים.
          </p>
          <ul className="mb-8 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>מנטורינג אישי 1:1</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>בניית מיתוג אישי</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>הפקת רמיקסים</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>ליווי קריירה</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#03b28c]">✓</span>
              <span>גישה לרשת קשרים</span>
            </li>
          </ul>
          <Link
            href="/courses"
            className="block w-full rounded-full border-2 border-[#059cc0] bg-[#059cc0]/10 px-6 py-3 text-center font-bold text-[#059cc0] transition hover:bg-[#059cc0]/20"
          >
            בואו נדבר
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Bottom Form */}
    <div className="mt-16">
      <ContactFormLevel100 context="course" />
    </div>
  </div>
</section>

// ===============================================
// 3️⃣ "CHOGEG MENAGEN" SECTION - LEVEL 100
// Add this as a NEW section (insert after courses)
// ===============================================

<section id="chogeg-menagen-level-100" className="relative overflow-hidden bg-[#1f1f21] py-20 md:py-32">
  {/* Background */}
  <div className="pointer-events-none absolute inset-0">
    <div className="brand-noise absolute inset-0 opacity-40" aria-hidden="true" />
    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[#03b28c]/10 blur-[150px]" />
  </div>

  <div className="relative z-10 mx-auto max-w-5xl px-6">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      {/* Headline */}
      <h2 
        className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl"
        style={{ fontWeight: 900 }}
      >
        חוגג מנגן:
        <br />
        <span className="text-[#03b28c]">זה לא מתנה. זה הישג.</span>
      </h2>
      
      <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-white/80">
        הילד לא מקבל "הזדמנות לנגן". הוא מקבל רגע בספוטלייט שמראה שיש לו אומץ ורצינות. 
        <br className="hidden md:inline" />
        לא עוד גימיק — הצגה.
      </p>

      {/* Price Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#03b28c]/30 bg-white/5 p-8 backdrop-blur-md md:p-12"
      >
        <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-2xl font-bold text-white/40 line-through md:text-3xl">2800 ₪</span>
            <svg className="h-8 w-8 text-[#03b28c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-4xl font-black text-[#03b28c] md:text-5xl" style={{ fontWeight: 900 }}>
              2300 ₪
            </span>
          </div>
          <p className="mb-8 text-sm text-white/60">
            מחיר היכרות מיוחד
          </p>

          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616"}?text=${encodeURIComponent("היי אלמוג, רציתי לשמוע על 'חוגג מנגן'")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] px-8 py-4 text-center text-lg font-bold text-black shadow-[0_0_40px_rgba(3,178,140,0.5)] transition hover:shadow-[0_0_60px_rgba(3,178,140,0.8)]"
          >
            תנו להם רגע שמגיע רק למי שעובד עליו
          </Link>
        </div>
      </motion.div>
    </motion.div>
  </div>
</section>

// ===============================================
// 🎨 ADDITIONAL GLOBAL CSS (Add to page.tsx global styles)
// ===============================================

/*
.brand-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
}
*/
