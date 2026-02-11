import { useState, useEffect } from "react";
import { useTimer } from "./features/timer/hooks/useTimer";
import { useFullscreen } from "./features/timer/hooks/useFullscreen";
import { useSettings } from "./features/timer/hooks/useSettings";
import { useGSAPAnimation } from "./hooks/useGSAPAnimation";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

import {
  Timer,
  ModeSwitcher,
  FullscreenMode,
  TimerControls,
} from "./features/timer/components/TimerPanel";

import { TodoList } from "./features/todo/components/TodoList";

import {
  SettingsButton,
  SettingsHeader,
  SettingsFooter,
  DurationInputs,
  SoundControls,
  VolumeControls,
} from "./features/timer/components/Settings";

import { loadSettings } from "./features/timer/utils/settings";
import type { TimerSettings } from "./features/timer/configs/types";

function App() {
  const [currentView, setCurrentView] = useState<"timer" | "todo">("timer");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(loadSettings());

  const { mode, status, timeLeft, start, pause, reset, switchMode } =
    useTimer(timerSettings);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { timerContainerRef, todoContainerRef } = useGSAPAnimation(currentView);

  const {
    workDuration,
    breakDuration,
    longBreakDuration,
    sound,
    volume,
    isMuted,
    repeatCount,
    soundError,
    handleDurationChange,
    handleSoundChange,
    handleVolumeChange,
    previewSound,
    resetToDefaults,
    saveCurrentSettings,
    stopPreview,
  } = useSettings();

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

  function handleCloseSettings() {
    stopPreview();
    setIsSettingsOpen(false);
  }

  function handleSaveSettings() {
    saveCurrentSettings();
    const newSettings = loadSettings();
    setTimerSettings(newSettings);
    if (status === "idle") {
      switchMode(mode);
    }
    setIsSettingsOpen(false);
  }

  return (
    <div
      className={`h-dvh overflow-hidden flex flex-col transition-colors duration-500 bg-(--color-bg) text-(--color-fg) ${
        isFullscreen ? "" : "p-6 sm:p-8"
      }`}
    >
      {!isFullscreen && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}

      <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
        {currentView === "timer" ? (
          <div ref={timerContainerRef} className="flex flex-col items-center">
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
        ) : (
          <div ref={todoContainerRef} className="w-full px-4 py-8">
            <TodoList />
          </div>
        )}
      </main>

      {!isFullscreen && <Footer />}

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-(--color-bg)/30">
          <div className="w-full max-w-md bg-(--color-bg) border border-(--color-border) rounded-2xl shadow-2xl overflow-hidden">
            <SettingsHeader onClose={handleCloseSettings} />

            <div className="p-6 space-y-6">
              <DurationInputs
                durations={{
                  work: workDuration,
                  break: breakDuration,
                  long: longBreakDuration,
                }}
                onChange={handleDurationChange}
              />

              <SoundControls
                sound={sound}
                repeatCount={repeatCount}
                isMuted={isMuted}
                soundError={soundError}
                onChange={handleSoundChange}
                onPreview={previewSound}
              />

              <VolumeControls
                volume={volume}
                isMuted={isMuted}
                onChange={handleVolumeChange}
              />
            </div>

            <SettingsFooter
              onReset={resetToDefaults}
              onSave={handleSaveSettings}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
