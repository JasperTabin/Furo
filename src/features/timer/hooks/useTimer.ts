// TIMER LOGIC

import { useState, useEffect, useRef, useCallback } from "react";
import { loadSettings } from "../utils/settings";
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

  // ✅ FIX: Update audio when settings change
  useEffect(() => {
    // Clean up old audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Don't create audio if no sound or "none"
    if (!currentSettings.sound || currentSettings.sound === "none") {
      return;
    }

    // Create new audio with current settings
    const audio = new Audio(`/sounds/${currentSettings.sound}`);
    audio.preload = "auto";
    audio.volume = currentSettings.isMuted
      ? 0
      : (currentSettings.volume ?? 50) / 100;
    audio.load();
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSettings.sound, currentSettings.volume, currentSettings.isMuted]);

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
    // Get fresh settings values
    if (currentSettings.isMuted || !audioRef.current) {
      console.log("Sound muted or no audio ref");
      return;
    }

    const audio = audioRef.current;

    // ✅ FIX: Only reset currentTime, don't pause if already paused
    audio.currentTime = 0;
    audio.volume = (currentSettings.volume ?? 50) / 100;

    let played = 0;
    const intervalMs = 500;
    const repeatCount = currentSettings.repeatCount ?? 1;

    const playNext = () => {
      if (played >= repeatCount) return;

      audio.currentTime = 0;

      // ✅ FIX: Use a promise chain to handle errors properly
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio is playing successfully
          })
          .catch((err) => {
            console.warn("Audio playback failed:", err);
          });
      }

      const onEnded = () => {
        audio.removeEventListener("ended", onEnded);
        played++;
        if (played < repeatCount) {
          setTimeout(playNext, intervalMs);
        }
      };

      audio.addEventListener("ended", onEnded);
    };

    playNext();
  }, [
    currentSettings.volume,
    currentSettings.isMuted,
    currentSettings.repeatCount,
  ]);

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

              setTimeout(() => {
                if (
                  newSessions % currentSettings.sessionsBeforeLongBreak ===
                  0
                ) {
                  updateMode("longBreak");
                } else {
                  updateMode("shortbreak");
                }
              }, 0);

              return newSessions;
            });

            return prev - 1;
          } else {
            setTimeout(() => {
              updateMode("focus");
            }, 0);
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
  }, [
    status,
    mode,
    currentSettings.sessionsBeforeLongBreak,
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
