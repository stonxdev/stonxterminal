// =============================================================================
// SCHEMAS PUBLIC EXPORTS
// =============================================================================

// Core schema system
export * from "./core";

// Tile inspector schema
export {
  pathfindingDataSchema,
  structureDataSchema,
  structureTypeOptions,
  type TileInspectorData,
  terrainDataSchema,
  terrainTypeOptions,
  tileInspectorSchema,
} from "./definitions/tile-schema";
