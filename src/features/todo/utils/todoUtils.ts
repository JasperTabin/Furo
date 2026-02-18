// UTILITY FUNCTIONS - Pure helper functions
// No side effects, no state, fully testable

import type { Todo, TodoStatus } from "../types/todo";

// ============================================================================
// ID GENERATION
// ============================================================================

export const generateId = (): string => {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    if (typeof crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
      return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
        .slice(6, 8)
        .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
    }
  }

  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// ============================================================================
// DATE UTILITIES
// ============================================================================

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDateForInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateInput = (dateString: string): number | undefined => {
  if (!dateString) return undefined;

  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day).getTime();
};

export const isPastDue = (
  dueDate: number | undefined,
  status: TodoStatus
): boolean => {
  if (!dueDate || status === "done") return false;
  const dueDateObj = new Date(dueDate);
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  return dueDateObj < todayStart;
};

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

export const calculateTotalPages = (
  totalItems: number,
  itemsPerPage: number
): number => {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
};

export const paginateItems = <T>(
  items: T[],
  page: number,
  itemsPerPage: number
): T[] => {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
};

export const boundPage = (page: number, totalPages: number): number => {
  if (totalPages === 0) return 1;
  return Math.max(1, Math.min(page, totalPages));
};

// ============================================================================
// FILTERING UTILITIES
// ============================================================================

export const filterByStatus = (
  todos: Todo[],
  status: TodoStatus
): Todo[] => {
  return todos.filter((todo) => todo.status === status);
};

export const groupByStatus = (todos: Todo[]) => {
  return {
    todo: filterByStatus(todos, "todo"),
    doing: filterByStatus(todos, "doing"),
    done: filterByStatus(todos, "done"),
  };
};
