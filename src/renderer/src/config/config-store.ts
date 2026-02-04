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
  /** User's custom configuration overrides (persisted, only valid JSON) */
  overrides: ConfigRecord;
  /** Merged result: defaults + overrides */
  computed: ConfigRecord;
  /** Raw text from editor (may be invalid JSON) */
  overridesText: string;
  /** Parse error if overridesText is invalid JSON */
  parseError: string | null;
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
  /** Update overrides text - parses and updates overrides if valid */
  setOverridesText: (text: string) => void;
  /** Reset all overrides to empty */
  resetOverrides: () => void;
  /** Load overrides from storage */
  load: () => Promise<void>;
  /** Save current overrides text to storage */
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
  overridesText: "{}",
  parseError: null,
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
        overridesText: JSON.stringify(newOverrides, null, 2),
        computed: computeConfig(state.defaults, newOverrides),
        parseError: null,
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
        overridesText: JSON.stringify(newOverrides, null, 2),
        computed: computeConfig(state.defaults, newOverrides),
        parseError: null,
      };
    });
    get().save();
  },

  setOverrides: (overrides: ConfigRecord) => {
    set((state) => ({
      overrides,
      overridesText: JSON.stringify(overrides, null, 2),
      computed: computeConfig(state.defaults, overrides),
      parseError: null,
    }));
  },

  setOverridesText: (text: string) => {
    try {
      const parsed = JSON.parse(text);
      set((state) => ({
        overridesText: text,
        overrides: parsed,
        computed: computeConfig(state.defaults, parsed),
        parseError: null,
      }));
    } catch (e) {
      // Invalid JSON - keep text but don't update overrides
      set({ overridesText: text, parseError: String(e) });
    }
  },

  resetOverrides: () => {
    set((state) => ({
      overrides: {},
      overridesText: "{}",
      computed: { ...state.defaults },
      parseError: null,
    }));
    get().save();
  },

  load: async () => {
    try {
      const storage = await getStorageService();
      const result = await storage.config.loadConfig();

      if (result.success && result.data) {
        const { text, lastValidJson, isTextValid } = result.data;
        set((state) => ({
          overridesText: text,
          overrides: lastValidJson,
          computed: computeConfig(state.defaults, lastValidJson),
          parseError: isTextValid ? null : "Invalid JSON",
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
      const { overridesText, overrides } = get();
      // Save both raw text and last valid JSON
      await storage.config.saveConfig({
        text: overridesText,
        lastValidJson: overrides,
      });
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
