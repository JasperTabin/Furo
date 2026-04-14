import { useMemo } from "react";
import { X } from "lucide-react";
import { useDrag, useTodoEditor, useTodos } from "./useTodo";
import { Column } from "./Kanban";
import { TodoEditorModal } from "./ToDoModal";

export const KanbanPanel = ({ onClose }: { onClose: () => void }) => {
  const { todoList, doingList, doneList, addTodo, updateTodo, deleteTodo } =
    useTodos();

  const {
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    createColumnHandlers,
  } = useDrag((id, status) => updateTodo(id, { status }));

  const {
    isModalOpen,
    editingTodo,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
  } = useTodoEditor({ addTodo, updateTodo });

  const columns = useMemo(
    () => [
      { key: "todo" as const, title: "To Do", items: todoList },
      { key: "doing" as const, title: "Doing", items: doingList },
      { key: "done" as const, title: "Done", items: doneList },
    ],
    [todoList, doingList, doneList],
  );

  return (
    <>
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
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
          {columns.map((col) => (
            <Column
              key={col.key}
              title={col.title}
              totalCount={col.items.length}
              todos={col.items}
              isDragOver={dragOverColumn === col.key}
              onAdd={() => openAddModal(col.key)}
              onEdit={openEditModal}
              onDelete={deleteTodo}
              onStatusChange={(id, status) => updateTodo(id, { status })}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              {...createColumnHandlers(col.key)}
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
