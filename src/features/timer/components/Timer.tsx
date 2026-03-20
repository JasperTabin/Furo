import { formatTime } from "../utils/formatTime";
import { Maximize, Minimize } from "lucide-react";
import type { TimerMode, TimerStatus } from "../configs/types";

// MODE SWITCHER
export const ModeSwitcher = ({
  onSwitchMode,
  currentMode,
  isReversed,
}: {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
  isReversed: boolean;
}) => {
  return (
    <div className={`flex flex-row items-center gap-3 transition-opacity duration-200 ${
      isReversed ? "invisible pointer-events-none" : "visible"
    }`}>
      <button
        onClick={() => onSwitchMode("focus")}
        className={`btn-base ${currentMode === "focus" ? "btn-active" : "btn-inactive"}`}
        aria-label="Switch to focus mode"
      >
        <span className="hidden sm:inline">Focus</span>
        <span className="sm:hidden">Focus</span>
      </button>
      <button
        onClick={() => onSwitchMode("shortbreak")}
        className={`btn-base ${currentMode === "shortbreak" ? "btn-active" : "btn-inactive"}`}
        aria-label="Switch to short break mode"
      >
        <span className="hidden sm:inline">Short Break</span>
        <span className="sm:hidden">Short</span>
      </button>
      <button
        onClick={() => onSwitchMode("longBreak")}
        className={`btn-base ${currentMode === "longBreak" ? "btn-active" : "btn-inactive"}`}
        aria-label="Switch to long break mode"
      >
        <span className="hidden sm:inline">Long Break</span>
        <span className="sm:hidden">Long</span>
      </button>
    </div>
  );
};

// TIMER
export const Timer = ({
  timeLeft,
  isFullscreen,
}: {
  timeLeft: number;
  isFullscreen: boolean;
}) => {
  const timeClasses = isFullscreen
    ? "text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[22rem]"
    : "text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem]";

  return (
    <div
      className={`${timeClasses} font-bold tracking-tight leading-none select-none transition-all duration-700`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {formatTime(timeLeft)}
    </div>
  );
};

// TIMER CONTROLS
export const TimerControls = ({
  status,
  onStart,
  onPause,
  onReset,
}: {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex flex-row gap-4">
      {isIdle ? (
        <button
          onClick={onStart}
          className="btn-base btn-active"
          aria-label="Start timer"
        >
          START
        </button>
      ) : (
        <>
          <button
            onClick={isRunning ? onPause : onStart}
            className={`btn-base ${isRunning ? "btn-active" : "btn-inactive"}`}
            aria-label={isRunning ? "Pause timer" : "Resume timer"}
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </button>
          <button
            onClick={onReset}
            className="btn-base btn-danger"
            aria-label="Stop timer"
          >
            STOP
          </button>
        </>
      )}
    </div>
  );
};

// FULLSCREEN
export const FullscreenMode = ({
  isFullscreen,
  toggleFullscreen,
}: {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}) => (
  <button
    onClick={toggleFullscreen}
    className={`p-2 transition-opacity ${isFullscreen ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
  >
    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
  </button>
);
