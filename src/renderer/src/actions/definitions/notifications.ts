// =============================================================================
// NOTIFICATION ACTIONS (converted from events)
//
// These are "pure notification" actions - they have no execute function and
// are only dispatched to notify subscribers about state changes.
// =============================================================================

import type { Position2D, Tile } from "../../world/types";
import { defineAction } from "../defineAction";

// =============================================================================
// SELECTION NOTIFICATIONS
// =============================================================================

export type EntityType = "colonist" | "item" | "structure" | "zone";

export interface SelectionTilePayload {
  position: Position2D;
  zLevel: number;
  tile: Tile;
}

export const selectionTile = defineAction<SelectionTilePayload>({
  id: "selection.tile",
  name: "Tile Selected",
  description: "Fired when a tile is selected",
});

export interface SelectionEntityPayload {
  entityType: EntityType;
  entityId: string;
  position?: Position2D;
}

export const selectionEntity = defineAction<SelectionEntityPayload>({
  id: "selection.entity",
  name: "Entity Selected",
  description: "Fired when an entity (colonist, item, structure) is selected",
});

export const selectionCleared = defineAction({
  id: "selection.cleared",
  name: "Selection Cleared",
  description: "Fired when selection is cleared",
});

export const selectionChanged = defineAction({
  id: "selection.changed",
  name: "Selection Changed",
  description:
    "Fired when selection changes (add/remove/toggle in multi-selection)",
});

// =============================================================================
// WORLD NOTIFICATIONS
// =============================================================================

export interface WorldTileUpdatedPayload {
  position: Position2D;
  zLevel: number;
  changes: Partial<Tile>;
  tile: Tile;
}

export const worldTileUpdated = defineAction<WorldTileUpdatedPayload>({
  id: "world.tileUpdated",
  name: "Tile Updated",
  description: "Fired when a tile is modified",
});

export interface WorldZLevelChangedPayload {
  previousZ: number;
  currentZ: number;
}

export const worldZLevelChanged = defineAction<WorldZLevelChangedPayload>({
  id: "world.zLevelChanged",
  name: "Z-Level Changed",
  description: "Fired when the current z-level view changes",
});

export interface WorldReadyPayload {
  timestamp: number;
}

export const worldReady = defineAction<WorldReadyPayload>({
  id: "world.ready",
  name: "World Ready",
  description:
    "Fired when the World component finishes rendering and viewport is initialized",
});

// =============================================================================
// INTERACTION NOTIFICATIONS
// =============================================================================

export interface InteractionHoverChangedPayload {
  position: Position2D | null;
  zLevel: number;
}

export const interactionHoverChanged =
  defineAction<InteractionHoverChangedPayload>({
    id: "interaction.hoverChanged",
    name: "Hover Changed",
    description: "Fired when mouse hovers over a new position",
  });

export type InteractionMode = "select" | "build" | "designate" | "zone";

export interface InteractionModeChangedPayload {
  previousMode: InteractionMode;
  currentMode: InteractionMode;
}

export const interactionModeChanged =
  defineAction<InteractionModeChangedPayload>({
    id: "interaction.modeChanged",
    name: "Interaction Mode Changed",
    description: "Fired when interaction mode changes",
  });
