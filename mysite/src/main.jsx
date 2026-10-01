import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@fontsource-variable/inter";
import "./index.css";
import { loadContent } from "./data/i18n.js";

// Nejdřív načíst upravené texty (aby neproblikly původní), pak vykreslit
loadContent().finally(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
});
