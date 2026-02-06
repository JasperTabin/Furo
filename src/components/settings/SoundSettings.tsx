// UI for sound controls

import {
  ChevronDown,
  ChevronUp,
  AudioLines,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { useSoundSettings } from "../../hooks/useSound";

interface SoundSettingsProps {
  sound: ReturnType<typeof useSoundSettings>;
  onStopPreview?: (stop: () => void) => void;
}

const inputClass =
  "w-full px-3 sm:px-4 py-2 text-sm bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] rounded-md";

export const SoundSettings = ({ sound, onStopPreview }: SoundSettingsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const { values, update } = sound;

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }
  };

  // Expose stopPreview to parent
  useEffect(() => {
    if (onStopPreview) {
      onStopPreview(stopPreview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopPreview();
      previewAudioRef.current = null;
    };
  }, []);

  // Detect clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const playPreview = () => {
    if (!values.sound || values.sound === "none" || values.isMuted) return;

    stopPreview();

    const audio = new Audio(`/sounds/${values.sound}`);
    audio.volume = values.volume / 100;
    previewAudioRef.current = audio;

    audio.play().catch((err) => console.log("Preview failed:", err));
    setTimeout(() => {
      if (previewAudioRef.current === audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }, 2000);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Sound Selector */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold tracking-widest mb-2">
          TIMER SOUND
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <select
              ref={selectRef}
              value={values.sound}
              onChange={(e) => {
                update("sound", e.target.value);
                setTimeout(() => setIsDropdownOpen(false), 100);
              }}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`${inputClass} pr-10 appearance-none cursor-pointer`}
              style={{ backgroundImage: "none" }}
            >
              <option value="Sound_1.mp3">Sound 1</option>
              <option value="Sound_2.mp3">Sound 2</option>
              <option value="Cat.mp3">Sound 3</option>
              <option value="none">No sound</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200">
              {isDropdownOpen ? (
                <ChevronUp className="text-(--color-fg) opacity-50" size={16} />
              ) : (
                <ChevronDown
                  className="text-(--color-fg) opacity-50"
                  size={16}
                />
              )}
            </div>
          </div>

          <button
            onClick={playPreview}
            disabled={!values.sound || values.sound === "none" || values.isMuted}
            className="px-3 sm:px-4 py-2 text-sm font-semibold tracking-widest flex items-center gap-2 bg-(--color-bg) text-(--color-fg) border border-(--color-border) rounded-md transition-all hover:bg-(--color-border) hover:text-(--color-bg) disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-(--color-bg) disabled:hover:text-(--color-fg) whitespace-nowrap"
          >
            <AudioLines size={16} />
            PREVIEW
          </button>
        </div>
      </div>

      {/* Volume Controls */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs sm:text-sm font-semibold tracking-widest">
            VOLUME
          </label>
          <span className="text-xs font-semibold tracking-widest text-(--color-border)">
            {values.isMuted ? "MUTED" : `${values.volume}%`}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => update("isMuted", (!values.isMuted).toString())}
            className="p-2 text-(--color-fg) hover:text-(--color-border) transition-colors border border-(--color-border) rounded-md shrink-0"
            aria-label={values.isMuted ? "Unmute" : "Mute"}
          >
            {values.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={values.volume}
            onChange={(e) => update("volume", e.target.value)}
            disabled={values.isMuted}
            className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-(--color-border) opacity-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--color-fg) [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-(--color-fg) [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer ${values.isMuted ? "opacity-20 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};