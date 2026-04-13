import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import type { Todo, TodoPriority, TodoStatus } from "./todo.types";
import { formatDate, isPastDue } from "./todo.utils";
import { usePagination } from "./useTodoPagination";
import { getTagChipClass } from "./tag-colors";

// ============================================================================
// KANBAN - COLUMN HEADER
// ============================================================================
export const ColumnHeader = ({
  title,
  count,
  onAdd,
}: {
  title: string;
  count: number;
  onAdd: () => void;
}) => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="badge-base">{count}</span>
        <button
          onClick={onAdd}
          className="rounded-lg p-1 transition-colors hover:bg-(--color-border)/30"
          aria-label={`Add to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
    <div className="h-px bg-(--color-border)/40" />
  </div>
);

// ============================================================================
// KANBAN - CARD
// ============================================================================
const PRIORITY_CONFIG: Record<TodoPriority, { accentClassName: string }> = {
  low: { accentClassName: "bg-sky-500" },
  medium: { accentClassName: "bg-amber-500" },
  high: { accentClassName: "bg-red-500" },
};

export const Card = ({
  todo,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
}: {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => {
  const priority = PRIORITY_CONFIG[todo.priority];
  const isOverdue = isPastDue(todo.dueDate, todo.status);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEdit(todo);
    }
    if (e.key === "Delete") {
      e.preventDefault();
      onDelete(todo.id);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
      onDragEnd={onDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${todo.text}, ${todo.priority} priority, status: ${todo.status}. Press Enter to edit, Delete to remove.`}
      className="card-base card-hover group cursor-grab active:cursor-grabbing p-4 todo-card focus:outline-none focus:ring-2 focus:ring-(--color-fg)/40"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`h-1 w-12 rounded-full ${priority.accentClassName}`} />
        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            className="rounded-lg p-1 transition-colors hover:bg-(--color-border)/30"
            aria-label="Edit task"
            tabIndex={-1}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            className="rounded-lg p-1 transition-colors hover:bg-(--color-border)/30"
            aria-label="Delete task"
            tabIndex={-1}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h4 className="mb-2 text-sm font-medium leading-relaxed">{todo.text}</h4>

      {todo.description && (
        <p className="mb-2 line-clamp-2 text-xs opacity-60">
          {todo.description}
        </p>
      )}

      {(todo.dueDate ||
        (todo.tags && todo.tags.length > 0) ||
        (todo.notes && todo.notes.trim())) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {todo.dueDate && (
            <span
              className={`badge-base flex items-center gap-1 ${
                isOverdue
                  ? "bg-red-500/20 text-red-400"
                  : "bg-(--color-border)/30"
              }`}
            >
              <Calendar size={10} />
              {formatDate(todo.dueDate)}
            </span>
          )}

          {/* ✅ Colored chips — color comes from the tag itself, no dot */}
          {todo.tags?.map((tag) => (
            <span
              key={tag.name}
              className={`badge-base border ${getTagChipClass(tag.color)}`}
            >
              #{tag.name}
            </span>
          ))}

          {todo.notes?.trim() && (
            <span className="badge-base flex items-center gap-1 bg-(--color-border)/30">
              <StickyNote size={10} />
              <span>notes</span>
            </span>
          )}
        </div>
      )}

      <Select
        value={todo.status}
        onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
        onClick={(e) => e.stopPropagation()}
        className="control-themed mt-3 w-full appearance-none py-1 pr-3 text-sm sm:hidden"
        hideIcon
        aria-label="Move task to column"
      >
        <option value="todo">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </Select>
    </div>
  );
};

