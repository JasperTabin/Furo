import { useEffect, useRef, useState } from "react";

export function useScrollActiveIndex(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemCount <= 1) {
      return;
    }

    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let isTrackingDesktopScroll = false;

    const updateActiveIndex = () => {
      frameId = 0;

      const container = containerRef.current;
      const sticky = stickyRef.current;
      if (!container || !sticky) {
        return;
      }

      const stickyHeight =
        sticky.getBoundingClientRect().height ||
        window.visualViewport?.height ||
        window.innerHeight;
      const scrollRange = Math.max(container.offsetHeight - stickyHeight, 0);
      if (scrollRange === 0) {
        setActiveIndex(0);
        return;
      }

      const { top } = container.getBoundingClientRect();
      const scrolledWithinSection = Math.min(Math.max(-top, 0), scrollRange);
      const segmentSize = scrollRange / itemCount;
      const nextIndex = Math.min(
        Math.floor(scrolledWithinSection / Math.max(segmentSize, 1)),
        itemCount - 1,
      );

      setActiveIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex,
      );
    };

    const requestUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveIndex);
    };

    const stopDesktopTracking = () => {
      if (!isTrackingDesktopScroll) {
        return;
      }

      isTrackingDesktopScroll = false;
      resizeObserver?.disconnect();
      resizeObserver = null;
      window.removeEventListener("scroll", requestUpdate);
      window.visualViewport?.removeEventListener("resize", requestUpdate);
    };

    const startDesktopTracking = () => {
      if (isTrackingDesktopScroll || window.innerWidth < 640) {
        return;
      }

      isTrackingDesktopScroll = true;
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.visualViewport?.addEventListener("resize", requestUpdate);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(requestUpdate);
        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }
        if (stickyRef.current) {
          resizeObserver.observe(stickyRef.current);
        }
      }
    };

    const syncTrackingMode = () => {
      if (window.innerWidth < 640) {
        stopDesktopTracking();
        setActiveIndex(0);
        return;
      }

      startDesktopTracking();
      requestUpdate();
    };

    if (window.innerWidth >= 640) {
      startDesktopTracking();
      requestUpdate();
    }
    window.addEventListener("resize", syncTrackingMode);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      stopDesktopTracking();
      window.removeEventListener("resize", syncTrackingMode);
    };
  }, [itemCount]);

  return {
    containerRef,
    stickyRef,
    activeIndex: itemCount <= 1 ? 0 : activeIndex,
  };
}
