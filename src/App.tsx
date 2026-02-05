import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { Timer } from "./components/timer/Timer";
import { TimerControls } from "./components/timer/TimerControls";
import { ModeSwitcher } from "./components/timer/ModeSwitcher";
import { Settings } from "./components/settings/Settings";
import { ThemeToggle } from "./components/theme/ThemeToggle";
import { SettingsButton } from "./components/settings/SettingsButton";
import { FullscreenMode } from "./components/fullscreen/FullscreenMode";
import { useTheme } from "./hooks/useTheme";
import { useAnimation } from "./hooks/useAnimation";
import { useFullscreen } from "./hooks/useFullscreen";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(loadSettings());
  const [settingsVersion, setSettingsVersion] = useState(0);

  const { theme } = useTheme();
  const { mode, status, timeLeft, start, pause, reset, switchMode } = useTimer(timerSettings);
  const { isFullscreen } = useFullscreen();

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

  const handleSaveSettings = (newSettings: TimerSettings) => {
    localStorage.setItem("timerSettings", JSON.stringify(newSettings));
    setTimerSettings(newSettings);
    setSettingsVersion((prev) => prev + 1);
  };

  return (
    <div
      ref={appRef}
      className={`flex flex-col transition-colors duration-500 ${theme} bg-(--color-bg) text-(--color-fg) ${
        isFullscreen
          ? "h-screen overflow-hidden" // fullscreen: lock viewport, no scroll
          : "min-h-screen p-6 sm:p-8"   // normal: allow growth + scroll
      }`}
    >
      {/* HEADER */}
      {!isFullscreen && (
        <header className="flex items-center justify-between w-full mb-auto">
          <div ref={headerTitleRef}>
            <h1 className="text-xl sm:text-2xl font-bold tracking-widest">FURŌ</h1>
            <p className="text-xs font-semibold tracking-widest text-(--color-border) opacity-60">
              FLOW
            </p>
          </div>
          <div ref={headerControlsRef}>
            <div ref={themeToggleRef}>
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      <main
        className={`flex flex-col items-center ${
          isFullscreen ? "h-screen justify-between py-12" : "flex-1 justify-center"
        }`}
      >
        {!isFullscreen && (
          <div ref={modeSwitcherRef} className="mb-6 sm:mb-12">
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}

        <div ref={timerRef}>
          <Timer timeLeft={timeLeft} />
        </div>

        <div
          ref={controlsRef}
          className={`flex items-center gap-3 ${
            isFullscreen ? "mt-0" : "mt-6 sm:mt-12"
          }`}
        >
          <TimerControls status={status} onStart={start} onPause={pause} onReset={reset} />
          <div className="w-px h-8 bg-(--color-border) opacity-30" />
          <SettingsButton onClick={() => setIsSettingsOpen(true)} isOpen={isSettingsOpen} />
          <FullscreenMode />
        </div>
      </main>

      {/* FOOTER */}
      {!isFullscreen && (
        <footer
          ref={footerRef}
          className="text-[10px] sm:text-xs tracking-wide flex items-center justify-center gap-2 mt-auto"
        >
          <Copyright size={12} />
          2026 JasDev. All rights reserved.
        </footer>
      )}

      {/* SETTINGS */}
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
