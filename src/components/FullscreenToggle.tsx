// components/FullscreenToggle.tsx - Fullscreen control button

import { Maximize, Minimize } from "lucide-react";

interface FullscreenToggleProps {
  onToggle: () => void;
  isFullscreen: boolean;
}

const iconButton =
  "p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors active:scale-95";

export const FullscreenToggle = ({
  onToggle,
  isFullscreen,
}: FullscreenToggleProps) => {
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
