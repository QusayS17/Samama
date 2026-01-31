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

// ✅ Map every target to its video (scales nicely)
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

    window.electronAPI.receive("update-external", handleUpdate);
    window.electronAPI.send("request-external-state");

    // ✅ optional cleanup (only if your electronAPI supports removing listeners)
    // return () => window.electronAPI?.remove?.("update-external", handleUpdate);
  }, [dispatch]);

  const src = videoMap[target] ?? Dfvid;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-[1344px] h-[1080px]">
        <video
          key={target} // ✅ forces reload when target changes
          className="w-full h-full object-cover"
          src={src}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default ExternalWindow;
