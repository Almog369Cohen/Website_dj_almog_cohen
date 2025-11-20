export default function CoursesPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  return (
    <div className="text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue/80">
            DJ SCHOOL
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">קורסים ומנטורינג</h1>
        </div>
        <p className="mb-10 max-w-3xl text-sm text-white/80 md:text-base">
          בחרו את המסלול שמתאים לקצב שלכם – מהצעד הראשון על הקונטרולר ועד לסטים מלאים באירועים
          אמיתיים וליווי אמנים.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-brand-blue/25 bg-white/5 p-6 text-right shadow-[0_0_30px_-10px_rgba(5,156,192,0.35)] backdrop-blur">
            <h2 className="mb-2 text-xl font-semibold">מתחילים</h2>
            <p className="mb-2 text-sm text-white/80">₪6,200 – כולל קונטרולר + אוזניות</p>
            <p className="mb-4 text-sm text-white/70">יסודות התקלוט, מבנה סטים, מיקס בסיסי והיכרות עם הציוד.</p>
            <a
              href={wa("שלום, מעוניין להירשם למסלול מתחילים")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              להרשמה
            </a>
          </div>
          <div className="flex flex-col rounded-2xl border border-brand-blue/25 bg-white/5 p-6 text-right shadow-[0_0_30px_-10px_rgba(5,156,192,0.35)] backdrop-blur">
            <h2 className="mb-2 text-xl font-semibold">מתקדמים</h2>
            <p className="mb-2 text-sm text-white/80">10 שיעורי דיג&#39;יי</p>
            <p className="mb-4 text-sm text-white/70">מיקס מתקדם, הכנה לאירועים, בניית זהות אמנותית והופעה.</p>
            <a
              href={wa("שלום, מעוניין להירשם למסלול מתקדמים")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              להרשמה
            </a>
          </div>
          <div className="flex flex-col rounded-2xl border border-brand-blue/25 bg-white/5 p-6 text-right shadow-[0_0_30px_-10px_rgba(5,156,192,0.35)] backdrop-blur">
            <h2 className="mb-2 text-xl font-semibold">פרימיום</h2>
            <p className="mb-2 text-sm text-white/80">10 שיעורי דיג&#39;יי + 10 מפגשי מנטליות</p>
            <p className="mb-4 text-sm text-white/70">בניית סטים, ביטחון על במה, מיינדסט של אמן ותוכנית פעולה אישית.</p>
            <a
              href={wa("שלום, מעוניין להירשם למסלול פרימיום")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              להרשמה
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-stretch">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-right text-sm text-white/80 shadow-lg shadow-black/30 backdrop-blur">
            <h3 className="mb-2 text-2xl font-bold">ליווי אמנים</h3>
            <p className="mb-3 text-sm text-white/80">
              תוכניות ליווי למי שכבר מנגן ורוצה לעלות מדרגה – במה, מיינדסט ומיתוג אישי.
            </p>
            <ul className="mb-4 list-disc pr-6 text-xs md:text-sm">
              <li>תוכנית 3 חודשים – 4 מפגשים בחודש</li>
              <li>תוכנית 6 חודשים – 2 מפגשים בחודש + מפגשי זום</li>
            </ul>
            <a
              href={wa("שלום, מעוניין להצטרף לליווי אמנים")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              הצטרף למחזור הבא 🎧
            </a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/85 via-black/70 to-brand-blue/20 p-6 text-right text-sm text-white/85 shadow-xl shadow-black/40">
            <h3 className="mb-2 text-lg font-bold md:text-xl">לא רק ללמוד, אלא להפוך ל־DJ שלוקח את זה ברצינות</h3>
            <p className="mb-4 text-sm text-white/80">
              כאן אפשר לחדד למבקרים למה בית הספר שלך שונה: יחס אישי, דגש על הופעה ועל בניית קריירה,
              ולא רק טכניקה. אתה תשלים כאן את הניסוח המדויק שלך.
            </p>
            <a
              href={wa("שלום אלמוג, הייתי בעמוד הקורסים ואני רוצה לשמוע על המסלול המתאים לי.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-brand-blue/40 transition hover:scale-[1.03] hover:shadow-brand-green/60"
            >
              שיחת התאמה למסלול הלימודים
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
