// Simplified test version of SoundSettings.tsx

import { Volume2, VolumeX } from "lucide-react";
import type { useSoundSettings } from "../../hooks/useSound";

interface SoundSettingsProps {
  sound: ReturnType<typeof useSoundSettings>;
}

export const SoundSettings = ({ sound }: SoundSettingsProps) => {
  const { values, update } = sound;

  return (
    <div className="space-y-5 border-2 border-red-500 p-4">
      <div>DEBUG VALUES: {JSON.stringify(values)}</div>
      
      {/* Simple Mute Button */}
      <button
        onClick={() => {
          console.log('Mute button clicked, current isMuted:', values.isMuted);
          update("isMuted", (!values.isMuted).toString());
        }}
        className="p-4 border-2 border-blue-500 bg-blue-200"
      >
        {values.isMuted ? "UNMUTE" : "MUTE"}
        {values.isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Simple Volume Slider */}
      <div>
        <div>Volume: {values.volume}%</div>
        <input
          type="range"
          min="0"
          max="100"
          value={values.volume}
          onChange={(e) => {
            console.log('Slider changed:', e.target.value);
            update("volume", e.target.value);
          }}
          disabled={values.isMuted}
          style={{ width: '100%', height: '40px' }}
        />
      </div>
    </div>
  );
};