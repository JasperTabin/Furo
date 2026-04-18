// shared types & helper functions

export type TimerMode = "focus" | "shortbreak" | "longBreak" | "infinite";
export type TimerStatus = "idle" | "running" | "paused";
export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export const TIMER_STORAGE_KEY = "timerSettings";
export const ALERT_SOUND = "/sounds/Ring.mp3";
export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};
export const DURATION_FIELDS = [
  { field: "work" as const, label: "Work Duration", min: 0, max: 60, step: 5 },
  { field: "break" as const, label: "Short Break", min: 0, max: 15, step: 5 },
  { field: "long" as const, label: "Long Break", min: 5, max: 30, step: 5 },
  {
    field: "interval" as const,
    label: "Long Break Interval",
    min: 2,
    max: 10,
    step: 1,
  },
] as const;

export const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const loadSettings = (): TimerSettings => {
  const saved = localStorage.getItem(TIMER_STORAGE_KEY);
  if (!saved) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(saved);
    return {
      workDuration: parsed.workDuration ?? DEFAULT_SETTINGS.workDuration,
      breakDuration: parsed.breakDuration ?? DEFAULT_SETTINGS.breakDuration,
      longBreakDuration:
        parsed.longBreakDuration ?? DEFAULT_SETTINGS.longBreakDuration,
      longBreakInterval:
        parsed.longBreakInterval ?? DEFAULT_SETTINGS.longBreakInterval,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};
export const saveSettings = (settings: TimerSettings): void => {
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(settings));
};
