// TIMER UI COMPONENTS ONLY 

import { formatTime } from "../utils/formatTime";
import { Maximize, Minimize } from "lucide-react";
import type { TimerMode, TimerStatus } from "../configs/types";

// TIMER MODE
export const ModeSwitcher = ({ 
  onSwitchMode, 
  currentMode 
}: {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}) => {
  return (
    <div className="flex flex-row gap-4 sm:gap-4 items-center">
      <button
        onClick={() => onSwitchMode("focus")}
        className={`btn-base ${currentMode === "focus" ? 'btn-active' : 'btn-inactive'}`}
        aria-label="Switch to focus mode"
      >
        FOCUS
      </button>

      <button
        onClick={() => onSwitchMode("shortbreak")}
        className={`btn-base ${currentMode === "shortbreak" ? 'btn-active' : 'btn-inactive'}`}
        aria-label="Switch to short break mode"
      >
        <span className="hidden sm:inline">SHORT BREAK</span>
        <span className="sm:hidden">SHORT</span>
      </button>

      <button
        onClick={() => onSwitchMode("longBreak")}
        className={`btn-base ${currentMode === "longBreak" ? 'btn-active' : 'btn-inactive'}`}
        aria-label="Switch to long break mode"
      >
        <span className="hidden sm:inline">LONG BREAK</span>
        <span className="sm:hidden">LONG</span>
      </button>

      <div className="w-px h-8 bg-(--color-border) opacity-30 self-center" />

      <button
        onClick={() => onSwitchMode("infinite")}
        className={`btn-base ${currentMode === "infinite" ? 'btn-active' : 'btn-inactive'}`}
        aria-label="Switch to infinite mode"
      >
        INFINITE
      </button>
    </div>
  );
};

// TIMER
export const Timer = ({ timeLeft, isFullscreen }: { timeLeft: number; isFullscreen: boolean }) => {
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
  onReset 
}: {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex flex-row gap-4 sm:gap-4">
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
            className={`btn-base ${isRunning ? 'btn-active' : 'btn-inactive'}`}
            aria-label={isRunning ? "Pause timer" : "Resume timer"}
            title={isRunning ? "Pause (Space)" : "Resume (Space)"}
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </button>

          <button
            onClick={onReset}
            className="btn-base btn-danger"
            aria-label="Stop timer"
            title="Stop timer"
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
  toggleFullscreen 
}: {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}) => {
  return (
    <button
      onClick={toggleFullscreen}
      className={`btn-base ${isFullscreen ? 'btn-active' : 'btn-inactive'}`}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  );
};