import type { ConfigRecord, ConfigSchema } from "./types";

/**
 * Configuration schema with type information and defaults.
 * This serves as the source of truth for all configuration properties.
 */
export const CONFIG_SCHEMA: ConfigSchema = {
  "pixi.maxFramerate": {
    type: "number",
    default: 60,
    description: "Maximum framerate for the Pixi.js renderer",
    minimum: 30,
    maximum: 144,
  },
};

/**
 * Extract default values from schema.
 * Returns a ConfigRecord with all default values.
 */
export function getDefaultConfig(): ConfigRecord {
  const defaults: ConfigRecord = {};
  for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
    defaults[key] = schema.default;
  }
  return defaults;
}

/**
 * The default configuration values.
 */
export const DEFAULT_CONFIG = getDefaultConfig();
