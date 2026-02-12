export type TodoStatus = "todo" | "in-progress" | "done";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: number;
  dueDate?: number;
  pomodorosCompleted?: number;
}