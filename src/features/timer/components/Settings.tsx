// SETTINGS UI COMPONENTS ONLY

import { X, AudioLines, Volume2, VolumeX, Settings as SettingsIcon } from "lucide-react";
import { SOUNDS, REPEAT_OPTIONS } from "../configs/constants";

// SETTINGS BUTTON
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

// DURATION INPUTS
export const DurationInputs = ({
  durations,
  onChange,
}: {
  durations: { work: number; break: number; long: number };
  onChange: (field: 'work' | 'break' | 'long', value: string) => void;
}) => {
  return (
    <div className="space-y-3">
      {/* ✅ Matches addedit.tsx section label style */}
      <h3 className="text-sm font-medium opacity-60">DURATIONS ( MINS )</h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          {/* ✅ Matches addedit.tsx label style */}
          <label className="block text-sm font-medium mb-2 opacity-60">FOCUS</label>
          <input
            type="number"
            min={0}
            max={999}
            value={durations.work}
            onChange={(e) => onChange('work', e.target.value)}
            className="input-base w-full text-center" // ✅ input-base instead of inline class
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">SHORT</label>
          <input
            type="number"
            min={0}
            max={999}
            value={durations.break}
            onChange={(e) => onChange('break', e.target.value)}
            className="input-base w-full text-center"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">LONG</label>
          <input
            type="number"
            min={0}
            max={999}
            value={durations.long}
            onChange={(e) => onChange('long', e.target.value)}
            className="input-base w-full text-center"
          />
        </div>
      </div>
    </div>
  );
};

// SOUND CONTROLS
export const SoundControls = ({
  sound,
  repeatCount,
  isMuted,
  soundError,
  onChange,
  onPreview,
}: {
  sound: string;
  repeatCount: number;
  isMuted: boolean;
  soundError: string | null;
  onChange: (field: 'sound' | 'repeat', value: string | number) => void;
  onPreview: () => void;
}) => {
  const previewDisabled = !sound || sound === "none" || isMuted;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium opacity-60">SOUND</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">ALERT SOUND</label>
          <select
            value={sound}
            onChange={(e) => onChange('sound', e.target.value)}
            className="input-base w-full" // ✅ input-base
            style={{ color: 'var(--color-fg)', backgroundColor: 'var(--color-bg)' }}
          >
            {SOUNDS.map((s) => (
              <option key={s.value} value={s.value}
                style={{ color: 'var(--color-fg)', backgroundColor: 'var(--color-bg)' }}
              >
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">REPEAT</label>
          <select
            value={repeatCount}
            onChange={(e) => onChange('repeat', parseInt(e.target.value))}
            className="input-base w-full" // ✅ input-base
            style={{ color: 'var(--color-fg)', backgroundColor: 'var(--color-bg)' }}
          >
            {REPEAT_OPTIONS.map((count) => (
              <option key={count} value={count}
                style={{ color: 'var(--color-fg)', backgroundColor: 'var(--color-bg)' }}
              >
                {count}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* ✅ btn-base btn-inactive instead of custom inline styles */}
      <button
        onClick={onPreview}
        disabled={previewDisabled}
        className="btn-base btn-inactive w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <AudioLines size={16} />
        <span className="text-sm">PREVIEW SOUND</span>
      </button>
      {soundError && (
        <p className="text-xs text-red-500 mt-2">{soundError}</p>
      )}
    </div>
  );
};

// VOLUME CONTROLS
export const VolumeControls = ({
  volume,
  isMuted,
  onChange,
}: {
  volume: number;
  isMuted: boolean;
  onChange: (field: 'volume' | 'mute', value: number | boolean) => void;
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium opacity-60">VOLUME</h3>
      <div className="flex items-center gap-3">
        {/* ✅ btn-base btn-inactive instead of custom inline styles */}
        <button
          onClick={() => onChange('mute', !isMuted)}
          className="btn-base btn-inactive p-2.5"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onChange('volume', parseInt(e.target.value))}
          disabled={isMuted}
          className="flex-1 h-2 rounded-lg bg-(--color-border) disabled:opacity-40"
        />
        <span className="text-sm opacity-60 w-14 text-right tabular-nums">
          {isMuted ? "Muted" : `${volume}%`}
        </span>
      </div>
    </div>
  );
};

// HEADER
export const SettingsHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-(--color-border)">
      <h2 className="text-xl font-semibold">SETTINGS</h2>
      {/* ✅ btn-base pattern for close button */}
      <button
        onClick={onClose}
        className="btn-base btn-inactive p-1"
        aria-label="Close settings"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// FOOTER
export const SettingsFooter = ({ onReset, onSave }: { onReset: () => void; onSave: () => void }) => {
  return (
    <div className="flex gap-3 px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-4 border-t border-(--color-border)">
      <button onClick={onReset} className="btn-base btn-inactive flex-1">
        RESET
      </button>
      <button onClick={onSave} className="btn-base btn-active flex-1">
        SAVE
      </button>
    </div>
  );
};
