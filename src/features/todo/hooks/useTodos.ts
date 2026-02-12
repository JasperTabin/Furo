import { useState, useEffect, useMemo } from "react";
import type { Todo, TodoStatus, TodoPriority } from "../types/todo";

const STORAGE_KEY = "furo-todos";
const ITEMS_PER_PAGE = 4;

const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos());
  const [todoPage, setTodoPage] = useState(1);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [donePage, setDonePage] = useState(1);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (
    text: string,
    description?: string,
    priority: TodoPriority = "medium",
    dueDate?: number,
    status: TodoStatus = "todo"
  ) => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      description: description?.trim(),
      status,
      priority,
      createdAt: Date.now(),
      dueDate,
      pomodorosCompleted: 0,
    };

    setTodos([newTodo, ...todos]);
    
    if (status === "todo") setTodoPage(1);
    if (status === "in-progress") setInProgressPage(1);
    if (status === "done") setDonePage(1);
    
    return newTodo.id;
  };

  const updateTodo = (
    id: string,
    updates: {
      text?: string;
      description?: string;
      priority?: TodoPriority;
      dueDate?: number;
    }
  ) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  const updateTodoStatus = (id: string, status: TodoStatus) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, status } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const todoItems = todos.filter((t) => t.status === "todo");
  const inProgressItems = todos.filter((t) => t.status === "in-progress");
  const doneItems = todos.filter((t) => t.status === "done");

  const todoTotalPages = Math.ceil(todoItems.length / ITEMS_PER_PAGE);
  const inProgressTotalPages = Math.ceil(inProgressItems.length / ITEMS_PER_PAGE);
  const doneTotalPages = Math.ceil(doneItems.length / ITEMS_PER_PAGE);

  const safeTodoPage = useMemo(() => {
    if (todoTotalPages === 0) return 1;
    if (todoPage > todoTotalPages) return todoTotalPages;
    return todoPage;
  }, [todoPage, todoTotalPages]);

  const safeInProgressPage = useMemo(() => {
    if (inProgressTotalPages === 0) return 1;
    if (inProgressPage > inProgressTotalPages) return inProgressTotalPages;
    return inProgressPage;
  }, [inProgressPage, inProgressTotalPages]);

  const safeDonePage = useMemo(() => {
    if (doneTotalPages === 0) return 1;
    if (donePage > doneTotalPages) return doneTotalPages;
    return donePage;
  }, [donePage, doneTotalPages]);

  const paginatedTodoItems = useMemo(() => {
    const start = (safeTodoPage - 1) * ITEMS_PER_PAGE;
    return todoItems.slice(start, start + ITEMS_PER_PAGE);
  }, [todoItems, safeTodoPage]);

  const paginatedInProgressItems = useMemo(() => {
    const start = (safeInProgressPage - 1) * ITEMS_PER_PAGE;
    return inProgressItems.slice(start, start + ITEMS_PER_PAGE);
  }, [inProgressItems, safeInProgressPage]);

  const paginatedDoneItems = useMemo(() => {
    const start = (safeDonePage - 1) * ITEMS_PER_PAGE;
    return doneItems.slice(start, start + ITEMS_PER_PAGE);
  }, [doneItems, safeDonePage]);

  return {
    todos,
    todoItems: paginatedTodoItems,
    inProgressItems: paginatedInProgressItems,
    doneItems: paginatedDoneItems,
    // ✅ Removed: allTodoItems, allInProgressItems, allDoneItems (no longer needed)
    todoPage: safeTodoPage,
    inProgressPage: safeInProgressPage,
    donePage: safeDonePage,
    todoTotalPages,
    inProgressTotalPages,
    doneTotalPages,
    setTodoPage,
    setInProgressPage,
    setDonePage,
    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  };
};