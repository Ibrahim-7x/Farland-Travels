import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <SiteSettingsProvider>
        <App />
      </SiteSettingsProvider>
    </ErrorBoundary>
  </StrictMode>
);
