import { defaultGameColors } from "@renderer/theming/default-game-colors";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CONTROL_BAR_IDS, STATUS_BAR_IDS, WIDGET_IDS } from "./registry-ids";

/**
 * Zod schemas for configuration validation.
 * These schemas are used for:
 * 1. Runtime validation when parsing user config
 * 2. Generating JSON Schema for Monaco Editor autocomplete
 */

// =============================================================================
// ID SCHEMAS (derived from registry-ids.ts)
// =============================================================================

const WidgetIdSchema = z.enum(WIDGET_IDS);
const StatusBarIdSchema = z.enum(STATUS_BAR_IDS);
const ControlBarIdSchema = z.enum(CONTROL_BAR_IDS);

// =============================================================================
// INDIVIDUAL PROPERTY SCHEMAS (internal use only)
// =============================================================================

const PixiMaxFramerateSchema = z
  .number()
  .min(30)
  .max(144)
  .describe("Maximum framerate for the Pixi.js renderer (30-144)");

const WidgetLayoutSchema = z
  .object({
    "left-top": z.array(WidgetIdSchema).optional(),
    "left-bottom": z.array(WidgetIdSchema).optional(),
    center: z.array(WidgetIdSchema).optional(),
    "center-bottom": z.array(WidgetIdSchema).optional(),
    "right-top": z.array(WidgetIdSchema).optional(),
    "right-bottom": z.array(WidgetIdSchema).optional(),
  })
  .describe("Widget slot assignments");

const StatusBarLayoutSchema = z
  .object({
    left: z.array(StatusBarIdSchema).optional(),
    right: z.array(StatusBarIdSchema).optional(),
  })
  .describe("Status bar alignment assignments");

const ControlBarLayoutSchema = z
  .object({
    "left-top": z.array(ControlBarIdSchema).optional(),
    "left-bottom": z.array(ControlBarIdSchema).optional(),
    "right-top": z.array(ControlBarIdSchema).optional(),
    "right-bottom": z.array(ControlBarIdSchema).optional(),
  })
  .describe("Control bar slot assignments");

// =============================================================================
// COMBINED CONFIG SCHEMA
// =============================================================================

/**
 * Complete config overrides schema.
 * This defines all valid configuration keys and their types.
 * Using .strict() to disallow unknown keys.
 */
const GameColorOverridesSchema = z
  .record(z.string(), z.string())
  .describe(
    'Game color overrides as dot-path keys to hex values (e.g. { "world.background": "#0a0a1e" })',
  );

export const ConfigOverridesSchema = z
  .object({
    "pixi.maxFramerate": PixiMaxFramerateSchema.optional(),
    "layout.widgets": WidgetLayoutSchema.optional(),
    "layout.statusBars": StatusBarLayoutSchema.optional(),
    "layout.controlBars": ControlBarLayoutSchema.optional(),
    "theme.gameColors": GameColorOverridesSchema.optional(),
  })
  .strict();

// =============================================================================
// INFERRED TYPES
// =============================================================================

/**
 * TypeScript type for config overrides, inferred from the Zod schema.
 */
export type ConfigOverrides = z.infer<typeof ConfigOverridesSchema>;

// =============================================================================
// JSON SCHEMA (for Monaco Editor)
// =============================================================================

/**
 * Flatten a nested object into dot-path keys, collecting only string leaf values.
 * E.g. { world: { background: "#1a1a2e" } } → [["world.background", "#1a1a2e"]]
 */
function flattenColorPaths(
  obj: Record<string, unknown>,
  prefix = "",
): [string, string][] {
  const result: [string, string][] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result.push([path, value]);
    } else if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      result.push(...flattenColorPaths(value as Record<string, unknown>, path));
    }
  }
  return result;
}

/**
 * JSON Schema generated from the Zod schema.
 * Used by Monaco Editor for autocomplete and validation.
 * Post-processes the schema to inject known game color paths for autocomplete.
 */
export function getConfigJsonSchema(): object {
  const schema = zodToJsonSchema(ConfigOverridesSchema, {
    name: "ConfigOverrides",
    $refStrategy: "none", // Inline all refs for Monaco compatibility
  }) as Record<string, unknown>;

  // Inject specific color path properties into theme.gameColors for autocomplete.
  // zodToJsonSchema wraps the schema under definitions.ConfigOverrides when `name` is given.
  const definitions = schema.definitions as
    | Record<string, Record<string, unknown>>
    | undefined;
  const rootSchema = definitions?.ConfigOverrides ?? schema;
  const properties = (rootSchema as { properties?: Record<string, unknown> })
    .properties;
  const gameColorsSchema = properties?.["theme.gameColors"] as
    | Record<string, unknown>
    | undefined;
  if (gameColorsSchema) {
    const colorPaths = flattenColorPaths(
      defaultGameColors as unknown as Record<string, unknown>,
    );
    const properties: Record<string, object> = {};
    for (const [path, defaultValue] of colorPaths) {
      properties[path] = {
        type: "string",
        pattern: "^#[0-9a-fA-F]{6}$",
        default: defaultValue,
        description: `Color override (default: ${defaultValue})`,
      };
    }
    gameColorsSchema.properties = properties;
    // Keep additionalProperties so unknown paths still validate as strings
  }

  return schema;
}
