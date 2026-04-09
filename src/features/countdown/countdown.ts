// ============================================================================
// TYPES
// ============================================================================
export interface CountdownEvent {
  name: string;
  date: Date;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
export const STORAGE_KEY = "furo-countdown-event";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const formatDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseCountdownDate = (dateValue: string): Date => {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
};

// ============================================================================
// STORAGE UTILITIES
// ============================================================================
export const loadSavedEvent = (): { name: string; date: Date | null } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { name, date } = JSON.parse(saved);
      if (typeof date === "string") {
        if (DATE_ONLY_PATTERN.test(date)) {
          return { name, date: parseCountdownDate(date) };
        }

        const parsedDate = new Date(date);
        if (!Number.isNaN(parsedDate.getTime())) {
          return { name, date: parsedDate };
        }
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { name: "", date: null };
};

export const saveEvent = (name: string, date: Date): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name, date: formatDateInputValue(date) }),
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to save countdown event:", error);
    }
  }
};

export const deleteEvent = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to delete countdown event:", error);
    }
  }
};

// ============================================================================
// TIME UTILITIES
// ============================================================================
export const calculateTimeLeft = (targetDate: Date | null): TimeLeft => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }

  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
};

export const getCalendarDayDifference = (targetDate: Date, now = new Date()) => {
  const currentDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );

  return Math.round(
    (targetDay.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24),
  );
};
