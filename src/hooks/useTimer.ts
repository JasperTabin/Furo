// hooks/useTimer.ts - Custom hook containing all timer logic and state management

import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerMode, TimerStatus, TimerSettings } from '../types/timer';

export const useTimer = (settings: TimerSettings) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const getTotalTime = useCallback((currentMode: TimerMode): number => {
    switch (currentMode) {
      case 'focus':
        return settings.workDuration * 60;
      case 'shortbreak':
        return settings.breakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      case 'infinite':
        return 0;
    }
  }, [settings]);

  const [timeLeft, setTimeLeft] = useState(() => getTotalTime('focus'));
  const [totalTime, setTotalTime] = useState(() => getTotalTime('focus'));

  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    const newTotal = getTotalTime(mode);
    setTotalTime(newTotal);
    setTimeLeft(mode === 'infinite' ? 0 : newTotal);
  }, [mode, getTotalTime]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      const newTotal = getTotalTime(newMode);
      setTotalTime(newTotal);
      setTimeLeft(newMode === 'infinite' ? 0 : newTotal);
      setStatus('idle');
    },
    [getTotalTime]
  );

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'infinite') {
            return prev + 1;
          }

          if (prev <= 1) {
            setStatus('idle');

            if (mode === 'focus') {
              const newSessions = sessionsCompleted + 1;
              setSessionsCompleted(newSessions);

              if (newSessions % settings.sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                const newTotal = settings.longBreakDuration * 60;
                setTotalTime(newTotal);
                return newTotal;
              } else {
                setMode('shortbreak');
                const newTotal = settings.breakDuration * 60;
                setTotalTime(newTotal);
                return newTotal;
              }
            } else {
              setMode('focus');
              const newTotal = settings.workDuration * 60;
              setTotalTime(newTotal);
              return newTotal;
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
    totalTime,
    sessionsCompleted,
    start,
    pause,
    reset,
    switchMode,
  };
};