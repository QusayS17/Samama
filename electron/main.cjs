// electron/main.cjs
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain,
} = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

// GPU acceleration tweaks
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-accelerated-video");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");

// Logging
log.transports.file.level = "info";
autoUpdater.logger = log;

// MAIN + EXTERNAL WINDOW HANDLING
let mainWindow = null;
let externalWindow = null;
let currentLang = "en";
let currentTarget = null; // "v1" | "v2" | "services" | "impact" | null

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "../public/logo.ico"),
    autoHideMenuBar: true, // 👈 hide toolbar/menu
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  return win;
}

function createExternalWindow() {
  if (externalWindow && !externalWindow.isDestroyed()) {
    externalWindow.focus();
    return;
  }

  externalWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "../public/logo.ico"),
    autoHideMenuBar: true, // 👈 no menu bar
    fullscreen: true,      // 👈 start fullscreen for signage
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    externalWindow.loadURL("http://localhost:5173/#/external");
  } else {
    const filePath = path.join(__dirname, "../dist/index.html");
    externalWindow.loadURL(`file://${filePath}#/external`);
  }

  externalWindow.webContents.on("did-finish-load", () => {
    if (!externalWindow || externalWindow.isDestroyed()) return;
    externalWindow.webContents.send("init-external", {
      lang: currentLang,
      target: currentTarget,
    });
  });

  externalWindow.on("closed", () => {
    externalWindow = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("external-window-closed");
    }
  });
}

// 🔥 AUTO-UPDATER SETUP
function setupAutoUpdater() {
  if (!app.isPackaged) {
    console.log("Skipping autoUpdater in dev mode");
    return;
  }

  autoUpdater.autoDownload = true;

  autoUpdater.on("update-available", (info) => {
    if (mainWindow) mainWindow.webContents.send("update-available", info);
  });

  autoUpdater.on("update-not-available", (info) => {
    if (mainWindow) mainWindow.webContents.send("update-not-available", info);
  });

  autoUpdater.on("error", (err) => {
    if (mainWindow)
      mainWindow.webContents.send("update-error", err?.message || String(err));
  });

  autoUpdater.on("download-progress", (progress) => {
    if (mainWindow)
      mainWindow.webContents.send("update-download-progress", progress);
  });

  autoUpdater.on("update-downloaded", (info) => {
    if (mainWindow) mainWindow.webContents.send("update-downloaded", info);
  });

  autoUpdater.checkForUpdates();
}

// 🔧 GLOBAL SHORTCUTS (fullscreen + reload)
function registerShortcuts() {
  // Shift+F → toggle fullscreen on focused window
  globalShortcut.register("Shift+F", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    win.setFullScreen(!win.isFullScreen());
  });

  // Shift+R → reload focused window
  globalShortcut.register("Shift+R", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;

    if (process.env.NODE_ENV === "development") {
      // dev: ignore cache, quicker for hot changes
      win.webContents.reloadIgnoringCache();
    } else {
      win.webContents.reload();
    }
  });
}

// IPC ROUTES
ipcMain.on("open-external-window", (_event, payload) => {
  const { target, lang } = payload || {};
  if (typeof target !== "undefined") currentTarget = target;
  if (lang) currentLang = lang;
  createExternalWindow();
});

ipcMain.on("focus-external-window", () => {
  if (externalWindow) externalWindow.focus();
});

ipcMain.on("update-external", (_event, payload) => {
  const { target, lang } = payload || {};
  if (typeof target !== "undefined") currentTarget = target;
  if (lang) currentLang = lang;

  if (externalWindow) {
    externalWindow.webContents.send("update-external", {
      lang: currentLang,
      target: currentTarget,
    });
  }
});

// Update IPC
ipcMain.on("check-for-updates", () => {
  if (app.isPackaged) autoUpdater.checkForUpdates();
});

ipcMain.on("quit-and-install", () => {
  autoUpdater.quitAndInstall();
});

// APP LIFECYCLE
app.whenReady().then(() => {
  Menu.setApplicationMenu(null); // hide app menu globally

  mainWindow = createMainWindow();
  createExternalWindow();
  setupAutoUpdater();
  registerShortcuts();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      createExternalWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// cleanup shortcuts
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
