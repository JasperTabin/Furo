// Orchestrator & controller

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useFullscreen } from "../../shared/hooks/useFullscreen";
import { todoStore } from "../todo/todo";
import { useMiniPlayer } from "./useMiniPlayer";
import { useSettings } from "./useSettings";
import { useTimer } from "./useTimer";

const getTimestamp = () => Date.now();

export type ActiveTimerKind = "classic" | "reverse";
export type ActiveTaskInterruptionReason =
  | "taskMovedToDone"
  | "taskMovedToTodo";

export interface StartRequest {
  id: number;
  kind: ActiveTimerKind;
  taskId: string | null;
}

interface InterruptionRequest {
  id: number;
  reason: ActiveTaskInterruptionReason;
}

interface ActiveTaskState {
  activeFocusTaskId: string | null;
  activeTimerKind: ActiveTimerKind;
  startRequest: StartRequest | null;
  interruptionRequest: InterruptionRequest | null;
}

type ActiveTaskListener = () => void;

let requestId = 0;

let activeTaskState: ActiveTaskState = {
  activeFocusTaskId: null,
  activeTimerKind: "classic",
  startRequest: null,
  interruptionRequest: null,
};

const activeTaskListeners = new Set<ActiveTaskListener>();

const emitActiveTaskChange = () => {
  activeTaskListeners.forEach((listener) => listener());
};

const setActiveTaskState = (patch: Partial<ActiveTaskState>) => {
  activeTaskState = { ...activeTaskState, ...patch };
  emitActiveTaskChange();
};

const createStartRequest = (
  kind: ActiveTimerKind,
  taskId: string | null = null,
): StartRequest => ({
  id: ++requestId,
  kind,
  taskId,
});

const createInterruptionRequest = (
  reason: ActiveTaskInterruptionReason,
): InterruptionRequest => ({
  id: ++requestId,
  reason,
});

export const activeTaskStore = {
  getSnapshot: () => activeTaskState,
  subscribe: (listener: ActiveTaskListener) => {
    activeTaskListeners.add(listener);
    return () => activeTaskListeners.delete(listener);
  },
  selectFocusTask: (taskId: string | null) => {
    setActiveTaskState({ activeFocusTaskId: taskId });
  },
  clearFocusTask: () => {
    setActiveTaskState({ activeFocusTaskId: null });
  },
  interruptActiveTask: (reason: ActiveTaskInterruptionReason) => {
    if (!activeTaskState.activeFocusTaskId) return;
    setActiveTaskState({
      activeFocusTaskId: null,
      interruptionRequest: createInterruptionRequest(reason),
    });
  },
  setTimerKind: (kind: ActiveTimerKind) => {
    setActiveTaskState({ activeTimerKind: kind });
  },
  startClassicFocus: (taskId?: string | null) => {
    const nextTaskId = taskId ?? activeTaskState.activeFocusTaskId ?? null;
    setActiveTaskState({
      activeFocusTaskId: nextTaskId,
      activeTimerKind: "classic",
      startRequest: createStartRequest("classic", nextTaskId),
    });
  },
  consumeStartRequest: (id: number) => {
    if (activeTaskState.startRequest?.id !== id) return;
    setActiveTaskState({ startRequest: null });
  },
  consumeInterruptionRequest: (id: number) => {
    if (activeTaskState.interruptionRequest?.id !== id) return;
    setActiveTaskState({ interruptionRequest: null });
  },
};

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

