// Timer logic

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ALERT_SOUND,
  type TimerMode,
  type TimerStatus,
  type TimerSettings,
} from "./timer";

export type CompletedTimerMode = Exclude<TimerMode, "infinite">;

export const useTimer = (
  settings: TimerSettings,
  {
    onTimerComplete,
  }: {
    onTimerComplete?: (payload: {
      completedMode: CompletedTimerMode;
      pomodoroCount: number;
    }) => void;
  } = {},
) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeLeftRef = useRef(0);
  const pomodoroCountRef = useRef(0);
  const isCompletingRef = useRef(false);
  const lastAlertAtRef = useRef(0);

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

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    pomodoroCountRef.current = pomodoroCount;
  }, [pomodoroCount]);

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
  const resetPomodoroCount = useCallback(() => {
    pomodoroCountRef.current = 0;
    setPomodoroCount(0);
  }, []);
  const reset = useCallback(() => {
    updateMode(mode);
  }, [mode, updateMode]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      if (newMode !== mode) {
        updateMode(newMode);
      }
    },
    [mode, updateMode],
  );

  const playTimerSound = useCallback(() => {
    if (!audioRef.current) return;

    const now = Date.now();
    if (now - lastAlertAtRef.current < 750) return;
    lastAlertAtRef.current = now;

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

    isCompletingRef.current = false;

    intervalRef.current = window.setInterval(() => {
      if (mode === "infinite") {
        const nextTimeLeft = timeLeftRef.current + 1;
        timeLeftRef.current = nextTimeLeft;
        setTimeLeft(nextTimeLeft);
        return;
      }

      if (timeLeftRef.current <= 1) {
        if (isCompletingRef.current) return;
        isCompletingRef.current = true;

        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setStatus("idle");
        playTimerSound();
        timeLeftRef.current = 0;
        setTimeLeft(0);

        if (mode === "focus") {
          const nextPomodoroCount = pomodoroCountRef.current + 1;
          const hitLongBreakInterval =
            nextPomodoroCount % settings.longBreakInterval === 0;
          const nextMode = hitLongBreakInterval ? "longBreak" : "shortbreak";

          pomodoroCountRef.current = nextPomodoroCount;
          setPomodoroCount(nextPomodoroCount);

          // Transition into the next break mode first, then notify the panel.
          // Panel decides whether to auto-start the break based on the toggle.
          window.setTimeout(() => {
            updateMode(nextMode);
            onTimerComplete?.({
              completedMode: "focus",
              pomodoroCount: nextPomodoroCount,
            });
          }, 0);
        } else if (mode === "shortbreak") {
          // Transition to focus first, then notify panel.
          // Panel decides whether to auto-start focus based on the toggle.
          window.setTimeout(() => {
            updateMode("focus");
            onTimerComplete?.({
              completedMode: "shortbreak",
              pomodoroCount: pomodoroCountRef.current,
            });
          }, 0);
        } else if (mode === "longBreak") {
          // Long break ends — notify panel immediately, do NOT auto-transition.
          // Panel shows the popup and controls what happens next.
          onTimerComplete?.({
            completedMode: "longBreak",
            pomodoroCount: pomodoroCountRef.current,
          });
        }

        return;
      }

      const nextTimeLeft = timeLeftRef.current - 1;
      timeLeftRef.current = nextTimeLeft;
      setTimeLeft(nextTimeLeft);
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
    updateMode,
    playTimerSound,
    settings.longBreakInterval,
    onTimerComplete,
  ]);

  return {
    mode,
    status,
    timeLeft,
    pomodoroCount,
    resetPomodoroCount,
    start,
    pause,
    reset,
    switchMode,
  };
};
