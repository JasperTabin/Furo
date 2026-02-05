// Timer - Settings

import { X } from "lucide-react";
import type { TimerSettings } from "../../types/timer";
import { useSettings } from "../../hooks/useSettings";
import { Button } from "../Shared/Button";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

const inputClass = `
  w-full
  px-3 sm:px-4 py-2
  text-sm
  bg-transparent
  text-[var(--color-fg)]
  border border-[var(--color-border)]
  rounded-md
  transition
  focus:outline-none
  focus:border-[var(--color-fg)]
  focus:ring-2 focus:ring-[var(--color-fg)]/30
`;

export const Settings = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}: SettingsProps) => {
  const { values, update, reset, save } = useSettings(currentSettings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-(--color-bg) border-2 border-(--color-border) rounded-lg p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-widest">
            TIMER SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-(--color-fg) hover:text-(--color-border) transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
              FOCUS DURATION (1–120 min)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={values.workDuration}
              onChange={(e) => update("workDuration", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
              SHORT BREAK (1–30 min)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={values.breakDuration}
              onChange={(e) => update("breakDuration", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
              LONG BREAK (1–60 min)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={values.longBreakDuration}
              onChange={(e) => update("longBreakDuration", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button onClick={reset} variant="inactive" className="flex-1">
            RESET
          </Button>
          <Button
            onClick={() => {
              save(onSave, currentSettings.sessionsBeforeLongBreak);
              onClose();
            }}
            variant="active"
            className="flex-1"
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
};
