import { useState, useMemo } from "react";
import {
  DEFAULT_SETTINGS,
  DURATION_FIELDS,
  loadSettings,
  saveSettings,
} from "./timer";

export const useSettings = () => {
  const [timerSettings, setTimerSettings] = useState(() => loadSettings());
  const [savedSettings, setSavedSettings] = useState(() => loadSettings());
  const hasChanges = useMemo(
    () =>
      timerSettings.workDuration !== savedSettings.workDuration ||
      timerSettings.breakDuration !== savedSettings.breakDuration ||
      timerSettings.longBreakDuration !== savedSettings.longBreakDuration ||
      timerSettings.sessionsUntilLongBreak !== savedSettings.sessionsUntilLongBreak,
    [timerSettings, savedSettings],
  );

  function getSetterAndConfig(field: "work" | "break" | "long" | "sessions") {
    const config = DURATION_FIELDS.find((f) => f.field === field)!;
    return { config };
  }

  function handleStep(
    field: "work" | "break" | "long" | "sessions",
    direction: "inc" | "dec",
  ) {
    const { config } = getSetterAndConfig(field);

    setTimerSettings((prev) => {
      const currentValue =
        field === "work"
          ? prev.workDuration
          : field === "break"
            ? prev.breakDuration
            : field === "long"
              ? prev.longBreakDuration
              : prev.sessionsUntilLongBreak;

      const next =
        direction === "inc"
          ? currentValue + config.step
          : currentValue - config.step;

      const newValue = Math.min(Math.max(next, config.min), config.max);

      return {
        ...prev,
        ...(field === "work"
          ? { workDuration: newValue }
          : field === "break"
            ? { breakDuration: newValue }
            : field === "long"
              ? { longBreakDuration: newValue }
              : { sessionsUntilLongBreak: newValue }),
      };
    });
  }

  function getValue(field: "work" | "break" | "long" | "sessions") {
    return field === "work"
      ? timerSettings.workDuration
      : field === "break"
        ? timerSettings.breakDuration
        : field === "long"
          ? timerSettings.longBreakDuration
          : timerSettings.sessionsUntilLongBreak;
  }

  function resetToDefaults() {
    setTimerSettings(DEFAULT_SETTINGS);
  }

  function saveCurrentSettings() {
    saveSettings(timerSettings);
    setSavedSettings(timerSettings);
    return timerSettings;
  }

  return {
    settings: timerSettings,
    getValue,
    handleStep,
    hasChanges,
    resetToDefaults,
    saveCurrentSettings,
  };
};
