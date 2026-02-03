import { create } from "zustand";
import { getStorageService } from "../services/storage";
import { DEFAULT_CONFIG } from "./defaults";
import type { ConfigRecord, ConfigValue } from "./types";

// =============================================================================
// TYPES
// =============================================================================

interface ConfigState {
  /** Built-in default configuration values (immutable at runtime) */
  defaults: ConfigRecord;
  /** User's custom configuration overrides (persisted) */
  overrides: ConfigRecord;
  /** Merged result: defaults + overrides */
  computed: ConfigRecord;
  /** Whether initial load has completed */
  isLoaded: boolean;
  /** Loading error if any */
  loadError: string | null;
}

interface ConfigActions {
  /** Get a configuration value by key */
  get: (key: string) => ConfigValue;
  /** Set a configuration value (adds to overrides) */
  set: (key: string, value: ConfigValue) => void;
  /** Remove an override (reverts to default) */
  remove: (key: string) => void;
  /** Replace all overrides at once */
  setOverrides: (overrides: ConfigRecord) => void;
  /** Reset all overrides to empty */
  resetOverrides: () => void;
  /** Load overrides from storage */
  load: () => Promise<void>;
  /** Save current overrides to storage */
  save: () => Promise<void>;
}

type ConfigStore = ConfigState & ConfigActions;

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Merge defaults with overrides to produce computed config.
 */
function computeConfig(
  defaults: ConfigRecord,
  overrides: ConfigRecord,
): ConfigRecord {
  return { ...defaults, ...overrides };
}

// =============================================================================
// STORE
// =============================================================================

export const useConfigStore = create<ConfigStore>((set, get) => ({
  defaults: DEFAULT_CONFIG,
  overrides: {},
  computed: DEFAULT_CONFIG,
  isLoaded: false,
  loadError: null,

  get: (key: string) => {
    const { computed, defaults } = get();
    return computed[key] ?? defaults[key] ?? null;
  },

  set: (key: string, value: ConfigValue) => {
    set((state) => {
      const newOverrides = { ...state.overrides, [key]: value };
      return {
        overrides: newOverrides,
        computed: computeConfig(state.defaults, newOverrides),
      };
    });
    // Auto-save after changes
    get().save();
  },

  remove: (key: string) => {
    set((state) => {
      const newOverrides = { ...state.overrides };
      delete newOverrides[key];
      return {
        overrides: newOverrides,
        computed: computeConfig(state.defaults, newOverrides),
      };
    });
    get().save();
  },

  setOverrides: (overrides: ConfigRecord) => {
    set((state) => ({
      overrides,
      computed: computeConfig(state.defaults, overrides),
    }));
  },

  resetOverrides: () => {
    set((state) => ({
      overrides: {},
      computed: { ...state.defaults },
    }));
    get().save();
  },

  load: async () => {
    try {
      const storage = await getStorageService();
      const result = await storage.config.loadConfig();

      if (result.success && result.data) {
        const loadedOverrides = result.data;
        set((state) => ({
          overrides: loadedOverrides,
          computed: computeConfig(state.defaults, loadedOverrides),
          isLoaded: true,
          loadError: null,
        }));
      } else {
        set({ isLoaded: true, loadError: result.error ?? null });
      }
    } catch (error) {
      set({ isLoaded: true, loadError: String(error) });
    }
  },

  save: async () => {
    try {
      const storage = await getStorageService();
      const { overrides } = get();
      await storage.config.saveConfig(overrides);
    } catch (error) {
      console.error("Failed to save config:", error);
    }
  },
}));

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the config store by loading from storage.
 * Call this during app startup.
 */
export async function initializeConfig(): Promise<void> {
  await useConfigStore.getState().load();
}
