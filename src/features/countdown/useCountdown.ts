import { useState, useEffect } from "react";
import { calculateTimeLeft, type TimeLeft } from "./countdown";

export const useCountdown = (targetDate: Date | null): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate),
  );

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft(targetDate));
    const timeout = setTimeout(update, 0);
    const interval = setInterval(update, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [targetDate]);

  return timeLeft;
};
