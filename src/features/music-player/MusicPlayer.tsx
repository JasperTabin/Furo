import { useState } from "react";
import { Music2, SkipForward, Square } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
}

const TRACKS: Track[] = [
  { id: "rYXVAAL_1ss", title: "Study with Me", artist: "Ambient Waves" },
  { id: "ivdPyFUPbAk", title: "Focus Flow", artist: "Deep Work" },
  { id: "_Q8Ih2SW-TE", title: "Peaceful Piano", artist: "Relax Music" },
  { id: "4EOZ4vG1tpE", title: "Night Drive Vibes", artist: "Chill Nights" },
  { id: "kMeHnn6IeMo", title: "Rain & Coffee", artist: "Cozy Sounds" },
  { id: "QebXHPY7sac", title: "Study & Work", artist: "Mr. Tiny's Studio" },
  { id: "bjelz7JxFZQ", title: "Let's just Start", artist: "Roti" },
  { id: "vWjl07A3rZg", title: "Tunes of Capy", artist: "Chill Pills Studio" },
  { id: "ZbyxjGE885I", title: "Track 9", artist: "MØNOM" },
  { id: "Y9mRoCerrpY", title: "Track 10", artist: "Kodi Lofi" },
  { id: "amfWIRasxtI", title: "Track 11", artist: "Lofi Study Room" },
];

function embedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = TRACKS[index];
  const skipNext = () => setIndex((i) => (i + 1) % TRACKS.length);

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open music player"
          className="
            fixed bottom-6 right-6 z-50
            w-10 h-10 rounded-full
            bg-(--color-fg) text-(--color-bg)
            border border-(--color-border)
            flex items-center justify-center
            shadow-lg hover:opacity-90 hover:scale-105
            transition-all duration-200
          "
        >
          <Music2 size={15} />
        </button>
      )}

      {/* Card */}
      {isOpen && (
        <div
          role="region"
          aria-label="Music player"
          className="
            fixed bottom-6 right-6 z-50
            w-90 rounded-xl overflow-hidden
            bg-(--color-bg) border border-(--color-border)
            shadow-2xl
            animate-[slideUp_0.2s_cubic-bezier(0.16,1,0.3,1)]
          "
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(10px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)   scale(1); }
            }
          `}</style>

          {/* ── Bar: Title · Count · Controls ── */}
          <div
            className="
            grid grid-cols-[1fr_auto_auto] items-center gap-2
            px-3 py-2.5
            border-b border-(--color-border)
          "
          >
            {/* Title + Artist */}
            <div className="min-w-0">
              <p
                className="
                text-xs font-medium tracking-wide
                text-(--color-fg) truncate leading-tight
              "
              >
                {current.title}
              </p>
              <p
                className="
                text-[0.6rem] font-normal
                text-(--color-fg)/40 truncate mt-0.5 tracking-wide
              "
              >
                {current.artist}
              </p>
            </div>

            {/* Track count */}
            <span
              aria-label={`Track ${index + 1} of ${TRACKS.length}`}
              className="text-[0.6rem] tabular-nums text-(--color-fg)/30 tracking-widest px-1 shrink-0"
            >
              {String(index + 1).padStart(2, "0")}&thinsp;/&thinsp;
              {String(TRACKS.length).padStart(2, "0")}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close player"
                title="Close"
                className="
                  w-7 h-7 rounded-md flex items-center justify-center
                  border border-(--color-border)
                  text-(--color-fg)/50 hover:text-(--color-fg)
                  hover:bg-(--color-fg)/5
                  transition-colors duration-150
                "
              >
                <Square size={10} strokeWidth={2.5} />
              </button>
              <button
                onClick={skipNext}
                aria-label="Next track"
                title="Next"
                className="
                  w-7 h-7 rounded-md flex items-center justify-center
                  border border-(--color-border)
                  text-(--color-fg)/50 hover:text-(--color-fg)
                  hover:bg-(--color-fg)/5
                  transition-colors duration-150
                "
              >
                <SkipForward size={12} />
              </button>
            </div>
          </div>

          {/* ── Video ── */}
          <div className="w-full aspect-video bg-black">
            <iframe
              key={current.id}
              src={embedUrl(current.id)}
              title={`${current.title} by ${current.artist}`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full border-0 block"
            />
          </div>
        </div>
      )}
    </>
  );
}
