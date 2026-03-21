import { useState } from "react";
import { useFullscreen } from "./features/timer/hooks/useFullscreen";
import { useMiniPlayer } from "./features/timer/hooks/useMiniPlayer";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { TimerView } from "./features/timer/components/TimerView";
import { TodoView } from "./features/todo/components/TodoView";
import { CalendarView } from "./features/calendar/components/CalendarView";

import MusicPlayer from "./features/MusicPlayer";

function App() {
  const [currentView, setCurrentView] = useState<"timer" | "todo" | "calendar">(
    "timer",
  );
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const {
    openMiniPlayer,
    closeMiniPlayer,
    popupContainer,
    isOpen,
    isSupported,
  } = useMiniPlayer();

  return (
    <div
      className={`h-dvh overflow-hidden flex flex-col transition-colors duration-500 bg-(--color-bg) text-(--color-fg) ${
        isFullscreen ? "" : "p-6 sm:p-8"
      }`}
    >
      {!isFullscreen && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}

      <main
        className={`flex-1 flex flex-col overflow-x-hidden ${
          currentView === "todo" ? "overflow-y-hidden" : "overflow-y-auto"
        } ${currentView === "calendar" ? "sm:justify-center" : ""}`}
      >
        {currentView === "timer" && (
          <div className="flex-1 flex items-center justify-center">
            <TimerView
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
              openMiniPlayer={openMiniPlayer}
              closeMiniPlayer={closeMiniPlayer}
              isOpen={isOpen}
              isSupported={isSupported}
              popupContainer={popupContainer}
            />
          </div>
        )}

        {currentView === "todo" && (
          <div className="w-full px-4 pt-4 pb-4 flex flex-col">
            <TodoView />
          </div>
        )}

        {currentView === "calendar" && (
          <div className="w-full">
            <CalendarView />
          </div>
        )}
      </main>

      {!isFullscreen && <Footer />}
      <MusicPlayer />
    </div>
  );
}

export default App;
