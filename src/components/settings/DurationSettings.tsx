// UI for duration inputs

import type { useDurationSettings } from "../../hooks/useDuration";

const inputClass = "w-full px-3 sm:px-4 py-2 text-sm bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] rounded-md";

interface DurationInputProps {
  label: string;
  value: number;
  onChange: (val: string) => void;
  min: number;
  max: number;
}

const DurationInput = ({ label, value, onChange, min, max }: DurationInputProps) => (
  <div>
    <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
      {label}
    </label>
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </div>
);

interface DurationSettingsProps {
  duration: ReturnType<typeof useDurationSettings>;
}

export const DurationSettings = ({ duration }: DurationSettingsProps) => {
  const { values, update, LIMITS } = duration;

  return (
    <div className="space-y-5 sm:space-y-6">
      <DurationInput 
        label="FOCUS DURATION (1–120 min)" 
        value={values.workDuration} 
        onChange={(val) => update("workDuration", val)} 
        min={LIMITS.workDuration.min} 
        max={LIMITS.workDuration.max} 
      />
      <DurationInput 
        label="SHORT BREAK (1–30 min)" 
        value={values.breakDuration} 
        onChange={(val) => update("breakDuration", val)} 
        min={LIMITS.breakDuration.min} 
        max={LIMITS.breakDuration.max} 
      />
      <DurationInput 
        label="LONG BREAK (1–60 min)" 
        value={values.longBreakDuration} 
        onChange={(val) => update("longBreakDuration", val)} 
        min={LIMITS.longBreakDuration.min} 
        max={LIMITS.longBreakDuration.max} 
      />
    </div>
  );
};