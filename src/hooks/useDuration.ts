// Manages duration state & logic (work, break, long break)

import { useState } from "react";

interface DurationSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
}

const LIMITS = {
  workDuration: { min: 0, max: 120 },
  breakDuration: { min: 1, max: 30 },
  longBreakDuration: { min: 1, max: 60 },
} as const;

const DURATION_DEFAULTS = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useDurationSettings = (initialSettings: DurationSettings) => {
  const [values, setValues] = useState({
    workDuration: initialSettings.workDuration,
    breakDuration: initialSettings.breakDuration,
    longBreakDuration: initialSettings.longBreakDuration,
  });

  const update = (key: keyof typeof values, value: string) => {
    const num = parseInt(value, 10) || 0;
    const { min, max } = LIMITS[key];

    setValues((prev) => ({
      ...prev,
      [key]: clamp(num, min, max),
    }));
  };

  const reset = () => setValues({ ...DURATION_DEFAULTS });

  return { values, update, reset, LIMITS };
};