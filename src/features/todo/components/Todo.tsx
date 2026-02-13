// TODO UI COMPONENTS ONLY

import {
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  Calendar,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Todo, TodoStatus, TodoPriority } from "../types/todo";

// ============================================================================
// HELPERS
// ============================================================================

const PRIORITY_CLASSES: Record<TodoPriority, string> = {
  low: "badge-priority-low",
  medium: "badge-priority-medium",
  high: "badge-priority-high",
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const isPastDue = (
  dueDate: number | undefined,
  status: TodoStatus,
): boolean => {
  if (!dueDate || status === "done") return false;
  const dueDateObj = new Date(dueDate);
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  return dueDateObj < todayStart;
};

// ============================================================================
// COLUMN HEADER
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
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <h3 className="font-semibold text-sm uppercase tracking-wider opacity-60">
        {title}
      </h3>
      <span className="badge-base bg-(--color-border)/30">{count}</span>
    </div>
    <button
      onClick={onAdd}
      className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
      aria-label={`Add to ${title}`}
    >
      <Plus size={16} />
    </button>
  </div>
);

// ============================================================================
// CARD
// ============================================================================

export const Card = ({
  todo,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => {
  const priorityClass = PRIORITY_CLASSES[todo.priority];
  const isOverdue = isPastDue(todo.dueDate, todo.status);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
      onDragEnd={onDragEnd}
      className="card-base card-hover group p-4 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="opacity-0 group-hover:opacity-40 transition-opacity mt-1">
          <GripVertical size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">{todo.text}</p>
          {todo.description && (
            <p className="text-xs opacity-60 mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
            aria-label="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className={`badge-base ${priorityClass} flex items-center gap-1`}>
          <Flag size={10} />
          {todo.priority}
        </span>
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
      </div>
    </div>
  );
};

// ============================================================================
// PAGINATION
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
    <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-(--color-border)/30">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded hover:bg-(--color-border)/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="text-xs font-medium px-2">
        PAGE {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded hover:bg-(--color-border)/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ============================================================================
// COLUMN
// ============================================================================

export const Column = ({
  title,
  todos,
  currentPage,
  totalPages,
  isDragOver,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  title: string;
  todos: Todo[];
  currentPage: number;
  totalPages: number;
  isDragOver: boolean;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <ColumnHeader title={title} count={todos.length} onAdd={onAdd} />

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex-1 flex flex-col p-3 bg-(--color-bg) border-2 border-dashed rounded-xl transition-all ${
          isDragOver
            ? "border-(--color-border) bg-(--color-border)/10"
            : "border-(--color-border)/30"
        }`}
      >
        <div className="flex-1 overflow-y-auto space-y-3 min-h-125 max-h-125">
          {todos.length === 0 ? (
            <div className="text-center py-8 opacity-30">
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            todos.map((todo) => (
              <Card
                key={todo.id}
                todo={todo}
                onEdit={onEdit}
                onDelete={onDelete}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
