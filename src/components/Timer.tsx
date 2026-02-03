// components/Timer.tsx - Displays the countdown clock and progress bar

import { formatTime } from "../utils/formatTime";
import type { TimerStatus } from "../types/timer";

interface TimerProps {
  status: TimerStatus;
  timeLeft: number;
  totalTime: number;
  isFullscreen?: boolean;
}

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
    <div
      className={`flex flex-col items-center justify-center transition-all duration-500 ${isFullscreen ? "gap-8" : "gap-8"}`}
    >
      {/* Timer Display */}
      <div
        className={`font-bold tracking-tight transition-all duration-500 ${isFullscreen ? "text-[25rem] leading-none" : "text-[15rem]"}`}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Status Label */}
      <div
        className={`tracking-widest text-gray-400 transition-all duration-500 ${isFullscreen ? "text-2xl" : "text-2xl"}`}
      >
        {getStatusLabel(status)}
      </div>

      {/* Progress Bar */}
      <div
        className={`h-px bg-gray-200 transition-all duration-500 ${isFullscreen ? "w-80" : "w-80"}`}
      >
        <div
          className="h-full bg-black dark:bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
