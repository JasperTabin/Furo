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

const buttonBase =
  "px-6 py-3 text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-fg)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]";

const buttonActive =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)] hover:brightness-90";

const buttonInactive =
  "bg-transparent text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5";

const buttonDanger =
  "bg-transparent text-red-500 border-red-500/50 hover:border-red-500 hover:bg-red-500/10";

const iconButton =
  "p-3 rounded-md border-2 bg-transparent text-[var(--color-fg)] border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-fg)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]";

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
    <div className="flex items-center justify-center gap-3">
      {isIdle ? (
        <>
          <button
            onClick={onStart}
            className={`${buttonBase} ${buttonActive}`}
            aria-label="Start timer"
          >
            START
          </button>

          <div className="mx-1" /> 

          <button
            onClick={onSettingsClick}
            className={iconButton}
            aria-label="Open settings"
            title="Settings"
          >
            <SettingsIcon size={20} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={iconButton}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
            aria-label={isRunning ? "Pause timer" : "Resume timer"}
            title={isRunning ? "Pause (Space)" : "Resume (Space)"}
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </button>

          <button
            onClick={onReset}
            className={`${buttonBase} ${buttonDanger}`}
            aria-label="Stop and reset timer"
            title="Stop timer"
          >
            STOP
          </button>

          <button
            onClick={onReset}
            className={`${buttonBase} ${buttonInactive}`}
            aria-label="Reset timer"
            title="Reset timer"
          >
            RESET
          </button>

          <div className="mx-1" /> 

          <button
            onClick={onSettingsClick}
            className={iconButton}
            aria-label="Open settings"
            title="Settings"
          >
            <SettingsIcon size={20} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={iconButton}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </>
      )}
    </div>
  );
};