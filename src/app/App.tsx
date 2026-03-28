import { useState } from "react";
import { Landing } from "../features/landing/Landing";
import { Layout } from "./Layout";
import { ViewRenderer, type AppView } from "./Page";
import { useLanding } from "../shared/hooks/useLanding";

function App() {
  const { showLanding, enterApp, returnToLanding } = useLanding();
  const [view, setView] = useState<AppView>("timer");

  if (showLanding) {
    return <Landing onEnter={enterApp} />;
  }

  return (
    <Layout currentView={view} onViewChange={setView} onHome={returnToLanding}>
      <ViewRenderer view={view} />
    </Layout>
  );
}

export default App;
