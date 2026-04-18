// ============================================================================
// TYPES
// ============================================================================

export type TodoStatus = "todo" | "doing" | "done";
export type TodoPriority = "low" | "medium" | "high";

export const TAG_COLORS = [
  { key: "blue", swatchClassName: "todo-tag-swatch-blue" },
  { key: "green", swatchClassName: "todo-tag-swatch-green" },
  { key: "amber", swatchClassName: "todo-tag-swatch-amber" },
  { key: "red", swatchClassName: "todo-tag-swatch-red" },
  { key: "purple", swatchClassName: "todo-tag-swatch-purple" },
] as const;

export type TodoTagColor = (typeof TAG_COLORS)[number]["key"];

export interface TodoTag {
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
  tags?: TodoTag[];
  notes?: string;
  pomodoroCompleted?: number;
  totalFocusMinutes?: number;
  lastFocusedAt?: number;
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

// ============================================================================
// CLASS HELPERS  (pure – no side effects)
// ============================================================================

export const getTagChipClass = (color: string) =>
  TAG_COLORS.some((c) => c.key === color)
    ? `todo-tag-chip-${color}`
    : "todo-tag-chip-default";

export const getPriorityAccentClass = (priority: TodoPriority) =>
  `todo-priority-accent-${priority}`;

// ============================================================================
// ID
// ============================================================================

export const generateId = (): string =>
  crypto.randomUUID?.() ??
  `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;

// ============================================================================
// DATE UTILITIES
// ============================================================================

export const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatDateForInput = (ts: number): string => {
  const d = new Date(ts);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

export const parseDateInput = (s: string): number | undefined => {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d).getTime() : undefined;
};

export const isPastDue = (dueDate: number | undefined, status: TodoStatus) => {
  if (!dueDate || status === "done") return false;
  return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
};

// ============================================================================
// GROUPING
// ============================================================================

export const groupByStatus = (todos: Todo[]) => ({
  todo: todos.filter((t) => t.status === "todo"),
  doing: todos.filter((t) => t.status === "doing"),
  done: todos.filter((t) => t.status === "done"),
});

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = "furo-todos";
const VALID_STATUSES: TodoStatus[] = ["todo", "doing", "done"];
const VALID_PRIORITIES: TodoPriority[] = ["low", "medium", "high"];

const isValidTag = (v: unknown): boolean => {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return typeof t.name === "string" && typeof t.color === "string";
};

const isTodo = (v: unknown): v is Todo => {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.text === "string" &&
    typeof t.createdAt === "number" &&
    VALID_STATUSES.includes(t.status as TodoStatus) &&
    VALID_PRIORITIES.includes(t.priority as TodoPriority) &&
    (t.description === undefined || typeof t.description === "string") &&
    (t.dueDate === undefined || typeof t.dueDate === "number") &&
    (t.notes === undefined || typeof t.notes === "string") &&
    (t.pomodoroCompleted === undefined ||
      typeof t.pomodoroCompleted === "number") &&
    (t.totalFocusMinutes === undefined ||
      typeof t.totalFocusMinutes === "number") &&
    (t.lastFocusedAt === undefined || typeof t.lastFocusedAt === "number") &&
    (t.tags === undefined ||
      (Array.isArray(t.tags) && t.tags.every(isValidTag)))
  );
};

export const todoStorage = {
  load: (): Todo[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
    } catch {
      return [];
    }
  },
  save: (data: Todo[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      if (import.meta.env.DEV) console.error("Failed to save todos:", e);
    }
  },
};

type TodoListener = () => void;

let todosCache: Todo[] | null = null;
const todoListeners = new Set<TodoListener>();

const emitTodoChange = () => {
  todoListeners.forEach((listener) => listener());
};

const readTodos = () => {
  if (todosCache) return todosCache;
  todosCache = todoStorage.load();
  return todosCache;
};

const writeTodos = (next: Todo[]) => {
  todosCache = next;
  todoStorage.save(next);
  emitTodoChange();
};

export const todoStore = {
  getSnapshot: (): Todo[] => readTodos(),
  subscribe: (listener: TodoListener) => {
    todoListeners.add(listener);
    return () => todoListeners.delete(listener);
  },
  add: (todo: Todo) => {
    writeTodos([todo, ...readTodos()]);
  },
  update: (
    id: string,
    patch: Partial<Omit<Todo, "id" | "createdAt">>,
  ): Todo | undefined => {
    let updatedTodo: Todo | undefined;

    writeTodos(
      readTodos().map((todo) => {
        if (todo.id !== id) return todo;
        updatedTodo = { ...todo, ...patch };
        return updatedTodo;
      }),
    );

    return updatedTodo;
  },
  delete: (id: string) => {
    writeTodos(readTodos().filter((todo) => todo.id !== id));
  },
  getById: (id: string) => readTodos().find((todo) => todo.id === id),
};
