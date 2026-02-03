// components/ThemeToggle.tsx

import { useTheme } from "../hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-block w-11 h-6 cursor-pointer">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="peer sr-only"
        aria-label="Toggle theme"
      />

      <span
        className="
          absolute inset-0 rounded-full border-2 border-secondary
          transition-colors duration-200 ease-in-out
        "
      />

      <span
        className="
          absolute top-1/2 left-[0.3rem] size-3 -translate-y-1/2
          rounded-full bg-secondary shadow-sm
          transition-transform duration-200 ease-in-out
          peer-checked:translate-x-[1.3rem]
        "
      />
    </label>
  );
};
