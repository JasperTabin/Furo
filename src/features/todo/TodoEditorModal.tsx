import { useEffect, useRef, useState } from "react";
import { Check, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  Todo,
  TodoPriority,
  TodoFormData,
  TodoTagColor,
  TodoTagDefinition,
} from "./todo.types";
import { formatDateForInput, parseDateInput } from "./todo.utils";
import { todoStorage } from "./todoStorage";

// ============================================================================
// TYPES
// ============================================================================
interface TodoEditorModalProps {
  isOpen: boolean;
  todo?: Todo;
  onClose: () => void;
  onSave: (id: string, data: TodoFormData) => void;
}

// ============================================================================
// FORM STATE SHAPE
// ============================================================================
interface FormState {
  text: string;
  description: string;
  tags: string[];
  notes: string;
  priority: TodoPriority;
  dueDate: string;
}

const buildFormState = (todo?: Todo): FormState => ({
  text: todo?.text || "",
  description: todo?.description || "",
  tags: todo?.tags || [],
  notes: todo?.notes || "",
  priority: todo?.priority || "medium",
  dueDate: todo?.dueDate ? formatDateForInput(todo.dueDate) : "",
});

const TAG_COLORS: Record<
  "blue" | "green" | "amber",
  { dot: string; chip: string; swatch: string; ring: string }
> = {
  blue: {
    dot: "bg-blue-400",
    chip: "border-blue-500/30 bg-blue-500/14 text-blue-200",
    swatch: "bg-blue-500",
    ring: "ring-blue-300/70",
  },
  green: {
    dot: "bg-emerald-400",
    chip: "border-emerald-500/30 bg-emerald-500/14 text-emerald-200",
    swatch: "bg-emerald-500",
    ring: "ring-emerald-300/70",
  },
  amber: {
    dot: "bg-amber-400",
    chip: "border-amber-500/30 bg-amber-500/14 text-amber-200",
    swatch: "bg-amber-500",
    ring: "ring-amber-300/70",
  },
};

const PRESET_TAG_COLORS = ["blue", "green", "amber"] as const;

const getTagColorStyles = (color: TodoTagColor) => {
  if (color in TAG_COLORS) {
    return TAG_COLORS[color as keyof typeof TAG_COLORS];
  }

  return {
    dot: "",
    chip: "border-(--color-border) bg-(--color-fg)/[0.08] text-(--color-fg)/90",
    swatch: "",
    ring: "ring-(--color-fg)/40",
  };
};

const FIELD_CLASS =
  "rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-fg) placeholder:text-(--color-fg)/35 shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-fg)/20";

const mergeTags = (
  catalog: TodoTagDefinition[],
  selected: string[],
): TodoTagDefinition[] => {
  const seen = new Set(catalog.map((tag) => tag.name.toLowerCase()));
  const extras = selected
    .filter((tag) => !seen.has(tag.toLowerCase()))
    .map((name) => ({ name, color: "blue" as TodoTagColor }));

  return [...catalog, ...extras];
};

// ============================================================================
// COMPONENT
// ============================================================================
export const TodoEditorModal = ({
  isOpen,
  todo,
  onClose,
  onSave,
}: TodoEditorModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="overflow-visible border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:max-w-sm sm:rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          {todo ? "Edit task" : "Add task"}
        </DialogTitle>
        <TodoEditorModalBody
          key={todo?.id ?? "new"}
          todo={todo}
          onClose={onClose}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
};

