// Shared tag color config — imported by both TodoEditorModal and todo-ui

export const TAG_COLORS: { key: string; swatch: string; chip: string }[] = [
  {
    key: "blue",
    swatch: "bg-blue-500",
    chip: "border-blue-500/30 bg-blue-500/15 text-blue-300",
  },
  {
    key: "green",
    swatch: "bg-emerald-500",
    chip: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  },
  {
    key: "amber",
    swatch: "bg-amber-500",
    chip: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  },
  {
    key: "red",
    swatch: "bg-red-500",
    chip: "border-red-500/30 bg-red-500/15 text-red-300",
  },
  {
    key: "purple",
    swatch: "bg-purple-500",
    chip: "border-purple-500/30 bg-purple-500/15 text-purple-300",
  },
];

export const getTagChipClass = (color: string): string =>
  TAG_COLORS.find((c) => c.key === color)?.chip ??
  "border-(--color-border) bg-(--color-fg)/8 text-(--color-fg)/80";
