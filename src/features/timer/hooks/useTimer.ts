import { useState, useEffect, useRef, useCallback } from "react";
import type { TimerMode, TimerStatus, TimerSettings } from "../../timer/types/timer";

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  volume: 50,
  isMuted: false,
  repeatCount: 1,
};

const loadSettings = (): TimerSettings => {
  const saved = localStorage.getItem("timerSettings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        volume: parsed.volume ?? DEFAULT_SETTINGS.volume,
        isMuted: parsed.isMuted ?? DEFAULT_SETTINGS.isMuted,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};

export const useTimer = (settings?: TimerSettings) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const currentSettings = settings || loadSettings();

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Listen for settings changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // Force a re-render by updating state when settings change
      setMode(mode);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mode]);

  // Create/update audio when sound changes
  useEffect(() => {
    if (!currentSettings.sound || currentSettings.sound === "none") {
      audioRef.current = null;
      return;
    }

    const audio = new Audio(`/sounds/${currentSettings.sound}`);
    audio.preload = "auto";
    audio.load();

    audioRef.current = audio;
  }, [currentSettings.sound]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current && !currentSettings.isMuted) {
      audioRef.current.volume = (currentSettings.volume ?? 50) / 100;
    }
  }, [currentSettings.volume, currentSettings.isMuted]);

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
  if (currentSettings.isMuted || !audioRef.current) return;

  const audio = audioRef.current;
  audio.pause();
  audio.currentTime = 0;
  audio.volume = (currentSettings.volume ?? 50) / 100;

  let played = 0;
  const intervalMs = 500; // delay between repeats

  const playNext = () => {
    if (played >= currentSettings.repeatCount) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});

    const onEnded = () => {
      audio.removeEventListener("ended", onEnded);
      played++;
      if (played < currentSettings.repeatCount) {
        // Wait before playing next repeat
        setTimeout(() => {
          playNext();
        }, intervalMs);
      }
    };

    audio.addEventListener("ended", onEnded);
  };

  playNext();
}, [currentSettings.volume, currentSettings.isMuted, currentSettings.repeatCount]);

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

            if (newSessions % currentSettings.sessionsBeforeLongBreak === 0) {
              updateMode("longBreak");
              return currentSettings.longBreakDuration * 60;
            } else {
              updateMode("shortbreak");
              return currentSettings.breakDuration * 60;
            }
          } else {
            updateMode("focus");
            return currentSettings.workDuration * 60;
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
  }, [status, mode, sessionsCompleted, currentSettings, updateMode, playTimerSound]);

  // Reset timer when settings change
  useEffect(() => {
    if (status === "idle") {
      updateMode(mode);
    }
  }, [currentSettings, mode, updateMode, status]);

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
