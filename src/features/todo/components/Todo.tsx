// TODO UI COMPONENTS - Original interface with accessibility fixes
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import type { Todo, TodoStatus } from "../types/todo";
import { formatDate, isPastDue } from "../utils/todoUtils";

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
  <div>
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-sm uppercase tracking-wider opacity-60">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="badge-base bg-(--color-border)/30">{count}</span>
        <button
          onClick={onAdd}
          className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
          aria-label={`Add to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
    <div className="h-px bg-(--color-border)/30" />
  </div>
);

// ============================================================================
// CARD
// ============================================================================
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
  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const priorityColor = priorityColors[todo.priority];
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
      <div className="flex items-center justify-between mb-3">
        <div className={`h-1 w-12 rounded-full ${priorityColor}`} />
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
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
            className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
            aria-label="Delete task"
            tabIndex={-1}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-medium leading-relaxed mb-2">{todo.text}</h4>

      {todo.description && (
        <p className="text-xs opacity-60 mb-2 line-clamp-2">
          {todo.description}
        </p>
      )}

      {(todo.dueDate ||
        (todo.tags && todo.tags.length > 0) ||
        (todo.notes && todo.notes.trim())) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
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
          {todo.tags &&
            todo.tags.length > 0 &&
            todo.tags.map((tag, index) => (
              <span key={index} className="badge-base bg-(--color-border)/30">
                #{tag}
              </span>
            ))}
          {todo.notes && todo.notes.trim() && (
            <span className="badge-base bg-(--color-border)/30 flex items-center gap-1">
              <StickyNote size={10} />
              <span>notes</span>
            </span>
          )}
        </div>
      )}

      {/* Mobile-only status dropdown — hidden on sm+ */}
      <select
        value={todo.status}
        onChange={(e) => onStatusChange(todo.id, e.target.value as TodoStatus)}
        onClick={(e) => e.stopPropagation()}
        className="mt-3 w-full input-base control-themed py-1 sm:hidden"
        aria-label="Move task to column"
      >
        <option value="todo">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
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
  totalCount,
  todos,
  currentPage,
  totalPages,
  isDragOver,
  onPageChange,
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
  currentPage: number;
  totalPages: number;
  isDragOver: boolean;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) => {
  return (
    <div
      className="w-full shrink-0 sm:w-auto sm:flex-1 flex flex-col border border-(--color-border) rounded-xl overflow-hidden todo-column snap-start"
    >
      <div className="p-4">
        <ColumnHeader title={title} count={totalCount} onAdd={onAdd} />
      </div>

      <div className="p-3">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          role="region"
          aria-label={`${title} column`}
          className={`flex flex-col rounded-xl transition-all ${
            todos.length === 0 ? "border-2 border-dashed" : ""
          } ${
            isDragOver
              ? "border-(--color-border) bg-(--color-border)/10"
              : todos.length === 0
              ? "border-(--color-border)/30"
              : ""
          }`}
        >
          <div className="space-y-3">
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
                  onStatusChange={onStatusChange}
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
    </div>
  );
};
