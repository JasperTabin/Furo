// components/SettingsButton.tsx

import { Settings as SettingsIcon } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
  isOpen: boolean; // new prop to track if settings modal is open
}

const baseButtonClass =
  "flex-1 px-3 py-2 sm:py-3 text-xs sm:text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200 active:scale-95 flex items-center justify-center";

const inactiveClass =
  "bg-transparent text-[var(--color-fg)]/60 border-2 border-[var(--color-border)]/40 hover:text-[var(--color-fg)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5 hover:scale-105";

const activeClass =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-2 sm:border-4 border-[var(--color-fg)] outline outline-2 outline-[var(--color-fg)] outline-offset-2";

export const SettingsButton = ({ onClick, isOpen }: SettingsButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${baseButtonClass} ${isOpen ? activeClass : inactiveClass}`}
      aria-label="Open settings"
      title="Settings"
    >
      <SettingsIcon size={18} />
    </button>
  );
};
