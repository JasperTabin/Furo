// CALENDAR VIEW - Container & orchestration logic

import type { FormEvent } from "react";
import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
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
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [formData, setFormData] = useState<CalendarEventInput>(createFormData);

  const { eventsByDate, addEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const monthDays = getMonthGrid(displayMonth);
  const selectedEvents = eventsByDate[selectedDateKey] ?? [];
  const timeParts = getTimeParts(formData.time);

  const handleResetForm = () => {
    setEditingEventId(null);
    setIsLimitModalOpen(false);
    setFormData(createFormData());
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDateKey(getDateKey(date));
    setDisplayMonth(startOfMonth(date));
    setIsLimitModalOpen(false);
    handleResetForm();
  };

  const handleFormChange = (
    field: keyof CalendarEventInput,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditEvent = (calendarEvent: CalendarEvent) => {
    setEditingEventId(calendarEvent.id);
    setFormData(createFormData(calendarEvent));
  };

  const handleDeleteEvent = (id: string) => {
    if (editingEventId === id) {
      handleResetForm();
    }

    deleteEvent(id);
  };

  const handleSaveEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingEventId && selectedEvents.length >= 5) {
      setIsLimitModalOpen(true);
      return;
    }

    const didSave = editingEventId
      ? updateEvent(editingEventId, formData)
      : addEvent(selectedDateKey, formData);

    if (didSave) {
      handleResetForm();
    }
  };

  return (
    <>
      <Calendar
        displayMonth={displayMonth}
        monthDays={monthDays}
        selectedDateKey={selectedDateKey}
        eventsByDate={eventsByDate}
        formData={formData}
        timeParts={timeParts}
        onMonthChange={(direction) =>
          setDisplayMonth((prev) => addMonths(prev, direction))
        }
        onDateSelect={handleDateSelect}
        onResetForm={handleResetForm}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onFormChange={handleFormChange}
        onSaveEvent={handleSaveEvent}
      />

      <Modal isOpen={isLimitModalOpen} maxWidth="w-full sm:max-w-sm mx-auto">
        <div className="space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-(--color-fg)/50">
              Limit reached
            </p>
            <h3 className="text-xl font-bold">
              You can only add up to 5 events per day.
            </h3>
            <p className="text-sm text-(--color-fg)/60">
              Delete an event or edit an existing one to make changes.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsLimitModalOpen(false)}
              className="btn-base btn-active"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
