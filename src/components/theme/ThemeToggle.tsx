// Dark & Light mode - Button

import { useState, useRef, useEffect } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../Shared/Button";

type ThemeOption = "light" | "dark";

export const ThemeToggle = () => {
  const { theme, setThemeMode } = useTheme();
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
    setIsOpen(false);
  };

  const getCurrentIcon = () =>
    theme === "light" ? <Sun size={20} /> : <Moon size={20} />;

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="themeTrigger"
        ariaLabel="Theme options"
      >
        {getCurrentIcon()}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-40 bg-(--color-bg) border-2 border-(--color-border) rounded-lg shadow-xl overflow-hidden z-50">
          <Button
            onClick={() => handleThemeSelect("light")}
            variant={theme === "light" ? "themeItemActive" : "themeItem"}
          >
            <Sun size={18} />
            <span className="text-sm font-semibold">Light</span>
            {theme === "light" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </Button>

          <Button
            onClick={() => handleThemeSelect("dark")}
            variant={theme === "dark" ? "themeItemActive" : "themeItem"}
          >
            <Moon size={18} />
            <span className="text-sm font-semibold">Dark</span>
            {theme === "dark" && (
              <div className="ml-auto w-2 h-2 rounded-full bg-(--color-fg)" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
