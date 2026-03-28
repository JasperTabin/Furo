import { useState } from "react";
import { X, Minus, Plus, Settings } from "lucide-react";
import { DURATION_FIELDS } from "../configs/constants";
import { PALETTE_OPTIONS, useTheme } from "../../../shared/hooks/useTheme";
import type { PaletteOption, Palette } from "../../../shared/hooks/useTheme";

export const SettingsButton = ({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) => (
  <button
    onClick={onClick}
    className={`p-2 transition-opacity ${isOpen ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
    aria-label="Settings"
    title="Settings"
  >
    <Settings size={18} />
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
}) => {
  const { palette, setPalette } = useTheme();
  const [pendingPalette, setPendingPalette] = useState<Palette>(palette);

  const hasThemeChanges = pendingPalette !== palette;
  const anyChanges = hasChanges || hasThemeChanges;

  const handleSave = () => {
    if (hasThemeChanges) setPalette(pendingPalette);
    onSave();
  };

  const handleReset = () => {
    setPendingPalette(palette);
    onReset();
  };

  return (
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

      {/* Timer controls */}
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

      {/* Color Palette */}
      <div className="border-t border-(--color-border) pt-4 flex flex-col gap-3">
        <p className="text-sm font-semibold tracking-widest">COLOR PALETTE</p>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_OPTIONS.map((p: PaletteOption) => {
            const isActive = pendingPalette === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPendingPalette(p.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  isActive ? "border-(--color-fg)" : "border-transparent"
                }`}
                style={{ background: p.swatch }}
                aria-label={p.label}
              >
                <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ background: p.light }}
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ background: p.dark }}
                  />
                </div>
                <p
                  className="text-center text-xs font-bold tracking-widest pb-3 uppercase"
                  style={{ color: "#ffffff88" }}
                >
                  {p.label}
                </p>
                {isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="btn-base btn-inactive flex-1 text-sm tracking-widest"
        >
          RESET
        </button>
        <button
          onClick={handleSave}
          disabled={!anyChanges}
          className="btn-base btn-active flex-1 text-sm tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};
