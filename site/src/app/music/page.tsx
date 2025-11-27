import { PLAYLISTS } from "@/content/playlists";
import YoutubePlaylist from "@/components/YoutubePlaylist";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue/80">
            LISTEN NOW
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground-heading md:text-4xl">מוזיקה מומלצת לאירועים</h1>
        </div>
        <p className="mb-10 max-w-3xl text-sm text-foreground-secondary md:text-base">
          כאן תמצאו פלייליסטים נבחרים לאווירה, לחופה ולרחבה – בדיוק באותו DNA מוזיקלי שמוביל את
          האירועים והקורסים. כל פלייליסט הוא נקודת פתיחה שתוכלו להתאים לסט האישי שלכם.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background/50 p-5 text-right shadow-xl backdrop-blur"
            >
              <div>
                <p className="text-xs text-brand-blue/80">פלייליסט</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground-heading md:text-xl">{pl.title}</h2>
              </div>
              <p className="text-sm text-foreground-secondary">{pl.description}</p>
              <div className="mt-2 overflow-hidden rounded-xl border border-border bg-background/40">
                <YoutubePlaylist listId={pl.id} title={pl.title} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
