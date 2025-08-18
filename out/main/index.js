"use strict";
const node_child_process = require("node:child_process");
const fs = require("node:fs/promises");
const node_path = require("node:path");
const utils = require("@electron-toolkit/utils");
const electron = require("electron");
const path = require("path");
const icon = path.join(__dirname, "../../resources/icon.png");
electron.app.name = "Colony";
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true, // Remove this to show the menu
    ...{ icon },
    webPreferences: {
      preload: node_path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      // Recommended for security
      webSecurity: false,
      // Allow unsafe-eval for Pixi.js in development
      nodeIntegration: false,
      // Keep this false for security
      allowRunningInsecureContent: true
      // Allow mixed content
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.maximize();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Open Folder...",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await electron.dialog.showOpenDialog(mainWindow, {
              properties: ["openDirectory"]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const folderPath = result.filePaths[0];
              console.log("Selected folder:", folderPath);
              mainWindow.webContents.send("folder-selected", folderPath);
            }
          }
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "Journal",
      submenu: [
        {
          label: "Reveal in Finder / Explorer",
          click: async () => {
            const currentProject = await mainWindow.webContents.executeJavaScript(
              `window.api._getCurrentProject && window.api._getCurrentProject()`
            );
            if (currentProject?.journalPath) {
              electron.shell.showItemInFolder(currentProject.journalPath);
            } else {
              electron.dialog.showMessageBox(mainWindow, {
                type: "info",
                message: "No journal folder is currently open.",
                buttons: ["OK"]
              });
            }
          }
        },
        {
          label: "Open in Terminal",
          click: async () => {
            const currentProject = await mainWindow.webContents.executeJavaScript(
              `window.api._getCurrentProject && window.api._getCurrentProject()`
            );
            if (currentProject?.projectPath) {
              if (process.platform === "darwin") {
                const terminalCommand = `open -a Terminal "${currentProject.projectPath}"`;
                node_child_process.exec(terminalCommand, (error) => {
                  if (error) {
                    console.error("Failed to open Terminal:", error);
                  }
                });
              } else if (process.platform === "win32") {
                node_child_process.spawn(
                  "cmd.exe",
                  ["/K", `cd /d "${currentProject.projectPath}"`],
                  {
                    detached: true,
                    stdio: "ignore"
                  }
                );
              } else {
                node_child_process.spawn(
                  "xterm",
                  ["-e", `cd "${currentProject.projectPath}" && bash`],
                  {
                    detached: true,
                    stdio: "ignore"
                  }
                );
              }
            } else {
              electron.dialog.showMessageBox(mainWindow, {
                type: "info",
                message: "No journal folder is currently open.",
                buttons: ["OK"]
              });
            }
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
        // Add other edit items if needed
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "resetZoom", label: "Reset Zoom", accelerator: "CmdOrCtrl+0" },
        { role: "zoomIn", accelerator: "CmdOrCtrl+Plus" },
        { role: "zoomOut", accelerator: "CmdOrCtrl+-" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    // Add other menus like Window, Help as needed
    {
      label: "Developer",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(menuTemplate);
  electron.Menu.setApplicationMenu(menu);
  if (utils.is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(node_path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.colony.app");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.handle("fs:joinPath", (_event, ...paths) => {
    return node_path.join(...paths);
  });
  electron.ipcMain.handle("zoom:increase", (event) => {
    const webContents = event.sender;
    const currentLevel = webContents.getZoomLevel();
    webContents.setZoomLevel(currentLevel + 0.5);
    return webContents.getZoomLevel();
  });
  electron.ipcMain.handle("zoom:decrease", (event) => {
    const webContents = event.sender;
    const currentLevel = webContents.getZoomLevel();
    webContents.setZoomLevel(currentLevel - 0.5);
    return webContents.getZoomLevel();
  });
  electron.ipcMain.handle("zoom:reset", (event) => {
    const webContents = event.sender;
    webContents.setZoomLevel(0);
    return 0;
  });
  electron.ipcMain.handle("zoom:getLevel", (event) => {
    return event.sender.getZoomLevel();
  });
  electron.ipcMain.handle("zoom:setLevel", (event, level) => {
    event.sender.setZoomLevel(level);
    return event.sender.getZoomLevel();
  });
  electron.ipcMain.handle("fs:checkPathExists", async (_event, path2) => {
    try {
      await fs.access(path2);
      return true;
    } catch {
      return false;
    }
  });
  electron.ipcMain.handle("fs:ensureDirExists", async (_event, path2) => {
    try {
      await fs.mkdir(path2, { recursive: true });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code !== "EEXIST") {
        console.error(`Failed to ensure directory exists: ${path2}`, error);
        throw error;
      }
    }
  });
  electron.ipcMain.handle(
    "fs:ensureFileExists",
    async (_event, path2, defaultContent = "") => {
      try {
        await fs.access(path2);
      } catch {
        try {
          await fs.mkdir(node_path.dirname(path2), { recursive: true });
          await fs.writeFile(path2, defaultContent, "utf-8");
        } catch (writeError) {
          console.error(`Failed to create file: ${path2}`, writeError);
          throw writeError;
        }
      }
    }
  );
  electron.ipcMain.handle("fs:readFileContent", async (_event, path2) => {
    try {
      const content = await fs.readFile(path2, "utf-8");
      return content;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
        return null;
      }
      console.error(`Failed to read file: ${path2}`, error);
      throw error;
    }
  });
  electron.ipcMain.handle("fs:writeFileContent", async (_event, path2, content) => {
    try {
      await fs.writeFile(path2, content, "utf-8");
    } catch (error) {
      console.error(`Failed to write file: ${path2}`, error);
      throw error;
    }
  });
  electron.ipcMain.handle(
    "fs:readDir",
    async (_event, dirPath) => {
      try {
        const dirents = await fs.readdir(dirPath, { withFileTypes: true });
        return dirents.map((dirent) => ({
          name: dirent.name,
          isDirectory: dirent.isDirectory()
        }));
      } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
          return null;
        }
        console.error(`Failed to read directory: ${dirPath}`, error);
        throw error;
      }
    }
  );
  electron.ipcMain.handle("dialog:openDirectory", async (event) => {
    const window = electron.BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      console.error("Could not find browser window for dialog");
      return void 0;
    }
    const result = await electron.dialog.showOpenDialog(window, {
      properties: ["openDirectory"]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      console.log("Selected folder via button:", folderPath);
      window.webContents.send("folder-selected", folderPath);
    }
    return result;
  });
  electron.ipcMain.handle(
    "shell:showItemInFolder",
    async (_event, folderPath) => {
      try {
        await electron.shell.showItemInFolder(folderPath);
        return true;
      } catch (error) {
        console.error("Failed to open folder in OS explorer:", error);
        return false;
      }
    }
  );
  electron.ipcMain.handle("shell:openTerminal", async (_event, folderPath) => {
    try {
      if (process.platform === "darwin") {
        const terminalCommand = `open -a Terminal "${folderPath}"`;
        node_child_process.exec(terminalCommand, (error) => {
          if (error) {
            console.error("Failed to open Terminal:", error);
            return false;
          }
          console.log("Terminal opened successfully at path:", folderPath);
          return true;
        });
        return true;
      } else if (process.platform === "win32") {
        node_child_process.spawn("cmd.exe", ["/K", `cd /d "${folderPath}"`], {
          detached: true,
          stdio: "ignore"
        });
        return true;
      } else {
        node_child_process.spawn("xterm", ["-e", `cd "${folderPath}" && bash`], {
          detached: true,
          stdio: "ignore"
        });
        return true;
      }
    } catch (error) {
      console.error("Failed to open terminal at path:", error);
      return false;
    }
  });
  electron.ipcMain.handle("dialog:showMessageBox", async (event, options) => {
    const window = electron.BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      console.error("Could not find browser window for dialog");
      return { response: 0 };
    }
    return await electron.dialog.showMessageBox(window, options);
  });
  electron.ipcMain.handle("ai:proxyRequest", async (_event, options) => {
    try {
      const { url, method, headers, body } = options;
      console.log(`Making proxy request to: ${url}`);
      const request = electron.net.request({
        method: method || "POST",
        url
      });
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          request.setHeader(key, value);
        });
      }
      return new Promise((resolve, reject) => {
        let responseData = "";
        request.on("response", (response) => {
          response.on("data", (chunk) => {
            responseData += chunk.toString();
          });
          response.on("end", () => {
            try {
              const parsedData = JSON.parse(responseData);
              resolve({
                status: response.statusCode,
                headers: response.headers,
                data: parsedData
              });
            } catch (_e) {
              resolve({
                status: response.statusCode,
                headers: response.headers,
                data: responseData
              });
            }
          });
          response.on("error", (error) => {
            console.error("Error in proxy response:", error);
            reject(error);
          });
        });
        request.on("error", (error) => {
          console.error("Error in proxy request:", error);
          reject(error);
        });
        if (body) {
          const bodyData = typeof body === "string" ? body : JSON.stringify(body);
          request.write(bodyData);
        }
        request.end();
      });
    } catch (error) {
      console.error("Error in AI proxy handler:", error);
      throw error;
    }
  });
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
