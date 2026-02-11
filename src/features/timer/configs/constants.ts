// shared/constants.ts - Default values and constants for timer

import type { TimerSettings } from "./types";

export const TIMER_STORAGE_KEY = "timerSettings";

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  sound: "Sound_1.mp3", 
  volume: 50, 
  isMuted: false, 
  repeatCount: 1,
};

export const SOUNDS = [
  { label: "Sound 1", value: "Sound_1.mp3" },
  { label: "Sound 2", value: "Sound_2.mp3" },
  { label: "Sound 3", value: "Sound_3.mp3" },
  { label: "Sound 4", value: "Sound_4.mp3" },
  { label: "No sound", value: "none" },
] as const;

export const REPEAT_OPTIONS = [1, 2, 3, 4, 5] as const;