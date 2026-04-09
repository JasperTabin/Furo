import { useEffect, useRef, useState } from "react";
import { loadYouTubeApi, type YouTubePlayer } from "./music-player";

export const useMusicPlayer = (
  videoId: string,
  shouldAutoplay: boolean,
  onVideoEnd?: () => void,
  setIsPlaying?: (playing: boolean) => void,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [canStop, setCanStop] = useState(false);
  const isInitialMount = useRef(true);
  const isPlayerReady = useRef(false);
  const isLoadingVideo = useRef(false);
  const onVideoEndRef = useRef(onVideoEnd);
  const setIsPlayingRef = useRef(setIsPlaying);
  const videoIdRef = useRef(videoId);

  useEffect(() => {
    onVideoEndRef.current = onVideoEnd;
    setIsPlayingRef.current = setIsPlaying;
    videoIdRef.current = videoId;
  }, [onVideoEnd, setIsPlaying, videoId]);

  useEffect(() => {
    let disposed = false;

    loadYouTubeApi().then((YT) => {
      if (disposed || !containerRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: videoIdRef.current,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            setCanStop(false);
            isPlayerReady.current = true;
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setCanStop(true);
              setIsPlayingRef.current?.(true);
            }
            if (event.data === YT.PlayerState.PAUSED) {
              setCanStop(true);
              setIsPlayingRef.current?.(false);
            }
            if (event.data === YT.PlayerState.ENDED) {
              setCanStop(false);
              setIsPlayingRef.current?.(false);
              onVideoEndRef.current?.();
            }
          },
        },
      });
    });

    return () => {
      disposed = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        isPlayerReady.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !isPlayerReady.current || isLoadingVideo.current)
      return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    isLoadingVideo.current = true;
    try {
      if (shouldAutoplay) {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current.cueVideoById(videoId);
      }
      setCanStop(false);
    } finally {
      setTimeout(() => {
        isLoadingVideo.current = false;
      }, 500);
    }
  }, [videoId, shouldAutoplay]);

  const stop = () => {
    playerRef.current?.stopVideo();
    setCanStop(false);
    setIsPlayingRef.current?.(false);
  };

  return {
    containerRef,
    canStop,
    stop,
  };
};
