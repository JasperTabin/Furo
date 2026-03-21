import { useState, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  X,
  SkipBack,
  SkipForward,
  Shuffle,
  Volume2,
  VolumeX,
} from "lucide-react";

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
  { id: "ZbyxjGE885I", title: "Track 9", artist: "MØNØM" },
  { id: "Y9mRoCerrpY", title: "Track 10", artist: "Kodi Lofi" },
  { id: "amfWIRasxtI", title: "Track 11", artist: "Lofi Study Room" },
];

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
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const current = queue[index];

  const sendCommand = (func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
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
  };

  const skipNext = () => goTo((index + 1) % queue.length);
  const skipPrev = () => goTo((index - 1 + queue.length) % queue.length);

  const toggleShuffle = () => {
    setQueue(shuffled ? TRACKS : shuffleArray(TRACKS));
    setIndex(0);
    setShuffled((v) => !v);
    setIsPlaying(false);
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    setMuted(val === 0);
    sendCommand("setVolume", [val]);
    if (val > 0) sendCommand("unMute");
  };

  const toggleMute = () => {
    if (muted) {
      sendCommand("unMute");
      sendCommand("setVolume", [volume || 80]);
      setMuted(false);
    } else {
      sendCommand("mute");
      setMuted(true);
    }
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

          <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
            {/* Track info + close */}
            <div className="flex items-start justify-between gap-2">
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
                className="shrink-0 w-6 h-6 flex items-center justify-center text-(--color-fg)/40 hover:text-(--color-fg) rounded transition-colors"
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

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-(--color-fg)/40 hover:text-(--color-fg) transition-colors shrink-0"
              >
                {muted || volume === 0 ? (
                  <VolumeX size={15} />
                ) : (
                  <Volume2 size={15} />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={muted ? 0 : volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                style={{
                  accentColor: "var(--color-fg)",
                  background: `linear-gradient(to right, var(--color-fg) ${muted ? 0 : volume}%, color-mix(in srgb, var(--color-fg) 20%, transparent) ${muted ? 0 : volume}%)`,
                }}
                className="flex-1 h-1 rounded-full cursor-pointer appearance-none"
              />

              <span className="text-(--color-fg)/30 text-xs tabular-nums w-6 text-right">
                {muted ? 0 : volume}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
