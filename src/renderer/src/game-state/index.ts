// =============================================================================
// PUBLIC GAME STATE EXPORTS
// =============================================================================

// Interaction hooks
export {
  useHoverPosition,
  useInteractionActions,
  useInteractionMode,
  useIsInteractionMode,
} from "./hooks/useInteraction";

// Selection hooks
export {
  useHasSelection,
  useSelectedEntity,
  useSelectedTile,
  useSelectedTileData,
  useSelection,
  useSelectionActions,
  useSelectionType,
} from "./hooks/useSelection";

// World hooks
export {
  useCurrentLevel,
  useCurrentZLevel,
  useIsWorldInitialized,
  useLevel,
  useTileAt,
  useWorld,
  useWorldActions,
  useWorldConfig,
  useWorldDimensions,
  useWorldMetadata,
} from "./hooks/useWorld";
// Store
export { useGameStore } from "./store";

// Types
export type {
  EntitySelection,
  GameState,
  GameStateActions,
  GameStore,
  InteractionMode,
  NoSelection,
  SelectableEntityType,
  SelectedStructureInfo,
  SelectedTileInfo,
  Selection,
  TileSelection,
  WorldGenerationConfig,
} from "./types";
