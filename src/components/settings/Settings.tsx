// Main container that holds both UI components

import { X } from "lucide-react";
import { useRef, useEffect } from "react";
import type { TimerSettings } from "../../types/timer";
import { useSettings } from "../../hooks/useSettings";
import { Button } from "../Shared/Button";
import { DurationSettings } from "./DurationSettings";
import { SoundSettings } from "./SoundSettings";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

export const Settings = ({ isOpen, onClose, currentSettings, onSave }: SettingsProps) => {
  const { duration, sound, reset, save } = useSettings(currentSettings);
  const stopPreviewRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) {
      stopPreviewRef.current?.();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    stopPreviewRef.current?.();
    onClose();
  };

  const handleSave = () => {
    stopPreviewRef.current?.();
    save(onSave, currentSettings.sessionsBeforeLongBreak);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-lg p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-widest">TIMER SETTINGS</h2>
          <button onClick={handleClose} className="p-2 text-[var(--color-fg)] hover:text-[var(--color-border)] transition-colors" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <DurationSettings duration={duration} />
          <div className="border-t border-[var(--color-border)] opacity-30" />
          <SoundSettings sound={sound} onStopPreview={(stop) => (stopPreviewRef.current = stop)} />
        </div>

        <div className="flex gap-3 sm:gap-4 mt-8">
          <Button onClick={reset} variant="inactive" className="flex-1">RESET</Button>
          <Button onClick={handleSave} variant="active" className="flex-1">SAVE</Button>
        </div>
      </div>
    </div>
  );
};