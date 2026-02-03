// Types

// Store
export { initializeConfig, useConfigStore } from "./config-store";

// Defaults
export { CONFIG_SCHEMA, DEFAULT_CONFIG, getDefaultConfig } from "./defaults";
export type {
  ConfigPropertySchema,
  ConfigRecord,
  ConfigSchema,
  ConfigValue,
} from "./types";

// Hooks
export { useConfigOverrides, useConfigValue, useSetConfig } from "./use-config";
