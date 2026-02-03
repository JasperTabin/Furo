import { useState, useEffect, useRef } from "react";
import { useTimer } from "./hooks/useTimer";
import { Timer } from "./components/Timer";
import { Controls } from "./components/Controls";
import { Settings } from "./components/Settings";
import { ThemeToggle } from "./components/ThemeToggle";
import { Copyright } from "lucide-react";

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef<number | null>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const { mode, status, timeLeft, totalTime, start, pause, reset, switchMode } =
    useTimer();

  const scheduleHide = () => {
    if (!isFullscreen) return;
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = window.setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && appRef.current) {
      appRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen failed:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen failed:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
      // Hide controls immediately in fullscreen
      if (document.fullscreenElement) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={appRef}
      className="min-h-screen w-full flex flex-col items-center justify-center p-8 relative"
    >
      {/* Header (non-fullscreen) */}
      {!isFullscreen && (
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold tracking-widest">FURŌ</h1>
          <p className="text-xs font-bold tracking-widest text-gray-400 mt-1">
            FLOW
          </p>
        </div>
      )}

      {!isFullscreen && (
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
      )}

      {/* Hover zones for fullscreen buttons */}
      {isFullscreen && (
        <>
          {/* Top hover zone */}
          <div
            className="absolute top-0 left-0 w-full h-68 z-50"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={scheduleHide}
          />

          {/* Bottom hover zone */}
          <div
            className="absolute bottom-0 left-0 w-full h-68 z-50"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={scheduleHide}
          />
        </>
      )}

      {/* Main content */}
      <div
        className={`flex flex-col items-center transition-all duration-500 ${
          isFullscreen ? "gap-32" : "gap-16"
        }`}
      >
        {/* Settings */}
        <div
          className={`transition-all duration-300 ease-in-out transform z-50 
            ${isFullscreen && !showControls 
              ? "opacity-0 scale-95 translate-y-4" 
              : "opacity-100 scale-100 translate-y-0"
            }`}
        >
          <Settings onSwitchMode={switchMode} currentMode={mode} />{" "}
        </div>

        <Timer
          status={status}
          timeLeft={timeLeft}
          totalTime={totalTime}
          isFullscreen={isFullscreen}
        />

        {/* Controls */}
        <div
          className={`transition-all duration-300 ease-in-out transform z-50 
            ${isFullscreen && !showControls 
              ? "opacity-0 scale-95 translate-y-4" 
              : "opacity-100 scale-100 translate-y-0"
            }`}
        >
          {" "}
          <Controls
            status={status}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onFullscreenChange={toggleFullscreen}
          />{" "}
        </div>
      </div>

      {/* Footer (non-fullscreen) */}
      {!isFullscreen && (
        <div className="flex items-center gap-2 absolute bottom-8 text-sm tracking-widest font-semibold">
          <Copyright size={12} /> 2026 JasDev. All rights reserved.
        </div>
      )}
    </div>
  );
}

export default App;
