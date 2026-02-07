"use client";

export default function YoutubePlaylist({ listId, title }: { listId: string; title?: string }) {
  if (!listId || listId === "YOUR_PLAYLIST_ID" || listId.startsWith("YOUR_")) {
    return (
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-border bg-background/30 p-8 text-center">
        <p className="text-foreground-secondary">⚠️ Playlist ID לא הוגדר</p>
      </div>
    );
  }

  const playlistUrl = `https://www.youtube.com/playlist?list=${listId}`;

  return (
    <a
      href={playlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-red-950/50 via-black to-black shadow-xl transition-all hover:border-red-600 hover:shadow-2xl hover:shadow-red-600/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-[280px] flex-col items-center justify-center gap-6 p-8 text-center">
        {/* YouTube Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/50 transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-red-600/60">
          <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>

        {/* Title */}
        {title && (
          <h3 className="text-xl font-bold text-white md:text-2xl">
            {title}
          </h3>
        )}

        {/* Play Button */}
        <div className="flex items-center gap-3 rounded-full bg-red-600 px-6 py-3 font-bold text-white shadow-lg transition-all group-hover:bg-red-700 group-hover:scale-105">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>האזן ב-YouTube</span>
        </div>

        {/* Hint */}
        <p className="text-sm text-white/60 transition-all group-hover:text-white/80">
          לחץ לפתיחת הפלייליסט המלא 🎵
        </p>
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent" />
      </div>
    </a>
  );
}
