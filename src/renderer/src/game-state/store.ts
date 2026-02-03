// =============================================================================
// GAME STATE ZUSTAND STORE
// =============================================================================

import { create } from "zustand";
import { actionRegistry } from "../actions";
import {
  entityStore,
  findPath,
  MovementSystem,
  simulationLoop,
} from "../simulation";
import type {
  Character,
  Command,
  EntityId,
  MoveCommand,
  SimulationSpeed,
} from "../simulation/types";
import type { Position2D, Position3D, Tile, World } from "../world/types";
import { getTileAt, setTileAt } from "../world/utils/tile-utils";
import type {
  GameStore,
  InteractionMode,
  MultiEntitySelection,
  SelectableEntityType,
  Selection,
  SimulationStateSlice,
  WorldGenerationConfig,
} from "./types";

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialSimulationState: SimulationStateSlice = {
  isPlaying: false,
  speed: 1,
  currentTick: 0,
  characters: new Map(),
};

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

  // Simulation
  simulation: initialSimulationState,

  // UI
  isInitialized: false,
};

// =============================================================================
// MOVEMENT SYSTEM SETUP
// =============================================================================

const movementSystem = new MovementSystem(entityStore);

// =============================================================================
// STORE CREATION
// =============================================================================

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // ===========================================================================
  // WORLD ACTIONS
  // ===========================================================================

  setWorld: (world: World, config?: WorldGenerationConfig) => {
    // Clear existing entities when setting a new world
    entityStore.clear();

    set({
      world,
      worldConfig: config ?? null,
      currentZLevel: world.surfaceZ,
      isInitialized: true,
      simulation: {
        ...get().simulation,
        characters: new Map(),
      },
    });

    // Auto-start the simulation when the world is loaded
    get().play();
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

      // Dispatch action
      actionRegistry.dispatch("world.zLevelChanged", {
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

    // Dispatch action
    actionRegistry.dispatch("world.tileUpdated", {
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

    // Dispatch action
    actionRegistry.dispatch("selection.tile", {
      position,
      zLevel,
      tile,
    });
  },

  selectEntity: (entityType, entityId, position) => {
    set({
      selection: { type: "entity", entityType, entityId, position },
    });

    // Dispatch action
    actionRegistry.dispatch("selection.entity", {
      entityType,
      entityId,
      position,
    });
  },

  clearSelection: () => {
    const { selection } = get();
    if (selection.type === "none") return;

    set({ selection: { type: "none" } });

    // Dispatch action
    actionRegistry.dispatch("selection.cleared");
  },

  // ===========================================================================
  // MULTI-SELECTION ACTIONS
  // ===========================================================================

  addToSelection: (entityType: SelectableEntityType, entityId: string) => {
    const { selection } = get();

    if (
      selection.type === "multi-entity" &&
      selection.entityType === entityType
    ) {
      // Add to existing multi-selection
      const newIds = new Set(selection.entityIds);
      newIds.add(entityId);
      set({
        selection: { type: "multi-entity", entityType, entityIds: newIds },
      });
    } else if (
      selection.type === "entity" &&
      selection.entityType === entityType
    ) {
      // Convert single to multi
      const newIds = new Set([selection.entityId, entityId]);
      set({
        selection: { type: "multi-entity", entityType, entityIds: newIds },
      });
    } else {
      // Start new multi-selection (clears any other selection type)
      set({
        selection: {
          type: "multi-entity",
          entityType,
          entityIds: new Set([entityId]),
        },
      });
    }

    actionRegistry.dispatch("selection.changed");
  },

  removeFromSelection: (entityId: string) => {
    const { selection } = get();

    if (selection.type === "multi-entity") {
      const newIds = new Set(selection.entityIds);
      newIds.delete(entityId);

      if (newIds.size === 0) {
        set({ selection: { type: "none" } });
      } else if (newIds.size === 1) {
        // Convert back to single selection
        const [remainingId] = newIds;
        set({
          selection: {
            type: "entity",
            entityType: selection.entityType,
            entityId: remainingId,
          },
        });
      } else {
        set({
          selection: {
            ...selection,
            entityIds: newIds,
          } as MultiEntitySelection,
        });
      }

      actionRegistry.dispatch("selection.changed");
    } else if (selection.type === "entity" && selection.entityId === entityId) {
      set({ selection: { type: "none" } });
      actionRegistry.dispatch("selection.changed");
    }
  },

  toggleSelection: (entityType: SelectableEntityType, entityId: string) => {
    const { selection, addToSelection, removeFromSelection } = get();

    // Check if already selected
    const isCurrentlySelected =
      (selection.type === "entity" && selection.entityId === entityId) ||
      (selection.type === "multi-entity" && selection.entityIds.has(entityId));

    if (isCurrentlySelected) {
      removeFromSelection(entityId);
    } else {
      addToSelection(entityType, entityId);
    }
  },

  selectMultiple: (entityType: SelectableEntityType, entityIds: string[]) => {
    if (entityIds.length === 0) {
      set({ selection: { type: "none" } });
    } else if (entityIds.length === 1) {
      set({
        selection: { type: "entity", entityType, entityId: entityIds[0] },
      });
    } else {
      set({
        selection: {
          type: "multi-entity",
          entityType,
          entityIds: new Set(entityIds),
        },
      });
    }
    actionRegistry.dispatch("selection.changed");
  },

  isSelected: (entityId: string) => {
    const { selection } = get();
    if (selection.type === "entity") {
      return selection.entityId === entityId;
    }
    if (selection.type === "multi-entity") {
      return selection.entityIds.has(entityId);
    }
    return false;
  },

  getSelectedIds: () => {
    const { selection } = get();
    if (selection.type === "entity") {
      return [selection.entityId];
    }
    if (selection.type === "multi-entity") {
      return Array.from(selection.entityIds);
    }
    return [];
  },

  // ===========================================================================
  // INTERACTION ACTIONS
  // ===========================================================================

  setInteractionMode: (mode: InteractionMode) => {
    const { interactionMode: previousMode } = get();
    if (mode === previousMode) return;

    set({ interactionMode: mode });

    // Dispatch action
    actionRegistry.dispatch("interaction.modeChanged", {
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

    // Dispatch action
    actionRegistry.dispatch("interaction.hoverChanged", {
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
    entityStore.clear();
    simulationLoop.stop();
    simulationLoop.reset();
    set({
      ...initialState,
      simulation: {
        ...initialSimulationState,
        characters: new Map(),
      },
    });
  },

  // ===========================================================================
  // SIMULATION ACTIONS
  // ===========================================================================

  play: () => {
    console.info("[store.play] Starting simulation loop");
    simulationLoop.start();
    set((state) => ({
      simulation: { ...state.simulation, isPlaying: true },
    }));
  },

  pause: () => {
    console.info("[store.pause] Stopping simulation loop");
    simulationLoop.stop();
    set((state) => ({
      simulation: { ...state.simulation, isPlaying: false },
    }));
  },

  togglePlayPause: () => {
    const { simulation } = get();
    if (simulation.isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  setSpeed: (speed: SimulationSpeed) => {
    simulationLoop.setSpeed(speed);
    set((state) => ({
      simulation: { ...state.simulation, speed },
    }));
  },

  // ===========================================================================
  // CHARACTER MANAGEMENT
  // ===========================================================================

  addCharacter: (character: Character) => {
    entityStore.add(character);
    set((state) => {
      const newCharacters = new Map(state.simulation.characters);
      newCharacters.set(character.id, character);
      return {
        simulation: { ...state.simulation, characters: newCharacters },
      };
    });
  },

  removeCharacter: (id: EntityId) => {
    entityStore.remove(id);
    set((state) => {
      const newCharacters = new Map(state.simulation.characters);
      newCharacters.delete(id);
      return {
        simulation: { ...state.simulation, characters: newCharacters },
      };
    });
  },

  updateCharacter: (id: EntityId, changes: Partial<Character>) => {
    entityStore.update(id, changes);
    const updated = entityStore.get(id);
    if (updated) {
      set((state) => {
        const newCharacters = new Map(state.simulation.characters);
        newCharacters.set(id, updated);
        return {
          simulation: { ...state.simulation, characters: newCharacters },
        };
      });
    }
  },

  getCharacter: (id: EntityId) => {
    return entityStore.get(id);
  },

  getCharactersAtTile: (position: Position3D) => {
    return entityStore.getAtTile(position);
  },

  // ===========================================================================
  // COMMAND MANAGEMENT
  // ===========================================================================

  issueCommand: (characterId: EntityId, command: Command) => {
    console.info("[store.issueCommand] Called with:", { characterId, command });

    const character = entityStore.get(characterId);
    if (!character) {
      console.warn("[store.issueCommand] Character not found in entityStore");
      return;
    }

    const { world, currentZLevel } = get();
    if (!world) {
      console.warn("[store.issueCommand] World not initialized");
      return;
    }

    const level = world.levels.get(currentZLevel);
    if (!level) {
      console.warn(
        "[store.issueCommand] Level not found for z:",
        currentZLevel,
      );
      return;
    }

    if (command.type === "move") {
      const moveCmd = command as MoveCommand;

      // Compute path if not already provided
      if (!moveCmd.path) {
        const start: Position3D = { ...character.position };
        const goal: Position3D = { ...moveCmd.destination, z: currentZLevel };
        console.info(
          "[store.issueCommand] Finding path from",
          start,
          "to",
          goal,
        );
        const result = findPath(level, start, goal);

        if (!result.found) {
          console.warn("[store.issueCommand] No path found to destination");
          return;
        }

        console.info(
          "[store.issueCommand] Path found with",
          result.path.length,
          "waypoints",
        );
        moveCmd.path = result.path;
      }

      // Issue move via movement system
      console.info("[store.issueCommand] Issuing move to movement system");
      movementSystem.issueMove(characterId, moveCmd);

      // Update state
      const updated = entityStore.get(characterId);
      if (updated) {
        console.info(
          "[store.issueCommand] Updating store state, isMoving:",
          updated.movement.isMoving,
        );
        set((state) => {
          const newCharacters = new Map(state.simulation.characters);
          newCharacters.set(characterId, updated);
          return {
            simulation: { ...state.simulation, characters: newCharacters },
          };
        });
      }
    }
  },

  cancelCommand: (characterId: EntityId) => {
    movementSystem.cancelMove(characterId);
    const updated = entityStore.get(characterId);
    if (updated) {
      set((state) => {
        const newCharacters = new Map(state.simulation.characters);
        newCharacters.set(characterId, updated);
        return {
          simulation: { ...state.simulation, characters: newCharacters },
        };
      });
    }
  },
}));

// =============================================================================
// SIMULATION LOOP SETUP
// =============================================================================

// Set up tick callback to update movement
simulationLoop.setTickCallback((deltaTime, tick) => {
  // Update movement system
  movementSystem.update(deltaTime);

  // Sync entity store to game state
  const characters = new Map<EntityId, Character>();
  for (const [id, character] of entityStore) {
    characters.set(id, character);
  }

  useGameStore.setState((state) => ({
    simulation: {
      ...state.simulation,
      currentTick: tick,
      characters,
    },
  }));
});
