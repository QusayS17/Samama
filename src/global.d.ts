// src/global.d.ts
export {};

interface ElectronAPI {
  // Basic IPC
  send: (channel: string, data?: unknown) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;

  // --- Auto-update methods (must match preload.cjs) ---
  checkForUpdates: () => void;
  quitAndInstall: () => void;

  onUpdateAvailable: (cb: (info: any) => void) => void;
  onUpdateNotAvailable: (cb: (info: any) => void) => void;
  onUpdateError: (cb: (error: any) => void) => void;
  onUpdateDownloadProgress: (cb: (progress: any) => void) => void;
  onUpdateDownloaded: (cb: (info: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
