import { z } from "zod";

/**
 * Zod schemas for configuration validation.
 * These schemas are used for:
 * 1. Runtime validation when parsing user config
 * 2. Generating JSON Schema for Monaco Editor autocomplete
 */

// =============================================================================
// INDIVIDUAL PROPERTY SCHEMAS
// =============================================================================

/**
 * Maximum framerate for the Pixi.js renderer.
 */
export const PixiMaxFramerateSchema = z
  .number()
  .min(30)
  .max(144)
  .describe("Maximum framerate for the Pixi.js renderer (30-144)");

/**
 * Widget layout - maps slot IDs to arrays of widget IDs.
 */
export const WidgetLayoutSchema = z
  .object({
    "left-top": z.array(z.string()).optional(),
    "left-bottom": z.array(z.string()).optional(),
    center: z.array(z.string()).optional(),
    "center-bottom": z.array(z.string()).optional(),
    "right-top": z.array(z.string()).optional(),
    "right-bottom": z.array(z.string()).optional(),
  })
  .describe("Widget slot assignments");

/**
 * Status bar layout - maps alignment (left/right) to arrays of status bar IDs.
 */
export const StatusBarLayoutSchema = z
  .object({
    left: z.array(z.string()).optional(),
    right: z.array(z.string()).optional(),
  })
  .describe("Status bar alignment assignments");

/**
 * Control bar layout - maps position to arrays of control bar IDs.
 */
export const ControlBarLayoutSchema = z
  .object({
    "left-top": z.array(z.string()).optional(),
    "left-bottom": z.array(z.string()).optional(),
    "right-top": z.array(z.string()).optional(),
    "right-bottom": z.array(z.string()).optional(),
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
