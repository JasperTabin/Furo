import { X } from "lucide-react";
import { useTodos } from "./useTodo";
import { useDrag } from "./useTodoDrag";
import { Column } from "./todo-ui";
import { TodoEditorModal } from "./TodoEditorModal";
import { useTodoEditor } from "./useTodoEditor";

export const KanbanPanel = ({ onClose }: { onClose: () => void }) => {
  const {
    todoList,
    doingList,
    doneList,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  } = useTodos();

  const {
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    createColumnHandlers,
  } = useDrag(updateTodoStatus);

  const {
    isModalOpen,
    editingTodo,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
  } = useTodoEditor({ addTodo, updateTodo });

  const columns = [
    {
      key: "todo" as const,
      title: "To Do",
      totalCount: todoList.length,
      items: todoList,
    },
    {
      key: "doing" as const,
      title: "Doing",
      totalCount: doingList.length,
      items: doingList,
    },
    {
      key: "done" as const,
      title: "Done",
      totalCount: doneList.length,
      items: doneList,
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0 ">
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3 px-4 sm:px-4">
          <h2 className="text-base font-semibold tracking-[0.02em]">Kanban</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-(--color-border) text-(--color-fg)/65 transition-colors hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
            aria-label="Close kanban"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex gap-4 flex-1 min-h-0 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] px-4 sm:px-0 scroll-pl-4 items-stretch">
          {columns.map((column) => (
            <Column
              key={column.key}
              title={column.title}
              totalCount={column.totalCount}
              todos={column.items}
              isDragOver={dragOverColumn === column.key}
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

      <TodoEditorModal
        key={`${editingTodo?.id ?? "new"}-${isModalOpen}`}
        isOpen={isModalOpen}
        todo={editingTodo}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
};
