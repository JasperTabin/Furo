// SETTINGS UI COMPONENTS ONLY

import { X, Minus, Plus, Settings as SettingsIcon } from "lucide-react";
import { DURATION_FIELDS } from "../configs/constants";

export const SettingsButton = ({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) => (
  <button
    onClick={onClick}
    className={`btn-base ${isOpen ? "btn-active" : "btn-inactive"}`}
    aria-label="Open settings"
    title="Open settings"
  >
    <SettingsIcon size={18} />
  </button>
);

export const SettingsPanel = ({
  getValue,
  onStep,
  onClose,
  onReset,
  onSave,
  hasChanges,
}: {
  getValue: (field: "work" | "break" | "long") => number;
  onStep: (field: "work" | "break" | "long", direction: "inc" | "dec") => void;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
  hasChanges: boolean;
}) => (
  <div className="flex flex-col px-6 py-5 gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold tracking-widest">SETTINGS</h2>
      <button
        onClick={onClose}
        className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
        aria-label="Close settings"
      >
        <X size={18} />
      </button>
    </div>

    {/* Content */}
    <div className="overflow-y-auto flex-1 min-h-0">
      {DURATION_FIELDS.map(({ field, label, min, max }) => {
        const value = getValue(field);
        return (
          <div key={field} className="py-4">
            <p className="text-sm font-semibold mb-3">{label}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onStep(field, "dec")}
                disabled={value <= min}
                className="flex items-center justify-center w-8 h-8 border border-(--color-border) hover:bg-(--color-border)/30 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label={`Decrease ${label}`}
              >
                <Minus size={14} />
              </button>

              <div className="input-base flex-1 flex items-center justify-center px-4 py-3 select-none">
                <span className="text-lg font-semibold">{value}</span>
              </div>

              <button
                onClick={() => onStep(field, "inc")}
                disabled={value >= max}
                className="flex items-center justify-center w-8 h-8 border border-(--color-border) hover:bg-(--color-border)/30 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label={`Increase ${label}`}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex justify-between mt-2 text-xs opacity-30">
              <span>Min: {min}</span>
              <span>Max: {max}</span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Footer */}
    <div className="flex gap-3">
      <button
        onClick={onReset}
        className="btn-base btn-inactive flex-1 text-sm tracking-widest"
      >
        RESET
      </button>
      <button
        onClick={onSave}
        disabled={!hasChanges}
        className="btn-base btn-active flex-1 text-sm tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
      >
        SAVE
      </button>
    </div>
  </div>
);