import { useState } from "react";
import type { TimerSettings } from "../types/timer";

const LIMITS = {
  workDuration: { min: 1, max: 120 },
  breakDuration: { min: 1, max: 30 },
  longBreakDuration: { min: 1, max: 60 },
} as const;

const DEFAULTS = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sound: "Cat.mp3",
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useSettings = (currentSettings: TimerSettings) => {
  const [values, setValues] = useState({
    workDuration: currentSettings.workDuration,
    breakDuration: currentSettings.breakDuration,
    longBreakDuration: currentSettings.longBreakDuration,
    sound: currentSettings.sound || DEFAULTS.sound,
  });

  const update = (key: keyof typeof values, value: string) => {
    if (key === "sound") {
      setValues((prev) => ({ ...prev, sound: value }));
      return;
    }

    const num = parseInt(value, 10) || 0;
    const { min, max } = LIMITS[key as keyof typeof LIMITS];

    setValues((prev) => ({
      ...prev,
      [key]: clamp(num, min, max),
    }));
  };

  const reset = () => setValues({ ...DEFAULTS });

  const save = (
    onSave: (settings: TimerSettings) => void,
    sessionsBeforeLongBreak: number,
  ) => {
    onSave({
      ...values,
      workDuration: clamp(values.workDuration, LIMITS.workDuration.min, LIMITS.workDuration.max),
      breakDuration: clamp(values.breakDuration, LIMITS.breakDuration.min, LIMITS.breakDuration.max),
      longBreakDuration: clamp(values.longBreakDuration, LIMITS.longBreakDuration.min, LIMITS.longBreakDuration.max),
      sessionsBeforeLongBreak,
      sound: values.sound,
    });
  };

  return { values, update, reset, save };
};
