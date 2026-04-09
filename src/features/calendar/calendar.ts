// ============================================================================
// TYPES
// ============================================================================
export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time?: string;
  notes?: string;
  createdAt: number;
};

export type CalendarEventInput = {
  title: string;
  time: string;
  notes: string;
};

export type CalendarDay = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
};

export type CalendarTimeParts = {
  hour: string;
  minute: string;
  period: "AM" | "PM";
};

// ============================================================================
// CONSTANTS
// ============================================================================
export const DEFAULT_EVENT_TIME = "09:00";
export const STORAGE_KEY = "furo-calendar-events";
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const panelDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const selectedDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "long",
  day: "numeric",
});

// ============================================================================
// DATE UTILITIES
// ============================================================================
export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const isSameDay = (left: Date, right: Date) =>
  getDateKey(left) === getDateKey(right);

export const getMonthLabel = (date: Date) => monthFormatter.format(date);

export const formatPanelDate = (dateKey: string) =>
  panelDateFormatter.format(parseDateKey(dateKey));

export const formatSelectedDate = (dateKey: string) =>
  selectedDateFormatter.format(parseDateKey(dateKey));

export const getMonthGrid = (monthDate: Date): CalendarDay[] => {
  const firstDayOfMonth = startOfMonth(monthDate);
  const year = firstDayOfMonth.getFullYear();
  const month = firstDayOfMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const grid: CalendarDay[] = [];

  // Previous month days
  if (firstDayOfWeek > 0) {
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNumber = prevMonthDays - i;
      const date = new Date(year, month - 1, dayNumber);
      grid.push({
        date,
        dateKey: getDateKey(date),
        dayNumber,
        isToday: isSameDay(date, new Date()),
        isCurrentMonth: false,
      });
    }
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    grid.push({
      date,
      dateKey: getDateKey(date),
      dayNumber: i,
      isToday: isSameDay(date, new Date()),
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingCells = 42 - grid.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    grid.push({
      date,
      dateKey: getDateKey(date),
      dayNumber: i,
      isToday: isSameDay(date, new Date()),
      isCurrentMonth: false,
    });
  }

  return grid;
};

// ============================================================================
// TIME UTILITIES
// ============================================================================
export const formatEventTime = (time?: string) => {
  if (!time) return "Any time";

  const [hoursString = "", minutesString = ""] = time.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "Any time";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const displayMinutes = `${minutes}`.padStart(2, "0");

  return `${displayHour}:${displayMinutes} ${suffix}`;
};

export const normalizeEventTime = (time: string) => {
  const trimmedTime = time.trim();
  if (!trimmedTime) return undefined;

  const [hoursString = "", minutesString = ""] = trimmedTime.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return undefined;
  }

  return `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}`;
};

export const getTimeParts = (time?: string): CalendarTimeParts => {
  const normalizedTime = normalizeEventTime(time ?? "") ?? DEFAULT_EVENT_TIME;
  const [hoursString, minutesString] = normalizedTime.split(":");
  const hours = Number(hoursString);
  const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return {
    hour: `${displayHour}`.padStart(2, "0"),
    minute: minutesString,
    period,
  };
};

export const buildTimeValue = (
  hour: string,
  minute: string,
  period: "AM" | "PM",
) => {
  const rawHour = Number(hour);
  const hours24 =
    period === "PM"
      ? rawHour === 12
        ? 12
        : rawHour + 12
      : rawHour === 12
        ? 0
        : rawHour;

  return `${`${hours24}`.padStart(2, "0")}:${minute}`;
};

// ============================================================================
// EVENT UTILITIES
// ============================================================================
export const sortCalendarEvents = (
  left: CalendarEvent,
  right: CalendarEvent,
) => {
  const dateCompare = left.date.localeCompare(right.date);
  if (dateCompare !== 0) return dateCompare;

  const leftTime = left.time || "99:99";
  const rightTime = right.time || "99:99";
  const timeCompare = leftTime.localeCompare(rightTime);
  if (timeCompare !== 0) return timeCompare;

  return left.createdAt - right.createdAt;
};

export const createEventId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ============================================================================
// STORAGE UTILITIES
// ============================================================================
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

export const loadEvents = (): CalendarEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isCalendarEvent) : [];
  } catch {
    return [];
  }
};

export const saveEvents = (data: CalendarEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to save calendar events:", error);
    }
  }
};
