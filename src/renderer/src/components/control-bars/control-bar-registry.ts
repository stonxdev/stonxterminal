// =============================================================================
// CONTROL BAR REGISTRY
// =============================================================================

import type {
  ControlBarDefinition,
  ControlBarLayoutConfig,
  ControlBarPosition,
} from "./types";

/**
 * Registry for managing control bar definitions
 */
class ControlBarRegistry {
  private bars: Map<string, ControlBarDefinition> = new Map();
  private layout: ControlBarLayoutConfig = {
    slots: {
      "left-top": [],
      "left-bottom": [],
      "right-top": [],
      "right-bottom": [],
    },
  };

  /**
   * Register a control bar definition
   */
  register(definition: ControlBarDefinition): void {
    if (this.bars.has(definition.id)) {
      console.warn(
        `ControlBarRegistry: Overwriting existing bar with id "${definition.id}"`,
      );
    }
    this.bars.set(definition.id, definition);
  }

  /**
   * Set the layout configuration
   */
  setLayout(layout: ControlBarLayoutConfig): void {
    this.layout = layout;
  }

  /**
   * Get a control bar definition by ID
   */
  get(id: string): ControlBarDefinition | undefined {
    return this.bars.get(id);
  }

  /**
   * Check if a control bar is registered
   */
  has(id: string): boolean {
    return this.bars.has(id);
  }

  /**
   * Get all control bars at a specific position (from layout config)
   */
  getByPosition(position: ControlBarPosition): ControlBarDefinition[] {
    const barIds = this.layout.slots[position] ?? [];
    const bars: ControlBarDefinition[] = [];
    for (const id of barIds) {
      const bar = this.bars.get(id);
      if (bar) {
        bars.push(bar);
      }
    }
    return bars;
  }

  /**
   * Get all registered control bars
   */
  getAll(): ControlBarDefinition[] {
    return Array.from(this.bars.values());
  }
}

/**
 * Global control bar registry singleton
 */
export const controlBarRegistry = new ControlBarRegistry();
