// components/Timer.tsx – Displays the countdown clock

import { formatTime } from "../utils/formatTime";

interface TimerProps {
  timeLeft: number;
  isFullscreen?: boolean;
}

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const timeBase = "font-bold tracking-tight transition-all duration-500 select-none";

const timeFullscreen = "text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[22rem] leading-none";

const timeNormal = "text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem]";

export const Timer = ({ timeLeft, isFullscreen = false }: TimerProps) => {
  return (
    <div>
      <div
        className={`${timeBase} ${isFullscreen ? timeFullscreen : timeNormal}`}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};
