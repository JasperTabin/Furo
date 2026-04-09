import { type FormEvent, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { useCalendar } from "./useCalendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  WEEKDAY_LABELS,
  DEFAULT_EVENT_TIME,
  addMonths,
  getDateKey,
  getMonthGrid,
  getMonthLabel,
  getTimeParts,
  formatPanelDate,
  formatEventTime,
  startOfMonth,
  type CalendarDay,
  type CalendarEvent,
  type CalendarEventInput,
} from "./calendar";

// ============================================================================
// SUB-COMPONENTS
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
  return (
    <div className="w-full mx-auto">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(-1)}
          className="h-9 w-9 shrink-0"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-center text-lg font-bold tracking-tight">
          {getMonthLabel(displayMonth)}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(1)}
          className="h-9 w-9 shrink-0"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[11px] text-xs font-medium uppercase tracking-widest text-(--color-fg)/50"
          >
            <span>{label[0]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day) => {
          const dayEvents = eventsByDate[day.dateKey] ?? [];
          const isSelected = day.dateKey === selectedDateKey;

          return (
            <button
              key={day.dateKey}
              onClick={() => onDateSelect(day.date)}
              className={`relative aspect-square w-full rounded-md p-2 transition-colors hover:bg-(--color-fg)/10 ${
                isSelected ? "bg-(--color-fg)/8" : ""
              }`}
              aria-label={`${formatPanelDate(day.dateKey)}. ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}.`}
            >
              <span
                className={`text-sm font-semibold ${
                  !day.isCurrentMonth
                    ? "text-(--color-fg)/20"
                    : isSelected || day.isToday || dayEvents.length > 0
                      ? "text-orange-400"
                      : "text-(--color-fg)"
                }`}
              >
                {day.dayNumber}
              </span>

              {dayEvents.length > 0 && day.isCurrentMonth && (
                <span
                  className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const EventModal = ({
  isOpen,
  selectedDateKey,
  selectedEvents,
  formData,
  editingEventId,
  eventsPage,
  onClose,
  onFormChange,
  onTimeChange,
  onSubmit,
  onClear,
  onEdit,
  onDelete,
  onPageChange,
}: {
  isOpen: boolean;
  selectedDateKey: string;
  selectedEvents: CalendarEvent[];
  formData: CalendarEventInput;
  editingEventId: string | null;
  eventsPage: number;
  onClose: () => void;
  onFormChange: (field: keyof CalendarEventInput, value: string) => void;
  onTimeChange: (field: "hour" | "minute" | "period", value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}) => {
  const EVENTS_PER_PAGE = 2;
  const FIELD_CLASS =
    "rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-fg) placeholder:text-(--color-fg)/35 shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-fg)/20";
  const timeParts = getTimeParts(formData.time);
  const totalPages = Math.ceil(selectedEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = selectedEvents.slice(
    eventsPage * EVENTS_PER_PAGE,
    eventsPage * EVENTS_PER_PAGE + EVENTS_PER_PAGE,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:max-w-sm sm:rounded-2xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          Events for {formatPanelDate(selectedDateKey)}
        </DialogTitle>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-4 pt-4 sm:px-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-fg)/45">
              {formatPanelDate(selectedDateKey)}
            </p>
          </div>

          <form onSubmit={onSubmit} className="shrink-0 space-y-3 px-4 pb-3 pt-3 sm:px-5">
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              placeholder="Event title..."
              maxLength={60}
              required
              autoFocus
              className={FIELD_CLASS}
            />

            <div className="grid grid-cols-3 gap-2">
              <Select
                value={timeParts.hour}
                onChange={(e) => onTimeChange("hour", e.target.value)}
                className={cn(FIELD_CLASS, "h-10 appearance-none pr-8")}
              >
                {Array.from({ length: 12 }, (_, i) =>
                  `${i + 1}`.padStart(2, "0"),
                ).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Select>

              <Select
                value={timeParts.minute}
                onChange={(e) => onTimeChange("minute", e.target.value)}
                className={cn(FIELD_CLASS, "h-10 appearance-none pr-8")}
              >
                {Array.from({ length: 60 }, (_, i) =>
                  `${i}`.padStart(2, "0"),
                ).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>

              <Select
                value={timeParts.period}
                onChange={(e) =>
                  onTimeChange("period", e.target.value as "AM" | "PM")
                }
                className={cn(FIELD_CLASS, "h-10 appearance-none pr-8")}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </Select>
            </div>

            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormChange("notes", e.target.value)}
              placeholder="Notes..."
              rows={3}
              maxLength={240}
              className={cn(FIELD_CLASS, "min-h-[68px] resize-none py-2.5")}
            />

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                disabled={!editingEventId}
                className="h-8 flex-1 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="h-8 w-8 rounded-xl bg-white p-0 text-black hover:bg-white/90"
                aria-label={editingEventId ? "Update event" : "Add event"}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent p-0 text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="flex min-h-0 flex-1 flex-col border-t border-(--color-border) px-4 pb-4 pt-3 sm:px-5">
            <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-fg)/40">
              Events ({selectedEvents.length})
            </p>

            {selectedEvents.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-(--color-border) px-4 py-8 text-center text-sm text-(--color-fg)/35">
                No events yet for this day
              </div>
            ) : (
              <>
                <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {paginatedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-xl border border-(--color-border) bg-(--color-bg) px-3 py-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="min-w-0 flex-1 cursor-pointer"
                            onClick={() => onEdit(event)}
                          >
                            <h4 className="truncate font-medium text-(--color-fg)">
                              {event.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-2 text-xs text-(--color-fg)/50">
                              <span>{formatEventTime(event.time)}</span>
                              {event.notes && (
                                <span className="inline-flex items-center gap-1 text-(--color-fg)/38">
                                  <StickyNote size={11} />
                                  <span>Note</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(event);
                              }}
                              className="h-7 w-7 rounded-lg border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-blue-500/14 hover:text-blue-300"
                              aria-label="Edit event"
                            >
                              <Pencil size={13} />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(event.id);
                              }}
                              className="h-7 w-7 rounded-lg border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-red-500/14 hover:text-red-300"
                              aria-label="Delete event"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEvents.length > EVENTS_PER_PAGE && (
                  <div className="mt-3 flex shrink-0 items-center justify-center gap-2 border-t border-(--color-border) pt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onPageChange(eventsPage - 1)}
                      disabled={eventsPage === 0}
                      className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="px-2 text-xs font-medium text-(--color-fg)/65">
                      PAGE {eventsPage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onPageChange(eventsPage + 1)}
                      disabled={eventsPage >= totalPages - 1}
                      className="h-8 w-8 rounded-xl border-(--color-border) bg-transparent text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const CalendarPanel = () => {
  const today = new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(today));
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    getDateKey(today),
  );
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CalendarEventInput>({
    title: "",
    time: DEFAULT_EVENT_TIME,
    notes: "",
  });
  const [eventsPage, setEventsPage] = useState(0);

  const { eventsByDate, addEvent, updateEvent, deleteEvent } = useCalendar();

  const monthDays = getMonthGrid(displayMonth);
  const selectedEvents = eventsByDate[selectedDateKey] ?? [];
  const timeParts = getTimeParts(formData.time);

  const resetFormState = () => {
    setEditingEventId(null);
    setFormData({ title: "", time: DEFAULT_EVENT_TIME, notes: "" });
  };

  const closeModal = () => {
    resetFormState();
    setIsModalOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDateKey(getDateKey(date));
    setDisplayMonth(startOfMonth(date));
    setEventsPage(0);
    resetFormState();
    setIsModalOpen(true);
  };

  const handleFormChange = (field: keyof CalendarEventInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (
    field: "hour" | "minute" | "period",
    value: string,
  ) => {
    const newTime = `${field === "hour" ? value : timeParts.hour}:${field === "minute" ? value : timeParts.minute} ${field === "period" ? value : timeParts.period}`;
    handleFormChange("time", newTime);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title,
      time: event.time ?? DEFAULT_EVENT_TIME,
      notes: event.notes ?? "",
    });
  };

  const handleDeleteEvent = (id: string) => {
    const EVENTS_PER_PAGE = 2;
    if (editingEventId === id) resetFormState();
    deleteEvent(id);

    const remainingEvents = selectedEvents.filter((event) => event.id !== id);
    const newTotalPages = Math.ceil(remainingEvents.length / EVENTS_PER_PAGE);
    if (eventsPage >= newTotalPages && eventsPage > 0) {
      setEventsPage(eventsPage - 1);
    }
  };

  const handleSaveEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const didSave = editingEventId
      ? updateEvent(editingEventId, formData)
      : addEvent(selectedDateKey, formData);
    if (didSave) resetFormState();
  };

  return (
    <>
      <CalendarGrid
        displayMonth={displayMonth}
        monthDays={monthDays}
        selectedDateKey={selectedDateKey}
        eventsByDate={eventsByDate}
        onMonthChange={(direction) =>
          setDisplayMonth((prev) => addMonths(prev, direction))
        }
        onDateSelect={handleDateSelect}
      />

      <EventModal
        isOpen={isModalOpen}
        selectedDateKey={selectedDateKey}
        selectedEvents={selectedEvents}
        formData={formData}
        editingEventId={editingEventId}
        eventsPage={eventsPage}
        onClose={closeModal}
        onFormChange={handleFormChange}
        onTimeChange={handleTimeChange}
        onSubmit={handleSaveEvent}
        onClear={resetFormState}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onPageChange={setEventsPage}
      />
    </>
  );
};

export default CalendarPanel;
