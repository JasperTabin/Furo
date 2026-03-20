import type { CalendarEvent } from "../utils/calendarUtils";

const STORAGE_KEY = "furo-calendar-events";

const isCalendarEvent = (item: unknown): item is CalendarEvent => {
  if (!item || typeof item !== "object") return false;
  const e = item as Record<string, unknown>;

  return (
    typeof e.id === "string" &&
    typeof e.date === "string" &&
    typeof e.title === "string" &&
    typeof e.createdAt === "number" &&
    (e.time === undefined || typeof e.time === "string") &&
    (e.notes === undefined || typeof e.notes === "string")
  );
};

export const calendarStorage = {
  load: (): CalendarEvent[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter(isCalendarEvent) : [];
    } catch {
      return [];
    }
  },

  save: (data: CalendarEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to save calendar events:", error);
    }
  }
},
};