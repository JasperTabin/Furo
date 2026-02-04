import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { usePageLoadAnimation } from "./hooks/usePageLoadAnimation";
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
      {!isFullscreen && (
        <div ref={headerRef} className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold tracking-widest">FURŌ</h1>
          <p className="mt-1 text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
            FLOW
          </p>
        </div>
      )}

      {!isFullscreen && (
        <div ref={themeToggleRef} className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
      )}

      <div className="flex flex-col items-center gap-24">
        {!isFullscreen && (
          <div ref={settingsRef} className="z-50">
            <Settings onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div className="relative flex flex-col items-center gap-20">
          <div ref={timerRef}>
            <Timer
              status={status}
              timeLeft={timeLeft}
              totalTime={totalTime}
              isFullscreen={isFullscreen}
            />
          </div>

          {isFullscreen ? (
            <div
              className="relative"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-32" />

              <div
                className={`z-50 transition-opacity duration-500 ease-in-out ${
                  !showControls ? "opacity-0" : "opacity-100"
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
            </div>
          ) : (
            <div ref={controlsRef} className="z-50">
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
      </div>

      {!isFullscreen && (
        <div
          ref={footerRef}
          className="absolute bottom-8 flex items-center gap-2 text-xs tracking-wide"
        >
          <Copyright size={10} />
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
