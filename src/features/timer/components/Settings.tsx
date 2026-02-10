// Settings handles Duration & Timer Sound

import { X, AudioLines, Volume2, VolumeX, Settings as SettingsIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { TimerSettings } from "../../timer/types/timer";

// Settings Button Component
export const SettingsButton = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => {
  return (
    <button
      onClick={onClick}
      className={`btn-base ${isOpen ? 'btn-active' : 'btn-inactive'}`}
      aria-label="Open settings"
      title="Open settings"
    >
      <SettingsIcon size={18} />
    </button>
  );
};

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: () => void;
}

const DEFAULTS = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sound: "Sound_1.mp3",
  volume: 50,
  isMuted: false,
  repeatCount: 1,
  sessionsBeforeLongBreak: 4,
};

const SOUNDS = [
  { label: "Sound 1", value: "Sound_1.mp3" },
  { label: "Sound 2", value: "Sound_2.mp3" },
  { label: "Sound 3", value: "Sound_3.mp3" },
  { label: "Sound 4", value: "Sound_4.mp3" },
  { label: "No sound", value: "none" },
];

const REPEAT_OPTIONS = [1, 2, 3, 4, 5];

const loadSettings = (): TimerSettings => {
  const saved = localStorage.getItem("timerSettings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULTS,
        ...parsed,
        volume: parsed.volume ?? DEFAULTS.volume,
        isMuted: parsed.isMuted ?? DEFAULTS.isMuted,
      };
    } catch {
      return DEFAULTS;
    }
  }
  return DEFAULTS;
};

export const Settings = ({ isOpen, onClose, onSettingsChange }: SettingsProps) => {
  const [workDuration, setWorkDuration] = useState(() => loadSettings().workDuration);
  const [breakDuration, setBreakDuration] = useState(() => loadSettings().breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(() => loadSettings().longBreakDuration);
  const [sound, setSound] = useState(() => loadSettings().sound || DEFAULTS.sound);
  const [volume, setVolume] = useState(() => loadSettings().volume ?? DEFAULTS.volume);
  const [isMuted, setIsMuted] = useState(() => loadSettings().isMuted ?? DEFAULTS.isMuted);
  const [repeatCount, setRepeatCount] = useState(() => loadSettings().repeatCount ?? DEFAULTS.repeatCount);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(() => loadSettings().sessionsBeforeLongBreak ?? DEFAULTS.sessionsBeforeLongBreak);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen]);

  function handleDurationChange(setter: (val: number) => void, value: string) {
    const num = parseInt(value) || 0;
    setter(Math.min(Math.max(num, 0), 999));
  }

  function previewSound() {
    if (!sound || sound === "none" || isMuted) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(`/sounds/${sound}`);
    audio.volume = volume / 100;
    audioRef.current = audio;
    audio.play().catch(() => {});
  }

  function resetToDefaults() {
    setWorkDuration(DEFAULTS.workDuration);
    setBreakDuration(DEFAULTS.breakDuration);
    setLongBreakDuration(DEFAULTS.longBreakDuration);
    setSound(DEFAULTS.sound);
    setVolume(DEFAULTS.volume);
    setIsMuted(DEFAULTS.isMuted);
    setRepeatCount(DEFAULTS.repeatCount);
    setSessionsBeforeLongBreak(DEFAULTS.sessionsBeforeLongBreak);
  }

  function saveSettings() {
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
    
    localStorage.setItem("timerSettings", JSON.stringify(newSettings));
    // Notify parent component that settings changed
    onSettingsChange?.();
    onClose();
  }

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2.5 text-center bg-(--color-bg) border border-(--color-border) rounded-lg focus:outline-none focus:border-(--color-border)/70";
  const previewDisabled = !sound || sound === "none" || isMuted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-(--color-bg)/30">
      <div className="w-full max-w-md bg-(--color-bg) border border-(--color-border) rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-(--color-border)">
          <h2 className="text-xl font-semibold">SETTINGS</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-(--color-border)/30 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-60">DURATIONS ( MINS )</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs opacity-70 mb-1.5">FOCUS</label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={workDuration}
                  onChange={(e) => handleDurationChange(setWorkDuration, e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs opacity-70 mb-1.5">SHORT</label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={breakDuration}
                  onChange={(e) => handleDurationChange(setBreakDuration, e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs opacity-70 mb-1.5">LONG</label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={longBreakDuration}
                  onChange={(e) => handleDurationChange(setLongBreakDuration, e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-60">SOUND</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs opacity-70 mb-1.5">ALERT SOUND</label>
                <select value={sound} onChange={(e) => setSound(e.target.value)} className={inputClass}>
                  {SOUNDS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs opacity-70 mb-1.5">REPEAT</label>
                <select value={repeatCount} onChange={(e) => setRepeatCount(parseInt(e.target.value))} className={inputClass}>
                  {REPEAT_OPTIONS.map((count) => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={previewSound}
              disabled={previewDisabled}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-(--color-border) rounded-lg hover:bg-(--color-border)/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <AudioLines size={16} />
              <span className="text-sm">PREVIEW SOUND</span>
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-60">VOLUME</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 border border-(--color-border) rounded-lg hover:bg-(--color-border)/20 transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                disabled={isMuted}
                className="flex-1 h-2 rounded-lg bg-(--color-border) disabled:opacity-40"
              />
              <span className="text-sm opacity-70 w-14 text-right tabular-nums">
                {isMuted ? "Muted" : `${volume}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-(--color-border)">
          <button
            onClick={resetToDefaults}
            className="btn-base btn-inactive flex-1"
          >
            RESET
          </button>
          <button
            onClick={saveSettings}
            className="btn-base btn-active flex-1"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
