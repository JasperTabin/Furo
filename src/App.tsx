import { useState, useEffect } from "react";
import { useTimer } from "./features/timer/hooks/useTimer";
import { useFullscreen } from "./features/timer/hooks/useFullscreen";
import { useGSAPAnimation } from "./hooks/useGSAPAnimation";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

import { TimerPanel, ModeSwitcher, FullscreenMode, TimerControls } from "./features/timer/components/TimerPanel";

import { TodoList } from "./features/todo/components/TodoList";

import { Settings, SettingsButton } from "./features/timer/components/Settings";

import type { TimerSettings } from "./features/timer/types/timer";

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  volume: 50,
  isMuted: false,
  repeatCount: 1,
};

const loadSettings = (): TimerSettings => {
  const saved = localStorage.getItem("timerSettings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        volume: parsed.volume ?? DEFAULT_SETTINGS.volume,
        isMuted: parsed.isMuted ?? DEFAULT_SETTINGS.isMuted,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};

function App() {
  const [currentView, setCurrentView] = useState<"timer" | "todo">("timer");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [timerSettings, setTimerSettings] = useState<TimerSettings>(loadSettings());

  const { mode, status, timeLeft, start, pause, reset, switchMode } = useTimer(timerSettings);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { timerContainerRef, todoContainerRef } = useGSAPAnimation(currentView);

  useEffect(() => {
    const handleStorageChange = () => {
      const newSettings = loadSettings();
      setTimerSettings(newSettings);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);



  return (
    <div
      className={`h-dvh overflow-hidden flex flex-col transition-colors duration-500 bg-(--color-bg) text-(--color-fg) ${
        isFullscreen ? "" : "p-6 sm:p-8"
      }`}
    >
      {!isFullscreen && (
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
        />
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
              <TimerPanel
                timeLeft={timeLeft}
              />
            </div>

            <div className="flex items-center gap-3 mt-8 timer-controls">
              <TimerControls status={status} onStart={start} onPause={pause} onReset={reset} />
              <div className="w-px h-8 bg-(--color-border) opacity-30" />
              <SettingsButton onClick={() => setIsSettingsOpen(true)} isOpen={isSettingsOpen} />
              <FullscreenMode isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />
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
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSettingsChange={() => {
            const newSettings = loadSettings();
            setTimerSettings(newSettings);
            if (status === "idle") {
              switchMode(mode);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
