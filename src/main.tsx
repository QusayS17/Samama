// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom"; // HashRouter is Electron-friendly
import App from "./App";
import Versions from "./Screens/Versions"; // adjust path if different
import "./index.css";
import V1 from "./Screens/V1";
import { store } from "./store";
import { Provider } from "react-redux";
import V2 from "./Screens/V2";

import ExternalWindow from "./ExternalWindow";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* 👈 Redux wrapper */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/versions" element={<Versions />} />
          <Route path="/v1" element={<V1 />} />
          <Route path="/v2" element={<V2 />} />
          <Route path="/external" element={<ExternalWindow />} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
