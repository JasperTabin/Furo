// components/ModeSwitcher.tsx – Mode switcher buttons (Mobile-Responsive)

import type { TimerMode } from "../types/timer";

interface ModeSwitcherProps {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}

const buttonBase =
  "px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold tracking-widest rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-fg)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] active:scale-95";

const buttonActive =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-2 sm:border-4 border-[var(--color-fg)] outline outline-2 outline-[var(--color-fg)] outline-offset-2";

const buttonInactive =
  "bg-transparent text-[var(--color-fg)]/60 border-2 border-[var(--color-border)]/40 hover:text-[var(--color-fg)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5 hover:scale-105";


export const ModeSwitcher = ({ onSwitchMode, currentMode }: ModeSwitcherProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full px-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => onSwitchMode("focus")}
          className={`${buttonBase} ${
            currentMode === "focus" ? buttonActive : buttonInactive
          } flex-1 sm:flex-none`}
          aria-label="Switch to focus mode"
          aria-pressed={currentMode === "focus"}
        >
          FOCUS
        </button>

        <button
          onClick={() => onSwitchMode("shortbreak")}
          className={`${buttonBase} ${
            currentMode === "shortbreak" ? buttonActive : buttonInactive
          } flex-1 sm:flex-none whitespace-nowrap`}
          aria-label="Switch to short break mode"
          aria-pressed={currentMode === "shortbreak"}
        >
          <span className="hidden sm:inline">SHORT BREAK</span>
          <span className="sm:hidden">SHORT</span>
        </button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => onSwitchMode("longBreak")}
          className={`${buttonBase} ${
            currentMode === "longBreak" ? buttonActive : buttonInactive
          } flex-1 sm:flex-none whitespace-nowrap`}
          aria-label="Switch to long break mode"
          aria-pressed={currentMode === "longBreak"}
        >
          <span className="hidden sm:inline">LONG BREAK</span>
          <span className="sm:hidden">LONG</span>
        </button>

        <div className="hidden sm:block h-8 w-px bg-(--color-border)/30 mx-1" />

        <button
          onClick={() => onSwitchMode("infinite")}
          className={`${buttonBase} ${
            currentMode === "infinite" ? buttonActive : buttonInactive
          } flex-1 sm:flex-none`}
          aria-label="Switch to infinite mode"
          aria-pressed={currentMode === "infinite"}
        >
          INFINITE
        </button>
      </div>
    </div>
  );
};