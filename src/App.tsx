import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { Timer } from "./components/Timer";
import { Controls } from "./components/Controls";
import { Settings } from "./components/Settings";
import { SettingsModal } from "./components/SettingsModal";
import { ThemeToggle } from "./components/ThemeToggle";
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
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(loadSettings());
  const [settingsVersion, setSettingsVersion] = useState(0);

  const hideTimeout = useRef<number | null>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const { mode, status, timeLeft, totalTime, start, pause, reset, switchMode } =
    useTimer(timerSettings);

  useEffect(() => {
    if (settingsVersion > 0 && status === "idle") {
      reset();
    }
  }, [settingsVersion, status, reset]);

  const scheduleHide = () => {
    if (!isFullscreen) return;

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    hideTimeout.current = window.setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && appRef.current) {
      appRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
      setShowControls(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);

      if (active) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
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
      className={`relative min-h-screen w-full flex flex-col items-center justify-center p-8 transition-colors duration-300 ${theme}`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
      }}
    >
      {/* Header */}
      {!isFullscreen && (
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold tracking-widest">FURŌ</h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-border">
            FLOW
          </p>
        </div>
      )}

      {!isFullscreen && (
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
      )}

      {/* Hover zone (fullscreen only) */}
      {isFullscreen && (
        <div
          className="absolute bottom-0 left-0 w-full h-24 z-50"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={scheduleHide}
        />
      )}

      {/* Main content */}
      <div
        className={`flex flex-col items-center transition-all duration-500 ${
          isFullscreen ? "gap-32" : "gap-16"
        }`}
      >
        {/* Settings */}
        {!isFullscreen && (
          <div className="z-50">
            <Settings onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        {/* Timer */}
        <div>
          <Timer
            status={status}
            timeLeft={timeLeft}
            totalTime={totalTime}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Controls */}
        {(showControls || !isFullscreen) && (
          <div
            className={`z-50 transition-opacity duration-300 ${
              isFullscreen && !showControls ? "opacity-0" : "opacity-100"
            }`}
          >
            <Controls
              status={status}
              onStart={start}
              onPause={pause}
              onReset={reset}
              onFullscreenChange={toggleFullscreen}
              onSettingsClick={() => setIsSettingsOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      {!isFullscreen && (
        <div className="absolute bottom-8 flex items-center gap-2 text-sm font-semibold tracking-widest">
          <Copyright size={12} />
          2026 JasDev. All rights reserved.
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
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
