import { useState } from "react";
import {
  Calendar,
  Check,
  Edit2,
  MoreVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCountdown } from "./useCountdown";
import { deleteEvent, loadSavedEvent, saveEvent } from "./countdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const CountdownPanel = () => {
  const savedEvent = loadSavedEvent();
  const [eventName, setEventName] = useState(savedEvent.name);
  const [targetDate, setTargetDate] = useState<Date | null>(savedEvent.date);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempDate, setTempDate] = useState("");

  const timeLeft = useCountdown(targetDate);

  const getDaysGone = () => {
    if (!targetDate || !timeLeft.isExpired) return 0;
    const difference = new Date().getTime() - targetDate.getTime();
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  const handleEdit = () => {
    setTempName(eventName);
    setTempDate(targetDate ? targetDate.toISOString().slice(0, 10) : "");
    setIsModalOpen(true);
  };

  const handleAddSave = () => {
    if (tempName.trim() && tempDate) {
      const newDate = new Date(`${tempDate}T23:59:59`);
      setEventName(tempName.trim());
      setTargetDate(newDate);
      saveEvent(tempName.trim(), newDate);
      setIsAddOpen(false);
      setTempName("");
      setTempDate("");
    }
  };

  const handleAddClose = () => {
    setIsAddOpen(false);
    setTempName("");
    setTempDate("");
  };

  const handleEditSave = () => {
    if (tempName.trim() && tempDate) {
      const newDate = new Date(`${tempDate}T23:59:59`);
      setEventName(tempName.trim());
      setTargetDate(newDate);
      saveEvent(tempName.trim(), newDate);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTempName("");
    setTempDate("");
  };

  const handleDelete = () => {
    setEventName("");
    setTargetDate(null);
    deleteEvent();
  };

  const formattedDate = targetDate?.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getStateColor = () => {
    if (timeLeft.isExpired) return "#E24B4A";
    if (timeLeft.days === 0) return "#639922";
    if (timeLeft.days === 1) return "#378ADD";
    return "#EF9F27";
  };

  const getDaysLabel = () => {
    if (timeLeft.isExpired) {
      const daysGone = getDaysGone();
      return `${daysGone} day${daysGone === 1 ? "" : "s"} ago`;
    }
    if (timeLeft.days === 0) return "Today";
    if (timeLeft.days === 1) return "Tomorrow";
    return `${timeLeft.days} days`;
  };

  const formatPickerDate = (value: string) => {
    if (!value) return "Date";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Date";
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {!eventName ? (
          <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-10 pt-10 text-center">
              <h3 className="text-base font-semibold text-(--color-fg)">
                No events yet
              </h3>
              <p className="text-sm text-(--color-fg)/40">
                The best days are worth looking forward to.
              </p>
            </div>

            <div className="-mx-6 border-t border-(--color-border)/80 pt-3">
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isAddOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-2 px-4 pb-3">
                    <Input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Event name.."
                      className="bg-(--color-bg) border-(--color-border) text-sm"
                    />

                    <div className="flex items-center gap-2.5">
                      <div className="relative min-w-0 flex-1 overflow-hidden">
                        <div className="flex h-8 w-full min-w-0 items-center rounded-md border border-(--color-border) bg-(--color-bg) px-3 pr-8 text-xs text-(--color-fg) shadow-sm transition-colors">
                          <span className="truncate">
                            {formatPickerDate(tempDate)}
                          </span>
                        </div>
                        <input
                          type="date"
                          value={tempDate}
                          onChange={(e) => setTempDate(e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          style={{ colorScheme: "dark" }}
                        />
                        <Calendar
                          size={14}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-fg)"
                        />
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          onClick={handleAddSave}
                          disabled={!tempName.trim() || !tempDate}
                          size="icon"
                          aria-label="Add countdown"
                          title="Add countdown"
                          className="h-8 w-8 shrink-0 rounded-xl"
                        >
                          <Check size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleAddClose}
                          className="h-8 w-8 shrink-0 rounded-xl border-(--color-border) text-(--color-fg)/50 hover:text-(--color-fg)"
                          aria-label="Close add countdown"
                          title="Close add countdown"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!isAddOpen && (
                <div className="px-4 flex justify-end">
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-(--color-border) text-(--color-fg)/50 transition-colors hover:bg-(--color-fg)/5 hover:text-(--color-fg)/80"
                    aria-label="Add countdown"
                    title="Add countdown"
                  >
                    <Plus
                      size={14}
                      className="transition-transform duration-200"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-[10px] font-medium text-(--color-fg)">
                {eventName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-(--color-fg)">
                  {formattedDate}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5  text-(--color-fg)  "
                    >
                      <MoreVertical size={12} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit2 size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-1 items-end pt-4">
              <p
                className="text-[32px] font-medium leading-none tracking-[-1px]"
                style={{ color: getStateColor() }}
              >
                {getDaysLabel()}
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent
          className="border border-(--color-border) bg-(--color-bg) p-0 text-(--color-fg) shadow-[0_28px_120px_rgba(0,0,0,0.35)] sm:max-w-sm sm:rounded-2xl"
          onOpenAutoFocus={(event) => event.preventDefault()}
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Edit Event</DialogTitle>
          <div className="space-y-3 px-4 py-4 sm:px-5">
            <Input
              id="event-name"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Event name"
              className="rounded-xl border border-(--color-border) bg-(--color-bg) px-3.5 text-sm text-(--color-fg) placeholder:text-(--color-fg)/35 shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-fg)/20"
            />
            <div className="flex items-center gap-2.5">
              <div className="relative min-w-0 flex-1 overflow-hidden">
                <div className="flex h-8 w-full min-w-0 max-w-full items-center rounded-xl border border-(--color-border) bg-(--color-bg) px-3 pr-8 text-xs text-(--color-fg) shadow-none transition-colors">
                  <span className="truncate">{formatPickerDate(tempDate)}</span>
                </div>
                <input
                  id="target-date"
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  style={{ colorScheme: "dark" }}
                />
                <Calendar
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--color-fg)/55"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  onClick={handleEditSave}
                  disabled={!tempName.trim() || !tempDate}
                  className="h-8 w-8 shrink-0 rounded-xl bg-white p-0 text-black hover:bg-white/90"
                  aria-label="Update event"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="h-8 w-8 shrink-0 rounded-xl border-(--color-border) bg-transparent p-0 text-(--color-fg)/65 hover:bg-(--color-fg)/5 hover:text-(--color-fg)"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CountdownPanel;
