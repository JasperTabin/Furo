// components/SettingsModal.tsx - Modal for configuring timer durations

import { X } from "lucide-react";
import { useState } from "react";
import type { TimerSettings } from "../types/timer";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

const inputClass =
  "w-full px-4 py-2 text-sm bg-transparent border-2 border-[var(--color-border)] rounded-md text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-fg)] transition-colors";

const buttonBase =
  "px-6 py-3 text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200";

const buttonPrimary =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]";

const buttonSecondary =
  "bg-transparent text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-fg)]";

export const SettingsModal = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}: SettingsModalProps) => {
  const [workDuration, setWorkDuration] = useState(currentSettings.workDuration);
  const [breakDuration, setBreakDuration] = useState(currentSettings.breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(currentSettings.longBreakDuration);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      workDuration,
      breakDuration,
      longBreakDuration,
      sessionsBeforeLongBreak: currentSettings.sessionsBeforeLongBreak, // Keep existing value
    });
    onClose();
  };

  const handleReset = () => {
    setWorkDuration(25);
    setBreakDuration(5);
    setLongBreakDuration(15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-bg border-2 border-border rounded-lg p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-fg hover:text-border transition-colors"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-widest mb-8 text-fg">
          TIMER SETTINGS
        </h2>

        {/* Settings form */}
        <div className="space-y-6">
          {/* Focus Duration */}
          <div>
            <label className="block text-sm font-semibold tracking-widest mb-2 text-fg">
              FOCUS DURATION (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-sm font-semibold tracking-widest mb-2 text-fg">
              SHORT BREAK (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-sm font-semibold tracking-widest mb-2 text-fg">
              LONG BREAK (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={longBreakDuration}
              onChange={(e) => setLongBreakDuration(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button onClick={handleReset} className={`${buttonBase} ${buttonSecondary} flex-1`}>
            RESET
          </button>
          <button onClick={handleSave} className={`${buttonBase} ${buttonPrimary} flex-1`}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};