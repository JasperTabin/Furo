import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { usePageLoadAnimation } from "./hooks/usePageLoadAnimation";
import { Timer } from "./components/Timer";
import { TimerControls } from "./components/TimerControls";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { Settings } from "./components/Settings";
import { ThemeToggle } from "./components/ThemeToggle";
import { SettingsButton } from "./components/SettingsButton";
import { FullscreenMode } from "./components/FullscreenMode"; 
import { useTheme } from "./hooks/useTheme";
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

  const appRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const themeToggleRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const { mode, status, timeLeft, totalTime, start, pause, reset, switchMode } =
    useTimer(timerSettings);

  usePageLoadAnimation({
    appRef,
    headerRef,
    themeToggleRef,
    settingsRef,
    timerRef,
    controlsRef,
    footerRef,
  });

  useEffect(() => {
    if (settingsVersion > 0 && status === "idle") {
      reset();
    }
  }, [settingsVersion, status, reset]);

  const toggleFullscreen = () => {
    if (!isFullscreen && appRef.current) {
      appRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleSaveSettings = (newSettings: TimerSettings) => {
    localStorage.setItem("timerSettings", JSON.stringify(newSettings));
    setTimerSettings(newSettings);
    setSettingsVersion((prev) => prev + 1);
  };

  return (
    <div
      ref={appRef}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300 ${theme}`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
      }}
    >
      {/* Header */}
      <div ref={headerRef} className="absolute top-4 sm:top-8 left-4 sm:left-8 z-50">
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
        <p className="mt-1 text-xs font-semibold tracking-widest text-[var(--color-border)] opacity-60">
          FLOW
        </p>
      </div>

      {/* Top Right Controls */}
      <div
        ref={themeToggleRef}
        className="absolute top-4 sm:top-8 right-4 sm:right-8 flex items-center gap-2 z-50"
      >
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        <FullscreenMode onToggle={toggleFullscreen} isFullscreen={isFullscreen} />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20 lg:gap-24 w-full max-w-6xl">
        {/* ModeSwitcher - hidden in fullscreen */}
        {!isFullscreen && (
          <div ref={settingsRef} className="z-50 w-full">
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div className="relative flex flex-col items-center gap-12 sm:gap-16 md:gap-20 w-full">
          <div ref={timerRef} className="w-full">
            <Timer
              status={status}
              timeLeft={timeLeft}
              totalTime={totalTime}
              isFullscreen={isFullscreen}
            />
          </div>

          {/* Timer Controls - always visible */}
          <div ref={controlsRef} className="z-50 w-full">
            <TimerControls
              status={status}
              onStart={start}
              onPause={pause}
              onReset={reset}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="absolute bottom-4 sm:bottom-8 flex items-center gap-2 text-[10px] sm:text-xs tracking-wide"
      >
        <Copyright size={10} />
        2026 JasDev. All rights reserved.
      </div>

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
