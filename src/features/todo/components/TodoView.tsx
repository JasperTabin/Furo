// TODO CONTAINER - Kanban board with drag & drop

import { useState, useRef } from "react";
import { useTodos } from "../hooks/useTodos";
import { KanbanBoard } from "./Todo";
import { TodoModal } from "./TodoModal";
import type { Todo, TodoStatus, TodoPriority } from "../types/todo";

export const TodoView = () => {
  const {
    todoItems,
    inProgressItems,
    doneItems,
    todoPage,
    inProgressPage,
    donePage,
    todoTotalPages,
    inProgressTotalPages,
    doneTotalPages,
    setTodoPage,
    setInProgressPage,
    setDonePage,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  } = useTodos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [modalTargetStatus, setModalTargetStatus] = useState<TodoStatus>("todo");
  const draggedTodo = useRef<Todo | null>(null);

  const handleAddToColumn = (status: TodoStatus) => {
    setEditingTodo(undefined);
    setModalTargetStatus(status);
    setIsModalOpen(true);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveTodo = (data: {
    text: string;
    description?: string;
    priority: TodoPriority;
    dueDate?: number;
  }) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data);
    } else {
      addTodo(
        data.text, 
        data.description, 
        data.priority, 
        data.dueDate,
        modalTargetStatus
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    draggedTodo.current = todo;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    draggedTodo.current = null;
  };

  const handleDrop = (status: TodoStatus) => {
    if (draggedTodo.current && draggedTodo.current.status !== status) {
      updateTodoStatus(draggedTodo.current.id, status);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
        <KanbanBoard
          todoItems={todoItems}
          inProgressItems={inProgressItems}
          doneItems={doneItems}
          todoPage={todoPage}
          inProgressPage={inProgressPage}
          donePage={donePage}
          todoTotalPages={todoTotalPages}
          inProgressTotalPages={inProgressTotalPages}
          doneTotalPages={doneTotalPages}
          onTodoPageChange={setTodoPage}
          onInProgressPageChange={setInProgressPage}
          onDonePageChange={setDonePage}
          onAddToColumn={handleAddToColumn}
          onEdit={handleEdit}
          onDelete={deleteTodo}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(undefined);
        }}
        onSave={handleSaveTodo}
        todo={editingTodo}
        title={editingTodo ? "Edit Task" : "Add Task"}
      />
    </>
  );
};