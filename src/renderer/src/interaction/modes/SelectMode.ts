// =============================================================================
// SELECT MODE HANDLER
// =============================================================================

import { useGameStore } from "../../game-state/store";
import type { InteractionContext, InteractionModeHandler } from "../types";

/** Maximum distance (in pixels) to still count as a click vs drag */
const CLICK_THRESHOLD = 5;

/**
 * Select mode handler - allows clicking to select tiles and entities
 * Only selects when clicking without dragging (to avoid interfering with pan)
 */
export class SelectModeHandler implements InteractionModeHandler {
  readonly mode = "select" as const;

  // Track pointer down position to detect drag vs click
  private pointerDownPosition: { x: number; y: number } | null = null;

  onPointerDown(ctx: InteractionContext): void {
    // Remember where the pointer went down
    this.pointerDownPosition = {
      x: ctx.screenPosition.x,
      y: ctx.screenPosition.y,
    };
  }

  onPointerUp(ctx: InteractionContext): void {
    // Check if this was a click (not a drag)
    if (this.pointerDownPosition) {
      const dx = ctx.screenPosition.x - this.pointerDownPosition.x;
      const dy = ctx.screenPosition.y - this.pointerDownPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only select if the pointer didn't move much (it's a click, not a drag)
      if (distance <= CLICK_THRESHOLD) {
        const { selectTile } = useGameStore.getState();
        selectTile(ctx.worldPosition, ctx.zLevel);
      }
    }

    // Clear the pointer down position
    this.pointerDownPosition = null;
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
