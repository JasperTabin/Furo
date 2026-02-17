import { useState } from "react";
import { useFullscreen } from "./features/timer/hooks/useFullscreen";
import { useGSAPAnimation } from "./hooks/useGSAPAnimation";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

import { TimerView } from "./features/timer/components/TimerView";
import { TodoView } from "./features/todo/components/TodoView";

function App() {
  const [currentView, setCurrentView] = useState<"timer" | "todo">("timer");
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { timerContainerRef, todoContainerRef } = useGSAPAnimation(currentView);

  return (
    <div
      className={`h-dvh overflow-hidden flex flex-col transition-colors duration-500 bg-(--color-bg) text-(--color-fg) ${
        isFullscreen ? "" : "p-6 sm:p-8"
      }`}
    >
      {!isFullscreen && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}

      <main className="flex-1 flex flex-col overflow-y-auto">
        {currentView === "timer" ? (
          <div
            ref={timerContainerRef}
            className="flex-1 flex items-center justify-center"
          >
            <TimerView
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />
          </div>
        ) : (
          <div ref={todoContainerRef} className="w-full px-4 pt-4 pb-8">
            <TodoView />
          </div>
        )}
      </main>

      {!isFullscreen && <Footer />}
    </div>
  );
}

export default App;
