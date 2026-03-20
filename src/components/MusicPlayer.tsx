import { useState, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  X,
  SkipBack,
  SkipForward,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
}

const TRACKS: Track[] = [
  { id: "OgU_UDYd9lY", title: "Chill Lofi Beats", artist: "Lofi Radio" },
  { id: "rYXVAAL_1ss", title: "Study with Me", artist: "Ambient Waves" },
  { id: "ivdPyFUPbAk", title: "Focus Flow", artist: "Deep Work" },
  { id: "_Q8Ih2SW-TE", title: "Peaceful Piano", artist: "Relax Music" },
  { id: "4EOZ4vG1tpE", title: "Night Drive Vibes", artist: "Chill Nights" },
  { id: "kMeHnn6IeMo", title: "Rain & Coffee", artist: "Cozy Sounds" },
  { id: "QebXHPY7sac", title: "Study & Work", artist: "Mr. Tiny's Studio" },
  { id: "bjelz7JxFZQ", title: "Let's just Start", artist: "Roti" },
  { id: "vWjl07A3rZg", title: "Tunes of Capy", artist: "Chill Pills Studio" },
];

const PAGE_SIZE = 3;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>(TRACKS);
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [page, setPage] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const current = queue[index];
  const totalPages = Math.ceil(queue.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const visible = queue.slice(pageStart, pageStart + PAGE_SIZE);

  const sendCommand = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*",
    );
  };

  const togglePlay = () => {
    sendCommand(isPlaying ? "pauseVideo" : "playVideo");
    setIsPlaying((v) => !v);
  };

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
    setIsPlaying(true);
    setPage(Math.floor(nextIndex / PAGE_SIZE));
  };

  const skipNext = () => goTo((index + 1) % queue.length);
  const skipPrev = () => goTo((index - 1 + queue.length) % queue.length);

  const toggleShuffle = () => {
    setQueue(shuffled ? TRACKS : shuffleArray(TRACKS));
    setIndex(0);
    setPage(0);
    setShuffled((v) => !v);
    setIsPlaying(false);
  };

  const handleClose = () => {
    sendCommand("pauseVideo");
    setIsPlaying(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating open button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open music player"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-(--color-border) bg-(--color-fg) text-(--color-bg) flex items-center justify-center shadow-lg hover:opacity-90 hover:scale-105 transition-all"
        >
          <Music size={18} />
        </button>
      )}

      {/* Player panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl border border-(--color-border) bg-(--color-bg) shadow-2xl">
          {/* Hidden iframe */}
          <iframe
            key={current.id}
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${current.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&controls=0`}
            allow="autoplay"
            className="w-0 h-0 absolute opacity-0 pointer-events-none"
            title="music"
          />

          <div className="px-4 pt-4 pb-3">
            {/* Track info */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-(--color-fg) text-sm font-medium truncate leading-tight">
                  {current.title}
                </p>
                <p className="text-(--color-fg)/40 text-xs truncate mt-0.5">
                  {current.artist}
                </p>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-(--color-fg)/40 hover:text-(--color-fg) rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={toggleShuffle}
                aria-label="Shuffle"
                className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                  shuffled
                    ? "text-(--color-fg)"
                    : "text-(--color-fg)/30 hover:text-(--color-fg)/60"
                }`}
              >
                <Shuffle size={14} />
              </button>

              <button
                onClick={skipPrev}
                aria-label="Previous"
                className="w-7 h-7 flex items-center justify-center text-(--color-fg)/60 hover:text-(--color-fg) rounded transition-colors"
              >
                <SkipBack size={15} />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-(--color-fg) text-(--color-bg) flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={skipNext}
                aria-label="Next"
                className="w-7 h-7 flex items-center justify-center text-(--color-fg)/60 hover:text-(--color-fg) rounded transition-colors"
              >
                <SkipForward size={15} />
              </button>

              <span className="text-(--color-fg)/30 text-xs tabular-nums w-7 text-right">
                {index + 1}/{queue.length}
              </span>
            </div>
          </div>

          {/* Track list */}
          <div className="border-t border-(--color-border) px-2 pt-2 pb-2">
            {/* Page row — only shown when more than 1 page */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 mb-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                  className="w-6 h-6 flex items-center justify-center rounded text-(--color-fg)/40 hover:text-(--color-fg) disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="text-xs text-(--color-fg)/30 tabular-nums">
                  {page + 1} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  aria-label="Next page"
                  className="w-6 h-6 flex items-center justify-center rounded text-(--color-fg)/40 hover:text-(--color-fg) disabled:opacity-20 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {visible.map((track, i) => {
              const trackIndex = pageStart + i;
              const isActive = trackIndex === index;
              return (
                <button
                  key={track.id}
                  onClick={() => goTo(trackIndex)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-(--color-fg)/10 text-(--color-fg)"
                      : "text-(--color-fg)/40 hover:bg-(--color-fg)/5 hover:text-(--color-fg)/70"
                  }`}
                >
                  <span className="text-xs tabular-nums text-(--color-fg)/30 w-4 flex-shrink-0">
                    {trackIndex + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {track.title}
                    </p>
                    <p className="text-xs text-(--color-fg)/30 truncate">
                      {track.artist}
                    </p>
                  </div>
                  {isActive && isPlaying && <AnimatedBars />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function AnimatedBars() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      style={{ fill: "var(--color-fg)", flexShrink: 0 }}
    >
      <style>{`
        @keyframes b1{0%,100%{height:4px;y:5px}50%{height:10px;y:2px}}
        @keyframes b2{0%,100%{height:9px;y:2.5px}50%{height:4px;y:5px}}
        @keyframes b3{0%,100%{height:6px;y:4px}50%{height:12px;y:1px}}
        .b1{animation:b1 0.8s ease-in-out infinite}
        .b2{animation:b2 0.9s ease-in-out infinite 0.15s}
        .b3{animation:b3 0.75s ease-in-out infinite 0.05s}
      `}</style>
      <rect className="b1" x="0" y="5" width="3" height="4" rx="1" />
      <rect className="b2" x="5.5" y="2.5" width="3" height="9" rx="1" />
      <rect className="b3" x="11" y="4" width="3" height="6" rx="1" />
    </svg>
  );
}
