import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Maximize,
  Minimize,
  Pause,
  Play,
  Square,
  Settings,
  X,
  Minus,
  Plus,
  Info,
} from "lucide-react";
import { useTimer } from "./useTimer";
import { useFullscreen } from "../../shared/hooks/useFullscreen";
import { useMiniPlayer } from "./useMiniPlayer";
import { MiniPlayerWindow } from "./MiniPlayer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "./useSettings";

import {
  formatTime,
  DURATION_FIELDS,
  type TimerMode,
  type TimerStatus,
} from "./timer";

// ============================================================================
// INLINE HOOK
// ============================================================================
const subscribeToViewport = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  window.addEventListener("fullscreenchange", onStoreChange);

  return () => {
    window.removeEventListener("resize", onStoreChange);
    window.removeEventListener("fullscreenchange", onStoreChange);
  };
};

const getViewportSnapshot = () =>
  Math.min(window.innerWidth, window.innerHeight);
const getServerSnapshot = () => 0;

const useFullscreenTimerSize = (isFullscreen: boolean) => {
  const viewport = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getServerSnapshot,
  );

  if (!isFullscreen) return undefined;

  return Math.max(96, Math.min(viewport * 0.34, 480));
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
const ModeSwitcher = ({
  onSwitchMode,
  currentMode,
}: {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}) => {
  return (
    <Tabs
      value={currentMode}
      onValueChange={(v: string) => onSwitchMode(v as TimerMode)}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="focus">Pomodoro</TabsTrigger>
        <TabsTrigger value="shortbreak">Short Break</TabsTrigger>
        <TabsTrigger value="longBreak">Long Break</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const Timer = ({
  timeLeft,
  isFullscreen,
  fontSize,
  className = "",
}: {
  timeLeft: number;
  isFullscreen: boolean;
  fontSize?: number;
  className?: string;
}) => {
  const timeClasses = isFullscreen ? "" : "text-[clamp(3.75rem,18vw,7rem)]";

  return (
    <div
      className={`${timeClasses} ${className} w-full max-w-full text-center font-bold tracking-tight leading-none whitespace-nowrap select-none transition-all duration-700`.trim()}
      style={
        isFullscreen && fontSize ? { fontSize: `${fontSize}px` } : undefined
      }
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {formatTime(timeLeft)}
    </div>
  );
};

const TimerControls = ({
  status,
  onStart,
  onPause,
  onReset,
  onSettingsClick,
  onFullscreenClick,
  isSettingsOpen,
  isFullscreen,
}: {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettingsClick: () => void;
  onFullscreenClick: () => void;
  isSettingsOpen: boolean;
  isFullscreen: boolean;
}) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-4">
      {!isFullscreen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick}
              aria-label="Settings"
              className={
                isSettingsOpen
                  ? "bg-(--color-fg)/8 text-(--color-fg) h-10 w-10"
                  : "text-(--color-fg)/60 h-10 w-10"
              }
            >
              <Settings size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      )}

      {isIdle ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onStart}
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full"
              aria-label="Start timer"
            >
              <Play size={20} fill="currentColor" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start</TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={isRunning ? onPause : onStart}
                variant={isRunning ? "default" : "outline"}
                size="icon"
                className="h-12 w-12 rounded-full"
                aria-label={isRunning ? "Pause timer" : "Resume timer"}
              >
                {isRunning ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRunning ? "Pause" : "Resume"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onReset}
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full"
                aria-label="Stop timer"
              >
                <Square size={20} fill="currentColor" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop</TooltipContent>
          </Tooltip>
        </div>
      )}

      {!isFullscreen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFullscreenClick}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className={
                isFullscreen
                  ? "bg-(--color-fg)/8 text-(--color-fg) h-10 w-10"
                  : "text-(--color-fg)/60 h-10 w-10"
              }
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

