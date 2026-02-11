// Load and save timer settings to localStorage

import { DEFAULT_SETTINGS, TIMER_STORAGE_KEY } from "../configs/constants";
import type { TimerSettings } from "../configs/types";

export const loadSettings = (): TimerSettings => {
  const saved = localStorage.getItem(TIMER_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        volume: parsed.volume ?? DEFAULT_SETTINGS.volume,
        isMuted: parsed.isMuted ?? DEFAULT_SETTINGS.isMuted,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: TimerSettings): void => {
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(settings));
};
