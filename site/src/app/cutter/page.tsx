import type { Metadata } from "next";
import { AudioCutter } from "@/components/cutter/AudioCutter";

export const metadata: Metadata = {
  title: "חותך אודיו מהיר – עד 60 שניות | Compaktt",
  description:
    "חותכים קטע מתוך שיר במהירות ובקלות – הכל בדפדפן, ללא העלאה לשרת. WAV / MP3 / FLAC / AIFF.",
  alternates: {
    canonical: "/cutter",
  },
};

export default function CutterPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground-heading">חותך אודיו</h1>
        <p className="mt-2 text-sm md:text-base text-foreground-secondary">
          העלו קובץ, בחרו קטע (עד 60 שניות), וייצאו בפורמט שאתם צריכים.
        </p>
      </div>
      <AudioCutter />
    </div>
  );
}
