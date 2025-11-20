import { PLAYLISTS } from "@/content/playlists";
import YoutubePlaylist from "@/components/YoutubePlaylist";

export default function MusicPage() {
  return (
    <div className="text-brand-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue/80">
            LISTEN NOW
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">מוזיקה מומלצת לאירועים</h1>
        </div>
        <p className="mb-10 max-w-3xl text-sm text-white/80 md:text-base">
          כאן תמצאו פלייליסטים נבחרים לאווירה, לחופה ולרחבה – בדיוק באותו DNA מוזיקלי שמוביל את
          האירועים והקורסים. כל פלייליסט הוא נקודת פתיחה שתוכלו להתאים לסט האישי שלכם.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-black/60 to-brand-blue/20 p-5 text-right shadow-xl shadow-black/40 backdrop-blur"
            >
              <div>
                <p className="text-xs text-brand-blue/80">פלייליסט</p>
                <h2 className="mt-1 text-lg font-semibold md:text-xl">{pl.title}</h2>
              </div>
              <p className="text-sm text-white/75">{pl.description}</p>
              <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <YoutubePlaylist listId={pl.id} title={pl.title} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
