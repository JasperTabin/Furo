import { useState } from "react";
import { Landing } from "../features/landing/Landing";
import { Layout } from "./Layout";
import { ViewRenderer, type AppView } from "./Page";
import { useLanding } from "../shared/hooks/useLanding";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { showLanding, enterApp, returnToLanding } = useLanding();
  const [view, setView] = useState<AppView>("timer");

  return (
    <>
      <Analytics />

      {showLanding ? (
        <Landing onEnter={enterApp} />
      ) : (
        <Layout
          currentView={view}
          onViewChange={setView}
          onHome={returnToLanding}
        >
          <ViewRenderer view={view} />
        </Layout>
      )}
    </>
  );
}

export default App;
