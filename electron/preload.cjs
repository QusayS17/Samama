// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => ipcRenderer.send(channel, data),

  receive: (channel, func) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },

  on: (channel, listener) => ipcRenderer.on(channel, listener),
  off: (channel, listener) => ipcRenderer.removeListener(channel, listener),

  // --- AUTO UPDATE ---
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),
  quitAndInstall: () => ipcRenderer.send("quit-and-install"),

  onUpdateAvailable: (cb) =>
    ipcRenderer.on("update-available", (_e, info) => cb(info)),
  onUpdateNotAvailable: (cb) =>
    ipcRenderer.on("update-not-available", (_e, info) => cb(info)),
  onUpdateError: (cb) =>
    ipcRenderer.on("update-error", (_e, err) => cb(err)),
  onUpdateDownloadProgress: (cb) =>
    ipcRenderer.on("update-download-progress", (_e, p) => cb(p)),
  onUpdateDownloaded: (cb) =>
    ipcRenderer.on("update-downloaded", (_e, info) => cb(info)),
});
