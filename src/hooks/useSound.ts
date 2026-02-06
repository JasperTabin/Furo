// Manages sound state & logic (sound file, volume, mute)

import { useState } from "react";

interface SoundSettings {
  sound: string;
  volume: number;
  isMuted: boolean;
}

const SOUND_DEFAULTS = {
  sound: "Sound_1.mp3",
  volume: 50,
  isMuted: false,
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useSoundSettings = (initialSettings: SoundSettings) => {
  const [values, setValues] = useState({
    sound: initialSettings.sound || SOUND_DEFAULTS.sound,
    volume: initialSettings.volume ?? SOUND_DEFAULTS.volume,
    isMuted: initialSettings.isMuted ?? SOUND_DEFAULTS.isMuted,
  });

  const update = (key: keyof typeof values, value: string | boolean) => {
    if (key === "sound") {
      setValues((prev) => ({ ...prev, sound: String(value) }));
      return;
    }

    if (key === "isMuted") {
      const boolValue = typeof value === "boolean" ? value : value === "true";
      setValues((prev) => ({ ...prev, isMuted: boolValue }));
      return;
    }

    if (key === "volume") {
      const num = typeof value === "string" ? parseInt(value, 10) || 0 : Number(value);
      setValues((prev) => ({ ...prev, volume: clamp(num, 0, 100) }));
      return;
    }
  };

  const reset = () => setValues({ ...SOUND_DEFAULTS });

  return { values, update, reset };
};