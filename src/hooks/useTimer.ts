import { useState, useEffect, useRef, useCallback } from "react";
import type { TimerMode, TimerStatus, TimerSettings } from "../types/timer";

export const useTimer = (settings: TimerSettings) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create/update audio when sound changes
  useEffect(() => {
    if (!settings.sound || settings.sound === "none") {
      audioRef.current = null;
      return;
    }

    const audio = new Audio(`/sounds/${settings.sound}`);
    audio.preload = "auto";
    audio.load();

    audioRef.current = audio;
  }, [settings.sound]);

  // Update volume on existing audio when volume changes
  useEffect(() => {
    if (audioRef.current && !settings.isMuted) {
      audioRef.current.volume = (settings.volume ?? 50) / 100;
    }
  }, [settings.volume, settings.isMuted]);

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

  const [timeLeft, setTimeLeft] = useState(() => getTotalTime("focus"));
  const [totalTime, setTotalTime] = useState(() => getTotalTime("focus"));

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

  const start = useCallback(() => setStatus("running"), []);
  const pause = useCallback(() => setStatus("paused"), []);
  const reset = useCallback(() => updateMode(mode), [mode, updateMode]);
  const switchMode = useCallback(
    (newMode: TimerMode) => updateMode(newMode),
    [updateMode]
  );

  const playTimerSound = useCallback(() => {
    // Don't play if muted, no sound selected, or audio not loaded
    if (settings.isMuted || !audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = (settings.volume ?? 50) / 100;

      audioRef.current.play().catch((err) => {
        console.log("Timer sound blocked:", err);
      });
    } catch (err) {
      console.log("Timer sound error:", err);
    }
  }, [settings.volume, settings.isMuted]);

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

          playTimerSound();

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
  }, [
    status,
    mode,
    sessionsCompleted,
    settings,
    updateMode,
    playTimerSound,
  ]);

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