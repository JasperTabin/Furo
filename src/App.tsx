import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { Timer } from "./components/Timer";
import { TimerControls } from "./components/TimerControls";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { Settings } from "./components/Settings";
import { ThemeToggle } from "./components/ThemeToggle";
import { SettingsButton } from "./components/SettingsButton";
import { FullscreenMode } from "./components/FullscreenMode";
import { useTheme } from "./hooks/useTheme";
import { useAnimation } from "./hooks/useAnimation";
import { Copyright } from "lucide-react";
import type { TimerSettings } from "./types/timer";

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const loadSettings = (): TimerSettings => {
  const saved = localStorage.getItem("timerSettings");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(loadSettings());
  const [settingsVersion, setSettingsVersion] = useState(0);

  const { theme } = useTheme();
  const { mode, status, timeLeft, start, pause, reset, switchMode } = useTimer(timerSettings);

  // Animation refs
  const appRef = useRef<HTMLDivElement>(null);
  const headerTitleRef = useRef<HTMLDivElement>(null);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  const themeToggleRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const modeSwitcherRef = useRef<HTMLDivElement>(null);

  useAnimation({
    appRef,
    headerTitleRef,
    headerControlsRef,
    themeToggleRef,
    settingsRef,
    timerRef,
    controlsRef,
    footerRef,
    modeSwitcherRef,
  });

  useEffect(() => {
    if (settingsVersion > 0 && status === "idle") {
      reset();
    }
  }, [settingsVersion, status, reset]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleSaveSettings = (newSettings: TimerSettings) => {
    localStorage.setItem("timerSettings", JSON.stringify(newSettings));
    setTimerSettings(newSettings);
    setSettingsVersion((prev) => prev + 1);
  };

  return (
    <div
      ref={appRef}
      className={`min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 transition-colors duration-300 ${theme} bg-(--color-bg) text-(--color-fg)`}
    >
      {/* Header */}
      <header className="flex items-center justify-between w-full mb-6">
        <div ref={headerTitleRef}>
          <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
          <p className="text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
            FLOW
          </p>
        </div>
        <div ref={headerControlsRef} className="flex items-center gap-2">
          <div ref={themeToggleRef}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Centered Content */}
      <main className="flex flex-col items-center">
        {!isFullscreen && (
          <div ref={modeSwitcherRef}>
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div ref={timerRef}>
          <Timer timeLeft={timeLeft} isFullscreen={isFullscreen} />
        </div>

        {/* Controls + Utility Buttons together */}
        <div
          ref={controlsRef}
          className="flex flex-row gap-2"
        >
          <TimerControls status={status} onStart={start} onPause={pause} onReset={reset} />

          <div className="flex flex-row gap-2">
            <SettingsButton
              onClick={() => setIsSettingsOpen(true)}
              isOpen={isSettingsOpen}
            />
            <FullscreenMode
              onToggle={toggleFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="text-[10px] sm:text-xs tracking-wide flex items-center gap-2"
      >
        <Copyright size={12} />
        2026 JasDev. All rights reserved.
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentSettings={timerSettings}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}

export default App;
