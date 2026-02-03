// components/Settings.tsx - Mode switcher buttons and session counter

import type { TimerMode } from "../types/timer";

interface SettingsProps {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}

export const Settings = ({ onSwitchMode, currentMode }: SettingsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onSwitchMode("focus")}
        className={`px-6 py-3 text-sm font-semibold tracking-widest transition-all duration-200 rounded-md border-2 ${
          currentMode === "focus"
            ? "bg-secondary text-primary border-secondary"
            : "bg-transparent text-secondary border-secondary"
        }`}
      >
        FOCUS
      </button>

      <button
        onClick={() => onSwitchMode("shortbreak")}
        className={`px-6 py-3 text-sm font-semibold tracking-widest transition-all duration-200 rounded-md border-2 ${
          currentMode === "shortbreak"
            ? "bg-secondary text-primary border-secondary"
            : "bg-transparent text-secondary border-secondary"
        }`}
      >
        SHORT BREAK
      </button>

      <button
        onClick={() => onSwitchMode("longBreak")}
        className={`px-6 py-3 text-sm font-semibold tracking-widest transition-all duration-200 rounded-md border-2 ${
          currentMode === "longBreak"
            ? "bg-secondary text-primary border-secondary"
            : "bg-transparent text-secondary border-secondary"
        }`}
      >
        LONG BREAK
      </button>

      <button
        onClick={() => onSwitchMode("infinite")}
        className={`px-6 py-3 text-sm font-semibold tracking-widest transition-all duration-200 rounded-md border-2 ${
          currentMode === "infinite"
            ? "bg-secondary text-primary border-secondary"
            : "bg-transparent text-secondary border-secondary"
        }`}
      >
        INFINITE
      </button>
    </div>
  );
};
