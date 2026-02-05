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
export const ConfigOverridesSchema = z
  .object({
    "pixi.maxFramerate": PixiMaxFramerateSchema.optional(),
    "layout.widgets": WidgetLayoutSchema.optional(),
    "layout.statusBars": StatusBarLayoutSchema.optional(),
    "layout.controlBars": ControlBarLayoutSchema.optional(),
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
 * JSON Schema generated from the Zod schema.
 * Used by Monaco Editor for autocomplete and validation.
 */
export function getConfigJsonSchema(): object {
  return zodToJsonSchema(ConfigOverridesSchema, {
    name: "ConfigOverrides",
    $refStrategy: "none", // Inline all refs for Monaco compatibility
  });
}
