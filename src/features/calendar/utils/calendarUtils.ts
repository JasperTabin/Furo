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
};

export type CalendarTimeParts = {
  hour: string;
  minute: string;
  period: "AM" | "PM";
};

export const DEFAULT_EVENT_TIME = "09:00";

export const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

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

export const getMonthGrid = (monthDate: Date): CalendarDay[] => {
  const firstDayOfMonth = startOfMonth(monthDate);
  const year = firstDayOfMonth.getFullYear();
  const month = firstDayOfMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    const date = new Date(year, month, dayNumber);

    return {
      date,
      dateKey: getDateKey(date),
      dayNumber,
      isToday: isSameDay(date, new Date()),
    };
  });
};

export const sortCalendarEvents = (left: CalendarEvent, right: CalendarEvent) => {
  const dateCompare = left.date.localeCompare(right.date);
  if (dateCompare !== 0) return dateCompare;

  const leftTime = left.time || "99:99";
  const rightTime = right.time || "99:99";
  const timeCompare = leftTime.localeCompare(rightTime);
  if (timeCompare !== 0) return timeCompare;

  return left.createdAt - right.createdAt;
};
