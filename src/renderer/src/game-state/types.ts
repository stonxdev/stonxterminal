// =============================================================================
// GAME STATE TYPES
// =============================================================================

import type {
  BiomeType,
  Position2D,
  StructureType,
  Tile,
  World,
} from "../world/types";

// =============================================================================
// SELECTION TYPES
// =============================================================================

/**
 * Types of entities that can be selected
 * EXTENSION POINT: Add new entity types here
 */
export type SelectableEntityType = "colonist" | "item" | "structure" | "zone";

/**
 * No selection state
 */
export interface NoSelection {
  type: "none";
}

/**
 * A tile is selected
 */
export interface TileSelection {
  type: "tile";
  position: Position2D;
  zLevel: number;
}

/**
 * An entity is selected
 */
export interface EntitySelection {
  type: "entity";
  entityType: SelectableEntityType;
  entityId: string;
  position?: Position2D;
}

/**
 * Union of all selection states
 * EXTENSION POINT: Add new selection types here
 */
export type Selection = NoSelection | TileSelection | EntitySelection;

// =============================================================================
// INTERACTION TYPES
// =============================================================================

/**
 * Available interaction modes
 * EXTENSION POINT: Add new modes like 'mine', 'build', 'zone'
 */
export type InteractionMode = "select" | "build" | "designate" | "zone";

// =============================================================================
// WORLD GENERATION CONFIG
// =============================================================================

/**
 * Configuration for world generation
 */
export interface WorldGenerationConfig {
  name: string;
  width: number;
  height: number;
  seed: number;
  biome: BiomeType;
}

// =============================================================================
// GAME STATE SHAPE
// =============================================================================

/**
 * The complete game state
 */
export interface GameState {
  // World state
  world: World | null;
  currentZLevel: number;
  worldConfig: WorldGenerationConfig | null;

  // Selection state
  selection: Selection;

  // Interaction state
  interactionMode: InteractionMode;
  hoverPosition: Position2D | null;

  // UI state
  isInitialized: boolean;
}

/**
 * Actions that modify game state
 */
export interface GameStateActions {
  // World actions
  setWorld: (world: World, config?: WorldGenerationConfig) => void;
  setCurrentZLevel: (zLevel: number) => void;
  updateTile: (
    position: Position2D,
    zLevel: number,
    changes: Partial<Tile>,
  ) => void;

  // Selection actions
  selectTile: (position: Position2D, zLevel: number) => void;
  selectEntity: (
    entityType: SelectableEntityType,
    entityId: string,
    position?: Position2D,
  ) => void;
  clearSelection: () => void;

  // Interaction actions
  setInteractionMode: (mode: InteractionMode) => void;
  setHoverPosition: (position: Position2D | null) => void;

  // Initialization
  initialize: () => void;
  reset: () => void;
}

/**
 * Combined state and actions
 */
export type GameStore = GameState & GameStateActions;

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Get tile at selection position if selection is a tile
 */
export interface SelectedTileInfo {
  position: Position2D;
  zLevel: number;
  tile: Tile;
}

/**
 * Get structure info if a structure is at the selected tile
 */
export interface SelectedStructureInfo {
  structureType: StructureType;
  position: Position2D;
  zLevel: number;
}
