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
  const [workDuration, setWorkDuration] = useState(
    currentSettings.workDuration,
  );
  const [breakDuration, setBreakDuration] = useState(
    currentSettings.breakDuration,
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    currentSettings.longBreakDuration,
  );

  if (!isOpen) return null;

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const handleWorkDurationChange = (value: string) => {
    const num = parseInt(value) || 0;
    setWorkDuration(clamp(num, 1, 120));
  };

  const handleBreakDurationChange = (value: string) => {
    const num = parseInt(value) || 0;
    setBreakDuration(clamp(num, 1, 30));
  };

  const handleLongBreakDurationChange = (value: string) => {
    const num = parseInt(value) || 0;
    setLongBreakDuration(clamp(num, 1, 60));
  };

  const handleSave = () => {
    onSave({
      workDuration: clamp(workDuration, 1, 120),
      breakDuration: clamp(breakDuration, 1, 30),
      longBreakDuration: clamp(longBreakDuration, 1, 60),
      sessionsBeforeLongBreak: currentSettings.sessionsBeforeLongBreak,
    });
    onClose();
  };

  const handleReset = () => {
    setWorkDuration(25);
    setBreakDuration(5);
    setLongBreakDuration(15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-bg border-2 border-border bg-(--color-bg) rounded-lg p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-fg hover:text-border transition-colors"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold tracking-widest mb-8 text-fg">
          TIMER SETTINGS
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold tracking-widest mb-2 text-fg">
              FOCUS DURATION (Set Number 1-120)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={workDuration}
              onChange={(e) => handleWorkDurationChange(e.target.value)}
              onBlur={(e) => handleWorkDurationChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold tracking-widest mb-2 text-fg">
              SHORT BREAK (Set Number 1-30)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => handleBreakDurationChange(e.target.value)}
              onBlur={(e) => handleBreakDurationChange(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold tracking-widest mb-2 text-fg">
              LONG BREAK (Set Number 1-60)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={longBreakDuration}
              onChange={(e) => handleLongBreakDurationChange(e.target.value)}
              onBlur={(e) => handleLongBreakDurationChange(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleReset}
            className={`${buttonBase} ${buttonSecondary} flex-1`}
          >
            RESET
          </button>
          <button
            onClick={handleSave}
            className={`${buttonBase} ${buttonPrimary} flex-1`}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
