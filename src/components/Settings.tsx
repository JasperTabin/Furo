// components/Settings.tsx – Mode switcher buttons

import type { TimerMode } from "../types/timer";

interface SettingsProps {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}

const buttonBase =
  "px-6 py-3 text-sm font-semibold tracking-widest rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-fg)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]";

const buttonActive =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-4 border-[var(--color-fg)] outline outline-2 outline-[var(--color-fg)] outline-offset-2";

const buttonInactive =
  "bg-transparent text-[var(--color-fg)]/60 border-2 border-[var(--color-border)]/40 hover:text-[var(--color-fg)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5 hover:scale-105";


export const Settings = ({ onSwitchMode, currentMode }: SettingsProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onSwitchMode("focus")}
        className={`${buttonBase} ${
          currentMode === "focus" ? buttonActive : buttonInactive
        }`}
        aria-label="Switch to focus mode"
        aria-pressed={currentMode === "focus"}
      >
        FOCUS
      </button>

      <button
        onClick={() => onSwitchMode("shortbreak")}
        className={`${buttonBase} ${
          currentMode === "shortbreak" ? buttonActive : buttonInactive
        }`}
        aria-label="Switch to short break mode"
        aria-pressed={currentMode === "shortbreak"}
      >
        SHORT BREAK
      </button>

      <button
        onClick={() => onSwitchMode("longBreak")}
        className={`${buttonBase} ${
          currentMode === "longBreak" ? buttonActive : buttonInactive
        }`}
        aria-label="Switch to long break mode"
        aria-pressed={currentMode === "longBreak"}
      >
        LONG BREAK
      </button>

      <div className="h-8 w-px bg-(--color-border)/30 mx-1" />

      <button
        onClick={() => onSwitchMode("infinite")}
        className={`${buttonBase} ${
          currentMode === "infinite" ? buttonActive : buttonInactive
        }`}
        aria-label="Switch to infinite mode"
        aria-pressed={currentMode === "infinite"}
      >
        INFINITE
      </button>
    </div>
  );
};