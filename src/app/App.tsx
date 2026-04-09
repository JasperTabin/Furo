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
import { KanbanPage } from "./KanbanPage";

function App() {
  const { showLanding, enterApp, returnToLanding } = useLanding();
  const [panelOrder, setPanelOrder] = useState<AppView[]>(() =>
    readPanelOrder(),
  );
  const [showKanbanPage, setShowKanbanPage] = useState(false);

  const openKanbanPage = () => {
    setShowKanbanPage(true);
  };

  const resetLayout = () => {
    setPanelOrder(ALL_PANELS);
    setShowKanbanPage(false);
  };

  const reorderPanels = (from: AppView, to: AppView) => {
    setPanelOrder((prev) => {
      if (from === "kanban" || to === "kanban") {
        return prev;
      }

      const dashboardOrder = prev.filter((panel) => panel !== "kanban");
      const fromIndex = dashboardOrder.indexOf(from);
      const toIndex = dashboardOrder.indexOf(to);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return prev;
      }

      const reorderedDashboard = [...dashboardOrder];
      [reorderedDashboard[fromIndex], reorderedDashboard[toIndex]] = [
        reorderedDashboard[toIndex],
        reorderedDashboard[fromIndex],
      ];

      let dashboardCursor = 0;
      return prev.map((panel) => {
        if (panel === "kanban") return panel;
        const nextPanel = reorderedDashboard[dashboardCursor];
        dashboardCursor += 1;
        return nextPanel;
      });
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
