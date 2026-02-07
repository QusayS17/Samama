// src/App.tsx
import startbtn from "./assets/start.png";
import bgimage from "./assets/BG.png";
import Leftbtn from "./assets/map.png";
import Rightbtn from "./assets/3naser.png";
import { startApp, resetApp, clicked } from "./Redux/funcSlice";

import HomeImage from "./assets/home.png";
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
  const { step, visible } = useSelector((state: RootState) => state.func);

  const animateHideThen = (el: HTMLButtonElement, next: () => void) => {
    el.classList.remove("animate-fade-in-scale");
    el.classList.add("animate-fade-out-scale");
    window.setTimeout(next, 260); // match fadeOut duration
  };

  const { isOpen, target } = useSelector(
    (state: RootState) => state.externalWindow,
  );

  const handleOpenExternal = (nextTarget: ExternalTarget) => {
    if (!window.electronAPI) return;

    if (isOpen) {
      dispatch(setWindowTarget(nextTarget));
      window.electronAPI.send("update-external", { target: nextTarget });
      window.electronAPI.send("focus-external-window");
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
    transform-gpu
    will-change-transform
    hover:animate-pulse-once
  "
        disabled={step === "started"}
        onClick={(e) => {
          const el = e.currentTarget;
          el.classList.remove("animate-press");
          void el.offsetWidth; // reset animation
          el.classList.add("animate-press");
          dispatch(startApp());
          handleOpenExternal("start");
        }}
      >
        <img
          src={startbtn}
          alt="start"
          className="w-[390px] h-[390px] object-contain pointer-events-none"
        />
      </button>

      {step === "started" && visible === "left" && (
        <button
          className="
   absolute top-[60%] left-[39%]
      w-[420px] h-[420px]
      flex items-center justify-center
      transform-gpu
      animate-fade-in-scale
    "
          onClick={(e) => {
            const el = e.currentTarget;

            // press
            el.classList.remove("animate-press");
            void el.offsetWidth;
            el.classList.add("animate-press");

            // play left video immediately
            handleOpenExternal("left");

            // hide left then show right
            animateHideThen(el, () => {
              dispatch(clicked("left")); // left -> right
            });
          }}
        >
          <img
            src={Leftbtn}
            alt="left"
            className="w-[390px] h-[390px] object-contain pointer-events-none"
          />
        </button>
      )}

      {/* Right Button */}
      {step === "started" && visible === "right" && (
        <button
          className="
      absolute top-[60%] left-[39%]
      w-[420px] h-[420px]
      flex items-center justify-center
      transform-gpu
      animate-fade-in-scale
    "
          onClick={(e) => {
            const el = e.currentTarget;

            // press
            el.classList.remove("animate-press");
            void el.offsetWidth;
            el.classList.add("animate-press");

            // play right video immediately
            handleOpenExternal("right");

            // hide right then show left
            animateHideThen(el, () => {
              dispatch(clicked("right")); // right -> left
            });
          }}
        >
          <img
            src={Rightbtn}
            alt="right"
            className="w-[390px] h-[390px] object-contain pointer-events-none"
          />
        </button>
      )}

      {/* Back button: show when NOT default */}
      {/* Home button: show when NOT default */}
      {target !== "default" && (
        <button
          onClick={() => {
            dispatch(resetApp()); // ✅ hide left/right buttons
            handleOpenExternal("default"); // ✅ show df video again
          }}
          className="
      absolute top-[5%] left-[5%]
      w-[72px] h-[72px]
      rounded-full
      bg-white/15 backdrop-blur-md
      border border-white/30
      shadow-xl
      flex items-center justify-center
      active:scale-95
      transition-all duration-200
      z-50
    "
        >
          <img
            src={HomeImage}
            alt="home"
            className="w-8 h-8 object-contain pointer-events-none opacity-90"
          />
        </button>
      )}
    </div>
  );
};

export default App;
