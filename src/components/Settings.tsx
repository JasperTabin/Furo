// components/Settings.tsx – Mode switcher buttons

import type { TimerMode } from "../types/timer";

interface SettingsProps {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const buttonBase =
  "px-6 py-3 text-sm font-semibold tracking-widest rounded-md border-2 transition-all duration-200";

const buttonActive =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]";

const buttonInactive =
  "bg-transparent text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-fg)]";

/* ───────────────────────────── */

export const Settings = ({ onSwitchMode, currentMode }: SettingsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onSwitchMode("focus")}
        className={`${buttonBase} ${
          currentMode === "focus" ? buttonActive : buttonInactive
        }`}
      >
        FOCUS
      </button>

      <button
        onClick={() => onSwitchMode("shortbreak")}
        className={`${buttonBase} ${
          currentMode === "shortbreak" ? buttonActive : buttonInactive
        }`}
      >
        SHORT BREAK
      </button>

      <button
        onClick={() => onSwitchMode("longBreak")}
        className={`${buttonBase} ${
          currentMode === "longBreak" ? buttonActive : buttonInactive
        }`}
      >
        LONG BREAK
      </button>

      <button
        onClick={() => onSwitchMode("infinite")}
        className={`${buttonBase} ${
          currentMode === "infinite" ? buttonActive : buttonInactive
        }`}
      >
        INFINITE
      </button>
    </div>
  );
};
