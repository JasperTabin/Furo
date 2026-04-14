import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  formatDateForInput,
  generateId,
  groupByStatus,
  parseDateInput,
  todoStorage,
} from "./todo";
import type {
  Todo,
  TodoFormData,
  TodoPriority,
  TodoStatus,
  TodoTag,
  TodoTagColor,
} from "./todo";

const ITEMS_PER_PAGE = 4;

// ============================================================================
// usePagination
// ============================================================================

export const usePagination = <T>(items: T[], itemsPerPage = ITEMS_PER_PAGE) => {
  const [page, setPageRaw] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const setPage = useCallback(
    (p: number) => setPageRaw(Math.max(1, Math.min(p, totalPages))),
    [totalPages],
  );

  return { currentPage, totalPages, paginatedItems, setPage };
};

// ============================================================================
// useDrag
// ============================================================================

export const useDrag = (onDrop: (id: string, status: TodoStatus) => void) => {
  const [dragOverColumn, setDragOverColumn] = useState<TodoStatus | null>(null);
  const dragged = useRef<Todo | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, todo: Todo) => {
    dragged.current = todo;
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragEnd = useCallback(() => {
    dragged.current = null;
    setDragOverColumn(null);
  }, []);

  const createColumnHandlers = useCallback(
    (status: TodoStatus) => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverColumn(status);
      },
      onDragLeave: () => setDragOverColumn(null),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (dragged.current && dragged.current.status !== status)
          onDrop(dragged.current.id, status);
      },
    }),
    [onDrop],
  );

  return {
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    createColumnHandlers,
  };
};

// ============================================================================
// useTodos  (CRUD + persistence)
// ============================================================================

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => todoStorage.load());

  useEffect(() => {
    todoStorage.save(todos);
  }, [todos]);

  const {
    todo: todoList,
    doing: doingList,
    done: doneList,
  } = useMemo(() => groupByStatus(todos), [todos]);

  // Single-object signature — no more 7 positional args
  const addTodo = useCallback(
    (data: TodoFormData, status: TodoStatus = "todo") => {
      setTodos((prev) => [
        { id: generateId(), ...data, status, createdAt: Date.now() },
        ...prev,
      ]);
    },
    [],
  );

  // Merged updateTodo + updateTodoStatus into one
  const updateTodo = useCallback(
    (id: string, patch: Partial<Omit<Todo, "id" | "createdAt">>) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
    },
    [],
  );

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    todos,
    todoList,
    doingList,
    doneList,
    addTodo,
    updateTodo,
    deleteTodo,
  };
};

// ============================================================================
// useTodoEditor  (modal open/close + save routing)
// ============================================================================

type AddTodo = ReturnType<typeof useTodos>["addTodo"];
type UpdateTodo = ReturnType<typeof useTodos>["updateTodo"];

export const useTodoEditor = ({
  addTodo,
  updateTodo,
}: {
  addTodo: AddTodo;
  updateTodo: UpdateTodo;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [targetStatus, setTargetStatus] = useState<TodoStatus>("todo");

  const openAddModal = useCallback((status: TodoStatus) => {
    setEditingTodo(undefined);
    setTargetStatus(status);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  }, []);

  const handleSave = useCallback(
    (id: string, data: TodoFormData) => {
      if (id) {
        updateTodo(id, data);
      } else {
        addTodo(data, targetStatus);
      }
    },
    [addTodo, updateTodo, targetStatus],
  );

  return {
    isModalOpen,
    editingTodo,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
  };
};

// ============================================================================
// useTodoEditorForm  (local form state for the modal)
// ============================================================================

interface FormState {
  text: string;
  description: string;
  tags: TodoTag[];
  notes: string;
  priority: TodoPriority;
  dueDate: string;
}

const initForm = (todo?: Todo): FormState => ({
  text: todo?.text ?? "",
  description: todo?.description ?? "",
  tags: todo?.tags ?? [],
  notes: todo?.notes ?? "",
  priority: todo?.priority ?? "medium",
  dueDate: todo?.dueDate ? formatDateForInput(todo.dueDate) : "",
});

export const useTodoEditorForm = ({
  todo,
  onClose,
  onSave,
}: {
  todo?: Todo;
  onClose: () => void;
  onSave: (id: string, data: TodoFormData) => void;
}) => {
  const [form, setForm] = useState<FormState>(() => initForm(todo));
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [selectedColor, setSelectedColor] = useState<TodoTagColor>("blue");
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagsButtonRef = useRef<HTMLButtonElement>(null);
  const [tagButtonWidth, setTagButtonWidth] = useState<number>();

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const openTags = useCallback((open: boolean) => {
    setIsTagsOpen(open);
    if (open) {
      setTagButtonWidth(tagsButtonRef.current?.getBoundingClientRect().width);
      setTimeout(() => tagInputRef.current?.focus(), 0);
    }
  }, []);

  const addTag = useCallback(() => {
    const name = tagInput.trim();
    if (!name || form.tags.some((t) => t.name === name)) return;
    setField("tags", [...form.tags, { name, color: selectedColor }]);
    setTagInput("");
    tagInputRef.current?.focus();
  }, [form.tags, selectedColor, setField, tagInput]);

  const removeTag = useCallback(
    (name: string) => {
      setField(
        "tags",
        form.tags.filter((t) => t.name !== name),
      );
    },
    [form.tags, setField],
  );

  const handleSave = useCallback(() => {
    if (!form.text.trim()) return;
    (document.activeElement as HTMLElement | null)?.blur();
    onSave(todo?.id ?? "", {
      text: form.text.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      dueDate: parseDateInput(form.dueDate),
      tags: form.tags.length ? form.tags : undefined,
      notes: form.notes.trim() || undefined,
    });
    onClose();
  }, [form, onClose, onSave, todo?.id]);

  return {
    form,
    isTagsOpen,
    tagInput,
    selectedColor,
    tagInputRef,
    tagsButtonRef,
    tagButtonWidth,
    isValid: form.text.trim().length > 0,
    saveLabel: todo ? "Update task" : "Save task",
    setField,
    setTagInput,
    setSelectedColor,
    openTags,
    addTag,
    removeTag,
    handleSave,
  };
};

// ============================================================================
// useTodoListView  (filter + pagination for MiniKanban)
// ============================================================================

export const useTodoListView = (todos: Todo[]) => {
  const [filter, setFilter] = useState<TodoStatus>("todo");

  // Counts derived here — no need to pass them in as props
  const counts = useMemo(
    () => ({
      todo: todos.filter((t) => t.status === "todo").length,
      doing: todos.filter((t) => t.status === "doing").length,
      done: todos.filter((t) => t.status === "done").length,
    }),
    [todos],
  );

  const filtered = useMemo(
    () => todos.filter((t) => t.status === filter),
    [todos, filter],
  );

  const { paginatedItems, currentPage, totalPages, setPage } =
    usePagination(filtered);

  const handleFilterChange = useCallback(
    (next: TodoStatus) => {
      setFilter(next);
      setPage(1);
    },
    [setPage],
  );

  return {
    filter,
    counts,
    paginatedItems,
    currentPage,
    totalPages,
    setPage,
    handleFilterChange,
  };
};
