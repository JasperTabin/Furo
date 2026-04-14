import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import type { Todo, TodoStatus } from "./todo";
import { getPriorityAccentClass } from "./todo";
import { useTodoListView } from "./useTodo";

// ============================================================================
// Pagination
// ============================================================================

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded p-1 transition-colors hover:bg-(--color-border)/30 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="px-2 text-xs font-medium">
        PAGE {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded p-1 transition-colors hover:bg-(--color-border)/30 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ============================================================================
// ListCard
// ============================================================================

const BADGE_CLASS =
  "border border-(--color-border)/60 bg-transparent text-(--color-fg)/78 hover:border-(--color-fg)/25 hover:bg-(--color-fg)/5 hover:text-(--color-fg)";

export const ListCard = ({
  todo,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}) => {
  const isDone = todo.status === "done";

  return (
    <div
      className={`group/list-card flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-colors ${
        isDone
          ? "border-(--color-border)/30 bg-transparent opacity-70 hover:border-(--color-border)/45"
          : "border-(--color-border)/60 hover:border-(--color-fg)/20 hover:bg-(--color-fg)/3"
      }`}
    >
      <div
        className={`h-9 w-0.75 shrink-0 self-stretch ${getPriorityAccentClass(todo.priority)}`}
      />

      <p
        className={`min-w-0 flex-1 truncate text-sm font-medium text-(--color-fg) ${isDone ? "line-through opacity-75" : ""}`}
      >
        {todo.text}
      </p>

      <div className="flex shrink-0 items-center gap-1 opacity-0 pointer-events-none transition-opacity group-hover/list-card:opacity-100 group-hover/list-card:pointer-events-auto group-focus-within/list-card:opacity-100 group-focus-within/list-card:pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(todo);
          }}
          className="rounded-lg p-1.5 text-(--color-fg)/55 transition-colors hover:bg-(--color-fg)/8 hover:text-(--color-fg)"
          aria-label="Edit task"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="rounded-lg p-1.5 text-(--color-fg)/55 transition-colors hover:bg-(--color-fg)/8 hover:text-(--color-fg)"
          aria-label="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <Select
        value={todo.status}
        onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Change task status"
        className={`h-8 w-20 shrink-0 rounded-lg bg-(--color-bg) px-2.5 py-1 pr-7 text-[11px] font-medium text-(--color-fg) shadow-none ${BADGE_CLASS}`}
      >
        <option value="todo" className="bg-(--color-bg) text-(--color-fg)">
          Todo
        </option>
        <option value="doing" className="bg-(--color-bg) text-(--color-fg)">
          Doing
        </option>
        <option value="done" className="bg-(--color-bg) text-(--color-fg)">
          Done
        </option>
      </Select>
    </div>
  );
};

// ============================================================================
// ListView
// ============================================================================

const FILTER_TABS: { key: TodoStatus; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];

const TAB_ACTIVE_CLASS =
  "border-(--color-fg)/15 bg-(--color-fg) text-(--color-bg) shadow-[0_10px_30px_rgba(0,0,0,0.24)]";

export const ListView = ({
  todos,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  todos: Todo[];
  onAdd: (status: TodoStatus) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}) => {
  const {
    filter,
    counts,
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    handleFilterChange,
  } = useTodoListView(todos);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleFilterChange(tab.key)}
              className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                filter === tab.key
                  ? TAB_ACTIVE_CLASS
                  : "border-(--color-border)/60 bg-transparent text-(--color-fg)/72 hover:border-(--color-fg)/20 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
              }`}
            >
              {tab.label} ({counts[tab.key]})
            </button>
          ))}
        </div>
        <button
          onClick={() => onAdd(filter)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-(--color-fg) px-3 py-1.5 text-[11px] font-medium text-(--color-bg) transition-opacity hover:opacity-85"
          aria-label="Add task"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="space-y-1">
          {paginatedItems.length === 0 ? (
            <div className="py-12 text-center text-(--color-fg)/35">
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            paginatedItems.map((todo) => (
              <ListCard
                key={todo.id}
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </div>
        <div className="mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};
