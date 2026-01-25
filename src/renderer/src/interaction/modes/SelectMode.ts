// =============================================================================
// SELECT MODE HANDLER
// =============================================================================

import { useGameStore } from "../../game-state/store";
import { entityStore } from "../../simulation/entity-store";
import { createMoveCommand } from "../../simulation/types";
import type { InteractionContext, InteractionModeHandler } from "../types";

/** Maximum distance (in pixels) to still count as a click vs drag */
const CLICK_THRESHOLD = 5;

/** Radius in pixels to detect character clicks */
const CHARACTER_CLICK_RADIUS = 16;

/**
 * Select mode handler - allows clicking to select tiles and entities
 * Only selects when clicking without dragging (to avoid interfering with pan)
 *
 * Left-click: Select tile or character
 * Right-click: Issue move command to selected character
 */
export class SelectModeHandler implements InteractionModeHandler {
  readonly mode = "select" as const;

  // Track pointer down position to detect drag vs click
  private pointerDownPosition: { x: number; y: number; button: number } | null =
    null;

  onPointerDown(ctx: InteractionContext): void {
    // Remember where the pointer went down
    this.pointerDownPosition = {
      x: ctx.screenPosition.x,
      y: ctx.screenPosition.y,
      button: ctx.button,
    };
  }

  onPointerUp(ctx: InteractionContext): void {
    // Check if this was a click (not a drag)
    if (
      this.pointerDownPosition &&
      this.pointerDownPosition.button === ctx.button
    ) {
      const dx = ctx.screenPosition.x - this.pointerDownPosition.x;
      const dy = ctx.screenPosition.y - this.pointerDownPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only handle if the pointer didn't move much (it's a click, not a drag)
      if (distance <= CLICK_THRESHOLD) {
        if (ctx.button === 0) {
          // Left-click: Select
          this.handleLeftClick(ctx);
        } else if (ctx.button === 2) {
          // Right-click: Issue command
          this.handleRightClick(ctx);
        }
      }
    }

    // Clear the pointer down position
    this.pointerDownPosition = null;
  }

  /**
   * Handle left-click to select tile or character
   */
  private handleLeftClick(ctx: InteractionContext): void {
    const state = useGameStore.getState();
    const cellSize = 32; // TODO: Get from config

    // Check if clicking on a character
    const centerX = ctx.localPosition.x;
    const centerY = ctx.localPosition.y;

    // Find character at click position
    for (const character of state.simulation.characters.values()) {
      if (character.position.z !== ctx.zLevel) continue;

      // Calculate character center position in pixels
      const charCenterX =
        character.position.x * cellSize +
        cellSize / 2 +
        character.visualOffset.x * cellSize;
      const charCenterY =
        character.position.y * cellSize +
        cellSize / 2 +
        character.visualOffset.y * cellSize;

      const dx = centerX - charCenterX;
      const dy = centerY - charCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= CHARACTER_CLICK_RADIUS) {
        // Select this character
        state.selectEntity("colonist", character.id, {
          x: character.position.x,
          y: character.position.y,
        });
        return;
      }
    }

    // No character clicked, select tile
    state.selectTile(ctx.worldPosition, ctx.zLevel);
  }

  /**
   * Handle right-click to issue move command
   */
  private handleRightClick(ctx: InteractionContext): void {
    const state = useGameStore.getState();
    const { selection } = state;

    // Only issue command if a character is selected
    if (selection.type !== "entity" || selection.entityType !== "colonist") {
      return;
    }

    const characterId = selection.entityId;
    const character = entityStore.get(characterId);

    if (!character) return;

    // Check if destination is passable
    if (!ctx.tile?.pathfinding?.isPassable) {
      console.warn("Cannot move to impassable tile");
      return;
    }

    // Create and issue move command
    const destination = {
      x: ctx.worldPosition.x,
      y: ctx.worldPosition.y,
      z: ctx.zLevel,
    };

    const command = createMoveCommand(destination);
    state.issueCommand(characterId, command);
  }

  onHover(ctx: InteractionContext): void {
    const { setHoverPosition } = useGameStore.getState();
    setHoverPosition(ctx.worldPosition);
  }

  onHoverEnd(): void {
    const { setHoverPosition } = useGameStore.getState();
    setHoverPosition(null);
  }

  onActivate(): void {
    // Could change cursor style here
  }

  onDeactivate(): void {
    // Clear state when leaving select mode
    this.pointerDownPosition = null;
    const { setHoverPosition } = useGameStore.getState();
    setHoverPosition(null);
  }
}

// Singleton instance
export const selectModeHandler = new SelectModeHandler();
