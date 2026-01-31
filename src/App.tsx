// src/App.tsx
import startbtn from "./assets/start.png";
import bgimage from "./assets/BG.png";
import Leftbtn from "./assets/map.png";
import Rightbtn from "./assets/3naser.png";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  openExternalWindow,
  setWindowTarget,
  type ExternalTarget,
} from "./Redux/externalWindowSlice";

declare const window: Window & typeof globalThis;

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, target } = useSelector(
    (state: RootState) => state.externalWindow,
  );

  const handleOpenExternal = (nextTarget: ExternalTarget) => {
    if (!window.electronAPI) return;

    if (isOpen) {
      const sameTarget = target === nextTarget;

      if (sameTarget) {
        window.electronAPI.send("focus-external-window");
        return;
      }

      dispatch(setWindowTarget(nextTarget));
      window.electronAPI.send("update-external", { target: nextTarget });
      return;
    }

    dispatch(openExternalWindow({ target: nextTarget }));
    window.electronAPI.send("open-external-window", { target: nextTarget });
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Start Button */}
      <button
        className="
          absolute top-[33%] right-[38.5%]
          w-[420px] h-[420px]
          flex items-center justify-center

        "
        onClick={() => handleOpenExternal("start")}
      >
        <img
          src={startbtn}
          alt="start"
          className="w-[390px] h-[390px] object-contain pointer-events-none"
        />
      </button>

      {/* Left Button */}
      <button
        className="
          absolute top-[33%] right-[63%]
          w-[420px] h-[420px]
          flex items-center justify-center
          
        "
        onClick={() => handleOpenExternal("left")}
      >
        <img
          src={Leftbtn}
          alt="left"
          className="w-[390px] h-[390px] object-contain pointer-events-none"
        />
      </button>

      {/* Right Button */}
      <button
        className="
          absolute top-[33%] left-[63.9%]
          w-[420px] h-[420px]
          flex items-center justify-center
 
        "
        onClick={() => handleOpenExternal("right")}
      >
        <img
          src={Rightbtn}
          alt="right"
          className="w-[390px] h-[390px] object-contain pointer-events-none"
        />
      </button>

      {/* Back button: show when NOT default */}
      {target !== "default" && (
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