const TodoEditorModalBody = ({
  todo,
  onClose,
  onSave,
}: Omit<TodoEditorModalProps, "isOpen">) => {
  const initialForm = buildFormState(todo);
  const [form, setForm] = useState<FormState>(initialForm);
  const [availableTags, setAvailableTags] = useState<TodoTagDefinition[]>(() =>
    mergeTags(todoStorage.loadTags(), initialForm.tags),
  );
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<TodoTagColor>("blue");
  const [isTagFormOpen, setIsTagFormOpen] = useState(false);
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [tagButtonWidth, setTagButtonWidth] = useState<number>();
  const tagsButtonRef = useRef<HTMLButtonElement | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.text.trim().length > 0;
  const isEditing = !!todo;
  const saveLabel = isEditing ? "Update task" : "Save task";
  const mergedTags = mergeTags(availableTags, form.tags);

  useEffect(() => {
    if (!isTagsOpen) return;

    const updateWidth = () => {
      setTagButtonWidth(tagsButtonRef.current?.getBoundingClientRect().width);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isTagsOpen]);

  const handleSave = () => {
    if (!isValid) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const formData: TodoFormData = {
      text: form.text.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      dueDate: parseDateInput(form.dueDate),
      tags: form.tags.length > 0 ? form.tags : undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      onSave(todo?.id || "", formData);
      onClose();
    } catch (error) {
      console.error("Failed to save todo:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isValid) {
      handleSave();
    }
  };

  const toggleTag = (tagName: string) => {
    const exists = form.tags.includes(tagName);
    setField(
      "tags",
      exists
        ? form.tags.filter((tag) => tag !== tagName)
        : [...form.tags, tagName],
    );
  };

  const handleCreateTag = () => {
    const name = newTagName.trim();
    if (!name) return;

    const duplicate = availableTags.some(
      (tag) =>
        tag.name.toLowerCase() === name.toLowerCase() &&
        tag.name.toLowerCase() !== editingTagName?.toLowerCase(),
    );
    if (duplicate) return;

    const nextTags = editingTagName
      ? availableTags.map((tag) =>
          tag.name === editingTagName ? { name, color: newTagColor } : tag,
        )
      : [...availableTags, { name, color: newTagColor }];

    setAvailableTags(nextTags);
    todoStorage.saveTags(nextTags);
    if (editingTagName) {
      setField(
        "tags",
        form.tags.map((tag) => (tag === editingTagName ? name : tag)),
      );
    }
    setIsTagFormOpen(false);
    setEditingTagName(null);
    setNewTagName("");
    setNewTagColor("blue");
  };

  const handleEditTag = (tag: TodoTagDefinition) => {
    setEditingTagName(tag.name);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setIsTagFormOpen(true);
  };

  const handleDeleteTag = (tagName: string) => {
    const nextTags = availableTags.filter((tag) => tag.name !== tagName);
    setAvailableTags(nextTags);
    todoStorage.saveTags(nextTags);
    setField(
      "tags",
      form.tags.filter((tag) => tag !== tagName),
    );
    if (editingTagName === tagName) {
      setEditingTagName(null);
      setIsTagFormOpen(false);
      setNewTagName("");
      setNewTagColor("blue");
    }
  };

  return (
    <>
      <div
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
        onKeyDown={handleKeyDown}
      >
        <Input
          type="text"
          value={form.text}
          onChange={(e) => setField("text", e.target.value)}
          placeholder="Task title..."
          className={cn(FIELD_CLASS, "h-10")}
        />

        <Textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Description..."
          className={cn(FIELD_CLASS, "min-h-[68px] resize-none py-2.5")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            value={form.priority}
            onChange={(e) =>
              setField("priority", e.target.value as TodoPriority)
            }
            className={cn(FIELD_CLASS, "h-10 appearance-none pr-10")}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>

          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => setField("dueDate", e.target.value)}
            className={cn(FIELD_CLASS, "h-10 [color-scheme:dark]")}
          />
        </div>

        <Textarea
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="Notes..."
          className={cn(FIELD_CLASS, "min-h-[68px] resize-none py-2.5")}
        />
      </div>

      <div className=" px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Popover open={isTagsOpen} onOpenChange={setIsTagsOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={tagsButtonRef}
                type="button"
                variant="outline"
                className="h-8 flex-1 justify-start rounded-xl border-(--color-border) bg-transparent px-3 text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
              >
                <Tag />
                Tags
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              sideOffset={12}
              className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
              style={{ width: tagButtonWidth }}
            >
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-(--color-fg)">Tags</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTagName(null);
                        setNewTagName("");
                        setNewTagColor("blue");
                        setIsTagFormOpen(
                          (prev) => !prev || editingTagName !== null,
                        );
                      }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-(--color-border) text-(--color-fg)/65 transition-colors hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                      aria-label="New tag"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {mergedTags.length === 0 ? (
                  <p className="mb-4 text-sm text-(--color-fg)/45">
                    No tags yet. Create one!
                  </p>
                ) : (
                  <div className="mb-4 flex flex-col gap-2">
                    {mergedTags.map((tag) => {
                      const color = getTagColorStyles(tag.color);
                      const isSelected = form.tags.includes(tag.name);

                      return (
                        <div
                          key={tag.name}
                          onClick={() => toggleTag(tag.name)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleTag(tag.name);
                            }
                          }}
                          aria-pressed={isSelected}
                          className={cn(
                            "inline-flex w-full cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-(--color-fg)/20",
                            color.chip,
                            !isSelected && "opacity-75 hover:opacity-100",
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
                            <span
                              className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                color.dot,
                              )}
                              style={
                                color.dot
                                  ? undefined
                                  : { backgroundColor: tag.color }
                              }
                            />
                            <span className="min-w-0 truncate">{tag.name}</span>
                          </div>
                          <span className="ml-auto flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTag(tag);
                              }}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-md text-current/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-current"
                              aria-label={`Edit ${tag.name} tag`}
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTag(tag.name);
                              }}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-md text-current/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-current"
                              aria-label={`Delete ${tag.name} tag`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isTagFormOpen && (
                  <>
                    <Separator className="mb-4 bg-(--color-border)" />

                    <div className="space-y-3">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name..."
                        className={cn(FIELD_CLASS, "h-9")}
                      />

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {PRESET_TAG_COLORS.map((colorKey) => (
                            <button
                              key={colorKey}
                              type="button"
                              onClick={() => setNewTagColor(colorKey)}
                              className={cn(
                                "h-7 w-7 rounded-lg transition-transform hover:scale-105",
                                TAG_COLORS[colorKey].swatch,
                                newTagColor === colorKey &&
                                  `ring-2 ring-offset-2 ring-offset-(--color-bg) ${TAG_COLORS[colorKey].ring}`,
                              )}
                              aria-label={`Select ${colorKey} tag color`}
                            />
                          ))}
                          <label
                            className="relative inline-flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-(--color-border)"
                            style={{
                              background:
                                "conic-gradient(#ff4d4d, #ffb84d, #f5ff4d, #4dff88, #4dd2ff, #7a5cff, #ff5ce1, #ff4d4d)",
                            }}
                          >
                            <input
                              type="color"
                              value={
                                newTagColor.startsWith("#")
                                  ? newTagColor
                                  : "#3b82f6"
                              }
                              onChange={(e) => setNewTagColor(e.target.value)}
                              className="absolute inset-0 cursor-pointer opacity-0"
                              aria-label="Choose custom tag color"
                            />
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTagName(null);
                              setIsTagFormOpen(false);
                              setNewTagName("");
                              setNewTagColor("blue");
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-(--color-border) text-(--color-fg)/65 transition-colors hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                            aria-label="Dismiss tag form"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateTag}
                            disabled={!newTagName.trim()}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={
                              editingTagName ? "Update tag" : "Create tag"
                            }
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="h-8 w-8 rounded-xl bg-white p-0 text-black hover:bg-white/90"
            aria-label={saveLabel}
            title={saveLabel}
          >
            <Check />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent p-0 text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
            aria-label="Close modal"
            title="Close"
          >
            <X />
          </Button>
        </div>
      </div>
    </>
  );
};
