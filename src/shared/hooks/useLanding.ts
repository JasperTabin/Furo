import { useState } from "react";

const LANDING_SESSION_KEY = "furo:entered-app";

export function useLanding() {
  const [showLanding, setShowLanding] = useState(() => {
    try {
      return sessionStorage.getItem(LANDING_SESSION_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const enterApp = () => {
    try {
      sessionStorage.setItem(LANDING_SESSION_KEY, "true");
    } catch {
      // Ignore storage failures and continue into the app.
    }
    setShowLanding(false);
  };

  const returnToLanding = () => {
    try {
      sessionStorage.removeItem(LANDING_SESSION_KEY);
    } catch {
      // Ignore storage failures and still return to the landing view.
    }
    setShowLanding(true);
  };

  return { showLanding, enterApp, returnToLanding };
}
