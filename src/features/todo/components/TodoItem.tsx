import { Check, Trash2 } from "lucide-react";
import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 bg-(--color-bg) border border-(--color-border) rounded-xl hover:border-(--color-border)/70 transition-all group ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded border-2 border-(--color-border) flex items-center justify-center hover:border-(--color-border)/70 transition-colors shrink-0 ${
          todo.completed ? "bg-(--color-border)" : ""
        }`}
      >
        {todo.completed && <Check size={14} />}
      </button>
      
      <span className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
        {todo.text}
      </span>
      
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-(--color-border)/30 rounded-lg transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
