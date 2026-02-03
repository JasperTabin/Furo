// Controls.tsx – buttons to control the timer

import { useState } from "react";
import { Maximize, Minimize, Settings as SettingsIcon } from "lucide-react";
import type { TimerStatus } from "../types/timer";

interface ControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onSettingsClick?: () => void;
}

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const buttonBase =
  "px-6 py-3 text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200";

const buttonActive =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]";

const buttonInactive =
  "bg-transparent text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-fg)]";

const buttonDanger =
  "bg-red-600 text-white border-red-600 hover:bg-red-700";

const iconButton =
  "p-3 rounded-md border-2 bg-transparent text-[var(--color-fg)] border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-fg)]";

/* ───────────────────────────── */

export const Controls = ({
  status,
  onStart,
  onPause,
  onReset,
  onFullscreenChange,
  onSettingsClick,
}: ControlsProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isIdle = status === "idle";
  const isRunning = status === "running";

  const toggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    onFullscreenChange?.(next);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {isIdle ? (
        <>
          <button
            onClick={onStart}
            className={`${buttonBase} ${buttonActive}`}
          >
            START
          </button>

          <button
            onClick={onSettingsClick}
            className={iconButton}
            aria-label="Open settings"
          >
            <SettingsIcon size={20} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={iconButton}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={isRunning ? onPause : onStart}
            className={`${buttonBase} ${
              isRunning ? buttonActive : buttonInactive
            }`}
          >
            {isRunning ? "PAUSE" : "START"}
          </button>

          <button
            onClick={onReset}
            className={`${buttonBase} ${buttonDanger}`}
          >
            STOP
          </button>

          <button
            onClick={onReset}
            className={`${buttonBase} ${buttonInactive}`}
          >
            RESET
          </button>

          <button
            onClick={onSettingsClick}
            className={iconButton}
            aria-label="Open settings"
          >
            <SettingsIcon size={20} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={iconButton}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </>
      )}
    </div>
  );
};