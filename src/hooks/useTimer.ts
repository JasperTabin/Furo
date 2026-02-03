// hooks/useTimer.ts - Custom hook containing all timer logic and state management

import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerMode, TimerStatus, TimerSettings } from '../types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

export const useTimer = (settings: TimerSettings = DEFAULT_SETTINGS) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);

  const getTotalTime = useCallback((currentMode: TimerMode): number => {
    switch (currentMode) {
      case 'focus':
        return settings.workDuration * 60;
      case 'shortbreak':
        return settings.breakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      case 'infinite':
        return 0; // special case, no upper bound
    }
  }, [settings]);

  const start = useCallback(() => {
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTimeLeft(mode === 'infinite' ? 0 : getTotalTime(mode));
  }, [mode, getTotalTime]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setTimeLeft(newMode === 'infinite' ? 0 : getTotalTime(newMode));
      setStatus('idle');
    },
    [getTotalTime]
  );

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'infinite') {
            // Count upwards
            return prev + 1;
          }

          // Countdown logic
          if (prev <= 1) {
            setStatus('idle');

            if (mode === 'focus') {
              const newSessions = sessionsCompleted + 1;
              setSessionsCompleted(newSessions);

              if (newSessions % settings.sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                return settings.longBreakDuration * 60;
              } else {
                setMode('shortbreak');
                return settings.breakDuration * 60;
              }
            } else {
              // After break, go back to work
              setMode('focus');
              return settings.workDuration * 60;
            }
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, mode, sessionsCompleted, settings]);

  return {
    mode,
    status,
    timeLeft,
    totalTime: getTotalTime(mode),
    sessionsCompleted,
    start,
    pause,
    reset,
    switchMode,
  };
};
