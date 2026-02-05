// Fullscreen Button

import { Maximize, Minimize } from "lucide-react";
import { Button } from "../Shared/Button";
import { useFullscreen } from "../../hooks/useFullscreen";

export const FullscreenMode = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <Button
      onClick={toggleFullscreen}
      variant={isFullscreen ? "active" : "inactive"}
      ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </Button>
  );
};
