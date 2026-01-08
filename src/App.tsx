// src/App.tsx
import bgvid from "./assets/ECHO/eco touch bg loop.webm";
import startbtn from "./assets/ECHO/bg buttong.png";
import bgimage from "./assets/ECHO/bg.png";

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

  // ONLY change local Redux lang. No IPC, no external updates here.
  const toggleLang = () => {
    dispatch(toggleLangAction());
  };

  // Open/update the ONE external window for any target (v1, v2, services, impact, null)
  const handleOpenExternal = (nextTarget: ExternalTarget) => {
    if (!window.electronAPI) return;

    if (isOpen) {
      const sameTarget = target === nextTarget;
      const sameLang = windowLang === lang;

      // SPECIAL CASE: reset to default (nextTarget === null)
      if (nextTarget === null) {
        // dispatch(setWindowTarget(null));
        dispatch(setWindowLang(lang));

        window.electronAPI.send("update-external", {
          target: null,
          lang,
        });
        return;
      }

      // Normal behavior for non-null targets
      if (sameTarget && sameLang) {
        window.electronAPI.send("focus-external-window");
        return;
      }

      dispatch(setWindowTarget(nextTarget));
      dispatch(setWindowLang(lang));
      window.electronAPI.send("update-external", {
        target: nextTarget,
        lang,
      });
      return;
    }

    // external window NOT open yet → open with target + lang (target can be null)
    dispatch(openExternalWindow({ target: nextTarget, lang }));
    window.electronAPI.send("open-external-window", {
      target: nextTarget,
      lang,
    });
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Background video */}
      {/*
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src={bgvid}
        autoPlay
        loop
        muted
      />
      */}

      {/* Start Button */}
      <button
        className="
          absolute top-[16%] right-[25%]
          w-[960px] h-[910px]   /* 👈 EDIT SIZE HERE */
          flex items-center justify-center
        "
        onClick={() => handleOpenExternal("start")}
      >
        <img
          src={startbtn}
          alt="start"
          className="
            w-[350px] h-[350px] object-contain
           
          "
        />
      </button>
      {target === "start" && (
 <button
  onClick={() => handleOpenExternal("default")}
  className="
    absolute top-[5%] left-[5%]
    w-[72px] h-[72px]
    rounded-full
    bg-white/15 backdrop-blur-md
    border border-white/30
    shadow-xl
    flex items-center justify-center
    hover:scale-110 hover:bg-white/25
    active:scale-95
    transition-all duration-200
    z-50
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="white"
    className="w-8 h-8 opacity-90"
  >
    <path d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
</button>

)}
    </div>
  );
};

export default App;
