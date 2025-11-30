// src/App.tsx
import React from "react";
import bgvid from "./assets/giff/bg.webm";
import bgimage from "./assets/sheet/touch screen eng copy.jpg";
import m1 from "./assets/giff/Samama versions.gif";
import m2 from "./assets/giff/Samama services.gif";
import m3 from "./assets/giff/Samama impact.gif";
import a1 from "./assets/giff/الأثر.gif";
import a2 from "./assets/giff/خدمات.gif";
import a3 from "./assets/giff/اصدارات.gif";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

import {
  toggleLang as toggleLangAction,
  openExternalWindow,
  setWindowLang,
  setWindowTarget,
  type ExternalTarget,
} from "./Redux/externalWindowSlice";

declare const window: Window & typeof globalThis;

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const lang = useSelector((state: RootState) => state.externalWindow.lang);
  const { isOpen, target, windowLang } = useSelector(
    (state: RootState) => state.externalWindow
  );

  const toggleLang = () => {
    dispatch(toggleLangAction());
  };

  // 🔁 generic: open/update the ONE external window for any target (v1, v2, services,…)
  const handleOpenExternal = (nextTarget: ExternalTarget) => {
    if (!window.electronAPI) return;

    // external window already open
    if (isOpen) {
      // same target + same lang → just focus
      if (target === nextTarget && windowLang === lang) {
        window.electronAPI.send("focus-external-window");
        return;
      }

      // target or lang changed → update Redux + tell external window
      dispatch(setWindowTarget(nextTarget));
      dispatch(setWindowLang(lang));
      window.electronAPI.send("update-external", {
        target: nextTarget,
        lang,
      });
      return;
    }

    // external window not open yet → open with target + lang
    dispatch(openExternalWindow({ target: nextTarget, lang }));
    window.electronAPI.send("open-external-window", {
      target: nextTarget,
      lang,
    });
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center overflow-hidden"
      // style={{
      //   backgroundImage: `url(${bgimage})`,
      // }}
    >
      {/* Background video */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src={bgvid}
        autoPlay
        loop
        muted
      />

      {/* Lang toggle */}
      <button
        onClick={toggleLang}
        className="
          absolute top-20 right-20 z-20
          flex items-center gap-2
          px-7 py-4
          rounded-full
          bg-white/10
          backdrop-blur-md
          shadow-lg shadow-black/30
          text-xs md:text-sm
          text-white
          font-medium
          hover:bg-white/20
          active:scale-95
          transition
        "
      >
        <span className="text-lg">{lang === "en" ? "English" : "عربي"}</span>
      </button>

      {/* m1 button → still internal route (versions) */}
      <button
        className="absolute top-[54%] left-[10%]"
        onClick={() => navigate("/versions")}
      >
        <img
          src={lang === "en" ? a1 : m1}
          alt="m1"
          className="transition-transform duration-150 ease-out active:scale-95"
        />
      </button>

      {/* m2 button → open ONE external window with target = 'services' */}
      <button
        className="absolute top-[54%] left-[38%]"
        onClick={() => handleOpenExternal("services")}
      >
        <img
          src={lang === "en" ? a2 : m2}
          alt="m2"
          className="transition-transform duration-150 ease-out active:scale-95"
        />
      </button>

      <button
        className="absolute top-[54%] left-[65%]"
        onClick={() => handleOpenExternal("impact")}
      >
        <img
          src={lang === "en" ? a3 : m3}
          alt="m3"
          className="
            transition-transform 
            duration-150 
            ease-out 
            active:scale-95
          "
        />
      </button>
    </div>
  );
};

export default App;
