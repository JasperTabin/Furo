// components/SettingsButton.tsx - Settings control button

import { Settings as SettingsIcon } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
}

const iconButton =
  "p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors active:scale-95";

export const SettingsButton = ({ onClick }: SettingsButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={iconButton}
      aria-label="Open settings"
      title="Settings"
    >
      <SettingsIcon size={20} />
    </button>
  );
};