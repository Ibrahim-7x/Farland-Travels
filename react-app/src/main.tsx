import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { DestinationsProvider } from "./contexts/DestinationsProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <SiteSettingsProvider>
        <DestinationsProvider>
          <App />
        </DestinationsProvider>
      </SiteSettingsProvider>
    </ErrorBoundary>
  </StrictMode>
);
