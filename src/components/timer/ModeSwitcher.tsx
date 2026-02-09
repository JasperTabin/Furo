// FOCUS | SHORT BREAK | LONG BREAK | INFINITE - Time Mode

import type { TimerMode } from "../../types/timer";
import { Button } from "../Shared/Button";

interface ModeSwitcherProps {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}

export const ModeSwitcher = ({
  onSwitchMode,
  currentMode,
}: ModeSwitcherProps) => {
  return (
    <div className="flex flex-row gap-4 sm:gap-4 items-center">
      <Button
        onClick={() => onSwitchMode("focus")}
        variant={currentMode === "focus" ? "active" : "inactive"}
        ariaLabel="Switch to focus mode"
      >
        FOCUS
      </Button>

      <Button
        onClick={() => onSwitchMode("shortbreak")}
        variant={currentMode === "shortbreak" ? "active" : "inactive"}
        ariaLabel="Switch to short break mode"
      >
        <span className="hidden sm:inline">SHORT BREAK</span>
        <span className="sm:hidden">SHORT</span>
      </Button>

      <Button
        onClick={() => onSwitchMode("longBreak")}
        variant={currentMode === "longBreak" ? "active" : "inactive"}
        ariaLabel="Switch to long break mode"
      >
        <span className="hidden sm:inline">LONG BREAK</span>
        <span className="sm:hidden">LONG</span>
      </Button>

      {/* Divider */}
      <div className="w-px h-8 bg-(--color-border) opacity-30 self-center" />

      <Button
        onClick={() => onSwitchMode("infinite")}
        variant={currentMode === "infinite" ? "active" : "inactive"}
        ariaLabel="Switch to infinite mode"
      >
        INFINITE
      </Button>
    </div>
  );
};
