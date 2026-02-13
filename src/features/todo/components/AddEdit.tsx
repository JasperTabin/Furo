// ADD/EDIT MODAL UI ONLY

import { X, Calendar } from "lucide-react";
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
  <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
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
  onKeyPress,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 opacity-60">Title *</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder="Task title..."
      className="input-base w-full"
      autoFocus
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
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="block text-sm font-medium mb-2 opacity-60">
        Priority
      </label>
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TodoPriority)}
        className="input-base w-full"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2 opacity-60">
        Due Date
      </label>
      <div className="relative">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
          className="input-base w-full"
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
  <div className="flex justify-end gap-3 p-6 border-t border-(--color-border)">
    <button onClick={onCancel} className="btn-base btn-inactive">
      Cancel
    </button>
    <button
      onClick={onSave}
      disabled={!isValid}
      className="btn-base btn-active disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {isEditing ? "Update" : "Save"}
    </button>
  </div>
);
