import { useState } from "react";
import { Landing } from "../features/landing/Landing";
import { Nav } from "../shared/components/Nav";
import { Dashboard } from "./Dashboard";
import { KanbanPage } from "../features/todo/KanbanPage";
import { usePanelOrder } from "../shared/hooks/usePanelOrder";
import { useLanding } from "../shared/hooks/useLanding";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { showLanding, enterApp, returnToLanding } = useLanding();
  const { panelOrder, reorderPanels, resetOrder } = usePanelOrder();
  const [showKanbanPage, setShowKanbanPage] = useState(false);

  const resetLayout = () => {
    resetOrder();
    setShowKanbanPage(false);
  };

  if (showLanding) return <Landing onEnter={enterApp} />;
  if (showKanbanPage)
    return <KanbanPage onBack={() => setShowKanbanPage(false)} />;

  return (
    <>
      <Analytics />
      <div className="h-dvh overflow-hidden bg-(--color-bg) text-(--color-fg) transition-colors duration-500">
        <Nav
          onResetLayout={resetLayout}
          onOpenKanbanPage={() => setShowKanbanPage(true)}
          onTitleClick={returnToLanding}
        />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-4 pb-26 sm:px-6 sm:py-6 sm:pb-28 lg:px-8">
              <Dashboard
                panelOrder={panelOrder}
                onReorderPanels={reorderPanels}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
