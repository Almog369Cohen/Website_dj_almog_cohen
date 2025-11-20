export default function YoutubePlaylist({ listId, title }: { listId: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {title ? <div className="px-4 pt-3 text-sm text-white/70">{title}</div> : null}
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/videoseries?list=${listId}`}
          title={title || "YouTube playlist"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
