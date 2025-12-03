// src/Screens/ExternalWindow.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import v1eng from "./assets/eng/samama eng.webm";
import v1arb from "./assets/arb/samama arb.webm";
import v2eng from "./assets/eng/SAMAMA v2.0 eng.webm";
import v2arb from "./assets/arb/SAMAMA v2.0 arb.webm";
import servicesEng from "./assets/eng/SAMAMA Services eng.webm";
import servicesArb from "./assets/arb/SAMAMA Services arb.webm";
import impactEng from "./assets/eng/SAMAMA Impact eng.webm";
import impactArb from "./assets/arb/SAMAMA Impact arb.webm";

import defaultVidEng from "./assets/eng/intro eng.webm";
import defaultVidArb from "./assets/arb/newarbintro.webm";

import {
  setLanguage,
  setWindowTarget,
  type ExternalTarget,
  type LangType,
} from "./Redux/externalWindowSlice";
import type { AppDispatch, RootState } from "./store";

declare const window: Window & typeof globalThis;

type VideoConfig = { id: string; src: string };

// Normal content videos
const VIDEO_BY_TARGET_LANG: Record<
  Exclude<ExternalTarget, null>,
  Record<LangType, VideoConfig>
> = {
  v1: {
    en: { id: "v1-en", src: v1arb },
    ar: { id: "v1-ar", src: v1eng },
  },
  v2: {
    en: { id: "v2-en", src: v2arb },
    ar: { id: "v2-ar", src: v2eng },
  },
  services: {
    en: { id: "services-en", src: servicesArb },
    ar: { id: "services-ar", src: servicesEng },
  },
  impact: {
    en: { id: "impact-en", src: impactArb },
    ar: { id: "impact-ar", src: impactEng },
  },
};

// Default intro when target === null
const DEFAULT_VIDEO_BY_LANG: Record<LangType, VideoConfig> = {
  en: { id: "default-en", src: defaultVidArb },
  ar: { id: "default-ar", src: defaultVidEng },
};

const ExternalWindow = () => {
  const dispatch = useDispatch<AppDispatch>();

  const lang = useSelector((state: RootState) => state.externalWindow.lang);
  const target = useSelector(
    (state: RootState) => state.externalWindow.target
  );

  // Decide what to show
  const currentVideo: VideoConfig =
    target === null
      ? DEFAULT_VIDEO_BY_LANG[lang]
      : VIDEO_BY_TARGET_LANG[target][lang];

  const { id, src } = currentVideo;

  useEffect(() => {
    if (!window.electronAPI) return;

    const handleInit = (payload?: {
      lang?: LangType;
      target?: ExternalTarget;
    }) => {
      if (payload?.lang) {
        dispatch(setLanguage(payload.lang));
      }

      // important: target can be null, so we must guard with typeof
      if (typeof payload?.target !== "undefined") {
        dispatch(setWindowTarget(payload.target));
      }
    };

    const handleUpdate = (payload?: {
      lang?: LangType;
      target?: ExternalTarget;
    }) => {
      if (payload?.lang) {
        dispatch(setLanguage(payload.lang));
      }
      if (typeof payload?.target !== "undefined") {
        dispatch(setWindowTarget(payload.target));
      }
    };

    window.electronAPI.receive("init-external", handleInit);
    window.electronAPI.receive("update-external", handleUpdate);

    // ask main for current (lang, target) when we mount
    window.electronAPI.send("request-external-state");
  }, [dispatch]);

  return (
    <div className="relative w-full h-screen bg-cover bg-center overflow-hidden">
      <video
        key={id}
        className="fixed inset-0 w-full h-full object-cover -z-10"
        src={src}
        autoPlay
        loop
        muted
      />
    </div>
  );
};

export default ExternalWindow;
