// ADD/EDIT MODAL UI COMPONENTS
import React from "react";
import { X, Calendar, StickyNote, Plus } from "lucide-react";
import type { TodoPriority } from "../types/todo";

// ============================================================================
// HEADER
// ============================================================================
export const Header = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-(--color-border)">
    <h3 className="text-lg font-bold">{title}</h3>
    <button
      onClick={onClose}
      className="p-1 hover:bg-(--color-border)/30 rounded-lg transition-colors"
      aria-label="Close modal"
    >
      <X size={20} />
    </button>
  </div>
);

// ============================================================================
// TITLE INPUT
// ============================================================================
export const TitleInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 opacity-60">
      Title *
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Task title..."
      className="input-base w-full"
    />
  </div>
);

// ============================================================================
// DESCRIPTION INPUT
// ============================================================================
export const DescriptionInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 opacity-60">
      Description
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Add more details..."
      className="input-base w-full resize-none"
      rows={3}
    />
  </div>
);

// ============================================================================
// TAGS INPUT
// ============================================================================
export const TagsInput = ({
  tags,
  onAdd,
  onRemove,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 opacity-60">Tags</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="input-base flex-1 [font-size:16px]"
        />
        <button
          onClick={handleAdd}
          className="btn-base btn-active p-2"
          type="button"
          aria-label="Add tag"
        >
          <Plus size={18} />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={tag}
              className="badge-base bg-(--color-border)/30 flex items-center gap-1.5"
            >
              #{tag}
              <button
                onClick={() => onRemove(index)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${tag} tag`}
                type="button"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NOTES INPUT
// ============================================================================
export const NotesInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="text-sm font-medium mb-2 opacity-60 flex items-center gap-2">
      <StickyNote size={16} />
      Notes
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Private notes (won't show on card)..."
      className="input-base w-full resize-none"
      rows={3}
    />
  </div>
);

// ============================================================================
// PRIORITY & DUE DATE ROW
// ============================================================================
export const PriorityAndDueDateRow = ({
  priority,
  dueDate,
  onPriorityChange,
  onDueDateChange,
}: {
  priority: TodoPriority;
  dueDate: string;
  onPriorityChange: (priority: TodoPriority) => void;
  onDueDateChange: (date: string) => void;
}) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
    <div>
      <label className="block text-sm font-medium mb-2 opacity-60">
        Priority
      </label>
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TodoPriority)}
        className="input-base w-full control-themed"
      >
        <option value="low">
          Low
        </option>
        <option value="medium">
          Medium
        </option>
        <option value="high">
          High
        </option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2 opacity-60">
        Due Date
      </label>
      <div className="relative overflow-hidden">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="input-base w-full max-w-full min-w-0 date-input-fix"
        />
        <Calendar
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
        />
      </div>
    </div>
  </div>
);

// ============================================================================
// FOOTER
// ============================================================================
export const Footer = ({
  isValid,
  isEditing,
  onCancel,
  onSave,
}: {
  isValid: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}) => (
  <div className="flex gap-3 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 border-t border-(--color-border)">
    <button
      type="button"
      onPointerDown={() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (isValid) onSave();
      }}
      onClick={onSave}
      disabled={!isValid}
      className="btn-base btn-active flex-1 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed [touch-action:manipulation]"
    >
      {isEditing ? "Update" : "Save"}
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="btn-base btn-inactive flex-1 [touch-action:manipulation]"
    >
      Cancel
    </button>
  </div>
);
