import { useTodos } from "./useTodo";
import { ListView } from "./todo-ui";
import { TodoEditorModal } from "./TodoEditorModal";
import { useTodoEditor } from "./useTodoEditor";

export const TodoPanel = () => {
  const {
    todos,
    todoList,
    doingList,
    doneList,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  } = useTodos();

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
        todoCount={todoList.length}
        doingCount={doingList.length}
        doneCount={doneList.length}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={deleteTodo}
        onStatusChange={updateTodoStatus}
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
