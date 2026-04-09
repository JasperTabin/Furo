import { useEffect, useState } from "react";
import { Landing } from "../features/landing/Landing";
import { Layout } from "./Layout";
import {
  ALL_PANELS,
  persistPanelOrder,
  readPanelOrder,
  type AppView,
} from "./panelConfig";
import { useLanding } from "../shared/hooks/useLanding";
import { Analytics } from "@vercel/analytics/react";
import { Dashboard } from "./Dashboard";
import { KanbanPage } from "../features/todo/KanbanPage";

function App() {
  const { showLanding, enterApp, returnToLanding } = useLanding();
  const [panelOrder, setPanelOrder] = useState<AppView[]>(() =>
    readPanelOrder(),
  );
  const [showKanbanPage, setShowKanbanPage] = useState(false);

  const openKanbanPage = () => setShowKanbanPage(true);

  const resetLayout = () => {
    setPanelOrder(ALL_PANELS);
    setShowKanbanPage(false);
  };

  const reorderPanels = (from: AppView, to: AppView) => {
    setPanelOrder((prev) => {
      const fromIndex = prev.indexOf(from);
      const toIndex = prev.indexOf(to);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return prev;
      }

      const next = [...prev];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
  };

  useEffect(() => {
    persistPanelOrder(panelOrder);
  }, [panelOrder]);

  return (
    <>
      <Analytics />

      {showLanding ? (
        <Landing onEnter={enterApp} />
      ) : showKanbanPage ? (
        <KanbanPage onBack={() => setShowKanbanPage(false)} />
      ) : (
        <Layout
          onResetLayout={resetLayout}
          onOpenKanbanPage={openKanbanPage}
          onHome={returnToLanding}
        >
          <Dashboard panelOrder={panelOrder} onReorderPanels={reorderPanels} />
        </Layout>
      )}
    </>
  );
}

export default App;
