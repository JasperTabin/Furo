// Main orchestrator 

import { useState } from "react";
import { useFullscreen } from "./features/timer/hooks/useFullscreen";
import { useGSAPAnimation } from "./hooks/useGSAPAnimation";

// Layout
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

// Pages
import { TimerView } from "./features/timer/components/TimerView";
import { TodoList } from "./features/todo/components/TodoList";

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

      <main className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
        {currentView === "timer" ? (
          <div ref={timerContainerRef}>
            <TimerView 
              isFullscreen={isFullscreen} 
              toggleFullscreen={toggleFullscreen}
            />
          </div>
        ) : (
          <div ref={todoContainerRef} className="w-full px-4 py-8">
            <TodoList />
          </div>
        )}
      </main>

      {!isFullscreen && <Footer />}
    </div>
  );
}

export default App;
