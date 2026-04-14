import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import App from "./app/App";
import { TooltipProvider } from "./components/ui/tooltip";
import { bootstrapTheme } from "./shared/hooks/useTheme";

bootstrapTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
