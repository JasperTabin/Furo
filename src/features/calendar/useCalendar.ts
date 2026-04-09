import { useEffect, useMemo, useState } from "react";
import {
  loadEvents,
  saveEvents,
  normalizeEventTime,
  sortCalendarEvents,
  createEventId,
  type CalendarEvent,
  type CalendarEventInput,
} from "./calendar";

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    loadEvents().sort(sortCalendarEvents),
  );

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const addEvent = (date: string, input: CalendarEventInput) => {
    const title = input.title.trim();
    if (!title) return false;

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
      if (!groupedEvents[event.date]) groupedEvents[event.date] = [];
      groupedEvents[event.date].push(event);
    });
    return groupedEvents;
  }, [events]);

  return { eventsByDate, addEvent, updateEvent, deleteEvent };
};
