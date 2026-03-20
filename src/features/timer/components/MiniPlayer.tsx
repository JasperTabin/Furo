import { PictureInPicture2 } from "lucide-react";
import { formatTime } from "../utils/formatTime";
import type { TimerStatus } from "../configs/types";

// ── Button ───────────────────────────────────────────────
export const MiniPlayerButton = ({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) => (
  <button
    onClick={onClick}
    className={`btn-base ${isOpen ? "btn-active" : "btn-inactive"}`}
    aria-label="Toggle mini player"
    title="Mini player"
  >
    <PictureInPicture2 size={18} />
  </button>
);

// ── Window UI ────────────────────────────────────────────
export const MiniPlayerWindow = ({
  status,
  timeLeft,
  onStart,
  onPause,
  onStop,
}: {
  status: TimerStatus;
  timeLeft: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}) => {
  const isIdle    = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-5
                    bg-(--color-bg) text-(--color-text) overflow-hidden select-none">
      <div className="text-6xl font-bold tracking-tight leading-none">
        {formatTime(timeLeft)}
      </div>

      {isIdle ? (
        <button onClick={onStart} className="btn-base btn-active px-8">
          START
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={isRunning ? onPause : onStart}
            className="btn-base btn-active px-6"
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </button>
          <button onClick={onStop} className="btn-base btn-danger px-6">
            STOP
          </button>
        </div>
      )}
    </div>
  );
};