import { useTodoEditor, useTodos } from "./useTodo";
import { ListView } from "./MiniKanban";
import { TodoEditorModal } from "./ToDoModal";

export const TodoPanel = () => {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  const {
    isModalOpen,
    editingTodo,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
  } = useTodoEditor({ addTodo, updateTodo });

  return (
    <>
      <ListView
        todos={todos}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={deleteTodo}
        onStatusChange={(id, status) => updateTodo(id, { status })}
      />
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
