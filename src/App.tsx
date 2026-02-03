import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
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
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = document.fullscreenElement !== null;
      setIsFullscreen(active);
      setShowControls(!active);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut, // ✅ use easing function instead of string
      },
    },
  };

  return (
    <motion.div
      ref={appRef}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center p-8 transition-colors duration-300 ${theme}`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-fg)",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header (non-fullscreen) */}
      {!isFullscreen && (
        <motion.div className="absolute top-8 left-8" variants={itemVariants}>
          <h1 className="text-2xl font-bold tracking-widest">FURŌ</h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-border">
            FLOW
          </p>
        </motion.div>
      )}

      {!isFullscreen && (
        <motion.div className="absolute top-8 right-8" variants={itemVariants}>
          <ThemeToggle />
        </motion.div>
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
      <motion.div
        className={`flex flex-col items-center transition-all duration-500 ${
          isFullscreen ? "gap-32" : "gap-16"
        }`}
        variants={containerVariants}
      >
        {/* Settings (hidden in fullscreen) */}
        {!isFullscreen && (
          <motion.div className="z-50" variants={itemVariants}>
            <Settings onSwitchMode={switchMode} currentMode={mode} />
          </motion.div>
        )}

        {/* Timer */}
        <motion.div variants={itemVariants}>
          <Timer
            status={status}
            timeLeft={timeLeft}
            totalTime={totalTime}
            isFullscreen={isFullscreen}
          />
        </motion.div>

        {/* Controls */}
        <AnimatePresence>
          <motion.div
            className={`z-50 ${
              isFullscreen && !showControls
                ? "opacity-0 scale-95 translate-y-4"
                : ""
            }`}
            variants={itemVariants}
            style={{
              transition: "opacity 0.3s, transform 0.3s",
            }}
          >
            <Controls
              status={status}
              onStart={start}
              onPause={pause}
              onReset={reset}
              onFullscreenChange={toggleFullscreen}
              onSettingsClick={() => setIsSettingsOpen(true)}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Footer (non-fullscreen) */}
      {!isFullscreen && (
        <motion.div
          className="absolute bottom-8 flex items-center gap-2 text-sm font-semibold tracking-widest"
          variants={itemVariants}
        >
          <Copyright size={12} />
          2026 JasDev. All rights reserved.
        </motion.div>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentSettings={timerSettings}
            onSave={handleSaveSettings}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
