// components/FullscreenMode.tsx

import { Maximize, Minimize } from "lucide-react";

interface FullscreenModeProps {
  onToggle: () => void;
  isFullscreen: boolean;
}

const baseButtonClass =
  "flex-1 px-3 py-2 sm:py-3 text-xs sm:text-sm tracking-widest font-semibold rounded-md border-2 transition-all duration-200 active:scale-95 flex items-center justify-center";

const inactiveClass =
  "bg-transparent text-[var(--color-fg)]/60 border-2 border-[var(--color-border)]/40 hover:text-[var(--color-fg)] hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)]/5 hover:scale-105";

const activeClass =
  "bg-[var(--color-fg)] text-[var(--color-bg)] border-2 sm:border-4 border-[var(--color-fg)] outline outline-2 outline-[var(--color-fg)] outline-offset-2";

export const FullscreenMode = ({ onToggle, isFullscreen }: FullscreenModeProps) => {
  return (
    <button
      onClick={onToggle}
      className={`${baseButtonClass} ${isFullscreen ? activeClass : inactiveClass}`}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  );
};
