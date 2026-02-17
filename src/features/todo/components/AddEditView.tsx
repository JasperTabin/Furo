// ADD/EDIT MODAL CONTAINER - Orchestrator & Container
import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import {
  Header,
  TitleInput,
  DescriptionInput,
  TagsInput,
  NotesInput,
  PriorityAndDueDateRow,
  Footer,
} from "./AddEdit";
import type { Todo, TodoPriority, TodoFormData } from "../types/todo";
import { formatDateForInput, parseDateInput } from "../utils/todoUtils";

// ============================================================================
// TYPES
// ============================================================================
interface AddEditViewProps {
  isOpen: boolean;
  todo?: Todo;
  onClose: () => void;
  onSave: (id: string, data: TodoFormData) => void;
}

// ============================================================================
// FORM STATE SHAPE
// ============================================================================
interface FormState {
  text: string;
  description: string;
  tags: string[];
  notes: string;
  priority: TodoPriority;
  dueDate: string;
}

const buildFormState = (todo?: Todo): FormState => ({
  text: todo?.text || "",
  description: todo?.description || "",
  tags: todo?.tags || [],
  notes: todo?.notes || "",
  priority: todo?.priority || "medium",
  dueDate: todo?.dueDate ? formatDateForInput(todo.dueDate) : "",
});

// ============================================================================
// COMPONENT
// ============================================================================
export const AddEditView = ({
  isOpen,
  todo,
  onClose,
  onSave,
}: AddEditViewProps) => {
  const [form, setForm] = useState<FormState>(() => buildFormState(todo));

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.text.trim().length > 0;
  const isEditing = !!todo;

  const handleAddTag = (tag: string) => {
    if (!form.tags.includes(tag)) {
      setField("tags", [...form.tags, tag]);
    }
  };

  const handleRemoveTag = (index: number) => {
    setField("tags", form.tags.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!isValid) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const formData: TodoFormData = {
      text: form.text.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      dueDate: parseDateInput(form.dueDate),
      tags: form.tags.length > 0 ? form.tags : undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      onSave(todo?.id || "", formData);
      onClose();
    } catch (error) {
      console.error("Failed to save todo:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isValid) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} maxWidth="w-full sm:max-w-md mx-auto">
      <Header
        title={isEditing ? "Edit Task" : "Add Task"}
        onClose={onClose}
      />
      <div
        className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0"
        onKeyDown={handleKeyDown}
      >
        <TitleInput value={form.text} onChange={(v) => setField("text", v)} />
        <DescriptionInput
          value={form.description}
          onChange={(v) => setField("description", v)}
        />
        <TagsInput
          tags={form.tags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
        />
        <PriorityAndDueDateRow
          priority={form.priority}
          dueDate={form.dueDate}
          onPriorityChange={(v) => setField("priority", v)}
          onDueDateChange={(v) => setField("dueDate", v)}
        />
        <NotesInput value={form.notes} onChange={(v) => setField("notes", v)} />
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
