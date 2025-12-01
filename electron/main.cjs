// electron/main.cjs
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain,
} = require("electron");
const path = require("path");

app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-accelerated-video");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");

let mainWindow = null;
let externalWindow = null;

// keep current external state in main process
let currentLang = "en";
// 🆕 allow null for default/intro content
let currentTarget = null; // "v1" | "v2" | "services" | "impact" | null

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "../public/logo.ico"),
    autoHideMenuBar: false,
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
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // 👉 route used by the external window
    externalWindow.loadURL("http://localhost:5173/#/external");
  } else {
    const filePath = path.join(__dirname, "../dist/index.html");
    externalWindow.loadURL(`file://${filePath}#/external`);
  }

  externalWindow.webContents.on("did-finish-load", () => {
    if (!externalWindow || externalWindow.isDestroyed()) return;
    externalWindow.webContents.send("init-external", {
      lang: currentLang,
      target: currentTarget, // can be null → renderer shows default intro
    });
  });

  externalWindow.on("closed", () => {
    externalWindow = null;

    // notify main renderer if you want
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("external-window-closed");
    }
  });
}

// shortcuts
function registerShortcuts() {
  globalShortcut.register("Shift+F", () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (focused) focused.setFullScreen(!focused.isFullScreen());
  });

  globalShortcut.register("F12", () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (!focused) return;
    if (focused.webContents.isDevToolsOpened()) {
      focused.webContents.closeDevTools();
    } else {
      focused.webContents.openDevTools();
    }
  });
}

/* ============ IPC ============ */

// open or create the external window for any target (v1/v2/services/impact/null)
ipcMain.on("open-external-window", (_event, payload) => {
  const { target, lang } = payload || {};

  // allow null (back to intro) or specific target
  if (typeof target !== "undefined") {
    currentTarget = target;
  }
  if (lang) currentLang = lang;

  createExternalWindow();
});

// focus external window
ipcMain.on("focus-external-window", () => {
  if (externalWindow && !externalWindow.isDestroyed()) {
    externalWindow.focus();
  }
});

// update target/lang if external window is already open
ipcMain.on("update-external", (_event, payload) => {
  const { target, lang } = payload || {};

  if (typeof target !== "undefined") {
    currentTarget = target; // can be null or "v1"/"v2"/"services"/"impact"
  }
  if (lang) currentLang = lang;

  if (externalWindow && !externalWindow.isDestroyed()) {
    externalWindow.webContents.send("update-external", {
      lang: currentLang,
      target: currentTarget,
    });
  }
});

// external window asks for latest state
ipcMain.on("request-external-state", (event) => {
  event.sender.send("init-external", {
    lang: currentLang,
    target: currentTarget,
  });
});

/* ========= App lifecycle ========= */

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  mainWindow = createMainWindow();
  createExternalWindow(); // 🆕 external window always opened on start
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
