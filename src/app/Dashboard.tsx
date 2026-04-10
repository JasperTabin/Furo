// Renders the dashboard panels in a 2-column grid. Handles drag-and-drop reordering between panels.

import { type AppView } from "./panelConfig";
import { CalendarPanel } from "../features/calendar/CalendarPanel";
import TimerPanel from "../features/timer/TimerPanel";
import { MusicPlayerPanel } from "../features/music-player/MusicPlayerPanel";
import { CountdownPanel } from "../features/countdown/CountdownPanel";
import { TodoPanel } from "../features/todo/TodoPanel";
import { type DragEvent, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { GripHorizontal } from "lucide-react";

interface DashboardProps {
  panelOrder: AppView[];
  onReorderPanels: (from: AppView, to: AppView) => void;
}

export function Dashboard({ panelOrder, onReorderPanels }: DashboardProps) {
  const [draggedPanel, setDraggedPanel] = useState<AppView | null>(null);
  const [dragOverPanel, setDragOverPanel] = useState<AppView | null>(null);
  const isAppView = (value: string): value is AppView =>
    ["timer", "todo", "calendar", "music", "countdown", "kanban"].includes(
      value,
    );

  const allPanelItems: Partial<Record<AppView, { content: ReactNode }>> = {
    timer: { content: <TimerPanel /> },
    music: { content: <MusicPlayerPanel /> },
    countdown: { content: <CountdownPanel /> },
    calendar: { content: <CalendarPanel /> },
    todo: { content: <TodoPanel /> },
  };

  const panelItems = panelOrder
    .map((key) => {
      const panelConfig = allPanelItems[key];
      return panelConfig ? { key, ...panelConfig } : null;
    })
    .filter((item): item is { key: AppView; content: ReactNode } => !!item);
  const desktopColumns = panelItems.reduce(
    (columns, panel, index) => {
      const isLastOddItem =
        panelItems.length % 2 === 1 && index === panelItems.length - 1;
      const targetColumn = isLastOddItem ? 1 : index % 2;
      columns[targetColumn].push(panel);
      return columns;
    },
    [[], []] as Array<Array<{ key: AppView; content: ReactNode }>>,
  );

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    panel: AppView,
  ) => {
    setDraggedPanel(panel);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", panel);
  };

  const handleDrop = (
    target: AppView,
    source: AppView | null = draggedPanel,
  ) => {
    const droppedPanel = source;
    if (droppedPanel && droppedPanel !== target) {
      onReorderPanels(droppedPanel, target);
    }
    setDraggedPanel(null);
    setDragOverPanel(null);
  };

  const clearDragState = () => {
    setDraggedPanel(null);
    setDragOverPanel(null);
  };

  if (panelItems.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-32 select-none">
        <p className="text-sm font-medium tracking-widest uppercase text-(--color-fg)/20">
          No panels open
        </p>
      </div>
    );
  }

  const renderPanelCard = (panel: { key: AppView; content: ReactNode }) => (
    <div key={panel.key}>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragOverPanel(panel.key);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setDragOverPanel(panel.key);
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (nextTarget && event.currentTarget.contains(nextTarget)) return;
          setDragOverPanel((prev) => (prev === panel.key ? null : prev));
        }}
        onDrop={(event) => {
          event.preventDefault();
          const panelFromData = event.dataTransfer.getData("text/plain");
          const sourcePanel =
            draggedPanel ?? (isAppView(panelFromData) ? panelFromData : null);
          handleDrop(panel.key, sourcePanel);
        }}
        className={cn(
          "group overflow-hidden rounded-2xl border border-(--color-border)/40 bg-(--color-bg) flex flex-col transition-colors",
          panel.key !== "timer" && "px-5 py-5 sm:px-6 sm:py-6",
          dragOverPanel === panel.key && "border-(--color-fg)/60",
        )}
      >
        <div
          draggable
          onDragStart={(event) => handleDragStart(event, panel.key)}
          onDragEnd={clearDragState}
          className={cn(
            "flex mb-4 h-8 items-center justify-center cursor-grab active:cursor-grabbing select-none border-b border-transparent transition-colors group-hover:border-(--color-border)/50",
            panel.key !== "timer"
              ? "-mx-5 -mt-5 px-5 sm:-mx-6 sm:-mt-6 sm:px-6"
              : "px-5 sm:px-6",
          )}
        >
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg text-(--color-fg)/70 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <GripHorizontal size={14} />
          </span>
        </div>
        {panel.content}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
      <div className="hidden flex-col gap-4 sm:flex">
        {desktopColumns[0].map(renderPanelCard)}
      </div>
      <div className="hidden flex-col gap-4 sm:flex">
        {desktopColumns[1].map(renderPanelCard)}
      </div>
      <div className="flex flex-col gap-4 sm:hidden">
        {panelItems.map(renderPanelCard)}
      </div>
    </div>
  );
}
