// src/Screens/ExternalWindow.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dfvid from "./assets/SHOW/ecosaver final.webm";
import startvid from "./assets/SHOW/ECo start.webm";
import rightvid from "./assets/SHOW/ECo b2.webm";
import leftvid from "./assets/SHOW/ECo b3 map.webm";

import type { AppDispatch, RootState } from "./store";
import {
  setWindowTarget,
  type ExternalTarget,
} from "./Redux/externalWindowSlice";

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

  // ✅ changes only when you want "restart"
  const [playId, setPlayId] = useState<number>(0);

  useEffect(() => {
    if (!window.electronAPI) return;

    const handleUpdate = (payload?: {
      target?: ExternalTarget;
      playId?: number;
    }) => {
      // ✅ update target
      if (payload?.target) dispatch(setWindowTarget(payload.target));

      // ✅ restart trigger
      if (typeof payload?.playId === "number") {
        setPlayId(payload.playId);
      }
    };

    window.electronAPI.receive("update-external", handleUpdate);
  }, [dispatch]);

  const src = videoMap[target] ?? Dfvid;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <video
        key={`${target}-${playId}`}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={src}
        autoPlay
        muted
        playsInline
        loop={target === "default"} // ✅ ONLY default loops
      />
    </div>
  );
};

export default ExternalWindow;
