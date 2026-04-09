import { KanbanPanel } from "../features/todo/KanbanPanel";

interface KanbanPageProps {
  onBack: () => void;
}

export function KanbanPage({ onBack }: KanbanPageProps) {
  return (
    <div className="h-dvh overflow-hidden bg-(--color-bg) text-(--color-fg)">
      <div className="relative flex h-full w-full flex-col overflow-y-hidden px-4 pt-4 pb-4">
        <KanbanPanel onClose={onBack} />
      </div>
    </div>
  );
}
