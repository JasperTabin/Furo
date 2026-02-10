import { useTodos } from "../hooks/useTodos";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";

export const TodoList = () => {
  const { activeTodos, completedTodos, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 text-center todo-header">
        <h2 className="text-3xl font-bold mb-2">Tasks</h2>
        <p className="text-sm opacity-60">
          {activeTodos.length} active · {completedTodos.length} completed
        </p>
      </div>

      {/* Input */}
      <div className="mb-6 todo-input">
        <TodoInput onAdd={addTodo} />
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {activeTodos.length === 0 && completedTodos.length === 0 ? (
          <div className="text-center py-12 opacity-40 todo-item">
            <p>No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          <>
            {/* Active Todos */}
            {activeTodos.map((todo) => (
              <div key={todo.id} className="todo-item">
                <TodoItem
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              </div>
            ))}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <>
                <div className="pt-4 pb-2 todo-item">
                  <h3 className="text-sm font-medium opacity-40">Completed</h3>
                </div>
                {completedTodos.map((todo) => (
                  <div key={todo.id} className="todo-item">
                    <TodoItem
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
