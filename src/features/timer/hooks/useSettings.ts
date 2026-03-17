// SETTINGS - LOGIC

import { useState, useMemo } from "react";
import { DEFAULT_SETTINGS, DURATION_FIELDS } from "../configs/constants";
import { loadSettings, saveSettings } from "../utils/settings";

export const useSettings = () => {
  const saved = loadSettings();

  const [workDuration, setWorkDuration] = useState(() => saved.workDuration);
  const [breakDuration, setBreakDuration] = useState(() => saved.breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(
    () => saved.longBreakDuration,
  );

  const hasChanges = useMemo(
    () =>
      workDuration !== saved.workDuration ||
      breakDuration !== saved.breakDuration ||
      longBreakDuration !== saved.longBreakDuration,
    [workDuration, breakDuration, longBreakDuration, saved],
  );

  function getSetterAndConfig(field: "work" | "break" | "long") {
    const config = DURATION_FIELDS.find((f) => f.field === field)!;
    const setter = {
      work: setWorkDuration,
      break: setBreakDuration,
      long: setLongBreakDuration,
    }[field];
    return { setter, config };
  }

  function handleStep(
    field: "work" | "break" | "long",
    direction: "inc" | "dec",
  ) {
    const { setter, config } = getSetterAndConfig(field);
    setter((prev) => {
      const next =
        direction === "inc" ? prev + config.step : prev - config.step;
      return Math.min(Math.max(next, config.min), config.max);
    });
  }

  function getValue(field: "work" | "break" | "long") {
    return {
      work: workDuration,
      break: breakDuration,
      long: longBreakDuration,
    }[field];
  }

  function resetToDefaults() {
    setWorkDuration(DEFAULT_SETTINGS.workDuration);
    setBreakDuration(DEFAULT_SETTINGS.breakDuration);
    setLongBreakDuration(DEFAULT_SETTINGS.longBreakDuration);
  }

  function saveCurrentSettings() {
    const newSettings = { workDuration, breakDuration, longBreakDuration };
    saveSettings(newSettings);
    return newSettings;
  }

  return {
    getValue,
    handleStep,
    hasChanges,
    resetToDefaults,
    saveCurrentSettings,
  };
};
