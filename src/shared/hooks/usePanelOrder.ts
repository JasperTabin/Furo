import { useEffect, useState } from "react";
import { ALL_PANELS, type AppView } from "../../app/panelConfig";

const STORAGE_KEY = "furo-panel-order";

const isAppView = (value: unknown): value is AppView =>
  typeof value === "string" && ALL_PANELS.includes(value as AppView);

const loadPanelOrder = (): AppView[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ALL_PANELS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return ALL_PANELS;
    const valid = parsed.filter(isAppView);
    const missing = ALL_PANELS.filter((p) => !valid.includes(p));
    return [...valid, ...missing];
  } catch {
    return ALL_PANELS;
  }
};

export const usePanelOrder = () => {
  const [panelOrder, setPanelOrder] = useState<AppView[]>(loadPanelOrder);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(panelOrder));
  }, [panelOrder]);

  const reorderPanels = (from: AppView, to: AppView) => {
    setPanelOrder((prev) => {
      const fromIndex = prev.indexOf(from);
      const toIndex = prev.indexOf(to);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
        return prev;
      const next = [...prev];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
  };

  const resetOrder = () => setPanelOrder(ALL_PANELS);

  return { panelOrder, reorderPanels, resetOrder };
};
