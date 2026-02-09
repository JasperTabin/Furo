import { X, AudioLines, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { TimerSettings } from "../../types/timer";
import { Button } from "../Shared/Button";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

const DEFAULTS = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sound: "Sound_1.mp3",
  volume: 50,
  isMuted: false,
  repeatCount: 1,
};

const SOUNDS = [
  { label: "Sound 1", value: "Sound_1.mp3" },
  { label: "Sound 2", value: "Sound_2.mp3" },
  { label: "Sound 3", value: "Sound_3.mp3" },
  { label: "Sound 4", value: "Sound_4.mp3" },
  { label: "No sound", value: "none" },
];

const REPEAT_OPTIONS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const TIMERS = [
  { label: "Focus (min)", key: "workDuration", min: 0, max: 120 },
  { label: "Short Break", key: "breakDuration", min: 1, max: 30 },
  { label: "Long Break", key: "longBreakDuration", min: 1, max: 60 },
] as const;

export const Settings = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}: SettingsProps) => {
  const [timers, setTimers] = useState({
    workDuration: currentSettings.workDuration,
    breakDuration: currentSettings.breakDuration,
    longBreakDuration: currentSettings.longBreakDuration,
  });

  const [sound, setSound] = useState(currentSettings.sound || DEFAULTS.sound);
  const [volume, setVolume] = useState(
    currentSettings.volume ?? DEFAULTS.volume,
  );
  const [isMuted, setIsMuted] = useState(
    currentSettings.isMuted ?? DEFAULTS.isMuted,
  );
  const [repeatCount, setRepeatCount] = useState(
    currentSettings.repeatCount ?? DEFAULTS.repeatCount,
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  const updateTimer = (
    key: keyof typeof timers,
    value: string,
    min: number,
    max: number,
  ) => {
    const num = parseInt(value) || min;
    setTimers((prev) => ({ ...prev, [key]: clamp(num, min, max) }));
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const preview = () => {
    if (!sound || sound === "none" || isMuted) return;

    // Stop existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/sounds/${sound}`);
    audio.volume = volume / 100;
    audioRef.current = audio;

    audio.play().catch(() => {});
  };

  const reset = () => {
    setTimers({
      workDuration: DEFAULTS.workDuration,
      breakDuration: DEFAULTS.breakDuration,
      longBreakDuration: DEFAULTS.longBreakDuration,
    });
    setSound(DEFAULTS.sound);
    setVolume(DEFAULTS.volume);
    setIsMuted(DEFAULTS.isMuted);
    setRepeatCount(DEFAULTS.repeatCount);
  };

  const save = () => {
    stopAudio();
    onSave({
      ...timers,
      sound,
      volume,
      isMuted,
      repeatCount,
      sessionsBeforeLongBreak: currentSettings.sessionsBeforeLongBreak,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="w-full max-w-md bg-(--color-bg) border border-(--color-border) rounded-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Timer Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-(--color-border)/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {TIMERS.map(({ label, key, min, max }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1">
                {label}
              </label>
              <input
                type="number"
                min={min}
                max={max}
                value={timers[key]}
                onChange={(e) => updateTimer(key, e.target.value, min, max)}
                className="w-full px-4 py-2 text-sm bg-(--color-bg) border border-(--color-border) rounded"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1 mb-6">
            <div className="flex gap-3 items-end">
              <div className="flex flex-col w-32">
                <label className="text-sm font-semibold mb-1">Sound</label>
                <select
                  value={sound}
                  onChange={(e) => setSound(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-(--color-bg) border border-(--color-border) rounded"
                >
                  {SOUNDS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-32">
                <label className="text-sm font-semibold mb-1">Repeat</label>
                <select
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-(--color-bg) border border-(--color-border) rounded"
                >
                  {REPEAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-32">
                <label className="text-sm font-semibold mb-1">Preview</label>
                <button
                  onClick={preview}
                  disabled={!sound || sound === "none" || isMuted}
                  className="w-full h-10 flex items-center justify-center border border-(--color-border) rounded hover:bg-(--color-border) disabled:opacity-30"
                >
                  <AudioLines size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 border border-(--color-border) rounded"
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
                className="flex-1 h-2 rounded-lg bg-(--color-border)"
              />
              <span className="text-sm w-16 text-right">
                {isMuted ? "Muted" : `${volume}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={reset} variant="inactive" className="flex-1">
            Reset
          </Button>
          <Button onClick={save} variant="active" className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
