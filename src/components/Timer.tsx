// components/Timer.tsx – Displays the countdown clock and progress bar

import { formatTime } from "../utils/formatTime";
import type { TimerStatus } from "../types/timer";

interface TimerProps {
  status: TimerStatus;
  timeLeft: number;
  totalTime: number;
  isFullscreen?: boolean;
}

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const containerBase =
  "flex flex-col items-center justify-center gap-8 transition-all duration-500";

const timeBase = "font-bold tracking-tight transition-all duration-500";

const timeFullscreen = "text-[25rem] leading-none";

const timeNormal = "text-[15rem]";

const statusLabel =
  "tracking-widest text-[var(--color-border)] text-2xl transition-all duration-500";

const progressTrack =
  "h-0.5 w-80 bg-[var(--color-border)]/40 transition-all duration-500";

const progressFill =
  "h-full bg-[var(--color-fg)] transition-all duration-1000 ease-linear";

/* ───────────────────────────── */

export const Timer = ({
  status,
  timeLeft,
  totalTime,
  isFullscreen = false,
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

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className={containerBase}>
      {/* Timer Display */}
      <div
        className={`${timeBase} ${isFullscreen ? timeFullscreen : timeNormal}`}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Status Label */}
      <div className={statusLabel}>{getStatusLabel(status)}</div>

      {/* Progress Bar */}
      <div className={progressTrack}>
        <div className={progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
