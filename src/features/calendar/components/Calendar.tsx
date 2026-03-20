// CALENDAR UI COMPONENTS ONLY

import type { FormEvent } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  WEEKDAY_LABELS,
  buildTimeValue,
  formatEventTime,
  formatPanelDate,
  formatSelectedDate,
  getMonthLabel,
  type CalendarDay,
  type CalendarEvent,
  type CalendarEventInput,
  type CalendarTimeParts,
} from "../utils/calendarUtils";

// ============================================================================
// CALENDAR OPTIONS & MOBILE GRID CLASSES
// ============================================================================
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  `${index + 1}`.padStart(2, "0"),
);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) =>
  `${index}`.padStart(2, "0"),
);
const PERIOD_OPTIONS = ["AM", "PM"] as const;
const EVENTS_PER_PAGE = 3;

const labelClass =
  "text-xs font-medium uppercase tracking-widest text-(--color-fg)/50";
const dayCellBaseClass =
  "relative flex w-full aspect-square items-center justify-center p-0 text-center focus:outline-none focus:ring-2 focus:ring-(--color-fg)/25 sm:min-h-0 sm:flex-col sm:items-start sm:justify-start sm:rounded-xl sm:px-4 sm:py-3 sm:text-left";
const dayCellUnselectedClass =
  "sm:border sm:border-(--color-border) sm:bg-(--color-bg) sm:transition-all sm:hover:border-(--color-border)/70";
const dayCellSelectedClass =
  "sm:border sm:border-(--color-border) sm:bg-(--color-bg) sm:transition-all";
const firstColumnClasses = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
] as const;

