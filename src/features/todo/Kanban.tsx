import { Calendar, Edit2, Play, Plus, StickyNote, Trash2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import type { Todo, TodoStatus } from "./todo";
import {
  formatDate,
  getPriorityAccentClass,
  getTagChipClass,
  isPastDue,
} from "./todo";

// ============================================================================
// Header
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
// Card
// ============================================================================
export const Card = ({
  todo,
  activeFocusTaskId,
  onEdit,
  onDelete,
  onStatusChange,
  onStartFocus,
  onDragStart,
  onDragEnd,
}: {
  todo: Todo;
  activeFocusTaskId: string | null;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onStartFocus: (todo: Todo) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => {
  const priorityAccentClass = getPriorityAccentClass(todo.priority);
  const isOverdue = isPastDue(todo.dueDate, todo.status);
  const isActive = todo.id === activeFocusTaskId;
  const canFocus = todo.status !== "done";

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
      className={`card-base card-hover group cursor-grab active:cursor-grabbing p-4 todo-card focus:outline-none focus:ring-2 focus:ring-(--color-fg)/40 ${
        isActive ? "border-(--color-fg)/35 bg-(--color-fg)/5" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`h-1 w-12 rounded-full ${priorityAccentClass}`} />
        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          {canFocus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartFocus(todo);
              }}
              className="rounded-lg p-1.5 text-(--color-fg)/55 transition-colors hover:bg-(--color-fg)/8 hover:text-(--color-fg)"
              aria-label={todo.status === "doing" ? "Resume Focus" : "Start Focus"}
              title={todo.status === "doing" ? "Resume Focus" : "Start Focus"}
              tabIndex={-1}
            >
              <Play size={13} fill="currentColor" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            className="rounded-lg p-1.5 text-(--color-fg)/55 transition-colors hover:bg-(--color-fg)/8 hover:text-(--color-fg)"
            aria-label="Edit task"
            tabIndex={-1}
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
            tabIndex={-1}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h4
        className={`mb-2 text-sm font-medium leading-relaxed ${
          todo.status === "done" ? "line-through opacity-65" : ""
        }`}
      >
        {todo.text}
      </h4>

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
                  ? "todo-badge-overdue"
                  : "bg-(--color-border)/30"
              }`}
            >
              <Calendar size={10} />
              {formatDate(todo.dueDate)}
            </span>
          )}

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
// Column
// ============================================================================
export const Column = ({
  title,
  totalCount,
  todos,
  activeFocusTaskId,
  isDragOver,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
  onStartFocus,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  title: string;
  totalCount: number;
  todos: Todo[];
  activeFocusTaskId: string | null;
  isDragOver: boolean;
  onAdd: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onStartFocus: (todo: Todo) => void;
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
                activeFocusTaskId={activeFocusTaskId}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onStartFocus={onStartFocus}
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
