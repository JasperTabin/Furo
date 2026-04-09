// ============================================================================
// TYPES
// ============================================================================
export interface Track {
  id: string;
  title: string;
  artist: string;
}

export interface YouTubePlayer {
  cueVideoById: (videoId: string) => void;
  loadVideoById: (videoId: string) => void;
  stopVideo: () => void;
  destroy: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================
export const TRACKS: Track[] = [
  { id: "rYXVAAL_1ss", title: "Study with Me", artist: "Ambient Waves" },
  { id: "ivdPyFUPbAk", title: "Focus Flow", artist: "Deep Work" },
  { id: "_Q8Ih2SW-TE", title: "Peaceful Piano", artist: "Relax Music" },
  { id: "4EOZ4vG1tpE", title: "Night Drive Vibes", artist: "Chill Nights" },
  { id: "kMeHnn6IeMo", title: "Rain & Coffee", artist: "Cozy Sounds" },
  { id: "QebXHPY7sac", title: "Study & Work", artist: "Mr. Tiny's Studio" },
  { id: "bjelz7JxFZQ", title: "Let's just Start", artist: "Roti" },
  { id: "vWjl07A3rZg", title: "Tunes of Capy", artist: "Chill Pills Studio" },
  { id: "ZbyxjGE885I", title: "Track 9", artist: "MONOM" },
  { id: "Y9mRoCerrpY", title: "Track 10", artist: "Kodi Lofi" },
  { id: "amfWIRasxtI", title: "Track 11", artist: "Lofi Study Room" },
];

// ============================================================================
// YOUTUBE API
// ============================================================================
declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        config: {
          videoId?: string;
          host?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
        PAUSED: number;
        PLAYING: number;
        UNSTARTED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<NonNullable<Window["YT"]>> | null = null;

export const loadYouTubeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    const handleReady = () => {
      if (window.YT) resolve(window.YT);
    };

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      handleReady();
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    } else if (window.YT?.Player) {
      handleReady();
    }
  });

  return youtubeApiPromise;
};
