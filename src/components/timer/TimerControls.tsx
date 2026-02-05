// START | STOP | RESUME | PAUSE - Timer Controls

import type { TimerStatus } from "../../types/timer";
import { Button } from "../Shared/Button";

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls = ({ status, onStart, onPause, onReset }: TimerControlsProps) => {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <div className="flex flex-row gap-4 sm:gap-4">
      {isIdle ? (
        <Button onClick={onStart} variant="active" ariaLabel="Start timer">
          START
        </Button>
      ) : (
        <>
          <Button
            onClick={isRunning ? onPause : onStart}
            variant={isRunning ? "active" : "inactive"}
            ariaLabel={isRunning ? "Pause timer" : "Resume timer"}
            title={isRunning ? "Pause (Space)" : "Resume (Space)"}
          >
            {isRunning ? "PAUSE" : "RESUME"}
          </Button>

          <Button onClick={onReset} variant="danger" ariaLabel="Stop timer" title="Stop timer">
            STOP
          </Button>
        </>
      )}
    </div>
  );
};