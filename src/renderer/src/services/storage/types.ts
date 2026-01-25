/**
 * Metadata for a saved game
 */
export interface SaveMetadata {
  id: string;
  name: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  version: string; // Game version for migration
  playtime: number; // Seconds
  thumbnail?: string; // Base64 image (optional)
}

/**
 * A complete save file
 */
export interface GameSave<T = unknown> {
  metadata: SaveMetadata;
  data: T; // The actual game state
}

/**
 * Settings data structure
 */
export interface GameSettings {
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    muted: boolean;
  };
  graphics: {
    resolution: "auto" | "720p" | "1080p" | "1440p";
    pixelRatio: number;
    showFPS: boolean;
    particleQuality: "low" | "medium" | "high";
  };
  gameplay: {
    autoSaveInterval: number; // minutes, 0 = disabled
    gameSpeed: number;
    tutorialsEnabled: boolean;
  };
  ui: {
    language: string;
    theme: "light" | "dark" | "system";
    hudScale: number;
  };
}

/**
 * Result of storage operations
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Save storage provider interface
 */
export interface SaveStorageProvider {
  // Save operations
  saveGame<T>(id: string, data: GameSave<T>): Promise<StorageResult<void>>;
  loadGame<T>(id: string): Promise<StorageResult<GameSave<T>>>;
  deleteGame(id: string): Promise<StorageResult<void>>;

  // List/query operations
  listSaves(): Promise<StorageResult<SaveMetadata[]>>;
  getSaveExists(id: string): Promise<boolean>;

  // Import/Export for sharing saves
  exportSave(id: string): Promise<StorageResult<Blob>>;
  importSave(file: File | Blob): Promise<StorageResult<SaveMetadata>>;
}

/**
 * Settings storage provider interface
 */
export interface SettingsStorageProvider {
  loadSettings(): Promise<StorageResult<GameSettings>>;
  saveSettings(settings: GameSettings): Promise<StorageResult<void>>;
  resetSettings(): Promise<StorageResult<GameSettings>>;

  // Granular updates
  updateSetting<K extends keyof GameSettings>(
    category: K,
    values: Partial<GameSettings[K]>,
  ): Promise<StorageResult<void>>;
}

/**
 * Combined storage service
 */
export interface StorageService {
  saves: SaveStorageProvider;
  settings: SettingsStorageProvider;

  // Platform info
  readonly platform: "electron" | "web";
  readonly isElectron: boolean;
}
