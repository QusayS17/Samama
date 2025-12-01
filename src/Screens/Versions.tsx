// src/Screens/Versions.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import bgvid from "../assets/giff/bg.webm";
import bgimage from "../assets/sheet/touch screen samama v2 copy.jpg"
import ver1 from "../assets/giff/SAMAMA.gif";
import ver2 from "../assets/giff/SAMAMA V.2.gif";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  openExternalWindow,
  setWindowLang,
  setWindowTarget,
  toggleLang as toggleLangAction,
  type ExternalTarget,
} from "../Redux/externalWindowSlice";

declare const window: Window & typeof globalThis;

const Versions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const lang = useSelector((state: RootState) => state.externalWindow.lang);
  const { isOpen, target, windowLang } = useSelector(
    (state: RootState) => state.externalWindow
  );

  const toggleLang = () => {
    dispatch(toggleLangAction());
  };

  const handleOpenExternal = (nextTarget: ExternalTarget) => {
    if (!window.electronAPI) return;

    // external window already open
    if (isOpen) {
      // same target + same lang → just focus
      if (target === nextTarget && windowLang === lang) {
        window.electronAPI.send("focus-external-window");
        return;
      }

      // something changed (target or lang) → update Redux + tell external window
      dispatch(setWindowTarget(nextTarget));
      dispatch(setWindowLang(lang));
      window.electronAPI.send("update-external", {
        target: nextTarget,
        lang,
      });
      return;
    }

    // external window not open yet → open with current target + lang
    dispatch(openExternalWindow({ target: nextTarget, lang }));
    window.electronAPI.send("open-external-window", {
      target: nextTarget,
      lang,
    });
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center overflow-hidden"
     // style={{
      //   backgroundImage: `url(${bgimage})`,
      // }}
    >
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src={bgvid}
        autoPlay
        loop
        muted
      />

      {/* toggle language (global) */}
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
        <span className="text-lg">
          {lang === "en" ? "English" : "عربي"}
        </span>
      </button>

      {/* back button (internal navigation) */}
      <button
        onClick={() => navigate("/")}
        className="absolute bottom-6 left-6 z-10 flex items-center justify-center h-15 w-15 rounded-full bg-white/10 border border-white/40 backdrop-blur-md shadow-lg shadow-black/30 hover:bg-white/20 active:scale-95 transition"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* ver1 → same external window, target=v1 */}
      <button
        className="absolute top-[55%] left-[25%]"
        onClick={() => handleOpenExternal("v1")}
      >
        <img
          src={ver1}
          alt="m1"
          className="transition-transform duration-150 ease-out active:scale-95"
        />
      </button>

      {/* ver2 → same external window, target=v2 */}
      <button
        className="absolute top-[55%] left-[53%]"
        onClick={() => handleOpenExternal("v2")}
      >
        <img
          src={ver2}
          alt="m2"
          className="transition-transform duration-150 ease-out active:scale-95"
        />
      </button>
    </div>
  );
};

export default Versions;
