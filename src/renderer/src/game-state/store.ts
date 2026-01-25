// =============================================================================
// GAME STATE ZUSTAND STORE
// =============================================================================

import { create } from "zustand";
import { eventBus } from "../events";
import type { Position2D, Tile, World } from "../world/types";
import { getTileAt, setTileAt } from "../world/utils/tile-utils";
import type {
  GameStore,
  InteractionMode,
  Selection,
  WorldGenerationConfig,
} from "./types";

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  // World
  world: null,
  currentZLevel: 0,
  worldConfig: null,

  // Selection
  selection: { type: "none" } as Selection,

  // Interaction
  interactionMode: "select" as InteractionMode,
  hoverPosition: null,

  // UI
  isInitialized: false,
};

// =============================================================================
// STORE CREATION
// =============================================================================

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // ===========================================================================
  // WORLD ACTIONS
  // ===========================================================================

  setWorld: (world: World, config?: WorldGenerationConfig) => {
    set({
      world,
      worldConfig: config ?? null,
      currentZLevel: world.surfaceZ,
      isInitialized: true,
    });
  },

  setCurrentZLevel: (zLevel: number) => {
    const { world, currentZLevel: previousZ } = get();
    if (!world) return;

    // Clamp to valid range
    const clampedZ = Math.max(
      world.dimensions.minZ,
      Math.min(world.dimensions.maxZ, zLevel),
    );

    if (clampedZ !== previousZ) {
      set({ currentZLevel: clampedZ });

      // Emit event
      eventBus.emit({
        type: "world:z-level-changed",
        previousZ,
        currentZ: clampedZ,
      });
    }
  },

  updateTile: (
    position: Position2D,
    zLevel: number,
    changes: Partial<Tile>,
  ) => {
    const { world } = get();
    if (!world) return;

    const level = world.levels.get(zLevel);
    if (!level) return;

    const currentTile = getTileAt(level, position.x, position.y);
    if (!currentTile) return;

    // Merge changes into tile
    const updatedTile: Tile = {
      ...currentTile,
      ...changes,
      terrain: changes.terrain
        ? { ...currentTile.terrain, ...changes.terrain }
        : currentTile.terrain,
      floor: changes.floor !== undefined ? changes.floor : currentTile.floor,
      structure:
        changes.structure !== undefined
          ? changes.structure
          : currentTile.structure,
      pathfinding: changes.pathfinding
        ? { ...currentTile.pathfinding, ...changes.pathfinding }
        : currentTile.pathfinding,
      visibility: changes.visibility
        ? { ...currentTile.visibility, ...changes.visibility }
        : currentTile.visibility,
    };

    // Update tile in level
    setTileAt(level, position.x, position.y, updatedTile);

    // Emit event
    eventBus.emit({
      type: "world:tile-updated",
      position,
      zLevel,
      changes,
      tile: updatedTile,
    });
  },

  // ===========================================================================
  // SELECTION ACTIONS
  // ===========================================================================

  selectTile: (position: Position2D, zLevel: number) => {
    const { world } = get();
    if (!world) return;

    const level = world.levels.get(zLevel);
    if (!level) return;

    const tile = getTileAt(level, position.x, position.y);
    if (!tile) return;

    set({
      selection: { type: "tile", position, zLevel },
    });

    // Emit event
    eventBus.emit({
      type: "selection:tile",
      position,
      zLevel,
      tile,
    });
  },

  selectEntity: (entityType, entityId, position) => {
    set({
      selection: { type: "entity", entityType, entityId, position },
    });

    // Emit event
    eventBus.emit({
      type: "selection:entity",
      entityType,
      entityId,
      position,
    });
  },

  clearSelection: () => {
    const { selection } = get();
    if (selection.type === "none") return;

    set({ selection: { type: "none" } });

    // Emit event
    eventBus.emit({ type: "selection:cleared" });
  },

  // ===========================================================================
  // INTERACTION ACTIONS
  // ===========================================================================

  setInteractionMode: (mode: InteractionMode) => {
    const { interactionMode: previousMode } = get();
    if (mode === previousMode) return;

    set({ interactionMode: mode });

    // Emit event
    eventBus.emit({
      type: "interaction:mode-changed",
      previousMode,
      currentMode: mode,
    });
  },

  setHoverPosition: (position: Position2D | null) => {
    const { hoverPosition: currentHover, currentZLevel } = get();

    // Avoid unnecessary updates
    if (position?.x === currentHover?.x && position?.y === currentHover?.y) {
      return;
    }

    set({ hoverPosition: position });

    // Emit event
    eventBus.emit({
      type: "interaction:hover-changed",
      position,
      zLevel: currentZLevel,
    });
  },

  // ===========================================================================
  // INITIALIZATION ACTIONS
  // ===========================================================================

  initialize: () => {
    set({ isInitialized: true });
  },

  reset: () => {
    set(initialState);
  },
}));
