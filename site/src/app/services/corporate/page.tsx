import Image from "next/image";

export default function CorporatePage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  return (
    <div className="bg-brand-dark text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h1 className="mb-6 text-3xl md:text-4xl font-bold">אירועים עסקיים</h1>
        <p className="mb-4 text-white/80">
          מוזיקה שמרימה ומייצרת אווירה מקצועית ונעימה: כנסים, האקתונים, קוקטיילים,
          ערבי חברה ונטוורקינג. מיתוג מוזיקלי שמחזק את המסר של האירוע.
        </p>
        <ul className="mb-6 list-disc pr-6 text-white/70">
          <li>פלייליסט אלגנטי שמאפשר שיחה</li>
          <li>סטים קצביים לרגעי שיא והכרזות</li>
          <li>הגשה מדויקת ועבודה מתואמת עם ההפקה</li>
        </ul>
        <div className="mb-8 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <Image src="/assets/almog/corporate-1.jpg" alt="אירועי חברה" width={1600} height={1066} className="h-full w-full object-cover" />
        </div>
        <a href={wa("שלום, אשמח להצעת מחיר לאירוע עסקי")}
           target="_blank" rel="noopener noreferrer"
           className="inline-flex rounded-full bg-brand-blue px-5 py-3 text-black font-medium hover:opacity-90">
          בקשת הצעת מחיר ב־WhatsApp
        </a>
      </section>
    </div>
  );
}
