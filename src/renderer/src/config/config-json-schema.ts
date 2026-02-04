import { zodToJsonSchema } from "zod-to-json-schema";
import { ConfigOverridesSchema } from "./config-schema";

/**
 * JSON Schema generated from the Zod schema.
 * This is used by Monaco Editor for autocomplete and validation.
 */
export const configJsonSchema = zodToJsonSchema(ConfigOverridesSchema, {
  name: "ConfigOverrides",
  $refStrategy: "none", // Inline all refs for Monaco compatibility
});

/**
 * Get the JSON Schema for config overrides.
 * Provided as a function for lazy loading if needed.
 */
export function getConfigJsonSchema(): object {
  return configJsonSchema;
}
