"use strict";
const preload = require("@electron-toolkit/preload");
const electron = require("electron");
let currentProject = null;
const ipcApi = {
  onFolderSelected: (callback) => {
    electron.ipcRenderer.on(
      "folder-selected",
      (_event, folderPath) => callback(folderPath)
    );
  },
  zoomIn: () => electron.ipcRenderer.invoke("zoom:increase"),
  zoomOut: () => electron.ipcRenderer.invoke("zoom:decrease"),
  zoomReset: () => electron.ipcRenderer.invoke("zoom:reset"),
  getZoomLevel: () => electron.ipcRenderer.invoke("zoom:getLevel"),
  setZoomLevel: (level) => electron.ipcRenderer.invoke("zoom:setLevel", level),
  joinPath: (...paths) => electron.ipcRenderer.invoke("fs:joinPath", ...paths),
  checkPathExists: (path) => electron.ipcRenderer.invoke("fs:checkPathExists", path),
  ensureDirExists: (path) => electron.ipcRenderer.invoke("fs:ensureDirExists", path),
  ensureFileExists: (path, defaultContent) => electron.ipcRenderer.invoke("fs:ensureFileExists", path, defaultContent),
  readFileContent: (path) => electron.ipcRenderer.invoke("fs:readFileContent", path),
  writeFileContent: (path, content) => electron.ipcRenderer.invoke("fs:writeFileContent", path, content),
  // Function to read directory contents
  readDir: (path) => electron.ipcRenderer.invoke("fs:readDir", path),
  // Function to trigger folder selection dialog
  selectFolder: () => electron.ipcRenderer.invoke("dialog:openDirectory"),
  // Function to open path in OS file explorer
  showItemInFolder: (path) => electron.ipcRenderer.invoke("shell:showItemInFolder", path),
  // Function to open terminal at path
  openTerminal: (path) => electron.ipcRenderer.invoke("shell:openTerminal", path),
  // Function to show a native message dialog
  showMessageBox: (options) => electron.ipcRenderer.invoke("dialog:showMessageBox", options),
  // NEW: Store current project data for access from the main process
  setCurrentProject: (project) => {
    currentProject = project;
  },
  // NEW: Method for main process to retrieve the current project
  _getCurrentProject: () => {
    return currentProject;
  },
  // AI API proxy to avoid CORS issues
  proxyAiRequest: (options) => {
    return electron.ipcRenderer.invoke("ai:proxyRequest", options);
  },
  // Get the app data path for storing game saves and settings
  getAppDataPath: () => electron.ipcRenderer.invoke("app:getDataPath")
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", ipcApi);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = ipcApi;
}
