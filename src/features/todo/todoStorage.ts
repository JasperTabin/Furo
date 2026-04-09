// STORAGE SERVICE - Handles all localStorage operations

import type {
  Todo,
  TodoPriority,
  TodoStatus,
  TodoTagColor,
  TodoTagDefinition,
} from "./todo.types";

const STORAGE_KEY = "furo-todos";
const TAGS_STORAGE_KEY = "furo-todo-tags";

const VALID_STATUSES: TodoStatus[] = ["todo", "doing", "done"];
const VALID_PRIORITIES: TodoPriority[] = ["low", "medium", "high"];
const isValidTagColor = (value: unknown): value is TodoTagColor =>
  typeof value === "string" &&
  /^(blue|green|amber|red|purple|pink|cyan|#[0-9a-fA-F]{6})$/.test(value);

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
    (t.tags === undefined || (Array.isArray(t.tags) && t.tags.every((tag) => typeof tag === "string")))
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
      localStorage.removeItem(TAGS_STORAGE_KEY);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to clear todos:", error);
      }
    }
  },

  loadTags: (): TodoTagDefinition[] => {
    try {
      const stored = localStorage.getItem(TAGS_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item): item is TodoTagDefinition =>
          !!item &&
          typeof item === "object" &&
          typeof (item as Record<string, unknown>).name === "string" &&
          isValidTagColor((item as Record<string, unknown>).color),
      );
    } catch {
      return [];
    }
  },

  saveTags: (tags: TodoTagDefinition[]): void => {
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save todo tags:", error);
      }
    }
  },
};
