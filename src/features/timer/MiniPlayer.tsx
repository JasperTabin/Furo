import { Pause, Play, Square } from "lucide-react";
import { formatTime, type TimerStatus } from "./timer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MINI_PLAYER_WINDOW_SIZE = {
  width: 100,
  height: 220,
} as const;

export const MiniPlayerWindow = ({
  status,
  timeLeft,
  onStart,
  onPause,
  onStop,
  mode,
  sessionsCompleted,
  sessionsUntilLongBreak,
  isReversed,
}: {
  status: TimerStatus;
  timeLeft: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  mode: string;
  sessionsCompleted: number;
  sessionsUntilLongBreak: number;
  isReversed: boolean;
}) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 bg-(--color-bg) text-(--color-fg) overflow-hidden select-none">
      <div className="text-xs font-medium tracking-widest text-(--color-fg)/60 uppercase">
        {mode === "focus"
          ? "Focus"
          : mode === "shortbreak"
            ? "Short Break"
            : mode === "longBreak"
              ? "Long Break"
              : "Infinite"}
      </div>
      
      <div className="text-5xl font-bold tracking-tight leading-none">
        {formatTime(timeLeft)}
      </div>

      {!isReversed && mode !== "infinite" && (
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: sessionsUntilLongBreak }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i < sessionsUntilLongBreak - (sessionsCompleted % sessionsUntilLongBreak)
                    ? "var(--color-fg)"
                    : "transparent",
                border: "1.5px solid var(--color-fg)",
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        {isIdle ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onStart}
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full"
                aria-label="Start timer"
              >
                <Play size={16} fill="currentColor" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={isRunning ? onPause : onStart}
                  variant={isRunning ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label={isRunning ? "Pause timer" : "Resume timer"}
                >
                  {isRunning ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRunning ? "Pause" : "Resume"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onStop}
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label="Stop timer"
                >
                  <Square size={16} fill="currentColor" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};
