import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@fontsource-variable/inter";
import "./index.css";
import { loadContent } from "./data/i18n.js";

// Nejdřív načíst upravené texty (aby neproblikly původní), pak vykreslit
loadContent().finally(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});
