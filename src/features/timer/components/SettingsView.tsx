// Container & orchestration logic

import { Modal } from "../../../components/ui/Modal";
import { SettingsHeader, SettingsFooter, DurationInputs, SoundControls, VolumeControls,} from "./Settings";
import { useSettings } from "../hooks/useSettings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  onSave,
}: SettingsModalProps) => {
  const {
    workDuration,
    breakDuration,
    longBreakDuration,
    sound,
    volume,
    isMuted,
    repeatCount,
    soundError,
    handleDurationChange,
    handleSoundChange,
    handleVolumeChange,
    previewSound,
    resetToDefaults,
    saveCurrentSettings,
    stopPreview,
  } = useSettings();

  const handleClose = () => {
    stopPreview();
    onClose();
  };

  const handleSave = () => {
    saveCurrentSettings();
    onSave();
  };

  return (
    <Modal isOpen={isOpen}>
      <SettingsHeader onClose={handleClose} />

      <div className="p-6 space-y-6">
        <DurationInputs
          durations={{
            work: workDuration,
            break: breakDuration,
            long: longBreakDuration,
          }}
          onChange={handleDurationChange}
        />

        <SoundControls
          sound={sound}
          repeatCount={repeatCount}
          isMuted={isMuted}
          soundError={soundError}
          onChange={handleSoundChange}
          onPreview={previewSound}
        />

        <VolumeControls
          volume={volume}
          isMuted={isMuted}
          onChange={handleVolumeChange}
        />
      </div>

      <SettingsFooter onReset={resetToDefaults} onSave={handleSave} />
    </Modal>
  );
};