// TODO UI COMPONENTS - Kanban Board

import { useState } from "react";
import { Plus, Trash2, GripVertical, Edit2, Calendar, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Todo, TodoStatus } from "../types/todo";

// COLUMN HEADER
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

// TODO CARD
export const TodoCard = ({
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
  const priorityClass = {
    low: "badge-priority-low",
    medium: "badge-priority-medium",
    high: "badge-priority-high",
  }[todo.priority];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const dueDateObj = todo.dueDate ? new Date(todo.dueDate) : null;
  const todayStart = dueDateObj ? new Date(new Date().setHours(0, 0, 0, 0)) : null;
  const isPastDue = dueDateObj && todayStart && dueDateObj < todayStart && todo.status !== "done";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
      onDragEnd={onDragEnd}
      className="card-base card-hover group p-4 cursor-grab active:cursor-grabbing"
    >
      {/* Header */}
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
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-3">
        <span className={`badge-base ${priorityClass} flex items-center gap-1`}>
          <Flag size={10} />
          {todo.priority}
        </span>
        {todo.dueDate && (
          <span
            className={`badge-base flex items-center gap-1 ${
              isPastDue
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

// COLUMN
export const Column = ({
  title,
  status,
  todos,
  currentPage,
  totalPages,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
  onDragEnd,
}: {
  title: string;
  status: TodoStatus;
  todos: Todo[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onDrop: (status: TodoStatus) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(status);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <ColumnHeader title={title} count={todos.length} onAdd={onAdd} />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col p-3 bg-(--color-bg) border-2 border-dashed rounded-xl transition-all ${
          isDragOver
            ? "border-(--color-border) bg-(--color-border)/10"
            : "border-(--color-border)/30"
        }`}
      >
        {/* ✅ Fixed height scrollable area */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[500px] max-h-[500px]">
          {todos.length === 0 ? (
            <div className="text-center py-8 opacity-30">
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoCard
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

        {/* ✅ New pagination design */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-(--color-border)/30">
            <button
              onClick={handlePrevPage}
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
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-(--color-border)/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// KANBAN BOARD
export const KanbanBoard = ({
  todoItems,
  inProgressItems,
  doneItems,
  todoPage,
  inProgressPage,
  donePage,
  todoTotalPages,
  inProgressTotalPages,
  doneTotalPages,
  onTodoPageChange,
  onInProgressPageChange,
  onDonePageChange,
  onAddToColumn,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
  onDragEnd,
}: {
  todoItems: Todo[];
  inProgressItems: Todo[];
  doneItems: Todo[];
  todoPage: number;
  inProgressPage: number;
  donePage: number;
  todoTotalPages: number;
  inProgressTotalPages: number;
  doneTotalPages: number;
  onTodoPageChange: (page: number) => void;
  onInProgressPageChange: (page: number) => void;
  onDonePageChange: (page: number) => void;
  onAddToColumn: (status: TodoStatus) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onDrop: (status: TodoStatus) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <Column
        title="To Do"
        status="todo"
        todos={todoItems}
        currentPage={todoPage}
        totalPages={todoTotalPages}
        onPageChange={onTodoPageChange}
        onAdd={() => onAddToColumn("todo")}
        onEdit={onEdit}
        onDelete={onDelete}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />

      <Column
        title="In Progress"
        status="in-progress"
        todos={inProgressItems}
        currentPage={inProgressPage}
        totalPages={inProgressTotalPages}
        onPageChange={onInProgressPageChange}
        onAdd={() => onAddToColumn("in-progress")}
        onEdit={onEdit}
        onDelete={onDelete}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />

      <Column
        title="Done"
        status="done"
        todos={doneItems}
        currentPage={donePage}
        totalPages={doneTotalPages}
        onPageChange={onDonePageChange}
        onAdd={() => onAddToColumn("done")}
        onEdit={onEdit}
        onDelete={onDelete}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </div>
  );
};