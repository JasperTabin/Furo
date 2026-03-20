// CALENDAR VIEW - Container & orchestration logic

import type { FormEvent } from "react";
import { useState } from "react";
import { Calendar } from "./Calendar";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import {
  DEFAULT_EVENT_TIME,
  addMonths,
  getDateKey,
  getMonthGrid,
  getTimeParts,
  startOfMonth,
  type CalendarEvent,
  type CalendarEventInput,
} from "../utils/calendarUtils";

const createFormData = (calendarEvent?: CalendarEvent): CalendarEventInput => ({
  title: calendarEvent?.title ?? "",
  time: calendarEvent?.time ?? DEFAULT_EVENT_TIME,
  notes: calendarEvent?.notes ?? "",
});

export const CalendarView = () => {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(today));
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDateKey(today));
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CalendarEventInput>(createFormData);
  const [eventsPage, setEventsPage] = useState(0);

  const { eventsByDate, addEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const monthDays = getMonthGrid(displayMonth);
  const selectedEvents = eventsByDate[selectedDateKey] ?? [];
  const timeParts = getTimeParts(formData.time);

  const handleResetForm = () => {
    setEditingEventId(null);
    setFormData(createFormData());
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDateKey(getDateKey(date));
    setDisplayMonth(startOfMonth(date));
    setEventsPage(0);
    handleResetForm();
  };

  const handleFormChange = (field: keyof CalendarEventInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditEvent = (calendarEvent: CalendarEvent) => {
    setEditingEventId(calendarEvent.id);
    setFormData(createFormData(calendarEvent));
  };

  const handleDeleteEvent = (id: string) => {
    if (editingEventId === id) handleResetForm();
    deleteEvent(id);

    // Go back a page if current page becomes empty
    const remainingEvents = selectedEvents.filter(e => e.id !== id);
    const newTotalPages = Math.ceil(remainingEvents.length / 3);
    if (eventsPage >= newTotalPages && eventsPage > 0) {
      setEventsPage(eventsPage - 1);
    }
  };

  const handleSaveEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const didSave = editingEventId
      ? updateEvent(editingEventId, formData)
      : addEvent(selectedDateKey, formData);
    if (didSave) handleResetForm();
  };

  return (
    <Calendar
      displayMonth={displayMonth}
      monthDays={monthDays}
      selectedDateKey={selectedDateKey}
      eventsByDate={eventsByDate}
      formData={formData}
      timeParts={timeParts}
      eventsPage={eventsPage}
      onMonthChange={(direction) =>
        setDisplayMonth((prev) => addMonths(prev, direction))
      }
      onDateSelect={handleDateSelect}
      onResetForm={handleResetForm}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onFormChange={handleFormChange}
      onSaveEvent={handleSaveEvent}
      onEventsPageChange={setEventsPage}
    />
  );
};