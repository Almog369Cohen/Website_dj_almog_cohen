export default function RentalPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  return (
    <div className="bg-brand-dark text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h1 className="mb-8 text-3xl md:text-4xl font-bold">השכרת ציוד</h1>
        <p className="mb-10 text-white/80">ציוד דיג&#39;יי מקצועי – קונטרולרים, רמקולים, תאורה, אוזניות.</p>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">קונטרולרים</h2>
            <p className="mb-4 text-white/70">הגדירו את הצרכים ואכוון לציוד מתאים.</p>
            <a href={wa("שלום, אשמח להצעת מחיר להשכרת קונטרולר")}
               target="_blank" rel="noopener noreferrer"
               className="text-brand-blue hover:underline">בקשת הצעת מחיר</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">רמקולים</h2>
            <p className="mb-4 text-white/70">PA לאירועים קטנים עד גדולים.</p>
            <a href={wa("שלום, אשמח להצעת מחיר להשכרת רמקולים")} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">בקשת הצעת מחיר</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">תאורה ואוזניות</h2>
            <p className="mb-4 text-white/70">ליצירת אווירה וקונטרול מדויק.</p>
            <a href={wa("שלום, אשמח להצעת מחיר להשכרת תאורה/אוזניות")} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">בקשת הצעת מחיר</a>
          </div>
        </div>
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-2 text-2xl font-bold">מתנה להורדה</h3>
          <p className="mb-4 text-white/80">איך לבנות סטאפ דיג&#39;יי מושלם (PDF)</p>
          <a href="#" className="rounded-full border border-brand-blue px-5 py-3 text-brand-blue hover:bg-brand-blue/10">הורדה</a>
        </div>
      </section>
    </div>
  );
}
