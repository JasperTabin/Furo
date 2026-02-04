// hooks/useTimer.ts – Cleaned & Simplified Pomodoro Timer Hook

import { useState, useEffect, useRef, useCallback } from "react";
import type { TimerMode, TimerStatus, TimerSettings } from "../types/timer";

export const useTimer = (settings: TimerSettings) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);

  /** Helper: calculate total time for a given mode */
  const getTotalTime = useCallback(
    (currentMode: TimerMode): number => {
      switch (currentMode) {
        case "focus":
          return settings.workDuration * 60;
        case "shortbreak":
          return settings.breakDuration * 60;
        case "longBreak":
          return settings.longBreakDuration * 60;
        case "infinite":
          return 0;
      }
    },
    [settings]
  );

  /** State for time tracking */
  const [timeLeft, setTimeLeft] = useState(() => getTotalTime("focus"));
  const [totalTime, setTotalTime] = useState(() => getTotalTime("focus"));

  /** Centralized mode updater */
  const updateMode = useCallback(
    (newMode: TimerMode) => {
      const newTotal = getTotalTime(newMode);
      setMode(newMode);
      setTotalTime(newTotal);
      setTimeLeft(newMode === "infinite" ? 0 : newTotal);
      setStatus("idle");
    },
    [getTotalTime]
  );

  /** Controls */
  const start = useCallback(() => setStatus("running"), []);
  const pause = useCallback(() => setStatus("paused"), []);
  const reset = useCallback(() => updateMode(mode), [mode, updateMode]);
  const switchMode = useCallback((newMode: TimerMode) => updateMode(newMode), [updateMode]);

  /** Timer effect */
  useEffect(() => {
    if (status !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (mode === "infinite") return prev + 1;

        if (prev <= 1) {
          setStatus("idle");

          if (mode === "focus") {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);

            if (newSessions % settings.sessionsBeforeLongBreak === 0) {
              updateMode("longBreak");
              return settings.longBreakDuration * 60;
            } else {
              updateMode("shortbreak");
              return settings.breakDuration * 60;
            }
          } else {
            updateMode("focus");
            return settings.workDuration * 60;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, mode, sessionsCompleted, settings, updateMode]);

  return {
    mode,
    status,
    timeLeft,
    totalTime,
    sessionsCompleted,
    start,
    pause,
    reset,
    switchMode,
  };
};
