import { SkipForward, Square } from "lucide-react";
import { useState } from "react";
import { useMusicPlayer } from "./useMusicPlayer";
import { TRACKS } from "./music-player";
import { Button } from "@/components/ui/button";

export const MusicPlayerPanel = () => {
  const [index, setIndex] = useState(0);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const current = TRACKS[index];
  const { containerRef, canStop, stop } = useMusicPlayer(
    current.id,
    shouldAutoplay,
    undefined,
    setIsPlaying,
  );

  const skipNext = () => {
    setShouldAutoplay(isPlaying);
    setIndex((i) => (i + 1) % TRACKS.length);
  };

  return (
    <section
      role="region"
      aria-label="Music player"
      className="flex h-full w-full min-w-0 flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          aria-label={`Track ${index + 1} of ${TRACKS.length}`}
          className="text-[10px] tabular-nums tracking-[0.16em] text-(--color-fg)/35"
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(TRACKS.length).padStart(2, "0")}
        </span>

        <div className="flex shrink-0 items-center gap-1.5">
          {canStop && (
            <Button
              variant="outline"
              size="icon"
              onClick={stop}
              aria-label="Stop track"
              title="Stop track"
              className="h-8 w-8 rounded-xl"
            >
              <Square size={12} />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={skipNext}
            aria-label="Next track"
            title="Next track"
            className="h-8 w-8 rounded-xl"
          >
            <SkipForward size={12} />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-(--color-border) bg-black">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </section>
  );
};

export default MusicPlayerPanel;
