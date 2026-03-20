import { useEffect, useMemo, useState } from "react";
import { calendarStorage } from "../services/calendarStorage";
import {
  normalizeEventTime,
  sortCalendarEvents,
  type CalendarEvent,
  type CalendarEventInput,
} from "../utils/calendarUtils";

const MAX_EVENTS_PER_DAY = 5;
const createEventId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
  calendarStorage.load().sort(sortCalendarEvents),
);

  useEffect(() => {
    calendarStorage.save(events);
  }, [events]);

  const addEvent = (date: string, input: CalendarEventInput) => {
    const title = input.title.trim();
    if (!title) return false;
    if (events.filter((event) => event.date === date).length >= MAX_EVENTS_PER_DAY) {
      return false;
    }

    const newEvent: CalendarEvent = {
      id: createEventId(),
      date,
      title,
      time: normalizeEventTime(input.time),
      notes: input.notes.trim() || undefined,
      createdAt: Date.now(),
    };

    setEvents((prev) => [...prev, newEvent].sort(sortCalendarEvents));
    return true;
  };

  const updateEvent = (id: string, input: CalendarEventInput) => {
    const title = input.title.trim();
    if (!title) return false;

    setEvents((prev) =>
      prev
        .map((event) =>
          event.id === id
            ? {
                ...event,
                title,
                time: normalizeEventTime(input.time),
                notes: input.notes.trim() || undefined,
              }
            : event,
        )
        .sort(sortCalendarEvents),
    );

    return true;
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const eventsByDate = useMemo(() => {
    const groupedEvents: Record<string, CalendarEvent[]> = {};

    events.forEach((event) => {
      if (!groupedEvents[event.date]) {
        groupedEvents[event.date] = [];
      }

      groupedEvents[event.date].push(event);
    });

    return groupedEvents;
  }, [events]);

  return {
    eventsByDate,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
