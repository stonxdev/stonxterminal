import { exec, spawn } from "node:child_process";
import fs from "node:fs/promises";
import { join as join$1, dirname } from "node:path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { app, ipcMain, BrowserWindow, dialog, shell, net, Menu } from "electron";
import { join } from "path";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const icon = join(__dirname, "../../resources/icon.png");
app.name = "Everyone is fine";
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true, // Remove this to show the menu
    ...{ icon },
    webPreferences: {
      preload: join$1(__dirname, "../preload/index.mjs"),
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
    shell.openExternal(details.url);
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
            const result = await dialog.showOpenDialog(mainWindow, {
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
              shell.showItemInFolder(currentProject.journalPath);
            } else {
              dialog.showMessageBox(mainWindow, {
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
                exec(terminalCommand, (error) => {
                  if (error) {
                    console.error("Failed to open Terminal:", error);
                  }
                });
              } else if (process.platform === "win32") {
                spawn(
                  "cmd.exe",
                  ["/K", `cd /d "${currentProject.projectPath}"`],
                  {
                    detached: true,
                    stdio: "ignore"
                  }
                );
              } else {
                spawn(
                  "xterm",
                  ["-e", `cd "${currentProject.projectPath}" && bash`],
                  {
                    detached: true,
                    stdio: "ignore"
                  }
                );
              }
            } else {
              dialog.showMessageBox(mainWindow, {
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
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join$1(__dirname, "../renderer/index.html"));
  }
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.everyoneisfine.app");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  ipcMain.on("ping", () => console.log("pong"));
  ipcMain.handle("app:getDataPath", () => {
    return join$1(app.getPath("userData"), "everyoneisfine-data");
  });
  ipcMain.handle("fs:joinPath", (_event, ...paths) => {
    return join$1(...paths);
  });
  ipcMain.handle("zoom:increase", (event) => {
    const webContents = event.sender;
    const currentLevel = webContents.getZoomLevel();
    webContents.setZoomLevel(currentLevel + 0.5);
    return webContents.getZoomLevel();
  });
  ipcMain.handle("zoom:decrease", (event) => {
    const webContents = event.sender;
    const currentLevel = webContents.getZoomLevel();
    webContents.setZoomLevel(currentLevel - 0.5);
    return webContents.getZoomLevel();
  });
  ipcMain.handle("zoom:reset", (event) => {
    const webContents = event.sender;
    webContents.setZoomLevel(0);
    return 0;
  });
  ipcMain.handle("zoom:getLevel", (event) => {
    return event.sender.getZoomLevel();
  });
  ipcMain.handle("zoom:setLevel", (event, level) => {
    event.sender.setZoomLevel(level);
    return event.sender.getZoomLevel();
  });
  ipcMain.handle("fs:checkPathExists", async (_event, path) => {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  });
  ipcMain.handle("fs:ensureDirExists", async (_event, path) => {
    try {
      await fs.mkdir(path, { recursive: true });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code !== "EEXIST") {
        console.error(`Failed to ensure directory exists: ${path}`, error);
        throw error;
      }
    }
  });
  ipcMain.handle(
    "fs:ensureFileExists",
    async (_event, path, defaultContent = "") => {
      try {
        await fs.access(path);
      } catch {
        try {
          await fs.mkdir(dirname(path), { recursive: true });
          await fs.writeFile(path, defaultContent, "utf-8");
        } catch (writeError) {
          console.error(`Failed to create file: ${path}`, writeError);
          throw writeError;
        }
      }
    }
  );
  ipcMain.handle("fs:readFileContent", async (_event, path) => {
    try {
      const content = await fs.readFile(path, "utf-8");
      return content;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
        return null;
      }
      console.error(`Failed to read file: ${path}`, error);
      throw error;
    }
  });
  ipcMain.handle("fs:writeFileContent", async (_event, path, content) => {
    try {
      await fs.writeFile(path, content, "utf-8");
    } catch (error) {
      console.error(`Failed to write file: ${path}`, error);
      throw error;
    }
  });
  ipcMain.handle(
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
  ipcMain.handle("dialog:openDirectory", async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      console.error("Could not find browser window for dialog");
      return void 0;
    }
    const result = await dialog.showOpenDialog(window, {
      properties: ["openDirectory"]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      console.log("Selected folder via button:", folderPath);
      window.webContents.send("folder-selected", folderPath);
    }
    return result;
  });
  ipcMain.handle(
    "shell:showItemInFolder",
    async (_event, folderPath) => {
      try {
        await shell.showItemInFolder(folderPath);
        return true;
      } catch (error) {
        console.error("Failed to open folder in OS explorer:", error);
        return false;
      }
    }
  );
  ipcMain.handle("shell:openTerminal", async (_event, folderPath) => {
    try {
      if (process.platform === "darwin") {
        const terminalCommand = `open -a Terminal "${folderPath}"`;
        exec(terminalCommand, (error) => {
          if (error) {
            console.error("Failed to open Terminal:", error);
            return false;
          }
          console.log("Terminal opened successfully at path:", folderPath);
          return true;
        });
        return true;
      } else if (process.platform === "win32") {
        spawn("cmd.exe", ["/K", `cd /d "${folderPath}"`], {
          detached: true,
          stdio: "ignore"
        });
        return true;
      } else {
        spawn("xterm", ["-e", `cd "${folderPath}" && bash`], {
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
  ipcMain.handle("dialog:showMessageBox", async (event, options) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      console.error("Could not find browser window for dialog");
      return { response: 0 };
    }
    return await dialog.showMessageBox(window, options);
  });
  ipcMain.handle("ai:proxyRequest", async (_event, options) => {
    try {
      const { url, method, headers, body } = options;
      console.log(`Making proxy request to: ${url}`);
      const request = net.request({
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
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
