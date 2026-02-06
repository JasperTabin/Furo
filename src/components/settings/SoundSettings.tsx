// components/settings/SoundSettings.tsx

import { ChevronDown, ChevronUp, AudioLines, Volume2, VolumeX } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { useSoundSettings } from "../../hooks/useSound";

interface SoundSettingsProps {
  sound: ReturnType<typeof useSoundSettings>;
  onStopPreview?: (stop: () => void) => void;
}

const inputClass = "w-full px-3 sm:px-4 py-2 text-sm bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] rounded-md";

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

  useEffect(() => {
    if (onStopPreview) {
      onStopPreview(stopPreview);
    }
  }, [onStopPreview]);

  useEffect(() => {
    return () => {
      stopPreview();
      previewAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const playPreview = () => {
    if (!values.sound || values.sound === "none") return;

    stopPreview();

    const audio = new Audio(`/sounds/${values.sound}`);
    audio.volume = values.isMuted ? 0 : values.volume / 100;
    previewAudioRef.current = audio;

    audio.play().catch((err) => console.log("Preview failed:", err));
    setTimeout(() => {
      if (previewAudioRef.current === audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }, 2000);
  };

  const handleMuteToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    update("isMuted", (!values.isMuted).toString());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update("volume", e.target.value);
  };

  const handleVolumeInput = (e: React.FormEvent<HTMLInputElement>) => {
    update("volume", e.currentTarget.value);
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
              style={{ backgroundImage: 'none' }}
            >
              <option value="Sound_1.mp3">Sound 1</option>
              <option value="Sound_2.mp3">Sound 2</option>
              <option value="Cat.mp3">Sound 3</option>
              <option value="none">No sound</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200">
              {isDropdownOpen ? 
                <ChevronUp className="text-[var(--color-fg)] opacity-50" size={16} /> : 
                <ChevronDown className="text-[var(--color-fg)] opacity-50" size={16} />
              }
            </div>
          </div>

          <button
            onClick={playPreview}
            disabled={!values.sound || values.sound === "none"}
            className="px-3 sm:px-4 py-2 text-sm font-semibold tracking-widest flex items-center gap-2 bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] rounded-md transition-all hover:bg-[var(--color-border)] hover:text-[var(--color-bg)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg)] disabled:hover:text-[var(--color-fg)] whitespace-nowrap active:bg-[var(--color-border)] active:text-[var(--color-bg)] touch-manipulation"
          >
            <AudioLines size={16} />
            PREVIEW
          </button>
        </div>
      </div>

      {/* Volume Controls */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs sm:text-sm font-semibold tracking-widest">VOLUME</label>
          <span className="text-xs font-semibold tracking-widest text-[var(--color-border)]">
            {values.isMuted ? "MUTED" : `${values.volume}%`}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleMuteToggle}
            onTouchEnd={handleMuteToggle}
            className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-fg)] hover:text-[var(--color-border)] transition-colors border border-[var(--color-border)] rounded-md shrink-0 active:bg-[var(--color-border)] active:text-[var(--color-bg)] touch-manipulation"
            aria-label={values.isMuted ? "Unmute" : "Mute"}
          >
            {values.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <div className="flex-1 relative py-2">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={values.volume}
              onChange={handleVolumeChange}
              onInput={handleVolumeInput}
              disabled={values.isMuted}
              className="volume-slider"
              style={{
                width: '100%',
                WebkitAppearance: 'none',
                appearance: 'none',
                height: '8px',
                borderRadius: '4px',
                background: values.isMuted 
                  ? 'var(--color-border)' 
                  : `linear-gradient(to right, var(--color-fg) 0%, var(--color-fg) ${values.volume}%, var(--color-border) ${values.volume}%, var(--color-border) 100%)`,
                opacity: values.isMuted ? 0.3 : 1,
                outline: 'none',
                cursor: values.isMuted ? 'not-allowed' : 'pointer',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-fg);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid var(--color-bg);
          transition: transform 0.1s ease;
        }

        .volume-slider::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }

        .volume-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-fg);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid var(--color-bg);
          transition: transform 0.1s ease;
        }

        .volume-slider::-moz-range-thumb:active {
          transform: scale(1.2);
        }

        .volume-slider:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .volume-slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Better track for Firefox */
        .volume-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }

        /* Remove tap highlight on mobile */
        .volume-slider {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};