// ============================================================================
// CALENDAR GRID
// ============================================================================
const CalendarGrid = ({
  displayMonth,
  monthDays,
  selectedDateKey,
  eventsByDate,
  onMonthChange,
  onDateSelect,
}: {
  displayMonth: Date;
  monthDays: CalendarDay[];
  selectedDateKey: string;
  eventsByDate: Record<string, CalendarEvent[]>;
  onMonthChange: (direction: -1 | 1) => void;
  onDateSelect: (date: Date) => void;
}) => {
  const firstDayOfWeek = monthDays[0]?.date.getDay() ?? 0;

  return (
    <div className="calendar-grid min-w-0">
      <div className="calendar-heading mb-6 flex items-center justify-between gap-4 sm:mb-8">
        <h2 className="text-left text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
          {getMonthLabel(displayMonth)}
        </h2>

        <div className="flex items-center gap-2">
          {([-1, 1] as const).map((direction, index) => (
            <button
              key={direction}
              type="button"
              onClick={() => onMonthChange(direction)}
              className="flex h-9 w-9 items-center justify-center text-(--color-fg)/70 transition hover:text-(--color-fg) focus:outline-none sm:h-10 sm:w-10"
              aria-label={index === 0 ? "Previous month" : "Next month"}
            >
              {index === 0 ? (
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-0 sm:mb-4 sm:gap-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className={`${labelClass} text-center sm:text-sm sm:normal-case`}
          >
            <span className="sm:hidden">{label[0]}</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-0 gap-y-2 sm:gap-2">
        {monthDays.map((day, index) => {
          const dayEvents = eventsByDate[day.dateKey] ?? [];
          const firstEvent = dayEvents[0];
          const isSelected = day.dateKey === selectedDateKey;
          const dayCellVariantClass = isSelected
            ? dayCellSelectedClass
            : dayCellUnselectedClass;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onDateSelect(day.date)}
              className={`calendar-cell ${dayCellBaseClass} ${dayCellVariantClass} ${
                index === 0 ? firstColumnClasses[firstDayOfWeek] : ""
              }`}
              aria-label={`${formatPanelDate(day.dateKey)}. ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}.`}
            >
              <div className="flex items-center justify-center sm:w-full sm:items-start sm:justify-between">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-bold leading-none sm:h-auto sm:w-auto sm:items-start sm:justify-start sm:rounded-none sm:bg-transparent sm:text-lg sm:font-medium ${
                    isSelected
                      ? "bg-orange-500 text-(--color-bg) sm:text-orange-500"
                      : day.isToday
                        ? "bg-orange-500/10 text-orange-500"
                        : "text-(--color-fg)"
                  }`}
                >
                  {day.dayNumber}
                </span>

                {dayEvents.length > 0 && (
                  <span className="hidden items-center justify-center text-xs font-medium text-(--color-fg)/50 sm:inline-flex">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {dayEvents.length > 0 && (
                <span
                  className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-500 sm:hidden"
                  aria-hidden="true"
                />
              )}

              {firstEvent && (
                <p
                  className="hidden text-xs text-(--color-fg)/40 sm:mt-auto sm:block sm:w-full sm:truncate sm:pt-4 sm:text-xs"
                  title={firstEvent.title}
                >
                  {firstEvent.title}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// CALENDAR PANEL
// ============================================================================
const CalendarPanel = ({
  formData,
  timeParts,
  selectedDateKey,
  selectedEvents,
  eventsPage,
  onEditEvent,
  onFormChange,
  onResetForm,
  onSaveEvent,
  onDeleteEvent,
  onEventsPageChange,
}: {
  formData: CalendarEventInput;
  timeParts: CalendarTimeParts;
  selectedDateKey: string;
  selectedEvents: CalendarEvent[];
  eventsPage: number;
  onEditEvent: (calendarEvent: CalendarEvent) => void;
  onFormChange: (field: keyof CalendarEventInput, value: string) => void;
  onResetForm: () => void;
  onSaveEvent: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteEvent: (id: string) => void;
  onEventsPageChange: (page: number) => void;
}) => {
  const selectedDateLabel = formatSelectedDate(selectedDateKey);
  const eventCountLabel = `${selectedEvents.length} ${
    selectedEvents.length === 1 ? "event" : "events"
  }`;

  const totalPages = Math.ceil(selectedEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = selectedEvents.slice(
    eventsPage * EVENTS_PER_PAGE,
    eventsPage * EVENTS_PER_PAGE + EVENTS_PER_PAGE,
  );

  const handleTimeChange = (field: keyof CalendarTimeParts, value: string) => {
    const nextTimeParts: CalendarTimeParts =
      field === "hour"
        ? { ...timeParts, hour: value }
        : field === "minute"
          ? { ...timeParts, minute: value }
          : { ...timeParts, period: value as "AM" | "PM" };

    onFormChange(
      "time",
      buildTimeValue(
        nextTimeParts.hour,
        nextTimeParts.minute,
        nextTimeParts.period,
      ),
    );
  };

  return (
    <div className="calendar-panel space-y-5">
      <div className="space-y-1">
        <p className={labelClass}>Adding event for</p>
        <h3 className="text-2xl leading-none font-bold tracking-tight">
          {selectedDateLabel}
        </h3>
        <p className="text-sm text-(--color-fg)/50">Click a date to change</p>
      </div>

      <form onSubmit={onSaveEvent} className="space-y-4">
        <label className="block space-y-2">
          <span className={labelClass}>Title</span>
          <input
            value={formData.title}
            onChange={(event) => onFormChange("title", event.target.value)}
            placeholder="e.g. Google Interview"
            className="input-base w-full font-medium placeholder:text-(--color-fg)/40"
            maxLength={60}
            required
          />
        </label>

        <div className="space-y-2">
          <p className={labelClass}>Time</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                key: "hour",
                value: timeParts.hour,
                options: HOUR_OPTIONS,
                onChange: (value: string) => handleTimeChange("hour", value),
              },
              {
                key: "minute",
                value: timeParts.minute,
                options: MINUTE_OPTIONS,
                onChange: (value: string) => handleTimeChange("minute", value),
              },
              {
                key: "period",
                value: timeParts.period,
                options: PERIOD_OPTIONS,
                onChange: (value: string) => handleTimeChange("period", value),
              },
            ].map((select) => (
              <div key={select.key} className="relative">
                <select
                  value={select.value}
                  onChange={(event) => select.onChange(event.target.value)}
                  className="input-base w-full appearance-none pr-8 font-medium text-(--color-fg)"
                >
                  {select.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-(--color-fg)/40"
                />
              </div>
            ))}
          </div>
        </div>

        <label className="block space-y-2">
          <span className={labelClass}>Notes</span>
          <textarea
            value={formData.notes}
            onChange={(event) => onFormChange("notes", event.target.value)}
            placeholder="Optional..."
            rows={3}
            className="input-base w-full h-20 resize-none placeholder:text-(--color-fg)/40"
            maxLength={240}
          />
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-base btn-active flex-1">
            Save
          </button>
          <button
            type="button"
            onClick={onResetForm}
            className="btn-base btn-inactive flex-1"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className={labelClass}>Events</p>
          <span className="text-sm text-(--color-fg)/40">{eventCountLabel}</span>
        </div>

        <div className="space-y-3">
          {selectedEvents.length === 0 ? (
            <div className="card-base border-dashed px-4 py-4 text-sm text-(--color-fg)/40">
              No events yet for this day.
            </div>
          ) : (
            paginatedEvents.map((calendarEvent) => (
              <article
                key={calendarEvent.id}
                className="card-base card-hover cursor-pointer px-4 py-3 text-left"
                onClick={() => onEditEvent(calendarEvent)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <h4 className="truncate text-sm font-medium text-(--color-fg)">
                      {calendarEvent.title}
                    </h4>
                    <p className="text-xs text-(--color-fg)/50">
                      {formatEventTime(calendarEvent.time)}
                    </p>
                    {calendarEvent.notes && (
                      <p className="text-xs leading-relaxed text-(--color-fg)/50">
                        {calendarEvent.notes}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteEvent(calendarEvent.id);
                    }}
                    className="btn-danger rounded-full p-1.5"
                    aria-label={`Delete ${calendarEvent.title}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onEventsPageChange(eventsPage - 1)}
              disabled={eventsPage === 0}
              className="flex items-center gap-1 text-xs text-(--color-fg)/50 hover:text-(--color-fg) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-(--color-fg)/40">
              {eventsPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => onEventsPageChange(eventsPage + 1)}
              disabled={eventsPage >= totalPages - 1}
              className="flex items-center gap-1 text-xs text-(--color-fg)/50 hover:text-(--color-fg) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CALENDAR SHELL
// ============================================================================
export const Calendar = ({
  displayMonth,
  monthDays,
  selectedDateKey,
  eventsByDate,
  formData,
  timeParts,
  eventsPage,
  onMonthChange,
  onDateSelect,
  onEditEvent,
  onDeleteEvent,
  onFormChange,
  onResetForm,
  onSaveEvent,
  onEventsPageChange,
}: {
  displayMonth: Date;
  monthDays: CalendarDay[];
  selectedDateKey: string;
  eventsByDate: Record<string, CalendarEvent[]>;
  formData: CalendarEventInput;
  timeParts: CalendarTimeParts;
  eventsPage: number;
  onMonthChange: (direction: -1 | 1) => void;
  onDateSelect: (date: Date) => void;
  onEditEvent: (calendarEvent: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onFormChange: (field: keyof CalendarEventInput, value: string) => void;
  onResetForm: () => void;
  onSaveEvent: (event: FormEvent<HTMLFormElement>) => void;
  onEventsPageChange: (page: number) => void;
}) => {
  const selectedEvents = eventsByDate[selectedDateKey] ?? [];

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="grid gap-6 lg:items-start lg:grid-cols-[minmax(0,1fr)_360px]">
        <CalendarGrid
          displayMonth={displayMonth}
          monthDays={monthDays}
          selectedDateKey={selectedDateKey}
          eventsByDate={eventsByDate}
          onMonthChange={onMonthChange}
          onDateSelect={onDateSelect}
        />
        <div className="self-start lg:sticky lg:top-4 lg:max-h-[80dvh] lg:overflow-y-auto">
          <CalendarPanel
            formData={formData}
            timeParts={timeParts}
            selectedDateKey={selectedDateKey}
            selectedEvents={selectedEvents}
            eventsPage={eventsPage}
            onEditEvent={onEditEvent}
            onFormChange={onFormChange}
            onResetForm={onResetForm}
            onSaveEvent={onSaveEvent}
            onDeleteEvent={onDeleteEvent}
            onEventsPageChange={onEventsPageChange}
          />
        </div>
      </div>
    </section>
  );
};