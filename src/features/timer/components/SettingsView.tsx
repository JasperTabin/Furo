// Container & orchestration logic
import { Modal } from "../../../components/ui/Modal";
import { SettingsPanel } from "./Settings";
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
    getValue,
    handleStep,
    hasChanges,
    resetToDefaults,
    saveCurrentSettings,
  } = useSettings();

  const handleSave = () => {
    saveCurrentSettings();
    onSave();
  };

  return (
    <Modal isOpen={isOpen}>
      <SettingsPanel
        getValue={getValue}
        onStep={handleStep}
        onClose={onClose}
        onReset={resetToDefaults}
        onSave={handleSave}
        hasChanges={hasChanges}
      />
    </Modal>
  );
};
