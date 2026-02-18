// KANBAN DRAG HOOK - Handles drag and drop logic

import { useState, useRef, useCallback } from "react";
import type { Todo, TodoStatus } from "../types/todo";

export const useDrag = (onDrop: (todoId: string, newStatus: TodoStatus) => void) => {
  const [dragOverColumn, setDragOverColumn] = useState<TodoStatus | null>(null);
  const draggedTodo = useRef<Todo | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, todo: Todo) => {
    draggedTodo.current = todo;
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedTodo.current = null;
    setDragOverColumn(null);
  }, []);

  const createColumnHandlers = useCallback(
    (status: TodoStatus) => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverColumn(status);
      },
      onDragLeave: () => {
        setDragOverColumn(null);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (draggedTodo.current && draggedTodo.current.status !== status) {
          onDrop(draggedTodo.current.id, status);
        }
      },
    }),
    [onDrop]
  );

  return {
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    createColumnHandlers,
  };
};
