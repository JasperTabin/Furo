// Pop up modals

import { Check, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DURATION_FIELDS } from "./timer";

// ============================================================================
// Settings Panel
// ============================================================================
export const SettingsPanel = ({
  getValue,
  onStep,
  onClose,
  onReset,
  onSave,
  hasChanges,
}: {
  getValue: (field: "work" | "break" | "long" | "interval") => number;
  onStep: (
    field: "work" | "break" | "long" | "interval",
    direction: "inc" | "dec",
  ) => void;
  onClose: () => void;
  onReset: () => void;
  onSave: () => void;
  hasChanges: boolean;
}) => (
  <div className="flex flex-col">
    <div className="space-y-3 px-4 pb-4 pt-4 sm:px-5">
      {[
        DURATION_FIELDS.filter((f) => f.field !== "interval"),
        DURATION_FIELDS.filter((f) => f.field === "interval"),
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
                    <div className="min-w-12 text-center text-base font-semibold text-(--color-fg)">
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
      <p className="pb-3 text-center text-xs text-(--color-fg)/45">
        Changes apply when the current timer stops.
      </p>
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

// ============================================================================
// Settings Modal
// ============================================================================
export const SettingsModal = ({
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
  getValue: (field: "work" | "break" | "long" | "interval") => number;
  handleStep: (
    field: "work" | "break" | "long" | "interval",
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
// Task Modal
// ============================================================================
export const FocusTaskPickerModal = ({
  isOpen,
  tasks,
  onSelectTask,
  onStartWithoutTask,
  onClose,
}: {
  isOpen: boolean;
  tasks: Array<{
    id: string;
    text: string;
    status: "todo" | "doing";
  }>;
  onSelectTask: (taskId: string) => void;
  onStartWithoutTask: () => void;
  onClose: () => void;
}) => {
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doingTasks = tasks.filter((task) => task.status === "doing");
  const renderTaskList = (
    items: Array<{
      id: string;
      text: string;
      status: "todo" | "doing";
    }>,
    emptyLabel: string,
  ) =>
    items.length === 0 ? (
      <div className="rounded-xl border border-dashed border-(--color-border) px-3 py-5 text-center text-sm text-(--color-fg)/45">
        {emptyLabel}
      </div>
    ) : (
      <div className="space-y-2">
        {items.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelectTask(task.id)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-(--color-border) px-3 py-3 text-left transition-colors hover:bg-(--color-fg)/5"
          >
            <span className="min-w-0 truncate text-sm font-medium">
              {task.text}
            </span>
            <span className="shrink-0 rounded-full border border-(--color-border) px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-(--color-fg)/60">
              {task.status}
            </span>
          </button>
        ))}
      </div>
    );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:max-w-sm sm:rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Pick a task</DialogTitle>
        <div className="space-y-4 px-4 py-4 sm:px-5">
          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="todo">Todo ({todoTasks.length})</TabsTrigger>
              <TabsTrigger value="doing">
                Doing ({doingTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todo">
              {renderTaskList(todoTasks, "No Todo tasks available.")}
            </TabsContent>
            <TabsContent value="doing">
              {renderTaskList(doingTasks, "No Doing tasks available.")}
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onStartWithoutTask}
              className="h-8 flex-1 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
            >
              Start without task
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
              aria-label="Close task picker"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// Task Completion Modal
// ============================================================================
export const TaskCompletionModal = ({
  isOpen,
  onComplete,
  onKeepDoing,
}: {
  isOpen: boolean;
  onComplete: () => void;
  onKeepDoing: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onKeepDoing()}>
    <DialogContent
      className="border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:max-w-sm sm:rounded-2xl"
      aria-describedby={undefined}
    >
      <DialogTitle className="sr-only">Task completion checkpoint</DialogTitle>
      <div className="px-4 py-5 text-center sm:px-5">
        <p className="text-base font-semibold text-(--color-fg)">
          Is this task done?
        </p>
      </div>
      <div className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onKeepDoing}
            className="h-8 flex-1 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
          >
            Resume task
          </Button>
          <Button
            type="button"
            onClick={onComplete}
            className="h-8 flex-1 rounded-xl bg-(--color-fg) text-(--color-bg) hover:opacity-90"
          >
            Mark as done
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
