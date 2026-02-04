// Types

export { configJsonSchema, getConfigJsonSchema } from "./config-json-schema";
export type { ConfigOverrides } from "./config-schema";

// Zod Schemas
export {
  ConfigOverridesSchema,
  ControlBarLayoutSchema,
  PixiMaxFramerateSchema,
  StatusBarLayoutSchema,
  WidgetLayoutSchema,
} from "./config-schema";
// Store
export { initializeConfig, useConfigStore } from "./config-store";
// Defaults
export { CONFIG_SCHEMA, DEFAULT_CONFIG, getDefaultConfig } from "./defaults";
export type {
  ControlBarLayoutConfigValue,
  StatusBarLayoutConfigValue,
  WidgetLayoutConfigValue,
} from "./layout-types";
export type {
  ConfigPropertySchema,
  ConfigRecord,
  ConfigSchema,
  ConfigValue,
} from "./types";

// Hooks
export { useConfigOverrides, useConfigValue, useSetConfig } from "./use-config";
export {
  useControlBarLayoutConfig,
  useStatusBarLayoutConfig,
  useWidgetLayoutConfig,
} from "./use-layout-config";
