// TODO ADD/EDIT MODAL

import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { X, Calendar } from "lucide-react";
import type { Todo, TodoPriority } from "../types/todo";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    text: string;
    description?: string;
    priority: TodoPriority;
    dueDate?: number;
  }) => void;
  todo?: Todo;
  title?: string;
}

// ✅ FIX: Component that resets on every render using key prop
const TodoModalContent = ({
  onClose,
  onSave,
  todo,
  title = "Add Task",
}: Omit<TodoModalProps, "isOpen">) => {
  const [text, setText] = useState(todo?.text || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [priority, setPriority] = useState<TodoPriority>(todo?.priority || "medium");
  const [dueDate, setDueDate] = useState(
    todo?.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );

  const handleSave = () => {
    if (text.trim()) {
      onSave({
        text: text.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      });
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSave();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">
            Title *
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Task title..."
            className="input-base w-full"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            className="input-base w-full resize-none"
            rows={3}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">
            Priority
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPriority("low")}
              className={`btn-base flex-1 ${
                priority === "low" ? "btn-active" : "btn-inactive"
              }`}
            >
              Low
            </button>
            <button
              onClick={() => setPriority("medium")}
              className={`btn-base flex-1 ${
                priority === "medium" ? "btn-active" : "btn-inactive"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setPriority("high")}
              className={`btn-base flex-1 ${
                priority === "high" ? "btn-active" : "btn-inactive"
              }`}
            >
              High
            </button>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-2 opacity-60">
            Due Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-base w-full"
            />
            <Calendar
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-(--color-border)">
        <button onClick={onClose} className="btn-base btn-inactive">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="btn-base btn-active disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {todo ? "Update" : "Save"}
        </button>
      </div>
    </>
  );
};

export const TodoModal = ({
  isOpen,
  onClose,
  onSave,
  todo,
  title = "Add Task",
}: TodoModalProps) => {
  if (!isOpen) return null;

  // ✅ FIX: Use key to force complete re-mount when switching between add/edit
  // This ensures the form resets properly without useEffect
  const modalKey = todo?.id || "new-task";

  return (
    <Modal isOpen={isOpen} maxWidth="max-w-lg">
      <TodoModalContent
        key={modalKey}
        onClose={onClose}
        onSave={onSave}
        todo={todo}
        title={title}
      />
    </Modal>
  );
};