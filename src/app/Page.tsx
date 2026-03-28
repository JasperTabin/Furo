import { TimerView } from "../features/timer/components/TimerView";
import { TodoView } from "../features/todo/components/TodoView";
import { CalendarView } from "../features/calendar/components/CalendarView";

export type AppView = "timer" | "todo" | "calendar";

interface ViewRendererProps {
  view: AppView;
}

export function ViewRenderer({ view }: ViewRendererProps) {
  if (view === "timer") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <TimerView />
      </div>
    );
  }

  if (view === "todo") {
    return (
      <div className="w-full px-4 pt-4 pb-4 flex flex-col overflow-y-hidden">
        <TodoView />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center sm:flex sm:justify-center">
      <CalendarView />
    </div>
  );
}
