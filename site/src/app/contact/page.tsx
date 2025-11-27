export default function ContactPage({ searchParams }: { searchParams?: { success?: string } }) {
  const success = searchParams?.success === "1";
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent("שלום אלמוג, השארתי פרטים באתר ואשמח לדבר.");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h1 className="mb-8 text-3xl md:text-4xl font-bold text-foreground-heading">צור קשר</h1>
        <p className="mb-6 text-foreground-secondary">בואו ניצור רגעים בלתי נשכחים יחד 🎶</p>
        {success ? (
          <div className="mb-6 rounded-lg border border-brand-green/40 bg-brand-green/10 p-4 text-foreground">
            <p className="mb-3">תודה! פנייתך התקבלה. אחזור אליך בהקדם.</p>
            <a
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-brand-green px-4 py-2 text-white hover:opacity-90"
            >
              דברו איתי ב־WhatsApp עכשיו
            </a>
          </div>
        ) : null}
        <form className="grid gap-4 md:grid-cols-4" method="post" action="/api/contact">
          <input name="name" required placeholder="שם" className="col-span-2 rounded-lg border border-border bg-background/50 px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground" />
          <input name="phone" required placeholder="טלפון" className="rounded-lg border border-border bg-background/50 px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground" />
          <input name="email" type="email" placeholder="אימייל" className="rounded-lg border border-border bg-background/50 px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground" />
          <textarea name="message" placeholder="ספרו לי על האירוע או המטרה" className="col-span-3 rounded-lg border border-border bg-background/50 px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground" />
          <button className="rounded-lg bg-brand-green px-5 py-3 font-medium text-white hover:opacity-90">שלחו</button>
        </form>
        <div className="mt-6 text-foreground-secondary text-sm">ווטסאפ: <a className="text-brand-blue hover:underline" href="https://wa.me/972502427616" target="_blank">+972-50-242-7616</a> · מייל: <a className="text-brand-blue hover:underline" href="mailto:almogmusiccohen@gmail.com">almogmusiccohen@gmail.com</a></div>
        <div className="mt-10 rounded-2xl border border-border bg-background/50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-foreground-heading">מתנה</h2>
          <p className="text-foreground-secondary">5 טיפים לרחבה מושלמת — להורדה בקרוב.</p>
        </div>
      </section>
    </div>
  );
}
