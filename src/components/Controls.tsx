// Controls.tsx buttons to trigger the timer

import { useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import type { TimerStatus } from "../types/timer";

interface ControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const baseButton =
  "px-6 py-3 text-sm tracking-widest transition-all duration-200 rounded-md border-2 font-semibold";

const activeButton = "bg-secondary text-primary border-secondary";

const inactiveButton = "bg-transparent text-secondary border-secondary";

const iconButton =
  "p-3 text-sm transition-all duration-200 rounded-md border-2 bg-transparent text-secondary border-secondary";

export const Controls = ({
  status,
  onStart,
  onPause,
  onReset,
  onFullscreenChange,
}: ControlsProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isIdle = status === "idle";
  const isRunning = status === "running";

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    onFullscreenChange?.(newFullscreenState);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {isIdle && (
        <>
          <button onClick={onStart} className={`${baseButton} ${activeButton}`}>
            START
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

      {!isIdle && (
        <>
          <button
            onClick={isRunning ? onPause : onStart}
            className={`${baseButton} ${activeButton}`}
          >
            {isRunning ? "PAUSE" : "START"}
          </button>

          <button
            onClick={onReset}
            className={`${baseButton} bg-red-600 text-white border-red-600 hover:bg-red-700`}
          >
            STOP
          </button>

          <button
            onClick={onReset}
            className={`${baseButton} ${inactiveButton}`}
          >
            RESET
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
