import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { useTimer } from "../hooks/useTimer";
import { Timer, ModeSwitcher, FullscreenMode, TimerControls } from "./Timer";
import { SettingsButton } from "./Settings";
import { SettingsModal } from "./SettingsView";
import { MiniPlayerButton, MiniPlayerWindow } from "./MiniPlayer";
import { loadSettings } from "../utils/settings";
import type { TimerSettings } from "../configs/types";

interface TimerViewProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  openMiniPlayer: () => void;
  closeMiniPlayer: () => void;
  isOpen: boolean;
  isSupported: boolean;
  popupContainer: HTMLElement | null;
}

export const TimerView = ({
  isFullscreen,
  toggleFullscreen,
  openMiniPlayer,
  closeMiniPlayer,
  isOpen,
  isSupported,
  popupContainer,
}: TimerViewProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(loadSettings());

  const { mode, status, timeLeft, start, pause, reset, switchMode } =
    useTimer(timerSettings);

  useEffect(() => {
    const handleStorageChange = () => setTimerSettings(loadSettings());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (status === "idle") switchMode(mode);
  }, [timerSettings, status, mode, switchMode]);

  const handleToggleReverse = () => {
    const next = !isReversed;
    setIsReversed(next);
    switchMode(next ? "infinite" : "focus");
  };

  const handleSaveSettings = () => {
    setTimerSettings(loadSettings());
    if (status === "idle") switchMode(mode);
    setIsSettingsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {!isFullscreen && (
          <div className="mb-8 flex flex-col items-center gap-4 mode-switcher">
            {/* Row 1: mode pills */}
            <ModeSwitcher
              onSwitchMode={switchMode}
              currentMode={mode}
              isReversed={isReversed}
            />

            {/* Row 2: reverse toggle + icons */}
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-bold tracking-wide transition-opacity ${isReversed ? "opacity-30" : "opacity-100"}`}
              >
                Classic
              </span>

              <button
                onClick={handleToggleReverse}
                role="switch"
                aria-checked={isReversed}
                className="relative w-10 h-5 rounded-full border border-(--color-border) transition-all duration-200 focus:outline-none"
                style={{
                  background: isReversed ? "var(--color-fg)" : "transparent",
                }}
              >
                <span
                  className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200"
                  style={{
                    left: isReversed ? "calc(100% - 18px)" : "2px",
                    background: isReversed
                      ? "var(--color-bg)"
                      : "var(--color-fg)",
                  }}
                />
              </button>

              <span
                className={`text-sm font-bold tracking-wide transition-opacity ${isReversed ? "opacity-100" : "opacity-30"}`}
              >
                Reverse
              </span>

              <SettingsButton
                onClick={() => setIsSettingsOpen(true)}
                isOpen={isSettingsOpen}
              />

              {/* Info */}
              <div
                className="relative"
                onMouseEnter={() => setIsInfoOpen(true)}
                onMouseLeave={() => setIsInfoOpen(false)}
              >
                <button
                  className={`p-2 transition-opacity ${isInfoOpen ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
                  aria-label="Info"
                  title="Info"
                >
                  <Info size={18} />
                </button>

                {isInfoOpen && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 card-base p-4 z-50">
                    <div className="flex flex-col gap-3 text-sm">
                      <div>
                        <span className="font-bold text-(--color-fg)">
                          Reverse Timer Mode:
                        </span>
                        {" "}
                        <span className="text-(--color-fg) opacity-60">
                          Work as long as you want and earn break time based on
                          your work duration. The longer you work, the more
                          break time you earn.
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-(--color-fg)">
                          Settings: 
                        </span>
                        {" "}
                        <span className="text-(--color-fg) opacity-60">
                          Set your preferred time for each mode in the classic
                          pomodoro.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isSupported && (
                <MiniPlayerButton
                  onClick={isOpen ? closeMiniPlayer : openMiniPlayer}
                  isOpen={isOpen}
                />
              )}

              <FullscreenMode
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
              />
            </div>
          </div>
        )}

        <div className="timer-display">
          <Timer timeLeft={timeLeft} isFullscreen={isFullscreen} />
        </div>

        {isFullscreen && (
          <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase opacity-20 select-none whitespace-nowrap">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-current font-mono">
              Esc
            </kbd>{" "}
            to exit fullscreen
          </p>
        )}

        <div className="mt-8 timer-controls">
          <TimerControls
            status={status}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      {popupContainer &&
        createPortal(
          <MiniPlayerWindow
            status={status}
            timeLeft={timeLeft}
            onStart={start}
            onPause={pause}
            onStop={reset}
          />,
          popupContainer,
        )}
    </>
  );
};
