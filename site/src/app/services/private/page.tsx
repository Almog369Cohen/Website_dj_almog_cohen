import Image from "next/image";

export default function PrivateEventsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;
  return (
    <div className="text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-black/50 p-6 shadow-xl shadow-black/40 backdrop-blur-md">
        <div className="mb-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-green/80">
            PRIVATE EVENTS
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">אירועים פרטיים</h1>
        </div>
        <p className="mb-4 text-sm text-white/80 md:text-base">
          בר/בת מצווה, מסיבות גג, ימי הולדת ואפטרים – מוזיקה שמרגישה אישית אבל מנגנת כמו במה
          גדולה. ביחד נתאים את הסטייל, השירים והסגנונות לקהל שמגיע, כדי שכל אחד ירגיש חלק
          מהאירוע – מהצעירים ועד המבוגרים.
        </p>
        <ul className="mb-6 list-disc pr-6 text-sm text-white/75 md:text-base">
          <li className="marker:text-brand-green">סטים מותאמים במיוחד לאירועי משפחה וחברים</li>
          <li className="marker:text-brand-green">פתיחת ערב רגועה ואטמוספרית ורחבה שממריאה בהמשך</li>
          <li className="marker:text-brand-green">שילוב סגנונות לפי בקשה – מיינסטרים, מזרחית, היפ הופ, טכנו, לועזי ועוד</li>
          <li className="marker:text-brand-green">אפשרות לשילוב נגנים חיים או מיקרופון לטקסים וברכות</li>
        </ul>
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5/80 shadow-lg shadow-black/40 backdrop-blur-md transition-transform hover:-translate-y-1 hover:scale-[1.01]">
          <Image src="/assets/almog/private-1.jpg" alt="אירועים פרטיים" width={1600} height={1066} className="h-full w-full object-cover" />
        </div>
        <p className="mb-4 text-sm text-white/80 md:text-base">
          יש לכם תאריך ורעיון בראש? שלחו לי הודעה קצרה ונתכנן יחד את המסיבה שלכם עד הפרט האחרון.
        </p>
        <a
          href={wa("שלום, אשמח לפרטים על אירוע פרטי")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full bg-brand-blue px-7 py-3 text-sm font-semibold text-black shadow-lg shadow-brand-blue/40 transition hover:scale-[1.03] hover:shadow-brand-green/60"
        >
          דברו איתי ב־WhatsApp
        </a>
        </div>
      </section>
    </div>
  );
}