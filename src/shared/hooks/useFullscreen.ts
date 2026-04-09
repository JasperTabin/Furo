import { useEffect, useState, type RefObject } from "react";

export const useFullscreen = <T extends HTMLElement>(
  targetRef?: RefObject<T | null>,
) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const target = targetRef?.current ?? document.documentElement;

    if (!document.fullscreenElement) {
      target.requestFullscreen().catch(console.error);
      return;
    }

    document.exitFullscreen().catch(console.error);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        targetRef?.current
          ? document.fullscreenElement === targetRef.current
          : !!document.fullscreenElement,
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [targetRef]);

  return { isFullscreen, toggleFullscreen };
};
