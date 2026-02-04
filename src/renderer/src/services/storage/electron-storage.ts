import { parseStoredConfig } from "./config-helpers";
import { DEFAULT_SETTINGS } from "./settings/defaults";
import type {
  ConfigLoadResult,
  ConfigStorageData,
  ConfigStorageProvider,
  GameSave,
  GameSettings,
  SaveMetadata,
  SaveStorageProvider,
  SettingsStorageProvider,
  StorageResult,
  StorageService,
} from "./types";

const SAVES_DIR = "saves";
const SETTINGS_FILE = "settings.json";
const CONFIG_FILE = "config.json";

class ElectronSaveStorage implements SaveStorageProvider {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  private async getSavePath(id: string): Promise<string> {
    return window.api.joinPath(this.basePath, SAVES_DIR, `${id}.json`);
  }

  private async getSavesDir(): Promise<string> {
    return window.api.joinPath(this.basePath, SAVES_DIR);
  }

  async saveGame<T>(
    id: string,
    data: GameSave<T>,
  ): Promise<StorageResult<void>> {
    try {
      const savesDir = await this.getSavesDir();
      await window.api.ensureDirExists(savesDir);

      const path = await this.getSavePath(id);
      await window.api.writeFileContent(path, JSON.stringify(data, null, 2));
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async loadGame<T>(id: string): Promise<StorageResult<GameSave<T>>> {
    try {
      const path = await this.getSavePath(id);
      const content = await window.api.readFileContent(path);
      if (!content) {
        return { success: false, error: "Save not found" };
      }
      return { success: true, data: JSON.parse(content) };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async deleteGame(id: string): Promise<StorageResult<void>> {
    // Note: fs:deleteFile is not implemented in preload yet
    // For now, we could add it or return not implemented
    try {
      const path = await this.getSavePath(id);
      // Would need to add deleteFile to preload API
      // For now, overwrite with empty content (not ideal but functional)
      await window.api.writeFileContent(path, "");
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async listSaves(): Promise<StorageResult<SaveMetadata[]>> {
    try {
      const savesDir = await this.getSavesDir();

      // Ensure directory exists
      await window.api.ensureDirExists(savesDir);

      const entries = await window.api.readDir(savesDir);

      if (!entries) {
        return { success: true, data: [] };
      }

      const saves: SaveMetadata[] = [];
      for (const entry of entries) {
        if (!entry.isDirectory && entry.name.endsWith(".json")) {
          const path = await window.api.joinPath(savesDir, entry.name);
          const content = await window.api.readFileContent(path);
          if (content?.trim()) {
            try {
              const save: GameSave = JSON.parse(content);
              saves.push(save.metadata);
            } catch {
              // Skip invalid save files
            }
          }
        }
      }

      return {
        success: true,
        data: saves.sort((a, b) => b.updatedAt - a.updatedAt),
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async getSaveExists(id: string): Promise<boolean> {
    const path = await this.getSavePath(id);
    return window.api.checkPathExists(path);
  }

  async exportSave(id: string): Promise<StorageResult<Blob>> {
    const result = await this.loadGame(id);
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }
    const blob = new Blob([JSON.stringify(result.data)], {
      type: "application/json",
    });
    return { success: true, data: blob };
  }

  async importSave(file: File | Blob): Promise<StorageResult<SaveMetadata>> {
    try {
      const text = await file.text();
      const save: GameSave = JSON.parse(text);
      await this.saveGame(save.metadata.id, save);
      return { success: true, data: save.metadata };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}

class ElectronSettingsStorage implements SettingsStorageProvider {
  private basePath: string;
  private settingsPathCache: string | null = null;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  private async getSettingsPath(): Promise<string> {
    if (!this.settingsPathCache) {
      this.settingsPathCache = await window.api.joinPath(
        this.basePath,
        SETTINGS_FILE,
      );
    }
    return this.settingsPathCache;
  }

  async loadSettings(): Promise<StorageResult<GameSettings>> {
    try {
      const path = await this.getSettingsPath();
      const content = await window.api.readFileContent(path);
      if (!content) {
        return { success: true, data: DEFAULT_SETTINGS };
      }
      const settings = { ...DEFAULT_SETTINGS, ...JSON.parse(content) };
      return { success: true, data: settings };
    } catch {
      return { success: true, data: DEFAULT_SETTINGS };
    }
  }

  async saveSettings(settings: GameSettings): Promise<StorageResult<void>> {
    try {
      const path = await this.getSettingsPath();
      await window.api.writeFileContent(
        path,
        JSON.stringify(settings, null, 2),
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async resetSettings(): Promise<StorageResult<GameSettings>> {
    await this.saveSettings(DEFAULT_SETTINGS);
    return { success: true, data: DEFAULT_SETTINGS };
  }

  async updateSetting<K extends keyof GameSettings>(
    category: K,
    values: Partial<GameSettings[K]>,
  ): Promise<StorageResult<void>> {
    const result = await this.loadSettings();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const updated = {
      ...result.data,
      [category]: { ...result.data[category], ...values },
    };

    return this.saveSettings(updated);
  }
}

/**
 * File system wrapper for configuration (dot-notation key-value pairs).
 * Saves both raw text and last valid JSON to preserve user edits.
 */
class ElectronConfigStorage implements ConfigStorageProvider {
  private basePath: string;
  private configPathCache: string | null = null;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  private async getConfigPath(): Promise<string> {
    if (!this.configPathCache) {
      this.configPathCache = await window.api.joinPath(
        this.basePath,
        CONFIG_FILE,
      );
    }
    return this.configPathCache;
  }

  async loadConfig(): Promise<StorageResult<ConfigLoadResult>> {
    try {
      const path = await this.getConfigPath();
      const content = await window.api.readFileContent(path);
      return { success: true, data: parseStoredConfig(content ?? null) };
    } catch {
      // File read error - return empty default
      return {
        success: true,
        data: { text: "{}", lastValidJson: {}, parseError: null },
      };
    }
  }

  async saveConfig(data: ConfigStorageData): Promise<StorageResult<void>> {
    try {
      const path = await this.getConfigPath();
      // Save wrapper object with both text and lastValidJson
      const content = JSON.stringify(data, null, 2);
      await window.api.writeFileContent(path, content);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async resetConfig(): Promise<StorageResult<void>> {
    return this.saveConfig({ text: "{}", lastValidJson: {} });
  }
}

export async function createElectronStorage(): Promise<StorageService> {
  // Get app data path from Electron
  const basePath = await window.api.getAppDataPath();

  // Ensure base directory exists
  await window.api.ensureDirExists(basePath);

  return {
    saves: new ElectronSaveStorage(basePath),
    settings: new ElectronSettingsStorage(basePath),
    config: new ElectronConfigStorage(basePath),
    platform: "electron",
    isElectron: true,
  };
}
