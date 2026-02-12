// TIMER CONTAINER -  Container & orchestration logic

import { useState, useEffect } from "react";
import { useTimer } from "../hooks/useTimer";
import { Timer, ModeSwitcher, FullscreenMode, TimerControls } from "./Timer";
import { SettingsButton } from "./Settings";
import { SettingsModal } from "./SettingsView";
import { loadSettings } from "../utils/settings";
import type { TimerSettings } from "../configs/types";

interface TimerViewProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const TimerView = ({ isFullscreen, toggleFullscreen }: TimerViewProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(loadSettings());

  const { mode, status, timeLeft, start, pause, reset, switchMode } = useTimer(timerSettings);

  useEffect(() => {
    const handleStorageChange = () => {
      const newSettings = loadSettings();
      setTimerSettings(newSettings);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      switchMode(mode);
    }
  }, [timerSettings, status, mode, switchMode]);

  const handleSaveSettings = () => {
    const newSettings = loadSettings();
    setTimerSettings(newSettings);
    if (status === "idle") {
      switchMode(mode);
    }
    setIsSettingsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {!isFullscreen && (
          <div className="mb-8 mode-switcher">
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div className="timer-display">
          <Timer timeLeft={timeLeft} isFullscreen={isFullscreen} />
        </div>

        <div className="flex items-center gap-3 mt-8 timer-controls">
          <TimerControls
            status={status}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
          <div className="w-px h-8 bg-(--color-border) opacity-30" />
          <SettingsButton
            onClick={() => setIsSettingsOpen(true)}
            isOpen={isSettingsOpen}
          />
          <FullscreenMode
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </>
  );
};