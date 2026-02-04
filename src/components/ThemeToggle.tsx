// components/ThemeToggle.tsx

import { useState, useRef, useEffect } from "react";
import { Monitor, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

/* ─────────────────────────────
   Tailwind class presets
   ───────────────────────────── */

const buttonClass =
  "flex items-center gap-2 p-2 rounded-md hover:bg-[var(--color-border)]/20 transition-colors";

const dropdownClass =
  "absolute top-12 right-0 w-48 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden z-50";

const menuItemClass =
  "flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-border)]/20 transition-colors cursor-pointer";

const menuItemActive =
  "flex items-center gap-3 px-4 py-3 bg-[var(--color-border)]/30 cursor-pointer";

/* ───────────────────────────── */

type ThemeOption = "light" | "dark" | "system";

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

  const getCurrentIcon = () => {
    if (theme === "light") return <Sun size={20} />;
    if (theme === "dark") return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Toggle Button */}
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
            <div className="flex-1">
              <div className="text-sm font-semibold">Light</div>
              <div className="text-xs text-(--color-border)">Light mode</div>
            </div>
            {theme === "light" && (
              <div className="w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </div>

          {/* Dark Option */}
          <div
            onClick={() => handleThemeSelect("dark")}
            className={theme === "dark" ? menuItemActive : menuItemClass}
          >
            <Moon size={18} />
            <div className="flex-1">
              <div className="text-sm font-semibold">Dark</div>
              <div className="text-xs text-(--color-border)">Dark mode</div>
            </div>
            {theme === "dark" && (
              <div className="w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </div>

          {/* System Option */}
          <div
            onClick={() => handleThemeSelect("system")}
            className={theme === "system" ? menuItemActive : menuItemClass}
          >
            <Monitor size={18} />
            <div className="flex-1">
              <div className="text-sm font-semibold">System</div>
              <div className="text-xs text-(--color-border)">Follow system</div>
            </div>
            {theme === "system" && (
              <div className="w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};