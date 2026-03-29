// TIMER LOGIC

import { useState, useEffect, useRef, useCallback } from "react";
import { loadSettings } from "../utils/settings";
import { ALERT_SOUND } from "../configs/constants";
import type { TimerMode, TimerStatus, TimerSettings } from "../configs/types";

export const useTimer = (settings?: TimerSettings) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const currentSettings = settings || loadSettings();

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

  const [timeLeft, setTimeLeft] = useState(() => getTotalTime("focus"));
  const [totalTime, setTotalTime] = useState(() => getTotalTime("focus"));

  // Preload single alert sound once on mount
  useEffect(() => {
    const audio = new Audio(`/sounds/${ALERT_SOUND}`);
    audio.preload = "auto";
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sync timer display when settings change while idle
  useEffect(() => {
    const handleStorageChange = () => {
      if (status === "idle") {
        const newTime = getTotalTime(mode);
        setTimeLeft(newTime);
        setTotalTime(newTime);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [mode, status, getTotalTime]);

  const updateMode = useCallback(
    (newMode: TimerMode) => {
      const newTotal = getTotalTime(newMode);
      setMode(newMode);
      setTotalTime(newTotal);
      setTimeLeft(newMode === "infinite" ? 0 : newTotal);
      setStatus("idle");
    },
    [getTotalTime],
  );

  const start = useCallback(() => setStatus("running"), []);
  const pause = useCallback(() => setStatus("paused"), []);
  const reset = useCallback(() => updateMode(mode), [mode, updateMode]);
  const switchMode = useCallback(
    (newMode: TimerMode) => updateMode(newMode),
    [updateMode],
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
            setSessionsCompleted((prevSessions) => {
              const newSessions = prevSessions + 1;
              // every 4 focus sessions → long break, otherwise short break
              setTimeout(() => {
                if (newSessions % 4 === 0) {
                  updateMode("longBreak");
                } else {
                  updateMode("shortbreak");
                }
              }, 0);
              return newSessions;
            });
            return prev - 1;
          } else {
            setTimeout(() => updateMode("focus"), 0);
            return prev - 1;
          }
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
  }, [status, mode, updateMode, playTimerSound]);

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
