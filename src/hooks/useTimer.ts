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

  // Update volume when changed
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
    [settings],
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
  if (settings.isMuted || !audioRef.current) return;

  const audio = audioRef.current;
  audio.pause();
  audio.currentTime = 0;
  audio.volume = (settings.volume ?? 50) / 100;

  let played = 0;
  const intervalMs = 500; // delay between repeats

  const playNext = () => {
    if (played >= settings.repeatCount) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});

    const onEnded = () => {
      audio.removeEventListener("ended", onEnded);
      played++;
      if (played < settings.repeatCount) {
        // Wait before playing next repeat
        setTimeout(() => {
          playNext();
        }, intervalMs);
      }
    };

    audio.addEventListener("ended", onEnded);
  };

  playNext();
}, [settings.volume, settings.isMuted, settings.repeatCount]);


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

          // 🔊 play repeatable sound
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
  }, [status, mode, sessionsCompleted, settings, updateMode, playTimerSound]);

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
