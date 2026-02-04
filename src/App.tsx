import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { usePageLoadAnimation } from "./hooks/usePageLoadAnimation";
import { Timer } from "./components/Timer";
import { TimerControls } from "./components/TimerControls";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { Settings } from "./components/Settings";
import { ThemeToggle } from "./components/ThemeToggle";
import { SettingsButton } from "./components/SettingsButton";
import { FullscreenMode } from "./components/FullscreenMode"; // renamed
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

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function App() {
  /* ───────── State ───────── */
  const [isFullscreen, setIsFullscreen] = useState(false); // desktop fullscreen
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false); // iOS fallback
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(loadSettings());
  const [settingsVersion, setSettingsVersion] = useState(0);

  const isFullscreenActive = isFullscreen || isMobileFullscreen;

  /* ───────── Refs ───────── */
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

  /* ───────── Reset on settings change ───────── */
  useEffect(() => {
    if (settingsVersion > 0 && status === "idle") reset();
  }, [settingsVersion, status, reset]);

  /* ───────── Toggle Fullscreen ───────── */
  const toggleFullscreen = () => {
    if (isIOS()) {
      // iOS Safari doesn’t support Fullscreen API → fake fullscreen
      setIsMobileFullscreen((prev) => !prev);
      return;
    }

    if (!document.fullscreenElement && appRef.current) {
      appRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  /* ───────── Listen for Fullscreen changes ───────── */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* ───────── Save Settings ───────── */
  const handleSaveSettings = (newSettings: TimerSettings) => {
    localStorage.setItem("timerSettings", JSON.stringify(newSettings));
    setTimerSettings(newSettings);
    setSettingsVersion((prev) => prev + 1);
  };

  return (
    <div
      ref={appRef}
      className={`transition-all duration-300 ${
        isMobileFullscreen ? "fixed inset-0 z-50" : "relative min-h-screen"
      } w-full flex flex-col items-center justify-center p-4 sm:p-8 ${theme}`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
      }}
    >
      {/* Header */}
      <div ref={headerRef} className="absolute top-4 sm:top-8 left-4 sm:left-8 z-50">
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
        <p className="mt-1 text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
          FLOW
        </p>
      </div>

      {/* Top Right */}
      <div
        ref={themeToggleRef}
        className="absolute top-4 sm:top-8 right-4 sm:right-8 flex items-center gap-2 z-50"
      >
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        <FullscreenMode onToggle={toggleFullscreen} isFullscreen={isFullscreenActive} />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-12 sm:gap-16 w-full max-w-6xl">
        {/* Mode Switcher */}
        {!isFullscreenActive && (
          <div ref={settingsRef} className="z-50 w-full">
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div className="flex flex-col items-center gap-12 w-full">
          <div ref={timerRef} className="w-full">
            <Timer
              status={status}
              timeLeft={timeLeft}
              totalTime={totalTime}
              isFullscreen={isFullscreenActive}
            />
          </div>

          {/* Controls always visible */}
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

      {/* Settings */}
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
