// components/ThemeToggle.tsx

import { useTheme } from "../hooks/useTheme";

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const toggleWrapper =
  "relative inline-block w-11 h-6 cursor-pointer";

const toggleTrack =
  "absolute inset-0 rounded-full border-2 border-[var(--color-border)] transition-colors duration-200 ease-in-out";

const toggleThumb =
  "absolute top-1/2 left-[0.3rem] size-3 -translate-y-1/2 rounded-full bg-[var(--color-fg)] shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-[1.3rem]";

/* ───────────────────────────── */

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className={toggleWrapper}>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="peer sr-only"
        aria-label="Toggle theme"
      />

      <span className={toggleTrack} />
      <span className={toggleThumb} />
    </label>
  );
};
