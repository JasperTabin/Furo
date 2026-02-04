// components/ThemeToggle.tsx – Dark/Light theme toggle only

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const buttonClass =
  "flex items-center gap-2 p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors";

const dropdownClass =
  "absolute top-12 right-0 w-40 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden z-50";

const menuItemClass =
  "flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-border)]/20 transition-colors cursor-pointer";

const menuItemActive =
  "flex items-center gap-3 px-4 py-3 bg-[var(--color-border)]/30 cursor-pointer";

/* ───────────────────────────── */

type ThemeOption = "light" | "dark";

export const ThemeToggle = () => {
  const { theme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (themeOption: ThemeOption) => {
    setThemeMode(themeOption);
    setIsOpen(false);
  };

  const getCurrentIcon = () =>
    theme === "light" ? <Sun size={20} /> : <Moon size={20} />;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        aria-label="Theme options"
      >
        {getCurrentIcon()}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={dropdownClass}>
          {/* Light Option */}
          <div
            onClick={() => handleThemeSelect("light")}
            className={theme === "light" ? menuItemActive : menuItemClass}
          >
            <Sun size={18} />
            <span className="text-sm font-semibold">Light</span>
            {theme === "light" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </div>

          {/* Dark Option */}
          <div
            onClick={() => handleThemeSelect("dark")}
            className={theme === "dark" ? menuItemActive : menuItemClass}
          >
            <Moon size={18} />
            <span className="text-sm font-semibold">Dark</span>
            {theme === "dark" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
