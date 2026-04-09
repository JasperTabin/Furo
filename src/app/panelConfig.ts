// Defines what panels exist, their default order, and how to save/load that order from localStorage.

export type AppView = "timer" | "todo" | "calendar" | "music" | "countdown";

export const ALL_PANELS: AppView[] = [
  "timer",
  "music",
  "countdown",
  "calendar",
  "todo",
];

const PANEL_ORDER_STORAGE_KEY = "furo-panel-order";

const isAppView = (value: unknown): value is AppView =>
  typeof value === "string" && ALL_PANELS.includes(value as AppView);

export const readPanelOrder = (): AppView[] => {
  if (typeof window === "undefined") return ALL_PANELS;

  try {
    const raw = window.localStorage.getItem(PANEL_ORDER_STORAGE_KEY);
    if (!raw) return ALL_PANELS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return ALL_PANELS;

    const validPanels = parsed.filter(isAppView);
    const missingPanels = ALL_PANELS.filter(
      (panel) => !validPanels.includes(panel),
    );
    return [...validPanels, ...missingPanels];
  } catch {
    return ALL_PANELS;
  }
};

export const persistPanelOrder = (panels: AppView[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PANEL_ORDER_STORAGE_KEY, JSON.stringify(panels));
};
