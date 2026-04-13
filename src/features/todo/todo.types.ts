// TODO TYPES

export type TodoStatus = "todo" | "doing" | "done";
export type TodoPriority = "low" | "medium" | "high";

export interface TodoTag {
  name: string;
  color: string; // preset: "blue" | "green" | "amber" | "red" | "purple"
}

export interface Todo {
  id: string;
  text: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: number;
  tags?: TodoTag[];
  notes?: string;
  createdAt: number;
}

export interface TodoFormData {
  text: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: number;
  tags?: TodoTag[];
  notes?: string;
}
