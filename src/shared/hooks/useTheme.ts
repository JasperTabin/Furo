import { useState, useEffect } from "react";

export type Mode = "light" | "dark";
export type Palette = "default" | "slate" | "rose";

export interface PaletteOption {
  id: Palette;
  label: string;
  swatch: string;
  light: string;
  dark: string;
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  {
    id: "default",
    label: "Default",
    swatch: "#1a1a1a",
    light: "#ffffff",
    dark: "#000000",
  },
  {
    id: "slate",
    label: "Soft Slate",
    swatch: "#1e2a3a",
    light: "#f0f4f8",
    dark: "#1e2a3a",
  },

  {
    id: "rose",
    label: "Rose",
    swatch: "#3d1a24",
    light: "#fdf0f3",
    dark: "#2a1018",
  },
];

const applyTheme = (palette: Palette, mode: Mode) => {
  const root = document.documentElement;
  root.classList.remove("dark", "palette-slate", "palette-rose");
  if (mode === "dark") root.classList.add("dark");
  if (palette !== "default") root.classList.add(`palette-${palette}`);
};

const savedMode = (localStorage.getItem("furo-mode") as Mode) ?? "light";
const savedPalette =
  (localStorage.getItem("furo-palette") as Palette) ?? "default";
applyTheme(savedPalette, savedMode);

let listeners: Array<() => void> = [];
const notify = () => listeners.forEach((fn) => fn());

export const useTheme = () => {
  const [, rerender] = useState(0);

  useEffect(() => {
    const handler = () => rerender((n) => n + 1);
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const mode = (localStorage.getItem("furo-mode") as Mode) ?? "light";
  const palette =
    (localStorage.getItem("furo-palette") as Palette) ?? "default";

  const setMode = (m: Mode) => {
    localStorage.setItem("furo-mode", m);
    applyTheme(palette, m);
    notify();
  };

  const setPalette = (p: Palette) => {
    localStorage.setItem("furo-palette", p);
    applyTheme(p, mode);
    notify();
  };

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  return {
    mode,
    palette,
    setMode,
    setPalette,
    toggleMode,
    theme: mode,
    setTheme: setMode,
  };
};
