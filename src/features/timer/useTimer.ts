import { useState, useEffect, useRef, useCallback } from "react";
import {
  ALERT_SOUND,
  type TimerMode,
  type TimerStatus,
  type TimerSettings,
} from "./timer";

export const useTimer = (settings: TimerSettings) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const currentSettings = settings;

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getTotalTime = useCallback(
    (currentMode: TimerMode): number => {
      switch (currentMode) {
        case "focus":
          return currentSettings.workDuration * 60;
        case "shortbreak":
          return currentSettings.breakDuration * 60;
        case "longBreak":
          return currentSettings.longBreakDuration * 60;
        case "infinite":
          return 0;
      }
    },
    [currentSettings],
  );

  // ✅ computed (NOT state)
  const totalTime = getTotalTime(mode);

  const [timeLeft, setTimeLeft] = useState(() => getTotalTime("focus"));

  // Preload sound
  useEffect(() => {
    const audio = new Audio(ALERT_SOUND);
    audio.preload = "auto";
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const updateMode = useCallback(
    (newMode: TimerMode) => {
      const newTotal = getTotalTime(newMode);
      setMode(newMode);
      setTimeLeft(newMode === "infinite" ? 0 : newTotal);
      setStatus("idle");
    },
    [getTotalTime],
  );

  const start = useCallback(() => setStatus("running"), []);
  const pause = useCallback(() => setStatus("paused"), []);
  const reset = useCallback(() => updateMode(mode), [mode, updateMode]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      if (newMode !== mode) updateMode(newMode);
    },
    [mode, updateMode],
  );

  const playTimerSound = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.currentTime = 0;

    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });
  }, []);

  useEffect(() => {
    if (status !== "running") {
      if (intervalRef.current !== null) {
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
          playTimerSound();

          if (mode === "focus") {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);

            setTimeout(() => {
              const nextMode =
                newSessions % currentSettings.sessionsUntilLongBreak === 0 ? "longBreak" : "shortbreak";
              updateMode(nextMode);
            }, 0);
          } else {
            setTimeout(() => updateMode("focus"), 0);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, mode, updateMode, playTimerSound, sessionsCompleted, currentSettings.sessionsUntilLongBreak]);

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
