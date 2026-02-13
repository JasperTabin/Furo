// TODO TYPES

export type TodoStatus = "todo" | "in-progress" | "done";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: number;
  createdAt: number;
}

export interface TodoFormData {
  text: string;
  description?: string;
  priority: TodoPriority;
  dueDate?: number;
}