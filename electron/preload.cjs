// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // send events to main
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  // simple subscribe (args only, no event)
  receive: (channel, func) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },

  // if you want direct access to on/off (optional)
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  off: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener);
  },
});
