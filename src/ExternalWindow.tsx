// src/Screens/ExternalWindow.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dfvid from "./assets/eco/ecosaver final.webm";
import startvid from "./assets/eco/ECo start.webm";
import rightvid from "./assets/eco/ECo b2.webm";
import leftvid from "./assets/eco/ECo b3 map.webm";

import type { AppDispatch, RootState } from "./store";
import { setWindowTarget, type ExternalTarget } from "./Redux/externalWindowSlice";

declare const window: Window & typeof globalThis;

const videoMap: Record<ExternalTarget, string> = {
  default: Dfvid,
  start: startvid,
  left: leftvid,
  right: rightvid,
};

const ExternalWindow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const target = useSelector((state: RootState) => state.externalWindow.target);

  useEffect(() => {
    if (!window.electronAPI) return;

    const handleUpdate = (payload?: { target?: ExternalTarget }) => {
      if (payload?.target) {
        dispatch(setWindowTarget(payload.target));
      }
    };

    // listen for updates from Electron main
    window.electronAPI.receive("update-external", handleUpdate);

    // ask Electron main for the current state on load
    window.electronAPI.send("request-external-state");

    // optional cleanup if you implement removeListener in preload
    // return () => window.electronAPI?.remove?.("update-external", handleUpdate);
  }, [dispatch]);

  const src = videoMap[target] ?? Dfvid;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <video
        key={target}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default ExternalWindow;
