// STORAGE SERVICE - Handles all localStorage operations

import type { Todo, TodoPriority, TodoStatus } from "./todo.types";

const STORAGE_KEY = "furo-todos";

const VALID_STATUSES: TodoStatus[] = ["todo", "doing", "done"];
const VALID_PRIORITIES: TodoPriority[] = ["low", "medium", "high"];

const isValidTag = (item: unknown): boolean => {
  if (!item || typeof item !== "object") return false;
  const t = item as Record<string, unknown>;
  return typeof t.name === "string" && typeof t.color === "string";
};

const isTodo = (item: unknown): item is Todo => {
  if (!item || typeof item !== "object") return false;
  const t = item as Record<string, unknown>;

  return (
    typeof t.id === "string" &&
    typeof t.text === "string" &&
    typeof t.createdAt === "number" &&
    VALID_STATUSES.includes(t.status as TodoStatus) &&
    VALID_PRIORITIES.includes(t.priority as TodoPriority) &&
    (t.description === undefined || typeof t.description === "string") &&
    (t.dueDate === undefined || typeof t.dueDate === "number") &&
    (t.notes === undefined || typeof t.notes === "string") &&
    (t.tags === undefined ||
      (Array.isArray(t.tags) && t.tags.every(isValidTag)))
  );
};

export const todoStorage = {
  load: (): Todo[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
    } catch {
      return [];
    }
  },

  save: (data: Todo[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save todos:", error);
      }
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to clear todos:", error);
      }
    }
  },
};
