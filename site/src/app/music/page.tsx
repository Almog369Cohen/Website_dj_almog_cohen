import { PLAYLISTS } from "@/content/playlists";
import YoutubePlaylist from "@/components/YoutubePlaylist";
import { MusicVideosSection, FinalCTASection } from "@/components/sections";

export default function MusicPage() {
  // קיבוץ לפי רגעים באירוע
  const moments = ["סלואו", "כניסה לחופה", "שבירת כוס", "שיר סיום"];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="mb-8 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue">
            🎵 MUSIC PLAYLISTS
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground-heading md:text-5xl">
            פלייליסטים לכל רגע באירוע
          </h1>
        </div>
        <p className="mb-12 max-w-3xl text-base text-foreground-secondary md:text-lg">
          4 רגעים מכריעים באירוע. 8 פלייליסטים מדויקים. בעברית ובאנגלית.
          <br />
          כל שיר נבחר בקפידה ליצור את האווירה המושלמת.
        </p>

        {/* Playlists by Moment */}
        <div className="space-y-16">
          {moments.map((moment) => {
            const momentPlaylists = PLAYLISTS.filter(pl => pl.moment === moment);
            
            return (
              <div key={moment} className="space-y-6">
                {/* Moment Header */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-border"></div>
                  <h2 className="text-2xl font-black text-foreground-heading md:text-3xl">
                    {moment}
                  </h2>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                {/* Playlists Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {momentPlaylists.map((pl) => (
                    <div
                      key={pl.id}
                      className="group relative flex flex-col gap-4 rounded-2xl border-2 border-border bg-background/50 p-6 text-right shadow-lg backdrop-blur transition-all hover:border-brand-blue/40 hover:shadow-xl"
                    >
                      {/* Language Badge */}
                      <div className="absolute left-6 top-6">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          pl.language === 'he' 
                            ? 'bg-brand-green/20 text-brand-green' 
                            : 'bg-brand-blue/20 text-brand-blue'
                        }`}>
                          {pl.language === 'he' ? '🇮🇱 עברית' : '🇺🇸 English'}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-foreground-heading md:text-2xl">
                          {pl.title}
                        </h3>
                        <p className="mt-2 text-sm text-foreground-secondary md:text-base">
                          {pl.description}
                        </p>
                      </div>

                      {/* YouTube Embed */}
                      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
                        <YoutubePlaylist listId={pl.id} title={pl.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Videos */}
      <MusicVideosSection 
        title="סטים וקליפים נבחרים"
        subtitle="הצצה לסגנון המוזיקלי שלי - מלייבים באירועים ועד רמיקסים מקוריים."
      />

      {/* CTA */}
      <FinalCTASection 
        title="רוצים לשמוע עוד?"
        subtitle="בואו נדבר על המוזיקה שתתאים לאירוע שלכם."
      />
    </div>
  );
}
