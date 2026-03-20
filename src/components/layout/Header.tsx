import {
  Sun,
  Moon,
  ChevronDown,
  Timer,
  ListChecks,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useState, useRef, useEffect } from "react";

/* TITLE */
export const HeaderTitle = () => (
  <div>
    <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
    <p className="text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
      FLOW
    </p>
  </div>
);

/* TABS */
export const HeaderTabs = ({
  currentView,
  onViewChange,
}: {
  currentView: "timer" | "todo" | "calendar";
  onViewChange: (view: "timer" | "todo" | "calendar") => void;
}) => (
  <div className="tab-container">
    <button
      onClick={() => onViewChange("timer")}
      className={`btn-tab-base px-2.5 sm:px-4 ${currentView === "timer" ? "btn-tab-active" : "btn-tab-inactive"}`}
    >
      <Timer size={18} />
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">Timer</span>
    </button>

    <button
      onClick={() => onViewChange("todo")}
      className={`btn-tab-base px-2.5 sm:px-4 ${currentView === "todo" ? "btn-tab-active" : "btn-tab-inactive"}`}
    >
      <ListChecks size={18} />
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">Tasks</span>
    </button>

    <button
      onClick={() => onViewChange("calendar")}
      className={`btn-tab-base px-2.5 sm:px-4 ${currentView === "calendar" ? "btn-tab-active" : "btn-tab-inactive"}`}
    >
      <CalendarDays size={18} />
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">Calendar</span>
    </button>
  </div>
);

/* THEME TOGGLE UI */
export const HeaderThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="btn-theme-trigger">
        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
        <ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-(--color-bg) border-2 border-(--color-border) rounded-lg shadow-xl">
          <button onClick={() => setTheme("light")} className="btn-theme-item">
            <Sun size={18} /> Light
          </button>

          <button onClick={() => setTheme("dark")} className="btn-theme-item">
            <Moon size={18} /> Dark
          </button>
        </div>
      )}
    </div>
  );
};

/* HEADER LAYOUT */
export const Header = ({
  currentView,
  onViewChange,
}: {
  currentView: "timer" | "todo" | "calendar";
  onViewChange: (view: "timer" | "todo" | "calendar") => void;
}) => {
  return (
    <header className="relative mb-8 flex w-full items-center justify-between">
      <div className="shrink-0">
        <HeaderTitle />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <HeaderTabs currentView={currentView} onViewChange={onViewChange} />
      </div>

      <div className="shrink-0">
        <HeaderThemeToggle />
      </div>
    </header>
  );
};
