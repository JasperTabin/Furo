// hooks/useSoundSettings.ts

import { useState } from "react";

interface SoundSettings {
  sound: string;
  volume: number;
  isMuted: boolean;
}

const SOUND_DEFAULTS = {
  sound: "Cat.mp3",
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

  const update = (key: keyof typeof values, value: string) => {
    console.log('useSoundSettings update called:', { key, value, currentValues: values });
    
    if (key === "sound") {
      setValues((prev) => {
        const newValues = { ...prev, sound: value };
        console.log('Sound updated:', newValues);
        return newValues;
      });
      return;
    }

    if (key === "isMuted") {
      const newMuted = value === "true";
      setValues((prev) => {
        const newValues = { ...prev, isMuted: newMuted };
        console.log('Mute updated:', newValues);
        return newValues;
      });
      return;
    }

    if (key === "volume") {
      const num = parseInt(value, 10) || 0;
      const clampedVolume = clamp(num, 0, 100);
      setValues((prev) => {
        const newValues = { ...prev, volume: clampedVolume };
        console.log('Volume updated:', newValues);
        return newValues;
      });
      return;
    }
  };

  const reset = () => setValues({ ...SOUND_DEFAULTS });

  console.log('useSoundSettings current state:', values);

  return { values, update, reset };
};