export const useTimerPanel = () => {
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
  const [isTaskPickerOpen, setIsTaskPickerOpen] = useState(false);
  const [isCompletionPromptOpen, setIsCompletionPromptOpen] = useState(false);
  // Not persisted — resets on reload intentionally.
  // Controls whether breaks auto-start the next session without user pressing start.
  const [autoContinue, setAutoContinue] = useState(false);
  const handledStartRequestRef = useRef<number | null>(null);
  const handledInterruptionRequestRef = useRef<number | null>(null);

  // Refs so onTimerComplete closure always reads the latest values
  // without stale closure issues.
  const autoContinueRef = useRef(autoContinue);
  useEffect(() => {
    autoContinueRef.current = autoContinue;
  }, [autoContinue]);

  const startRef = useRef<() => void>(() => {});

  const {
    settings,
    getValue,
    handleStep,
    hasChanges,
    resetToDefaults,
    saveCurrentSettings,
  } = useSettings();

  const todos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
  );
  const { activeFocusTaskId, startRequest, interruptionRequest } =
    useSyncExternalStore(
      activeTaskStore.subscribe,
      activeTaskStore.getSnapshot,
    );
  const activeTodo = activeFocusTaskId
    ? todos.find((todo) => todo.id === activeFocusTaskId)
    : undefined;

  const selectableTasks = todos.filter(
    (
      todo,
    ): todo is typeof todo & {
      status: "todo" | "doing";
    } => todo.status === "todo" || todo.status === "doing",
  );

  const {
    mode,
    status,
    timeLeft,
    resetPomodoroCount,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(settings, {
    onTimerComplete: ({ completedMode }) => {
      const autoStart = () => window.setTimeout(() => startRef.current(), 0);
      // Focus ended — write pomodoro stats to the active task silently.
      if (completedMode === "focus" && activeFocusTaskId) {
        const todo = todos.find((item) => item.id === activeFocusTaskId);
        if (todo && todo.status !== "done") {
          todoStore.update(activeFocusTaskId, {
            pomodoroCompleted: (todo.pomodoroCompleted ?? 0) + 1,
            totalFocusMinutes:
              (todo.totalFocusMinutes ?? 0) + settings.workDuration,
            lastFocusedAt: getTimestamp(),
          });
        }
      }

      // Focus ended → break ready (shortbreak or longBreak).
      // Short break ended → focus ready.
      // In both cases the timer has already transitioned to idle in the new mode.
      // If auto-continue is ON, start it immediately.
      if (completedMode === "focus" || completedMode === "shortbreak") {
        if (autoContinueRef.current) {
          autoStart();
        }
        return;
      }

      if (completedMode === "longBreak") {
        if (!activeFocusTaskId) {
          resetPomodoroCount();
          switchMode("focus");
          if (autoContinueRef.current) {
            autoStart();
          }
          return;
        }

        const todo = todos.find((item) => item.id === activeFocusTaskId);
        if (!todo || todo.status === "done") {
          resetPomodoroCount();
          switchMode("focus");
          return;
        }

        // Active task still in progress — show the popup.
        // Timer stays in longBreak idle until user answers.
        setIsCompletionPromptOpen(true);
      }
    },
  });

  const isReversed = mode === "infinite";

  // Keep startRef in sync so onTimerComplete always calls the latest start.
  useEffect(() => {
    startRef.current = start;
  }, [start]);

  // Called after the user answers the post-long-break popup.
  // Resets the interval counter and either auto-starts or leaves idle
  // depending on the toggle.
  const finishLongBreakFlow = useCallback(
    (autoStart: boolean) => {
      resetPomodoroCount();
      switchMode("focus");
      if (autoStart) {
        window.setTimeout(() => startRef.current(), 0);
      }
    },
    [resetPomodoroCount, switchMode],
  );

  const setReverseMode = (nextReversed: boolean) => {
    activeTaskStore.setTimerKind(nextReversed ? "reverse" : "classic");
    switchMode(nextReversed ? "infinite" : "focus");
  };

  const handleMiniPlayerToggle = (checked: boolean) => {
    if (checked) {
      openMiniPlayer();
      return;
    }
    closeMiniPlayer();
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

  const handleStart = () => {
    if (isReversed) {
      activeTaskStore.setTimerKind("reverse");
      start();
      return;
    }

    if (mode !== "focus") {
      activeTaskStore.setTimerKind("classic");
      start();
      return;
    }

    if (activeTodo?.status === "done") {
      activeTaskStore.clearFocusTask();
    }

    const currentTaskIsSelectable =
      activeTodo && activeTodo.status !== "done" ? activeTodo : undefined;

    if (!currentTaskIsSelectable && selectableTasks.length > 0) {
      setIsTaskPickerOpen(true);
      return;
    }

    activeTaskStore.setTimerKind("classic");
    start();
  };

  const handleClearFocusTask = () => {
    activeTaskStore.clearFocusTask();
    setIsCompletionPromptOpen(false);
    resetPomodoroCount();
    switchMode("focus");
  };

  // User answered "continue" on the post-long-break popup.
  const handleKeepTaskInDoing = () => {
    setIsCompletionPromptOpen(false);
    finishLongBreakFlow(autoContinue);
  };

  // User answered "mark done" on the post-long-break popup.
  // Always resets to fresh focus idle — never auto-starts a taskless session.
  const handleMarkTaskComplete = () => {
    if (activeFocusTaskId) {
      todoStore.update(activeFocusTaskId, {
        status: "done",
        lastFocusedAt: Date.now(),
      });
      activeTaskStore.clearFocusTask();
    }
    setIsCompletionPromptOpen(false);
    resetPomodoroCount();
    switchMode("focus");
  };

  const handleTaskSelection = (taskId: string) => {
    setIsTaskPickerOpen(false);
    activeTaskStore.startClassicFocus(taskId);
  };

  const handleStartWithoutTask = () => {
    setIsTaskPickerOpen(false);
    activeTaskStore.clearFocusTask();
    activeTaskStore.setTimerKind(isReversed ? "reverse" : "classic");
    start();
  };

  useEffect(() => {
    if (!startRequest || handledStartRequestRef.current === startRequest.id) {
      return;
    }

    handledStartRequestRef.current = startRequest.id;

    const requestedTodo = startRequest.taskId
      ? todos.find((todo) => todo.id === startRequest.taskId)
      : undefined;
    const nextTaskId =
      requestedTodo && requestedTodo.status !== "done"
        ? requestedTodo.id
        : null;
    const isDifferentTask =
      startRequest.kind === "classic" && nextTaskId !== activeFocusTaskId;

    if (isDifferentTask) {
      resetPomodoroCount();
    }

    activeTaskStore.selectFocusTask(nextTaskId);
    activeTaskStore.setTimerKind(startRequest.kind);

    if (nextTaskId) {
      todoStore.update(nextTaskId, {
        lastFocusedAt: Date.now(),
        ...(startRequest.kind === "classic" && requestedTodo?.status === "todo"
          ? { status: "doing" as const }
          : {}),
      });
    }

    if (startRequest.kind === "classic") {
      switchMode("focus");
    } else {
      switchMode("infinite");
    }

    start();
    activeTaskStore.consumeStartRequest(startRequest.id);
  }, [
    activeFocusTaskId,
    resetPomodoroCount,
    startRequest,
    start,
    switchMode,
    todos,
  ]);

  // Handles task interruptions — task moved to Done or Todo mid-cycle.
  // Closes any open modals, resets interval counter, goes to fresh focus idle.
  // For taskMovedToTodo: useTodo.updateTodo already wipes pomodoroCompleted,
  // totalFocusMinutes, and lastFocusedAt on the task object before emitting this.
  useEffect(() => {
    if (
      !interruptionRequest ||
      handledInterruptionRequestRef.current === interruptionRequest.id
    ) {
      return;
    }

    handledInterruptionRequestRef.current = interruptionRequest.id;
    const timeoutId = window.setTimeout(() => {
      setIsCompletionPromptOpen(false);
      setIsTaskPickerOpen(false);
      resetPomodoroCount();
      switchMode("focus");
      activeTaskStore.consumeInterruptionRequest(interruptionRequest.id);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [interruptionRequest, resetPomodoroCount, switchMode]);

  return {
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
    settings,
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
  };
};
