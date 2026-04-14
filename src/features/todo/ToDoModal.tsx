import { Check, Plus, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Todo, TodoFormData, TodoPriority } from "./todo";
import { getTagChipClass, TAG_COLORS } from "./todo";
import { useTodoEditorForm } from "./useTodo";

interface TodoEditorModalProps {
  isOpen: boolean;
  todo?: Todo;
  onClose: () => void;
  onSave: (id: string, data: TodoFormData) => void;
}

const FIELD_CLASS =
  "rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-fg) placeholder:text-(--color-fg)/35 shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-fg)/20";

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
  const {
    form,
    isTagsOpen,
    tagInput,
    selectedColor,
    tagInputRef,
    tagsButtonRef,
    tagButtonWidth,
    isValid,
    saveLabel,
    setField,
    setTagInput,
    setSelectedColor,
    openTags,
    addTag,
    removeTag,
    handleSave,
  } = useTodoEditorForm({ todo, onClose, onSave });

  return (
    <>
      <div
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isValid) {
            handleSave();
          }
        }}
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
          className={cn(FIELD_CLASS, "min-h-17 resize-none py-2.5")}
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
          className={cn(FIELD_CLASS, "min-h-17 resize-none py-2.5")}
        />
      </div>

      <div className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Popover open={isTagsOpen} onOpenChange={openTags}>
            <PopoverTrigger asChild>
              <Button
                ref={tagsButtonRef}
                type="button"
                variant="outline"
                className="h-8 flex-1 justify-start gap-1.5 rounded-xl border-(--color-border) bg-transparent px-3 text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
              >
                <Tag className="h-3.5 w-3.5 shrink-0" />
                {form.tags.length > 0 ? (
                  <span className="truncate text-xs text-(--color-fg)">
                    {form.tags.map((t) => t.name).join(", ")}
                  </span>
                ) : (
                  <span className="text-xs">Tags</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={8}
              className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-3 text-(--color-fg) shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
              style={{ width: tagButtonWidth }}
            >
              {form.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium",
                        getTagChipClass(tag.color),
                      )}
                    >
                      #{tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.name)}
                        className="rounded opacity-60 transition-opacity hover:opacity-100"
                        aria-label={`Remove ${tag.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <Input
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Tag name..."
                className={cn(FIELD_CLASS, "mb-2 h-8 w-full text-xs")}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {TAG_COLORS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setSelectedColor(c.key)}
                      aria-label={`${c.key} color`}
                      className={cn(
                        "h-5 w-5 shrink-0 rounded-full transition-transform hover:scale-110",
                        c.swatchClassName,
                        selectedColor === c.key
                          ? "todo-icon-button-selected"
                          : "opacity-40",
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="todo-icon-button-primary"
                    aria-label="Add tag"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openTags(false)}
                    className="todo-icon-button"
                    aria-label="Close tag picker"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="h-8 w-8 rounded-xl bg-(--color-fg) p-0 text-(--color-bg) hover:opacity-90"
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
