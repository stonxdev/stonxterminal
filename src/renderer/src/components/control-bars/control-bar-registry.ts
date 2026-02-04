// =============================================================================
// CONTROL BAR REGISTRY
// =============================================================================

import {
  type ControlBarLayoutConfigValue,
  useConfigStore,
} from "@renderer/config";
import type { ControlBarDefinition, ControlBarPosition } from "./types";

/**
 * Registry for managing control bar definitions.
 * Layout configuration is read from the config store.
 */
class ControlBarRegistry {
  private bars: Map<string, ControlBarDefinition> = new Map();

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
   * Get all control bars at a specific position (from config)
   */
  getByPosition(position: ControlBarPosition): ControlBarDefinition[] {
    const config = useConfigStore.getState().computed[
      "layout.controlBars"
    ] as unknown as ControlBarLayoutConfigValue | undefined;

    const barIds = config?.[position] ?? [];
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
