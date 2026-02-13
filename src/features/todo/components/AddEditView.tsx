// ADD/EDIT MODAL CONTAINER - Orchestrator & Container

import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Header, TitleInput, DescriptionInput, PriorityAndDueDateRow, Footer } from "./AddEdit";
import type { Todo, TodoPriority } from "../types/todo";

// ============================================================================
// HELPERS
// ============================================================================

const formatDateForInput = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split("T")[0];
};

const parseDateInput = (dateString: string): number | undefined => {
  return dateString ? new Date(dateString).getTime() : undefined;
};

// ============================================================================
// TYPES
// ============================================================================

interface TodoFormData {
  text: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: number;
}

interface AddEditViewProps {
  isOpen: boolean;
  todo?: Todo;
  onClose: () => void;
  onSave: (
    id: string,
    data: TodoFormData
  ) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AddEditView = ({
  isOpen,
  todo,
  onClose,
  onSave,
}: AddEditViewProps) => {
  const [text, setText] = useState(todo?.text || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [priority, setPriority] = useState<TodoPriority>(todo?.priority || "medium");
  const [dueDate, setDueDate] = useState(
    todo?.dueDate ? formatDateForInput(todo.dueDate) : ""
  );

  const isValid = text.trim().length > 0;
  const isEditing = !!todo;

  const handleSave = () => {
    if (!isValid) return;

    const formData: TodoFormData = {
      text: text.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: parseDateInput(dueDate),
    };

    onSave(todo?.id || "", formData);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey && isValid) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} maxWidth="max-w-md">
      <Header 
        title={isEditing ? "Edit Task" : "Add Task"} 
        onClose={onClose} 
      />

      <div className="p-6 space-y-4">
        <TitleInput
          value={text}
          onChange={setText}
          onKeyPress={handleKeyPress}
        />

        <DescriptionInput
          value={description}
          onChange={setDescription}
        />

        <PriorityAndDueDateRow
          priority={priority}
          dueDate={dueDate}
          onPriorityChange={setPriority}
          onDueDateChange={setDueDate}
        />
      </div>

      <Footer
        isValid={isValid}
        isEditing={isEditing}
        onCancel={onClose}
        onSave={handleSave}
      />
    </Modal>
  );
};