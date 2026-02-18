// TODO VIEW - Main container composing all layers
// Architecture: UI → Hooks → Services → Storage
import { useState, useCallback } from "react";
import { useTodos } from "../hooks/useTodo";
import { usePagination } from "../hooks/usePagination";
import { useDrag } from "../hooks/useDrag";
import { Column } from "./Todo";
import { AddEditView } from "./AddEditView";
import type { Todo, TodoStatus, TodoFormData } from "../types/todo";

export const TodoView = () => {
  const {
    todoList,
    doingList,
    doneList,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  } = useTodos();

  const todoPagination = usePagination(todoList);
  const doingPagination = usePagination(doingList);
  const donePagination = usePagination(doneList);

  const {
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    createColumnHandlers,
  } = useDrag(updateTodoStatus);

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
      } else {
        addTodo(
          data.text,
          data.description,
          data.priority,
          data.dueDate,
          targetStatus,
          data.tags,
          data.notes,
        );
      }
    },
    [addTodo, updateTodo, targetStatus],
  );

  const columns = [
    {
      key: "todo" as const,
      title: "To Do",
      totalCount: todoList.length,
      todos: todoPagination.paginatedItems,
      currentPage: todoPagination.currentPage,
      totalPages: todoPagination.totalPages,
      onPageChange: todoPagination.setPage,
    },
    {
      key: "doing" as const,
      title: "Doing",
      totalCount: doingList.length,
      todos: doingPagination.paginatedItems,
      currentPage: doingPagination.currentPage,
      totalPages: doingPagination.totalPages,
      onPageChange: doingPagination.setPage,
    },
    {
      key: "done" as const,
      title: "Done",
      totalCount: doneList.length,
      todos: donePagination.paginatedItems,
      currentPage: donePagination.currentPage,
      totalPages: donePagination.totalPages,
      onPageChange: donePagination.setPage,
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-2xl flex justify-center font-bold mb-6 todo-title">
          Kanban Board
        </h2>
        <div className="flex gap-4 items-start pb-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [-webkit-overflow-scrolling:touch] px-4 sm:px-0 scroll-pl-4">
          {columns.map((column) => (
            <Column
              key={column.key}
              title={column.title}
              totalCount={column.totalCount}
              todos={column.todos}
              currentPage={column.currentPage}
              totalPages={column.totalPages}
              isDragOver={dragOverColumn === column.key}
              onPageChange={column.onPageChange}
              onAdd={() => openAddModal(column.key)}
              onEdit={openEditModal}
              onDelete={deleteTodo}
              onStatusChange={updateTodoStatus}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              {...createColumnHandlers(column.key)}
            />
          ))}
        </div>
      </div>

      <AddEditView
        key={`${editingTodo?.id ?? "new"}-${isModalOpen}`}
        isOpen={isModalOpen}
        todo={editingTodo}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
};
