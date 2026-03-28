import {
  Sun,
  Moon,
  ChevronDown,
  Timer,
  ListChecks,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import { type AppView } from "../../app/Page";

/* TITLE */
export const HeaderTitle = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Go to landing page"
    className="text-left cursor-pointer transition-opacity hover:opacity-80"
  >
    <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
    <p className="text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
      FLOW
    </p>
  </button>
);

/* TABS */
export const HeaderTabs = ({
  currentView,
  onViewChange,
}: {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}) => (
  <div className="tab-container">
    <button
      onClick={() => onViewChange("timer")}
      className={`btn-tab-base px-2.5 sm:px-4 ${currentView === "timer" ? "btn-tab-active" : "btn-tab-inactive"}`}
    >
      <Timer size={18} />
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">
        Timer
      </span>
    </button>
    <button
      onClick={() => onViewChange("todo")}
      className={`btn-tab-base px-2.5 sm:px-4 ${currentView === "todo" ? "btn-tab-active" : "btn-tab-inactive"}`}
    >
      <ListChecks size={18} />
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">
        Tasks
      </span>
    </button>
    <button
      onClick={() => onViewChange("calendar")}
      className={`btn-tab-base px-2.5 sm:px-4 ${currentView === "calendar" ? "btn-tab-active" : "btn-tab-inactive"}`}
    >
      <CalendarDays size={18} />
      <span className="hidden text-xs font-medium sm:inline sm:text-sm">
        Calendar
      </span>
    </button>
  </div>
);

/* THEME TOGGLE UI */
export const HeaderThemeToggle = () => {
  const { mode, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="btn-theme-trigger">
        {mode === "light" ? <Sun size={20} /> : <Moon size={20} />}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-(--color-bg) border border-(--color-border) rounded-lg overflow-hidden z-50">
          <button
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className={
              mode === "light" ? "btn-theme-item-active" : "btn-theme-item"
            }
          >
            <Sun size={16} />
            <span className="text-sm">Light</span>
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
            className={
              mode === "dark" ? "btn-theme-item-active" : "btn-theme-item"
            }
          >
            <Moon size={16} />
            <span className="text-sm">Dark</span>
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
  onTitleClick,
}: {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onTitleClick: () => void;
}) => {
  return (
    <header className="relative mb-8 flex w-full items-center justify-between">
      <div className="shrink-0">
        <HeaderTitle onClick={onTitleClick} />
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
