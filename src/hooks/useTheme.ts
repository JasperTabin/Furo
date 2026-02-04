// hooks/useTheme.ts
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage or default to system
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      return stored || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (themeToApply: "light" | "dark") => {
      if (themeToApply === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(systemPrefersDark ? "dark" : "light");

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const getAppliedTheme = (): "light" | "dark" => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  return { theme, toggleTheme, setThemeMode, getAppliedTheme };
};