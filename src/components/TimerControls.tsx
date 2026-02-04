// components/TimerControls.tsx – buttons to control the timer (Mobile-Responsive)

import type { TimerStatus } from "../types/timer";

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const buttonBase =
  "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-fg)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] active:scale-95";

const buttonActive =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)] hover:brightness-90";

const buttonInactive =
  "bg-transparent text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5";

const buttonDanger =
  "bg-transparent text-red-500 border-red-500/50 hover:border-red-500 hover:bg-red-500/10";

export const TimerControls = ({ status, onStart, onPause, onReset }: TimerControlsProps) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex flex-row gap-4 sm:gap-4">
      {isIdle ? (
        <button
          onClick={onStart}
          className={`${buttonBase} ${buttonActive}`}
          aria-label="Start timer"
        >
          START
        </button>
      ) : (
        <>
          <button
            onClick={isRunning ? onPause : onStart}
            className={`${buttonBase} ${isRunning ? buttonActive : buttonInactive}`}
            aria-label={isRunning ? "Pause timer" : "Resume timer"}
            title={isRunning ? "Pause (Space)" : "Resume (Space)"}
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </button>

          <button
            onClick={onReset}
            className={`${buttonBase} ${buttonDanger}`}
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
