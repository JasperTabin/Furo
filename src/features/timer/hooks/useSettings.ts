// SETTINGS - LOGIC

import { useState, useRef } from "react";
import { DEFAULT_SETTINGS } from "../configs/constants";
import { loadSettings, saveSettings } from "../utils/settings";

export const useSettings = () => {
  const [workDuration, setWorkDuration] = useState(() => loadSettings().workDuration);
  const [breakDuration, setBreakDuration] = useState(() => loadSettings().breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(() => loadSettings().longBreakDuration);
  const [sound, setSound] = useState(() => loadSettings().sound || DEFAULT_SETTINGS.sound || "Sound_1.mp3");
  const [volume, setVolume] = useState<number>(() => loadSettings().volume ?? DEFAULT_SETTINGS.volume ?? 50);
  const [isMuted, setIsMuted] = useState(() => loadSettings().isMuted ?? DEFAULT_SETTINGS.isMuted);
  const [repeatCount, setRepeatCount] = useState(() => loadSettings().repeatCount ?? DEFAULT_SETTINGS.repeatCount);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(() => loadSettings().sessionsBeforeLongBreak ?? DEFAULT_SETTINGS.sessionsBeforeLongBreak);
  const [soundError, setSoundError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleDurationChange(field: 'work' | 'break' | 'long', value: string) {
    const num = parseInt(value) || 0;
    const clamped = Math.min(Math.max(num, 0), 999);
    
    if (field === 'work') setWorkDuration(clamped);
    else if (field === 'break') setBreakDuration(clamped);
    else setLongBreakDuration(clamped);
  }

  function handleSoundChange(field: 'sound' | 'repeat', value: string | number) {
    if (field === 'sound') {
      setSound(value as string);
      setSoundError(null);
    } else {
      setRepeatCount(value as number);
    }
  }

  function handleVolumeChange(field: 'volume' | 'mute', value: number | boolean) {
    if (field === 'volume') setVolume(value as number);
    else setIsMuted(value as boolean);
  }

  function previewSound() {
    if (!sound || sound === "none" || isMuted) return;
    
    setSoundError(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const audio = new Audio(`/sounds/${sound}`);
    audio.volume = (volume ?? 50) / 100;
    audioRef.current = audio;
    
    audio.play().catch((error) => {
      console.error("Failed to play sound:", error);
      setSoundError("Failed to load sound. Please check if the file exists.");
    });
  }

  function resetToDefaults() {
    setWorkDuration(DEFAULT_SETTINGS.workDuration);
    setBreakDuration(DEFAULT_SETTINGS.breakDuration);
    setLongBreakDuration(DEFAULT_SETTINGS.longBreakDuration);
    setSound(DEFAULT_SETTINGS.sound || "Sound_1.mp3");
    setVolume(DEFAULT_SETTINGS.volume ?? 50);
    setIsMuted(DEFAULT_SETTINGS.isMuted);
    setRepeatCount(DEFAULT_SETTINGS.repeatCount);
    setSessionsBeforeLongBreak(DEFAULT_SETTINGS.sessionsBeforeLongBreak);
    setSoundError(null);
  }

  function saveCurrentSettings() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const newSettings = {
      workDuration,
      breakDuration,
      longBreakDuration,
      sound,
      volume,
      isMuted,
      repeatCount,
      sessionsBeforeLongBreak,
    };
    
    saveSettings(newSettings);
    return newSettings;
  }

  function stopPreview() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return {
    workDuration,
    breakDuration,
    longBreakDuration,
    sound,
    volume,
    isMuted,
    repeatCount,
    sessionsBeforeLongBreak,
    soundError,
    
    handleDurationChange,
    handleSoundChange,
    handleVolumeChange,
    previewSound,
    resetToDefaults,
    saveCurrentSettings,
    stopPreview,
  };
};