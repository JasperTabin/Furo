import { useState, useEffect, useRef, useCallback } from "react";
import { MINI_PLAYER_WINDOW_SIZE } from "./MiniPlayer";

interface DocumentPictureInPicture {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
}

declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

export const useMiniPlayer = () => {
  const pipRef = useRef<Window | null>(null);
  const [popupContainer, setPopupContainer] = useState<HTMLElement | null>(
    null,
  );
  const [isSupported] = useState(() => !!window.documentPictureInPicture);

  useEffect(() => {
    return () => {
      pipRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!pipRef.current || pipRef.current.closed) return;
    pipRef.current.document.documentElement.className =
      document.documentElement.className;
  });

  const openMiniPlayer = useCallback(async () => {
    if (!window.documentPictureInPicture) return;

    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.focus();
      return;
    }

    const pipWindow = await window.documentPictureInPicture.requestWindow(
      MINI_PLAYER_WINDOW_SIZE,
    );

    pipRef.current = pipWindow;

    [...document.styleSheets].forEach((ss) => {
      try {
        const style = pipWindow.document.createElement("style");
        style.textContent = [...ss.cssRules].map((r) => r.cssText).join("\n");
        pipWindow.document.head.appendChild(style);
      } catch {
        /* cross-origin — skip */
      }
    });

    document.querySelectorAll("link[rel='stylesheet']").forEach((link) => {
      pipWindow.document.head.appendChild(link.cloneNode());
    });

    pipWindow.document.documentElement.className =
      document.documentElement.className;

    pipWindow.document.body.style.cssText =
      "margin:0;padding:0;height:100vh;overflow:hidden;background:var(--color-bg);";

    setPopupContainer(pipWindow.document.body);

    pipWindow.addEventListener("pagehide", () => {
      setPopupContainer(null);
      pipRef.current = null;
    });
  }, []);

  const closeMiniPlayer = useCallback(() => {
    pipRef.current?.close();
    pipRef.current = null;
    setPopupContainer(null);
  }, []);

  return {
    openMiniPlayer,
    closeMiniPlayer,
    popupContainer,
    isOpen: popupContainer !== null,
    isSupported,
  };
};
