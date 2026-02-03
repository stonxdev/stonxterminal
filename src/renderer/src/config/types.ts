/**
 * Primitive configuration values supported by the config system.
 * Matches VS Code's settings model.
 */
export type ConfigValue = string | number | boolean | null;

/**
 * Configuration record with dot-notation keys.
 * Example: { "pixi.maxFramerate": 60, "ui.theme": "dark" }
 */
export type ConfigRecord = Record<string, ConfigValue>;

/**
 * Schema definition for a configuration property.
 * Used for validation and UI generation.
 */
export interface ConfigPropertySchema {
  type: "string" | "number" | "boolean";
  default: ConfigValue;
  description?: string;
  minimum?: number;
  maximum?: number;
  enum?: ConfigValue[];
}

/**
 * Schema for all configuration properties.
 */
export type ConfigSchema = Record<string, ConfigPropertySchema>;
