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
  const inputClass = "w-full px-3 py-2.5 text-center bg-(--color-bg) border border-(--color-border) rounded-lg focus:outline-none focus:border-(--color-border)/70";

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium opacity-60">DURATIONS ( MINS )</h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs opacity-70 mb-1.5">FOCUS</label>
          <input
            type="number"
            min={0}
            max={999}
            value={durations.work}
            onChange={(e) => onChange('work', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs opacity-70 mb-1.5">SHORT</label>
          <input
            type="number"
            min={0}
            max={999}
            value={durations.break}
            onChange={(e) => onChange('break', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs opacity-70 mb-1.5">LONG</label>
          <input
            type="number"
            min={0}
            max={999}
            value={durations.long}
            onChange={(e) => onChange('long', e.target.value)}
            className={inputClass}
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
  const inputClass = "w-full px-3 py-2.5 text-center bg-(--color-bg) border border-(--color-border) rounded-lg focus:outline-none focus:border-(--color-border)/70";
  const previewDisabled = !sound || sound === "none" || isMuted;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium opacity-60">SOUND</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs opacity-70 mb-1.5">ALERT SOUND</label>
          <select 
            value={sound} 
            onChange={(e) => onChange('sound', e.target.value)} 
            className={inputClass}
          >
            {SOUNDS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs opacity-70 mb-1.5">REPEAT</label>
          <select 
            value={repeatCount} 
            onChange={(e) => onChange('repeat', parseInt(e.target.value))} 
            className={inputClass}
          >
            {REPEAT_OPTIONS.map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={onPreview}
        disabled={previewDisabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-(--color-border) rounded-lg hover:bg-(--color-border)/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        <button
          onClick={() => onChange('mute', !isMuted)}
          className="p-2.5 border border-(--color-border) rounded-lg hover:bg-(--color-border)/20 transition-colors"
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
        <span className="text-sm opacity-70 w-14 text-right tabular-nums">
          {isMuted ? "Muted" : `${volume}%`}
        </span>
      </div>
    </div>
  );
};

// SETTINGS MODAL HEADER
export const SettingsHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-(--color-border)">
      <h2 className="text-xl font-semibold">SETTINGS</h2>
      <button onClick={onClose} className="p-2 rounded-lg hover:bg-(--color-border)/30 transition-colors">
        <X size={20} />
      </button>
    </div>
  );
};

// SETTINGS MODAL FOOTER
export const SettingsFooter = ({ onReset, onSave }: { onReset: () => void; onSave: () => void }) => {
  return (
    <div className="flex gap-3 px-6 py-4 border-t border-(--color-border)">
      <button onClick={onReset} className="btn-base btn-inactive flex-1">
        RESET
      </button>
      <button onClick={onSave} className="btn-base btn-active flex-1">
        SAVE
      </button>
    </div>
  );
};