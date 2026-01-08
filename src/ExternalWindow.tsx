// src/Screens/ExternalWindow.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dfvid from "./assets/ECHO/ECo saver1.webm";
import vid1 from "./assets/ECHO/ECofull3.webm";
import type { AppDispatch, RootState } from "./store";
import { setWindowTarget, type ExternalTarget } from "./Redux/externalWindowSlice";



declare const window: Window & typeof globalThis;

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
  }, [dispatch]);

  const src = target === "start" ? vid1 : Dfvid;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <video
        key={target} // ✅ forces reload when target changes
        className="fixed inset-0 w-full h-full object-cover"
        src={src}
        autoPlay
        loop
        muted
      />
    </div>
  );
};

export default ExternalWindow;
