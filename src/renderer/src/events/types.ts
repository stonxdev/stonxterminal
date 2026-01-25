// =============================================================================
// EVENT TYPE DEFINITIONS
// =============================================================================

import type { Position2D, Tile } from "../world/types";

/**
 * Entity types that can be selected
 * EXTENSION POINT: Add new entity types here as the game grows
 */
export type EntityType = "colonist" | "item" | "structure" | "zone";

/**
 * All game events as a discriminated union
 * EXTENSION POINT: Add new events here with unique `type` strings
 */
export type GameEvent =
  // Selection events
  | TileSelectedEvent
  | EntitySelectedEvent
  | SelectionClearedEvent
  // World events
  | TileUpdatedEvent
  | ZLevelChangedEvent
  // Interaction events
  | HoverChangedEvent
  | InteractionModeChangedEvent;

// =============================================================================
// SELECTION EVENTS
// =============================================================================

/** Fired when a tile is selected */
export interface TileSelectedEvent {
  type: "selection:tile";
  position: Position2D;
  zLevel: number;
  tile: Tile;
}

/** Fired when an entity (colonist, item, structure) is selected */
export interface EntitySelectedEvent {
  type: "selection:entity";
  entityType: EntityType;
  entityId: string;
  position?: Position2D;
}

/** Fired when selection is cleared */
export interface SelectionClearedEvent {
  type: "selection:cleared";
}

// =============================================================================
// WORLD EVENTS
// =============================================================================

/** Fired when a tile is modified */
export interface TileUpdatedEvent {
  type: "world:tile-updated";
  position: Position2D;
  zLevel: number;
  changes: Partial<Tile>;
  tile: Tile;
}

/** Fired when the current z-level view changes */
export interface ZLevelChangedEvent {
  type: "world:z-level-changed";
  previousZ: number;
  currentZ: number;
}

// =============================================================================
// INTERACTION EVENTS
// =============================================================================

/** Fired when mouse hovers over a new position */
export interface HoverChangedEvent {
  type: "interaction:hover-changed";
  position: Position2D | null;
  zLevel: number;
}

/** Interaction modes */
export type InteractionMode = "select" | "build" | "designate" | "zone";

/** Fired when interaction mode changes */
export interface InteractionModeChangedEvent {
  type: "interaction:mode-changed";
  previousMode: InteractionMode;
  currentMode: InteractionMode;
}

// =============================================================================
// TYPE UTILITIES
// =============================================================================

/**
 * Extract the event type string from a GameEvent
 */
export type GameEventType = GameEvent["type"];

/**
 * Get the specific event interface for a given event type string
 */
export type GameEventByType<T extends GameEventType> = Extract<
  GameEvent,
  { type: T }
>;

/**
 * Event handler function type
 */
export type EventHandler<T extends GameEvent> = (event: T) => void;

/**
 * Generic handler that can receive any event
 */
export type AnyEventHandler = EventHandler<GameEvent>;
