// TODO TYPES

export type TodoStatus = "todo" | "doing" | "done";
export type TodoPriority = "low" | "medium" | "high";
export type TodoTagColor = string;

export interface TodoTagDefinition {
  name: string;
  color: TodoTagColor;
}

export interface Todo {
  id: string;
  text: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: number;
  tags?: string[];
  notes?: string;
  createdAt: number;
}

export interface TodoFormData {
  text: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: number;
  tags?: string[];
  notes?: string;
}
