// Timer UI
import { formatTime } from "../../utils/formatTime";
import { useFullscreen } from "../../hooks/useFullscreen";

interface TimerProps {
  timeLeft: number;
}

export const Timer = ({ timeLeft }: TimerProps) => {
  const { isFullscreen } = useFullscreen();

  const timeClasses = isFullscreen
    ? "text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[22rem]" // Fullscreen
    : "text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem]"; // Normal

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