const SettingsPanel = ({
  getValue,
  onStep,
  onClose,
  onReset,
  onSave,
  hasChanges,
}: {
  getValue: (field: "work" | "break" | "long" | "sessions") => number;
  onStep: (
    field: "work" | "break" | "long" | "sessions",
    direction: "inc" | "dec",
  ) => void;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
  hasChanges: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <div className="space-y-3 px-4 pb-4 pt-4 sm:px-5">
        {[
          DURATION_FIELDS.filter((f) => f.field !== "sessions"),
          DURATION_FIELDS.filter((f) => f.field === "sessions"),
        ].map((section) => (
          <div key={section[0]?.field ?? "section"} className="space-y-2">
            <div className="space-y-2">
              {section.map(({ field, label }) => {
                const value = getValue(field);
                return (
                  <div
                    key={field}
                    className="flex items-center justify-between rounded-xl border border-(--color-border) bg-(--color-bg) px-3 py-2.5"
                  >
                    <span className="pr-3 text-sm font-medium text-(--color-fg)/82">
                      {label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        onClick={() => onStep(field, "dec")}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                        aria-label={`Decrease ${label}`}
                      >
                        <Minus size={14} />
                      </Button>
                      <div className="min-w-[48px] text-center text-base font-semibold text-(--color-fg)">
                        {value}
                      </div>
                      <Button
                        onClick={() => onStep(field, "inc")}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                        aria-label={`Increase ${label}`}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className=" px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Button
            onClick={onReset}
            variant="outline"
            className="h-8 flex-1 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
          >
            Reset
          </Button>
          <Button
            onClick={onSave}
            disabled={!hasChanges}
            variant="default"
            className="h-8 w-8 rounded-xl bg-white p-0 text-black hover:bg-white/90"
            aria-label="Save settings"
          >
            <Check size={16} />
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
            aria-label="Close settings"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({
  isOpen,
  onClose,
  onSave,
  getValue,
  handleStep,
  hasChanges,
  resetToDefaults,
  saveCurrentSettings,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  getValue: (field: "work" | "break" | "long" | "sessions") => number;
  handleStep: (
    field: "work" | "break" | "long" | "sessions",
    direction: "inc" | "dec",
  ) => void;
  hasChanges: boolean;
  resetToDefaults: () => void;
  saveCurrentSettings: () => unknown;
}) => {
  const handleSave = () => {
    saveCurrentSettings();
    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:max-w-sm sm:rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <SettingsPanel
          getValue={getValue}
          onStep={handleStep}
          onClose={onClose}
          onReset={resetToDefaults}
          onSave={handleSave}
          hasChanges={hasChanges}
        />
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const TimerPanel = () => {
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(fullscreenRef);
  const fullscreenFontSize = useFullscreenTimerSize(isFullscreen);
  const {
    openMiniPlayer,
    closeMiniPlayer,
    popupContainer,
    isOpen,
    isSupported,
  } = useMiniPlayer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReversed, setIsReversed] = useState(false);

  const {
    settings,
    getValue,
    handleStep,
    hasChanges,
    resetToDefaults,
    saveCurrentSettings,
  } = useSettings();

  const {
    mode,
    status,
    timeLeft,
    sessionsCompleted,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(settings);

  const setReverseMode = (nextReversed: boolean) => {
    setIsReversed(nextReversed);
    switchMode(nextReversed ? "infinite" : "focus");
  };

  const handleMiniPlayerToggle = (checked: boolean) => {
    if (checked) {
      openMiniPlayer();
    } else {
      closeMiniPlayer();
    }
  };

  const handleSettingsSave = () => {
    if (status === "idle") {
      reset();
    }
  };

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      setIsSettingsOpen(false);
    }
    toggleFullscreen();
  };

  if (isFullscreen) {
    return (
      <div
        ref={fullscreenRef}
        className="flex h-full w-full flex-col items-center justify-center gap-6 bg-(--color-bg) px-4 py-6 text-(--color-fg) sm:gap-6 sm:px-6"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium tracking-widest text-(--color-fg)/60 uppercase">
            {mode === "focus"
              ? "Focus"
              : mode === "shortbreak"
                ? "Short Break"
                : mode === "longBreak"
                  ? "Long Break"
                  : "Infinite"}
          </div>
          <Timer
            timeLeft={timeLeft}
            isFullscreen
            fontSize={fullscreenFontSize}
          />
          {!isReversed && mode !== "infinite" && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: settings.sessionsUntilLongBreak }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        i <
                        settings.sessionsUntilLongBreak -
                          (sessionsCompleted % settings.sessionsUntilLongBreak)
                          ? "var(--color-fg)"
                          : "transparent",
                      border: "2px solid var(--color-fg)",
                    }}
                  />
                ),
              )}
            </div>
          )}
        </div>
        <TimerControls
          status={status}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onFullscreenClick={handleToggleFullscreen}
          isSettingsOpen={isSettingsOpen}
          isFullscreen={isFullscreen}
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={fullscreenRef}
        className="flex w-full min-w-0 flex-col gap-10 px-4 py-4 sm:px-5 sm:py-5"
      >
        <div className="flex flex-col gap-2 items-center w-full max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-(--color-border)/55 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-(--color-fg)/70">
                {isReversed ? "Reverse" : "Classic"}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info size={14} className="text-(--color-fg)/40" />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-xs bg-(--color-bg) border border-(--color-border) text-gray-100"
                >
                  {isReversed
                    ? "Work as long as you want with a stopwatch."
                    : "Pomodoro technique with timed focus sessions."}
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              checked={isReversed}
              onCheckedChange={setReverseMode}
              aria-label="Toggle timer mode"
            />
          </div>

          {isSupported && (
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-(--color-border)/55 w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-(--color-fg)/70">
                  Mini Player
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <Info size={14} className="text-(--color-fg)/40" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-xs bg-(--color-bg) border border-(--color-border) text-gray-100"
                  >
                    Mini timer window that follows you around.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={isOpen}
                onCheckedChange={handleMiniPlayerToggle}
                aria-label="Toggle mini player"
              />
            </div>
          )}

          {!isReversed ? (
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          ) : (
            <div className="h-9" />
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium tracking-widest text-(--color-fg)/60 uppercase">
            {mode === "focus"
              ? "Focus"
              : mode === "shortbreak"
                ? "Short Break"
                : mode === "longBreak"
                  ? "Long Break"
                  : "Infinite"}
          </div>
          <Timer timeLeft={timeLeft} isFullscreen={false} />
          {!isReversed && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: settings.sessionsUntilLongBreak }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        i <
                        settings.sessionsUntilLongBreak -
                          (sessionsCompleted % settings.sessionsUntilLongBreak)
                          ? "var(--color-fg)"
                          : "transparent",
                      border: "2px solid var(--color-fg)",
                    }}
                  />
                ),
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <TimerControls
            status={status}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSettingsClick={() => setIsSettingsOpen(true)}
            onFullscreenClick={handleToggleFullscreen}
            isSettingsOpen={isSettingsOpen}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        getValue={getValue}
        handleStep={handleStep}
        hasChanges={hasChanges}
        resetToDefaults={resetToDefaults}
        saveCurrentSettings={saveCurrentSettings}
      />

      {popupContainer &&
        createPortal(
          <MiniPlayerWindow
            status={status}
            timeLeft={timeLeft}
            onStart={start}
            onPause={pause}
            onStop={reset}
            mode={mode}
            sessionsCompleted={sessionsCompleted}
            sessionsUntilLongBreak={settings.sessionsUntilLongBreak}
            isReversed={isReversed}
          />,
          popupContainer,
        )}
    </>
  );
};

export default TimerPanel;
