// hooks/useAnimation.ts – GSAP animations on first load

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

interface AnimationRefs {
  appRef: RefObject<HTMLDivElement | null>;
  headerTitleRef: RefObject<HTMLDivElement | null>;
  headerControlsRef: RefObject<HTMLDivElement | null>;
  themeToggleRef: RefObject<HTMLDivElement | null>;
  settingsRef: RefObject<HTMLDivElement | null>;
  timerRef: RefObject<HTMLDivElement | null>;
  controlsRef: RefObject<HTMLDivElement | null>;
  footerRef: RefObject<HTMLDivElement | null>;
  modeSwitcherRef: RefObject<HTMLDivElement | null>;
}

export const useAnimation = (refs: AnimationRefs) => {
  useEffect(() => {
    if (!refs.appRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Fade in whole app container
      tl.from(refs.appRef.current, { opacity: 0, duration: 0.6 });

      // Header title + controls
      if (refs.headerTitleRef.current) {
        tl.from(refs.headerTitleRef.current, { y: -40, opacity: 0, duration: 0.8 }, "-=0.2");
      }
      if (refs.headerControlsRef.current) {
        tl.from(refs.headerControlsRef.current, { y: -40, opacity: 0, duration: 0.8 }, "-=0.6");
      }

      // ModeSwitcher
      if (refs.modeSwitcherRef.current) {
        tl.from(refs.modeSwitcherRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.4");
      }

      // Timer
      if (refs.timerRef.current) {
        tl.from(refs.timerRef.current, { scale: 0.8, opacity: 0, duration: 1 }, "-=0.6");
      }

      // Controls
      if (refs.controlsRef.current) {
        tl.from(refs.controlsRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
      }

      // Footer
      if (refs.footerRef.current) {
        tl.from(refs.footerRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
      }
    }, refs.appRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
