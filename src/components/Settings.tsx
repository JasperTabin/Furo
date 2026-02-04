// components/Settings.tsx - Modal for configuring timer durations (Optimized)

import { X } from "lucide-react";
import { useState } from "react";
import type { TimerSettings } from "../types/timer";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

/* ───────────────────────────── */
/* Constants & Helpers */

const LIMITS = {
  workDuration: { min: 1, max: 120 },
  breakDuration: { min: 1, max: 30 },
  longBreakDuration: { min: 1, max: 60 },
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/* ───────────────────────────── */
/* Styles */

const inputClass =
  "w-full px-3 sm:px-4 py-2 text-sm bg-transparent border-2 border-[var(--color-border)] rounded-md text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-fg)] transition-colors";

const buttonBase =
  "px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200 active:scale-95";

const buttonPrimary =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]";

const buttonSecondary =
  "bg-transparent text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-fg)]";

/* ───────────────────────────── */

export const Settings = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}: SettingsProps) => {
  const [values, setValues] = useState({
    workDuration: currentSettings.workDuration,
    breakDuration: currentSettings.breakDuration,
    longBreakDuration: currentSettings.longBreakDuration,
  });

  if (!isOpen) return null;

  /* Generic handler */
  const handleChange =
    (key: keyof typeof values) => (value: string) => {
      const num = parseInt(value, 10) || 0;
      const { min, max } = LIMITS[key];

      setValues((prev) => ({
        ...prev,
        [key]: clamp(num, min, max),
      }));
    };

  const handleSave = () => {
    onSave({
      ...values,
      workDuration: clamp(
        values.workDuration,
        LIMITS.workDuration.min,
        LIMITS.workDuration.max,
      ),
      breakDuration: clamp(
        values.breakDuration,
        LIMITS.breakDuration.min,
        LIMITS.breakDuration.max,
      ),
      longBreakDuration: clamp(
        values.longBreakDuration,
        LIMITS.longBreakDuration.min,
        LIMITS.longBreakDuration.max,
      ),
      sessionsBeforeLongBreak: currentSettings.sessionsBeforeLongBreak,
    });

    onClose();
  };

  const handleReset = () => {
    setValues({
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-(--color-bg) border-2 border-(--color-border) rounded-lg p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-(--color-fg) hover:text-(--color-border) transition-colors"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold tracking-widest mb-6 sm:mb-8">
          TIMER SETTINGS
        </h2>

        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
              FOCUS DURATION (1–120 min)
            </label>
            <input
              type="number"
              min={LIMITS.workDuration.min}
              max={LIMITS.workDuration.max}
              value={values.workDuration}
              onChange={(e) =>
                handleChange("workDuration")(e.target.value)
              }
              onBlur={(e) =>
                handleChange("workDuration")(e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
              SHORT BREAK (1–30 min)
            </label>
            <input
              type="number"
              min={LIMITS.breakDuration.min}
              max={LIMITS.breakDuration.max}
              value={values.breakDuration}
              onChange={(e) =>
                handleChange("breakDuration")(e.target.value)
              }
              onBlur={(e) =>
                handleChange("breakDuration")(e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
              LONG BREAK (1–60 min)
            </label>
            <input
              type="number"
              min={LIMITS.longBreakDuration.min}
              max={LIMITS.longBreakDuration.max}
              value={values.longBreakDuration}
              onChange={(e) =>
                handleChange("longBreakDuration")(e.target.value)
              }
              onBlur={(e) =>
                handleChange("longBreakDuration")(e.target.value)
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
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
