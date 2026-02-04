// components/Timer.tsx – Displays the countdown clock and progress bar (Mobile-Responsive)

import { formatTime } from "../utils/formatTime";
import type { TimerStatus } from "../types/timer";

interface TimerProps {
  status: TimerStatus;
  timeLeft: number;
  totalTime: number;
  isFocus?: boolean;
}

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const containerBase =
  "flex flex-col items-center justify-center gap-8 sm:gap-12 transition-all duration-500 px-4";

const timeBase = "font-bold tracking-tight transition-all duration-500 select-none";

const timeFocus = "text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[22rem] leading-none";

const timeNormal = "text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem]";

const statusLabel =
  "tracking-widest text-sm sm:text-lg md:text-xl font-semibold transition-all duration-500";

const statusIdle = "text-[var(--color-border)] opacity-60";

const statusRunning = "text-[var(--color-fg)] opacity-90 animate-pulse";

const statusPaused = "text-[var(--color-border)] opacity-80";

const progressTrack =
  "h-1 w-full max-w-[20rem] sm:max-w-sm md:max-w-md lg:max-w-lg bg-[var(--color-border)]/30 rounded-full overflow-hidden transition-all duration-500";

const progressFill =
  "h-full bg-[var(--color-fg)] transition-all duration-1000 ease-linear shadow-lg shadow-[var(--color-fg)]/30";

export const Timer = ({
  status,
  timeLeft,
  totalTime,
  isFocus = false,
}: TimerProps) => {
  const getStatusLabel = (status: TimerStatus): string => {
    switch (status) {
      case "idle":
        return "READY";
      case "running":
        return "IN PROGRESS";
      case "paused":
        return "PAUSED";
    }
  };

  const getStatusClass = (status: TimerStatus): string => {
    switch (status) {
      case "idle":
        return statusIdle;
      case "running":
        return statusRunning;
      case "paused":
        return statusPaused;
    }
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const remainingMinutes = Math.ceil(timeLeft / 60);
  const progressPercentage = Math.round(progress);

  return (
    <div className={containerBase}>

      <div
        className={`${timeBase} ${isFocus ? timeFocus : timeNormal}`}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(timeLeft)}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className={`${statusLabel} ${getStatusClass(status)}`}>
          {getStatusLabel(status)}
        </div>
        {status === "running" && totalTime > 0 && (
          <div className="text-xs sm:text-sm text-(--color-border) opacity-70 text-center">
            <span className="hidden sm:inline">{remainingMinutes} min left · </span>
            {progressPercentage}% complete
          </div>
        )}
      </div>

      <div className={progressTrack} role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div className={progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};