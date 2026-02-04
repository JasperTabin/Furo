// components/FocusToggle.tsx - Focus control button

import { Maximize, Minimize } from "lucide-react";

interface FocusToggleProps {
  onToggle: () => void;
  isFocusMode: boolean;
}

const iconButton =
  "p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors active:scale-95";

export const FocusToggle = ({
  onToggle,
  isFocusMode,
}: FocusToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={iconButton}
      aria-label={isFocusMode ? "Exit Focus" : "Enter Focus"}
      title={isFocusMode ? "Exit Focus" : "Enter Focus"}
    >
      {isFocusMode ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
};
