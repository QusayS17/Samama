// src/Screens/V1.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

import v2eng from "../assets/eng/SAMAMA v2.0 eng.webm";
import v2arb from "../assets/arb/SAMAMA v2.0 arb.webm";

import {
  setLanguage,
  type LangType,
} from "../Redux/externalWindowSlice";

// 👇 map each lang to a unique id + src
const VIDEO_BY_LANG: Record<LangType, { id: string; src: string }> = {
  en: { id: "v2-en", src: v2eng },
  ar: { id: "v2-ar", src: v2arb },
};


const V2 = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 🔤 lang for THIS window (from its own Redux store)
  const lang = useSelector(
    (state: RootState) => state.externalWindow.lang
  );

  const { id, src } = VIDEO_BY_LANG[lang];

  // 🔁 sync lang from main → V1 via IPC
  useEffect(() => {
    if (!window.electronAPI) return;

    const handleInitLang = (payload?: { lang?: LangType }) => {
      if (!payload?.lang) return;
      dispatch(setLanguage(payload.lang));
    };

    const handleUpdateLang = (payload?: { lang?: LangType }) => {
      if (!payload?.lang) return;
      dispatch(setLanguage(payload.lang));
    };

    // first time load
    window.electronAPI.receive("init-v2-lang", handleInitLang);

    // subsequent changes
    window.electronAPI.receive("update-v2-lang", handleUpdateLang);

    // (optional) ask for current lang if window opened later
    window.electronAPI.send("request-v2-lang");

    // no clean-up needed if this component never unmounts.
    // if you want to be extra safe, add on/off in preload and remove here.

  }, [dispatch]);

  return (
    <div className="relative w-full h-screen bg-cover bg-center overflow-hidden">
      <video
        key={id} // 🚀 unique per language → forces remount when lang changes
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src={src}
        autoPlay
        loop
        muted
      />
    </div>
  );
};

export default V2;
