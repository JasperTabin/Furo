import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGSAPAnimation = (currentView: "timer" | "todo") => {
  const timerContainerRef = useRef<HTMLDivElement>(null);
  const todoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from("header", {
        y: -30,
        opacity: 0,
        duration: 1.2,
      })
      .from("footer", {
        y: 30,
        opacity: 0,
        duration: 1.2,
      }, "-=0.8");
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (currentView === "timer" && timerContainerRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.from(".mode-switcher", {
          y: -20,
          opacity: 0,
          duration: 1.0,
        })
        .from(".timer-display", {
          y: 30,
          opacity: 0,
          duration: 1.2,
        }, "-=0.6")
        .from(".timer-controls", {
          y: 20,
          opacity: 0,
          duration: 1.0,
        }, "-=0.6");
      }, timerContainerRef);

      return () => ctx.revert();
    }

    // Todo view animations
    if (currentView === "todo" && todoContainerRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.from(".todo-header", {
          y: -20,
          opacity: 0,
          duration: 1.0,
        })
        .from(".todo-input", {
          y: 20,
          opacity: 0,
          duration: 1.0,
        }, "-=0.6")
        .from(".todo-item", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
        }, "-=0.6");
      }, todoContainerRef);

      return () => ctx.revert();
    }
  }, [currentView]);

  return { timerContainerRef, todoContainerRef };
};
