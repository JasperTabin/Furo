// TODO HOOK - All todo logic here

import { useState, useEffect } from "react";
import type { Todo, TodoStatus, TodoPriority } from "../types/todo";

// ============================================================================
// CONSTANTS
// ============================================================================

const ITEMS_PER_PAGE = 4;
const STORAGE_KEY = "furo-todos";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateTotalPages = (items: Todo[]): number => {
  return Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
};

const paginateItems = (items: Todo[], page: number): Todo[] => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return items.slice(start, start + ITEMS_PER_PAGE);
};

const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load todos from storage:", error);
    return [];
  }
};

const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos to storage:", error);
  }
};

// ============================================================================
// HOOK
// ============================================================================

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodosFromStorage);
  const [todoPage, setTodoPage] = useState(1);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [donePage, setDonePage] = useState(1);

  // Save to localStorage whenever todos change
  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

  // Filter todos by status
  const todoList = todos.filter((t) => t.status === "todo");
  const inProgressList = todos.filter((t) => t.status === "doing");
  const doneList = todos.filter((t) => t.status === "done");

  // Calculate pagination
  const todoTotalPages = calculateTotalPages(todoList);
  const inProgressTotalPages = calculateTotalPages(inProgressList);
  const doneTotalPages = calculateTotalPages(doneList);

  // Get paginated items
  const todoItems = paginateItems(todoList, todoPage);
  const inProgressItems = paginateItems(inProgressList, inProgressPage);
  const doneItems = paginateItems(doneList, donePage);

  // ========================================
  // Actions
  // ========================================

  const addTodo = (
    text: string,
    description?: string,
    priority: TodoPriority = "medium",
    dueDate?: number,
    status: TodoStatus = "todo",
    tags?: string[],
    notes?: string
  ) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      description,
      priority,
      status,
      dueDate,
      tags,
      notes,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (
    id: string,
    data: {
      text?: string;
      description?: string;
      priority?: TodoPriority;
      dueDate?: number;
      tags?: string[];
      notes?: string;
    }
  ) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...data } : todo
      )
    );
  };

  const updateTodoStatus = (id: string, status: TodoStatus) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, status } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return {
    // Data
    todoItems,
    inProgressItems,
    doneItems,
    
    // Pagination state
    todoPage,
    inProgressPage,
    donePage,
    todoTotalPages,
    inProgressTotalPages,
    doneTotalPages,
    
    // Pagination setters
    setTodoPage,
    setInProgressPage,
    setDonePage,
    
    // Actions
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  };
};