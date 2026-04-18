import { useTodoEditor, useTodos } from "./useTodo";
import { ListView } from "./MiniKanban";
import { TodoEditorModal } from "./ToDoModal";
import { activeTaskStore } from "../timer/useTimerPanel";
import { useActiveTask } from "./useTodo";

export const TodoPanel = () => {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const { activeFocusTaskId } = useActiveTask();

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
        activeFocusTaskId={activeFocusTaskId}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={deleteTodo}
        onStatusChange={(id, status) => updateTodo(id, { status })}
        onStartFocus={(todo) => activeTaskStore.startClassicFocus(todo.id)}
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
