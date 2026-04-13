import { useCallback, useState } from "react";
import type { Todo, TodoTag, TodoFormData, TodoStatus } from "./todo.types";

interface UseTodoEditorParams {
  addTodo: (
    text: string,
    description?: string,
    priority?: TodoFormData["priority"],
    dueDate?: number,
    status?: TodoStatus,
    tags?: TodoTag[],
    notes?: string,
  ) => void;
  updateTodo: (id: string, data: TodoFormData) => void;
}

export const useTodoEditor = ({ addTodo, updateTodo }: UseTodoEditorParams) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [targetStatus, setTargetStatus] = useState<TodoStatus>("todo");

  const openAddModal = useCallback((status: TodoStatus) => {
    setEditingTodo(undefined);
    setTargetStatus(status);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  }, []);

  const handleSave = useCallback(
    (id: string, data: TodoFormData) => {
      if (id) {
        updateTodo(id, data);
        return;
      }
      addTodo(
        data.text,
        data.description,
        data.priority,
        data.dueDate,
        targetStatus,
        data.tags,
        data.notes,
      );
    },
    [addTodo, updateTodo, targetStatus],
  );

  return {
    isModalOpen,
    editingTodo,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
  };
};
