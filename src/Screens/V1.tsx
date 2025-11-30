// src/Screens/V1.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

import v1eng from "../assets/eng/samama eng.webm";
import v1arb from "../assets/arb/samama arb.webm";

import {
  setLanguage,
  type LangType,
} from "../Redux/externalWindowSlice";

// 👇 map each lang to a unique id + src
const VIDEO_BY_LANG: Record<LangType, { id: string; src: string }> = {
  en: { id: "v1-en", src: v1eng },
  ar: { id: "v1-ar", src: v1arb },
};


const V1 = () => {
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
    window.electronAPI.receive("init-v1-lang", handleInitLang);

    // subsequent changes
    window.electronAPI.receive("update-v1-lang", handleUpdateLang);

    // (optional) ask for current lang if window opened later
    window.electronAPI.send("request-v1-lang");

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

export default V1;
