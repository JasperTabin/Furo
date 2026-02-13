// TODO CONTAINER - Orchestrator & Container

import { useState, useRef } from "react";
import { useTodos } from "../hooks/useTodo";
import { Column } from "./Todo";
import { AddEditView } from "./AddEditView";
import type { Todo, TodoStatus } from "../types/todo";

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
  const [targetStatus, setTargetStatus] = useState<TodoStatus>("todo");
  const [modalKey, setModalKey] = useState(0);
  const [dragOverColumn, setDragOverColumn] = useState<TodoStatus | null>(null);
  const draggedTodo = useRef<Todo | null>(null);

  // ========================================
  // Modal handlers
  // ========================================
  
  const openAddModal = (status: TodoStatus) => {
    setEditingTodo(undefined);
    setTargetStatus(status);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  };

  // ========================================
  // Drag handlers
  // ========================================

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    draggedTodo.current = todo;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    draggedTodo.current = null;
    setDragOverColumn(null);
  };

  const createColumnDragHandlers = (status: TodoStatus) => ({
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
        updateTodoStatus(draggedTodo.current.id, status);
      }
    },
  });

  // ========================================
  // Render
  // ========================================

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
        {/* Kanban Board Title */}
        <h2 className="text-2xl flex justify-center font-bold mb-6 todo-title">Kanban Board</h2>

        <div className="flex gap-4 items-start pb-4">
          <Column
            title="To Do"
            todos={todoItems}
            currentPage={todoPage}
            totalPages={todoTotalPages}
            isDragOver={dragOverColumn === "todo"}
            onPageChange={setTodoPage}
            onAdd={() => openAddModal("todo")}
            onEdit={openEditModal}
            onDelete={deleteTodo}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            {...createColumnDragHandlers("todo")}
          />

          <Column
            title="Doing"
            todos={inProgressItems}
            currentPage={inProgressPage}
            totalPages={inProgressTotalPages}
            isDragOver={dragOverColumn === "doing"}
            onPageChange={setInProgressPage}
            onAdd={() => openAddModal("doing")}
            onEdit={openEditModal}
            onDelete={deleteTodo}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            {...createColumnDragHandlers("doing")}
          />

          <Column
            title="Done"
            todos={doneItems}
            currentPage={donePage}
            totalPages={doneTotalPages}
            isDragOver={dragOverColumn === "done"}
            onPageChange={setDonePage}
            onAdd={() => openAddModal("done")}
            onEdit={openEditModal}
            onDelete={deleteTodo}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            {...createColumnDragHandlers("done")}
          />
        </div>
      </div>

      <AddEditView
        key={modalKey}
        isOpen={isModalOpen}
        todo={editingTodo}
        onClose={closeModal}
        onSave={(id, data) => {
          if (id) {
            updateTodo(id, data);
          } else {
            addTodo(
              data.text,
              data.description,
              data.priority,
              data.dueDate,
              targetStatus,
              data.tags,
              data.notes
            );
          }
        }}
      />
    </>
  );
};