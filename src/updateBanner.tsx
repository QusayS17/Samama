// src/updateBanner.tsx
import { useEffect, useState } from "react";

const UpdateBanner = () => {
  const [status, setStatus] = useState<
    "idle" | "downloading" | "ready" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api) return; // ✅ fixes "possibly undefined"

    api.onUpdateAvailable?.((info: any) => {
      setStatus("downloading");
      setVersion(info?.version ?? null);
    });

    api.onUpdateDownloadProgress?.((p: any) => {
      if (typeof p?.percent === "number") {
        setProgress(p.percent);
      }
    });

    api.onUpdateDownloaded?.((info: any) => {
      setStatus("ready");
      setVersion(info?.version ?? null);
    });

    api.onUpdateError?.((err: any) => {
      setStatus("error");
      setError(
        typeof err === "string"
          ? err
          : err?.message ?? err?.toString?.() ?? "Unknown error"
      );
    });
  }, []);

  if (status === "idle") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-black/80 text-white px-4 py-3 shadow-lg flex items-center gap-3 max-w-md">
      {status === "downloading" && (
        <>
          <span>
            Downloading update {version ? `v${version}` : ""}...
          </span>
          <span className="text-sm opacity-80">
            {progress.toFixed(0)}%
          </span>
        </>
      )}

      {status === "ready" && (
        <>
          <span>
            Update {version ? `v${version}` : ""} downloaded. Restart to install.
          </span>
          <button
            onClick={() => window.electronAPI?.quitAndInstall?.()}
            className="ml-2 rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold hover:bg-green-600"
          >
            Restart & Update
          </button>
        </>
      )}

    
    </div>
  );
};

export default UpdateBanner;
