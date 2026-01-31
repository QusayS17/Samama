// src/Screens/ExternalWindow.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dfvid from "./assets/eco/ecosaver final.webm";
import startvid from "./assets/eco/ECo start.webm";
import rightvid from "./assets/eco/ECo b2.webm";
import leftvid from "./assets/eco/ECo b3 map.webm";
import gridImg from "./assets/grids.png";

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
      {/* VIDEO */}
      <video
        key={target}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* GRID OVERLAY – VERY UNCOMFORTABLE */}
     <div
  className="pointer-events-none fixed inset-0 z-[999]"
  style={{
    backgroundImage: `
      linear-gradient(to right, rgba(0, 220, 0, 1) 5px, transparent 5px),
      linear-gradient(to bottom, rgba(200, 220, 0, 1) 5px, transparent 5px)
    `,
    backgroundSize: "28px 28px", // VERY dense
    opacity: 0.6,
    animation: "gridMove 3s linear infinite, gridFlicker 0.9s infinite",
  }}
/>

<style>
{`
@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 28px;
  }
}

@keyframes gridFlicker {
  0%   { opacity: 0.35; }
  10%  { opacity: 0.75; }
  20%  { opacity: 0.25; }
  35%  { opacity: 0.8; }
  50%  { opacity: 0.3; }
  65%  { opacity: 0.85; }
  80%  { opacity: 0.4; }
  100% { opacity: 0.6; }
}
`}
</style>

    </div>
  );
};

export default ExternalWindow;
