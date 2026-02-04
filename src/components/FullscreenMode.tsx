// components/FullscreenMode.tsx - Fullscreen control button

import { Maximize, Minimize } from "lucide-react";

interface FullscreenModeProps {
  onToggle: () => void;
  isFullscreen: boolean; // renamed
}

const iconButton =
  "p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors active:scale-95";

export const FullscreenMode = ({
  onToggle,
  isFullscreen,
}: FullscreenModeProps) => {
  return (
    <button
      onClick={onToggle}
      className={iconButton}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </button>
  );
};
