// Dark & Light mode - Button with integrated theme logic

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";

type Theme = "light" | "dark";

interface ThemeToggleProps {
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

type ThemeOption = "light" | "dark";

// Theme hook logic integrated into the component
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      return stored || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, toggleTheme, setThemeMode };
};

export const ThemeToggle = ({ theme: controlledTheme, onThemeChange }: ThemeToggleProps) => {
  const { theme, setThemeMode } = useTheme();
  const currentTheme = controlledTheme ?? theme;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (themeOption: ThemeOption) => {
    setThemeMode(themeOption);
    onThemeChange?.(themeOption);
    setIsOpen(false);
  };

  const getCurrentIcon = () =>
    currentTheme === "light" ? <Sun size={20} /> : <Moon size={20} />;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-theme-trigger"
        aria-label="Theme options"
      >
        {getCurrentIcon()}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-(--color-bg) border-2 border-(--color-border) rounded-lg shadow-xl z-50">
          <button
            onClick={() => handleThemeSelect("light")}
            className={`btn-theme-item ${currentTheme === "light" ? 'btn-theme-item-active' : ''}`}
          >
            <Sun size={18} />
            <span className="text-sm font-semibold">Light</span>
            {currentTheme === "light" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </button>

          <button
            onClick={() => handleThemeSelect("dark")}
            className={`btn-theme-item ${currentTheme === "dark" ? 'btn-theme-item-active' : ''}`}
          >
            <Moon size={18} />
            <span className="text-sm font-semibold">Dark</span>
            {currentTheme === "dark" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
