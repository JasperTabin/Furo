// Orchestrator/Coordinator that combines both hooks

import type { TimerSettings } from "../types/timer";
import { useDurationSettings } from "../hooks/useDuration";
import { useSoundSettings } from "../hooks/useSound";

type DurationKeys = "workDuration" | "breakDuration" | "longBreakDuration";
type SoundKeys = "sound" | "volume" | "isMuted";
type SettingsKeys = DurationKeys | SoundKeys;

export const useSettings = (currentSettings: TimerSettings) => {
  const duration = useDurationSettings({
    workDuration: currentSettings.workDuration,
    breakDuration: currentSettings.breakDuration,
    longBreakDuration: currentSettings.longBreakDuration,
  });

  const sound = useSoundSettings({
    sound: currentSettings.sound || "Sound_1.mp3",
    volume: currentSettings.volume ?? 50,
    isMuted: currentSettings.isMuted ?? false,
  });

  const update = (key: SettingsKeys, value: string) => {
    if (key === "sound" || key === "volume" || key === "isMuted") {
      sound.update(key, value);
    } else {
      duration.update(key, value);
    }
  };

  const reset = () => {
    duration.reset();
    sound.reset();
  };

  const save = (
    onSave: (settings: TimerSettings) => void,
    sessionsBeforeLongBreak: number,
  ) => {
    onSave({
      ...duration.values,
      ...sound.values,
      sessionsBeforeLongBreak,
    });
  };

  return {
    values: { ...duration.values, ...sound.values },
    duration,
    sound,
    update,
    reset,
    save,
  };
};