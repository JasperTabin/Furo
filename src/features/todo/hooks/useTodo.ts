// TODOS HOOK - State management and CRUD operations only

import { useState, useEffect, useCallback, useMemo } from "react";
import { todoStorage } from "../services/todoStorage";
import { generateId, groupByStatus } from "../utils/todoUtils";
import type { Todo, TodoStatus, TodoPriority } from "../types/todo";

export const useTodos = () => {

  const [todos, setTodos] = useState<Todo[]>(() => todoStorage.load<Todo>());

  useEffect(() => {
    todoStorage.save(todos);
  }, [todos]);

  const { todo: todoList, doing: doingList, done: doneList } = useMemo(
    () => groupByStatus(todos),
    [todos]
  );

  const addTodo = useCallback(
    (
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
    },
    []
  );

  const updateTodo = useCallback(
    (
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
        prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo))
      );
    },
    []
  );

  const updateTodoStatus = useCallback((id: string, status: TodoStatus) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, status } : todo))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  return {
    todoList,
    doingList,
    doneList,

    addTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  };
};