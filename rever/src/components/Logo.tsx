export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`} dir="ltr">
      <span className="font-display text-2xl font-bold tracking-[0.35em] text-gold-grad">REVER</span>
      <span className="mt-1 text-[0.6rem] tracking-[0.42em] text-ink-dim" dir="rtl">הפקות אירועים</span>
    </span>
  );
}
