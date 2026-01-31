// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";

import "./index.css";

import { store } from "./store";
import { Provider } from "react-redux";

import ExternalWindow from "./ExternalWindow";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}

      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/external" element={<ExternalWindow />} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);
