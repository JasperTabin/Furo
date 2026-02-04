import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

interface AnimationRefs {
  appRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLDivElement | null>;
  themeToggleRef: RefObject<HTMLDivElement | null>;
  settingsRef: RefObject<HTMLDivElement | null>;
  timerRef: RefObject<HTMLDivElement | null>;
  controlsRef: RefObject<HTMLDivElement | null>;
  footerRef: RefObject<HTMLDivElement | null>;
}

export const usePageLoadAnimation = (refs: AnimationRefs) => {
  useEffect(() => {
    if (!refs.appRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (refs.headerRef.current) {
        tl.from(refs.headerRef.current, { y: -50, opacity: 0, duration: 0.8 });
      }

      if (refs.themeToggleRef.current) {
        tl.from(
          refs.themeToggleRef.current,
          { y: -50, opacity: 0, duration: 0.8 },
          "-=0.6",
        );
      }

      if (refs.settingsRef.current) {
        tl.from(
          refs.settingsRef.current,
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.4",
        );
      }

      if (refs.timerRef.current) {
        tl.from(
          refs.timerRef.current,
          { scale: 0.8, opacity: 0, duration: 1 },
          "-=0.6",
        );
      }

      if (refs.controlsRef.current) {
        tl.from(
          refs.controlsRef.current,
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.6",
        );
      }

      if (refs.footerRef.current) {
        tl.from(
          refs.footerRef.current,
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.6",
        );
      }
    }, refs.appRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
