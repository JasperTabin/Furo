// shared/constants.ts - Default values and constants for timer

import type { TimerSettings } from "./types";

export const TIMER_STORAGE_KEY = "timerSettings";
export const ALERT_SOUND = "/public/sounds/Ring.mp3";

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
};

export const DURATION_FIELDS = [
  { field: "work" as const, label: "Work Duration", min: 5, max: 60, step: 5 },
  { field: "break" as const, label: "Short Break", min: 5, max: 15, step: 5 },
  { field: "long" as const, label: "Long Break", min: 5, max: 30, step: 5 },
] as const;
