import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGSAPAnimation = (currentView: "timer" | "todo") => {
  const timerContainerRef = useRef<HTMLDivElement>(null);
  const todoContainerRef = useRef<HTMLDivElement>(null);

  // Initial page load animations (header & footer)
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

  // View-specific animations
  useEffect(() => {
    // Timer view animations
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

    // Todo view animations (Kanban board)
    if (currentView === "todo" && todoContainerRef.current) {
      const ctx = gsap.context(() => {
        // Set initial state
        gsap.set(".todo-title", { opacity: 1 });
        gsap.set(".todo-column", { opacity: 1 });
        gsap.set(".todo-card", { opacity: 1 });

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Animate title
        tl.fromTo(".todo-title",
          {
            y: -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            clearProps: "all",
          }
        )
        // Animate columns appearing
        .fromTo(".todo-column", 
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.15,
            clearProps: "all",
          },
          "-=0.6"
        )
        // Animate cards within columns
        .fromTo(".todo-card", 
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            clearProps: "all",
          }, 
          "-=0.6"
        );
      }, todoContainerRef);

      return () => ctx.revert();
    }
  }, [currentView]);

  return { timerContainerRef, todoContainerRef };
};