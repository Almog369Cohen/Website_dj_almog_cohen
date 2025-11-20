export default function EventsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent("שלום אלמוג, ראיתי את עמוד האירועים ואני רוצה פרטים.");
  const wa = (txt?: string) => `https://wa.me/${waNumber}?text=${txt || waText}`;
  return (
    <div className="bg-brand-dark text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h1 className="mb-8 text-3xl md:text-4xl font-bold">אירועים</h1>
        <p className="mb-10 text-white/80">כל אירוע הוא פסקול. כל רגע נבנה מאנרגיה, רגש ואהבה למוזיקה.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">חתונות</h2>
            <p className="mb-4 text-white/70">ריקוד ראשון, חופה, שבירת הכוס – המוזיקה מחברת הכל.</p>
            <a href={wa()} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">שריין תאריך</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">בר/בת מצווה</h2>
            <p className="mb-4 text-white/70">Celebrate & Play – ליצור זכרונות של שמחה.</p>
            <a href={wa(encodeURIComponent("שלום, אשמח לפרטים על בר/בת מצווה"))} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">בוא נתחיל</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">אפטר / פרטי</h2>
            <p className="mb-4 text-white/70">מסיבות פרטיות אינטימיות ועד מסיבות גדולות.</p>
            <a href={wa(encodeURIComponent("שלום, אשמח לפרטים על אפטר/אירוע פרטי"))} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">דברו איתי</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">אירועי חברה</h2>
            <p className="mb-4 text-white/70">מוזיקה שמגבשת צוות ומעלה אנרגיות.</p>
            <a href={wa(encodeURIComponent("שלום, אשמח להצעת מחיר לאירוע חברה"))} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">בקש הצעת מחיר</a>
          </div>
        </div>
      </section>
    </div>
  );
}
