import { useEffect, useRef, useState } from "react";
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

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
}

interface YouTubePlayerEvent {
  data: number;
}

interface YouTubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      height: string;
      width: string;
      videoId: string;
      playerVars: {
        controls: number;
        playsinline: number;
        rel: number;
        origin: string;
      };
      events: {
        onReady?: () => void;
        onStateChange?: (event: YouTubePlayerEvent) => void;
        onError?: () => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: (() => void) | null;
  }
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
  { id: "ZbyxjGE885I", title: "Track 9", artist: "MÃ˜NÃ˜M" },
  { id: "Y9mRoCerrpY", title: "Track 10", artist: "Kodi Lofi" },
  { id: "amfWIRasxtI", title: "Track 11", artist: "Lofi Study Room" },
];

const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${YOUTUBE_IFRAME_API_SRC}"]`,
    );
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();

      if (window.YT?.Player) {
        resolve(window.YT);
        return;
      }

      youtubeApiPromise = null;
      reject(new Error("YouTube player API was unavailable."));
    };

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = YOUTUBE_IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      youtubeApiPromise = null;
      reject(new Error("Failed to load the YouTube player API."));
    };
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

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
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [hasInitializedPlayer, setHasInitializedPlayer] = useState(false);
  const [queue, setQueue] = useState<Track[]>(TRACKS);
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const queueRef = useRef(queue);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const current = queue[index] ?? TRACKS[0];

  useEffect(() => {
    if (!hasInitializedPlayer || playerRef.current || !playerHostRef.current) {
      return;
    }

    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !playerHostRef.current || playerRef.current) {
          return;
        }

        playerRef.current = new YT.Player(playerHostRef.current, {
          height: "200",
          width: "200",
          videoId: current.id,
          playerVars: {
            controls: 0,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) {
                return;
              }

              setPlayerError(null);
              setIsPlayerReady(true);
            },
            onStateChange: (event) => {
              if (cancelled) {
                return;
              }

              if (event.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                return;
              }

              if (
                event.data === YT.PlayerState.PAUSED ||
                event.data === YT.PlayerState.CUED
              ) {
                setIsPlaying(false);
                return;
              }

              if (event.data === YT.PlayerState.ENDED) {
                setIndex((currentIndex) =>
                  (currentIndex + 1) % queueRef.current.length,
                );
                setIsPlaying(true);
              }
            },
            onError: () => {
              if (cancelled) {
                return;
              }

              setPlayerError("This track could not be played.");
              setIsPlaying(false);
            },
          },
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setPlayerError("Music player failed to load.");
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsPlayerReady(false);
    };
  }, [current.id, hasInitializedPlayer]);

  useEffect(() => {
    if (!current || !isPlayerReady || !playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.loadVideoById(current.id);
      return;
    }

    playerRef.current.cueVideoById(current.id);
  }, [current, isPlayerReady, isPlaying]);

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) {
      return;
    }

    playerRef.current.setVolume(volume);

    if (muted || volume === 0) {
      playerRef.current.mute();
      return;
    }

    playerRef.current.unMute();
  }, [isPlayerReady, muted, volume]);

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.playVideo();
      return;
    }

    playerRef.current.pauseVideo();
  }, [isPlayerReady, isPlaying]);

  if (!current) {
    return null;
  }

  const openPlayer = () => {
    setHasInitializedPlayer(true);
    setPlayerError(null);
    setIsOpen(true);
  };

  const togglePlay = () => {
    if (!isPlayerReady) {
      return;
    }

    setPlayerError(null);
    setIsPlaying((value) => !value);
  };

  const goTo = (nextIndex: number) => {
    setPlayerError(null);
    setIndex(nextIndex);
    setIsPlaying(true);
  };

  const skipNext = () => goTo((index + 1) % queue.length);
  const skipPrev = () => goTo((index - 1 + queue.length) % queue.length);

  const toggleShuffle = () => {
    setPlayerError(null);
    setQueue(shuffled ? TRACKS : shuffleArray(TRACKS));
    setIndex(0);
    setShuffled((value) => !value);
    setIsPlaying(false);
  };

  const handleVolume = (value: number) => {
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleMute = () => {
    setMuted((value) => !value);
  };

  const handleClose = () => {
    setIsPlaying(false);
    setIsOpen(false);
  };

  return (
    <>
      {hasInitializedPlayer && (
        <div
          aria-hidden="true"
          className="fixed -left-[9999px] top-0 h-[200px] w-[200px] overflow-hidden opacity-0 pointer-events-none"
        >
          <div ref={playerHostRef} className="h-[200px] w-[200px]" />
        </div>
      )}

      {!isOpen && (
        <button
          onClick={openPlayer}
          aria-label="Open music player"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-(--color-border) bg-(--color-fg) text-(--color-bg) flex items-center justify-center shadow-lg hover:opacity-90 hover:scale-105 transition-all"
        >
          <Music size={18} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:w-72 sm:right-6 z-50 rounded-2xl border border-(--color-border) bg-(--color-bg) shadow-2xl">
          <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
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
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={!isPlayerReady}
                className="w-9 h-9 rounded-full bg-(--color-fg) text-(--color-bg) flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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
                onChange={(event) => handleVolume(Number(event.target.value))}
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

            {!isPlayerReady && !playerError && (
              <p className="text-xs text-(--color-fg)/40">
                Loading player...
              </p>
            )}

            {playerError && (
              <p className="text-xs text-red-500/80">{playerError}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