// ============================================================================
// SHARED - PAGINATION
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
    <div className="flex items-center justify-center gap-2 pt-3 border-t border-(--color-border)/40">
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
// KANBAN - COLUMN
// ============================================================================
export const Column = ({
  title,
  totalCount,
  todos,
  isDragOver,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  title: string;
  totalCount: number;
  todos: Todo[];
  isDragOver: boolean;
  onAdd: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) => (
  <div className="w-full shrink-0 sm:w-auto sm:flex-1 flex flex-col overflow-hidden todo-column snap-start h-full">
    <div className="shrink-0 p-4">
      <ColumnHeader title={title} count={totalCount} onAdd={onAdd} />
    </div>
    <div className="no-scrollbar overflow-y-auto p-3 pt-0 flex-1 flex flex-col">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="region"
        aria-label={`${title} column`}
        className={`flex flex-1 flex-col rounded-xl transition-all ${
          isDragOver ? "border-(--color-border) bg-(--color-border)/10" : ""
        }`}
      >
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div
              className={`py-8 text-center rounded-xl border-2 border-dashed border-(--color-border) transition-all ${
                isDragOver ? "opacity-0" : "opacity-30"
              }`}
            >
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            todos.map((todo) => (
              <Card
                key={todo.id}
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// LIST VIEW
// ============================================================================
const NEXT_STATUS: Record<TodoStatus, TodoStatus> = {
  todo: "doing",
  doing: "done",
  done: "todo",
};

const STATUS_CONFIG: Record<
  TodoStatus,
  { label: string; tabActiveClassName: string; badgeClassName: string }
> = {
  todo: {
    label: "Todo",
    tabActiveClassName:
      "border-amber-500/20 bg-amber-500 text-[#2c1700] shadow-[0_10px_30px_rgba(245,158,11,0.26)]",
    badgeClassName: "border border-amber-500/30 bg-amber-500/18 text-amber-300",
  },
  doing: {
    label: "Doing",
    tabActiveClassName:
      "border-blue-500/70 bg-blue-500 text-[#051728] shadow-[0_10px_30px_rgba(59,130,246,0.26)]",
    badgeClassName: "border border-blue-500/30 bg-blue-500/18 text-blue-300",
  },
  done: {
    label: "Done",
    tabActiveClassName:
      "border-emerald-500/70 bg-emerald-500 text-[#041b10] shadow-[0_10px_30px_rgba(16,185,129,0.24)]",
    badgeClassName:
      "border border-emerald-500/30 bg-emerald-500/18 text-emerald-300",
  },
};

const ALL_TAB_ACTIVE_CLASS =
  "border-(--color-fg)/15 bg-(--color-fg) text-(--color-bg) shadow-[0_10px_30px_rgba(0,0,0,0.24)]";

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
  const status = STATUS_CONFIG[todo.status];
  const priority = PRIORITY_CONFIG[todo.priority];

  return (
    <div className="group flex items-center gap-2.5 rounded-xl border border-(--color-border)/60 bg-(--color-fg)/3 px-2.5 py-2 transition-colors hover:border-(--color-fg)/20 hover:bg-(--color-fg)/3">
      <div
        className={`h-9 w-0.75 shrink-0 self-stretch ${priority.accentClassName}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium text-(--color-fg) ${todo.status === "done" ? "line-through opacity-65" : ""}`}
        >
          {todo.text}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStatusChange(todo.id, NEXT_STATUS[todo.status]);
        }}
        title={`Move to ${STATUS_CONFIG[NEXT_STATUS[todo.status]].label}`}
        aria-label={`Status: ${status.label}. Click to move to ${STATUS_CONFIG[NEXT_STATUS[todo.status]].label}`}
        className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${status.badgeClassName}`}
      >
        {status.label}
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(todo);
          }}
          className="rounded-lg p-1.5 text-(--color-fg)/55 transition-colors hover:bg-blue-500/14 hover:text-blue-300"
          aria-label="Edit task"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="rounded-lg p-1.5 text-(--color-fg)/55 transition-colors hover:bg-red-500/14 hover:text-red-300"
          aria-label="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

type StatusFilter = "all" | TodoStatus;

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "Todo" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];

export const ListView = ({
  todos,
  todoCount,
  doingCount,
  doneCount,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  todos: Todo[];
  todoCount: number;
  doingCount: number;
  doneCount: number;
  onAdd: (status: TodoStatus) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}) => {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const counts: Record<StatusFilter, number> = {
    all: todos.length,
    todo: todoCount,
    doing: doingCount,
    done: doneCount,
  };

  const filtered =
    filter === "all" ? todos : todos.filter((t) => t.status === filter);

  const { paginatedItems, currentPage, totalPages, setPage } =
    usePagination(filtered);

  const handleFilterChange = (newFilter: StatusFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const addStatus: TodoStatus =
    filter === "all" ? "todo" : (filter as TodoStatus);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.key;
            const activeClassName =
              tab.key === "all"
                ? ALL_TAB_ACTIVE_CLASS
                : STATUS_CONFIG[tab.key as TodoStatus].tabActiveClassName;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleFilterChange(tab.key)}
                className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? activeClassName
                    : "border-(--color-border)/60 bg-transparent text-(--color-fg)/72 hover:border-(--color-fg)/20 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onAdd(addStatus)}
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
