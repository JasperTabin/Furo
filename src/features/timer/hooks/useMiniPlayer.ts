import { useState, useEffect, useRef, useCallback } from "react";

export const useMiniPlayer = () => {
  const popupRef = useRef<Window | null>(null);
  const [popupContainer, setPopupContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    return () => {
      popupRef.current?.close();
    };
  }, []);

  const openMiniPlayer = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    const W = 280,
      H = 220;
    const left = window.screenX + window.outerWidth - W - 24;
    const top = window.screenY + window.outerHeight - H - 60;

    const popup = window.open(
      "/mini-player",
      "furo_mini",
      `width=${W},height=${H},left=${left},top=${top},` +
        `resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`,
    );

    if (!popup) return;
    popupRef.current = popup;

    popup.document.title = "FURŌ · Timer";
    popup.document.body.style.cssText =
      "margin:0;padding:0;height:100vh;overflow:hidden;";

    // Copy all stylesheets — catch is intentionally a no-op for cross-origin sheets
    [...document.styleSheets].forEach((ss) => {
      try {
        const style = popup.document.createElement("style");
        style.textContent = [...ss.cssRules].map((r) => r.cssText).join("\n");
        popup.document.head.appendChild(style);
      } catch {
        // Cross-origin stylesheet — skip
      }
    });

    // Copy font links
    document.querySelectorAll("link[rel='stylesheet']").forEach((link) => {
      popup.document.head.appendChild(link.cloneNode());
    });

    setPopupContainer(popup.document.body);

    const interval = setInterval(() => {
      if (popup.closed) {
        setPopupContainer(null);
        popupRef.current = null;
        clearInterval(interval);
      }
    }, 500);
  }, []);

  const closeMiniPlayer = useCallback(() => {
    popupRef.current?.close();
    popupRef.current = null;
    setPopupContainer(null);
  }, []);

  return { openMiniPlayer, closeMiniPlayer, popupContainer };
};
