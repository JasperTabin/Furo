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

  // Fix iOS Safari 100vh issue
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

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
      className={`relative w-full flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300 ${theme}`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
        minHeight: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      <div ref={headerRef} className="absolute top-4 sm:top-8 left-4 sm:left-8 z-50">
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
        <p className="mt-1 text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
          FLOW
        </p>
      </div>

      <div
        ref={themeToggleRef}
        className="absolute top-4 sm:top-8 right-4 sm:right-8 flex items-center gap-2 z-50"
      >
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        <FullscreenMode onToggle={toggleFullscreen} isFullscreen={isFullscreen} />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-6 sm:gap-12 md:gap-16 lg:gap-4 w-full max-w-6xl">
        {!isFullscreen && (
          <div ref={settingsRef} className="z-50 w-full">
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div className="relative flex flex-col items-center gap-8 sm:gap-12 md:gap-4 w-full">
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