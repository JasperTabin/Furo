import { ThemeToggle } from "../theme/ThemeToggle";
import { Timer, ListTodo } from "lucide-react";

interface HeaderProps {
  currentView: "timer" | "todo";
  onViewChange: (view: "timer" | "todo") => void;
  titleRef?: React.RefObject<HTMLDivElement | null>;
  controlsRef?: React.RefObject<HTMLDivElement | null>;
  themeRef?: React.RefObject<HTMLDivElement | null>;
}

export const Header = ({
  currentView,
  onViewChange,
  titleRef,
  controlsRef,
  themeRef,
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between w-full mb-8 relative">

        {/* Title */}
      <div ref={titleRef}>
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
        <p className="text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
          FLOW
        </p>
      </div>

    {/* Timer & Task Tab */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="tab-container">
          <button
            onClick={() => onViewChange("timer")}
            className={`btn-tab-base ${currentView === "timer" ? 'btn-tab-active' : 'btn-tab-inactive'}`}
          >
            <Timer size={18} />
            <span className="text-sm font-medium">Timer</span>
          </button>
          <button
            onClick={() => onViewChange("todo")}
            className={`btn-tab-base ${currentView === "todo" ? 'btn-tab-active' : 'btn-tab-inactive'}`}
          >
            <ListTodo size={18} />
            <span className="text-sm font-medium">Tasks</span>
          </button>
        </div>
      </div>

    {/* Dark & Light Mode Button */}
      <div ref={controlsRef}>
        <div ref={themeRef}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
