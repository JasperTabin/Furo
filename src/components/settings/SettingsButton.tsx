// Setting Button - Triggers the settings.tsx

import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "../Shared/Button";

interface SettingsButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const SettingsButton = ({ onClick, isOpen }: SettingsButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={isOpen ? "active" : "inactive"}
      ariaLabel="Open settings"
      title="Settings"
    >
      <SettingsIcon size={18} />
    </Button>
  );
};
