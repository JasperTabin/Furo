import { useState, lazy, Suspense } from "react";
import { usePanelOrder } from "../shared/hooks/usePanelOrder";
import { useLanding } from "../shared/hooks/useLanding";

const Landing = lazy(() =>
  import("../features/landing/Landing").then((m) => ({ default: m.Landing })),
);

const KanbanPanel = lazy(() =>
  import("../features/todo/KanbanPanel").then((m) => ({
    default: m.KanbanPanel,
  })),
);

const Dashboard = lazy(() =>
  import("./Dashboard").then((m) => ({ default: m.Dashboard })),
);

const Nav = lazy(() =>
  import("../shared/components/Nav").then((m) => ({ default: m.Nav })),
);

const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((m) => ({ default: m.Analytics })),
);

function App() {
  const { showLanding, enterApp, returnToLanding } = useLanding();
  const { panelOrder, reorderPanels, resetOrder } = usePanelOrder();
  const [showKanbanPage, setShowKanbanPage] = useState(false);

  const resetLayout = () => {
    resetOrder();
    setShowKanbanPage(false);
  };

  return (
    <>
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>

      {showLanding ? (
        <Suspense fallback={null}>
          <Landing onEnter={enterApp} />
        </Suspense>
      ) : showKanbanPage ? (
        <Suspense fallback={null}>
          <div className="h-dvh overflow-hidden bg-(--color-bg) text-(--color-fg)">
            <div className="relative flex h-full w-full flex-col overflow-y-hidden px-4 pt-4 pb-4">
              <KanbanPanel onClose={() => setShowKanbanPage(false)} />
            </div>
          </div>
        </Suspense>
      ) : (
        <Suspense fallback={null}>
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
        </Suspense>
      )}
    </>
  );
}

export default App;
