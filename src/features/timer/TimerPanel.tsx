// UI

import { createPortal } from "react-dom";
import {
  Info,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  Square,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTimerPanel } from "./useTimerPanel";
import { formatTime, type TimerMode, type TimerStatus } from "./timer";
import {
  FocusTaskPickerModal,
  SettingsModal,
  TaskCompletionModal,
} from "./TimerModals";

// ============================================================================
// Modes
// ============================================================================
const ModeSwitcher = ({
  onSwitchMode,
  currentMode,
}: {
  onSwitchMode: (mode: TimerMode) => void;
  currentMode: TimerMode;
}) => (
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

// ============================================================================
// Timer display
// ============================================================================
const TimerDisplay = ({
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

// ============================================================================
// Timer Controls
// ============================================================================
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

// ============================================================================
// Classic or Reverse
// ============================================================================
const TimerModeCard = ({
  isReversed,
  onToggle,
}: {
  isReversed: boolean;
  onToggle: (checked: boolean) => void;
}) => (
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
            : "Pomodoro timer with automatic breaks and long break intervals."}
        </TooltipContent>
      </Tooltip>
    </div>
    <Switch
      checked={isReversed}
      onCheckedChange={onToggle}
      aria-label="Toggle timer mode"
    />
  </div>
);

// ============================================================================
// Mini player toggle
// ============================================================================
const MiniPlayerCard = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: (checked: boolean) => void;
}) => (
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
      onCheckedChange={onToggle}
      aria-label="Toggle mini player"
    />
  </div>
);

// ============================================================================
// Auto continue toggle
// ============================================================================
const AutoContinueCard = ({
  isEnabled,
  onToggle,
}: {
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-(--color-border)/55 w-full">
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-(--color-fg)/70">
        Auto Start
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
          Automatically starts the next work session after a break ends.
        </TooltipContent>
      </Tooltip>
    </div>
    <Switch
      checked={isEnabled}
      onCheckedChange={onToggle}
      aria-label="Toggle auto continue"
    />
  </div>
);

// ============================================================================
// Task Card
// ============================================================================
const FocusTaskCard = ({
  taskTitle,
  onClear,
}: {
  taskTitle?: string;
  onClear: () => void;
}) => {
  const hasTask = Boolean(taskTitle);

  return (
    <div className="group/focus-task w-full rounded-xl border border-(--color-border)/55 px-3 py-3">
      <div className="relative flex items-center justify-center">
        <p
          className={`truncate px-8 text-center text-sm font-medium text-(--color-fg) ${
            hasTask ? "" : "opacity-55"
          }`}
        >
          {hasTask ? taskTitle : "Choose a task to focus on"}
        </p>

        {hasTask && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-0 rounded-lg p-1.5 text-(--color-fg)/55 opacity-0 transition-colors hover:bg-(--color-fg)/8 hover:text-(--color-fg) group-hover/focus-task:opacity-100 group-focus-within/focus-task:opacity-100"
            aria-label="Clear active task"
            title="Clear active task"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Mini player window
// ============================================================================
const MiniPlayerWindow = ({
  status,
  timeLeft,
  onStart,
  onPause,
  onStop,
}: {
  status: TimerStatus;
  timeLeft: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 bg-(--color-bg) text-(--color-fg) overflow-hidden select-none">
      <div className="text-5xl font-bold tracking-tight leading-none">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center justify-center gap-2">
        {isIdle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onStart}
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full"
                aria-label="Start timer"
              >
                <Play size={16} fill="currentColor" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={isRunning ? onPause : onStart}
                  variant={isRunning ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label={isRunning ? "Pause timer" : "Resume timer"}
                >
                  {isRunning ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRunning ? "Pause" : "Resume"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onStop}
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label="Stop timer"
                >
                  <Square size={16} fill="currentColor" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Timer Panel
// ============================================================================
export const TimerPanel = () => {
  const {
    fullscreenRef,
    fullscreenFontSize,
    popupContainer,
    isOpen,
    isSupported,
    isSettingsOpen,
    setIsSettingsOpen,
    isTaskPickerOpen,
    setIsTaskPickerOpen,
    isCompletionPromptOpen,
    autoContinue,
    setAutoContinue,
    getValue,
    handleStep,
    hasChanges,
    resetToDefaults,
    saveCurrentSettings,
    mode,
    status,
    timeLeft,
    start,
    pause,
    reset,
    switchMode,
    isReversed,
    setReverseMode,
    handleMiniPlayerToggle,
    handleSettingsSave,
    handleToggleFullscreen,
    handleStart,
    handleClearFocusTask,
    handleKeepTaskInDoing,
    handleMarkTaskComplete,
    handleTaskSelection,
    handleStartWithoutTask,
    activeTodo,
    selectableTasks,
    isFullscreen,
  } = useTimerPanel();

  if (isFullscreen) {
    return (
      <div
        ref={fullscreenRef}
        className="flex h-full w-full flex-col items-center justify-center gap-6 bg-(--color-bg) px-4 py-6 text-(--color-fg) sm:gap-6 sm:px-6"
      >
        <TimerDisplay
          timeLeft={timeLeft}
          isFullscreen
          fontSize={fullscreenFontSize}
        />
        <TimerControls
          status={status}
          onStart={handleStart}
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
          <TimerModeCard isReversed={isReversed} onToggle={setReverseMode} />

          {isSupported && (
            <MiniPlayerCard isOpen={isOpen} onToggle={handleMiniPlayerToggle} />
          )}

          {!isReversed && (
            <AutoContinueCard
              isEnabled={autoContinue}
              onToggle={setAutoContinue}
            />
          )}

          {!isReversed ? (
            <ModeSwitcher onSwitchMode={switchMode} currentMode={mode} />
          ) : (
            <div className="h-9" />
          )}

          {!isReversed && (
            <FocusTaskCard
              taskTitle={activeTodo?.text}
              onClear={handleClearFocusTask}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <TimerDisplay timeLeft={timeLeft} isFullscreen={false} />
        </div>

        <div className="flex justify-center">
          <TimerControls
            status={status}
            onStart={handleStart}
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

      <FocusTaskPickerModal
        isOpen={isTaskPickerOpen}
        tasks={selectableTasks.map((task) => ({
          id: task.id,
          text: task.text,
          status: task.status,
        }))}
        onSelectTask={handleTaskSelection}
        onStartWithoutTask={handleStartWithoutTask}
        onClose={() => setIsTaskPickerOpen(false)}
      />

      <TaskCompletionModal
        isOpen={isCompletionPromptOpen}
        onComplete={handleMarkTaskComplete}
        onKeepDoing={handleKeepTaskInDoing}
      />

      {popupContainer &&
        createPortal(
          <MiniPlayerWindow
            status={status}
            timeLeft={timeLeft}
            onStart={start}
            onPause={pause}
            onStop={reset}
          />,
          popupContainer,
        )}
    </>
  );
};

export default TimerPanel;
