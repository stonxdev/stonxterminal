// =============================================================================
// EVENT BUS IMPLEMENTATION
// =============================================================================

import type {
  AnyEventHandler,
  EventHandler,
  GameEvent,
  GameEventByType,
  GameEventType,
} from "./types";

/**
 * Type-safe event bus for decoupled communication between game systems
 *
 * Features:
 * - Type-safe event subscription via discriminated union
 * - Multiple handlers per event type
 * - Wildcard subscription for debugging/logging
 * - Automatic handler cleanup
 *
 * Usage:
 * ```ts
 * // Subscribe to a specific event type
 * const unsubscribe = eventBus.on('selection:tile', (event) => {
 *   console.log('Tile selected:', event.position);
 * });
 *
 * // Emit an event
 * eventBus.emit({
 *   type: 'selection:tile',
 *   position: { x: 5, y: 10 },
 *   zLevel: 0,
 *   tile: someTile
 * });
 *
 * // Cleanup
 * unsubscribe();
 * ```
 */
class EventBusImpl {
  private handlers = new Map<GameEventType | "*", Set<AnyEventHandler>>();
  private debugMode = false;

  /**
   * Subscribe to a specific event type
   * Returns an unsubscribe function
   */
  on<T extends GameEventType>(
    eventType: T,
    handler: EventHandler<GameEventByType<T>>,
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlers = this.handlers.get(eventType)!;
    handlers.add(handler as AnyEventHandler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as AnyEventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  /**
   * Subscribe to ALL events (useful for debugging/logging)
   */
  onAny(handler: AnyEventHandler): () => void {
    if (!this.handlers.has("*")) {
      this.handlers.set("*", new Set());
    }

    const handlers = this.handlers.get("*")!;
    handlers.add(handler);

    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete("*");
      }
    };
  }

  /**
   * Subscribe to an event, automatically unsubscribe after first occurrence
   */
  once<T extends GameEventType>(
    eventType: T,
    handler: EventHandler<GameEventByType<T>>,
  ): () => void {
    const unsubscribe = this.on(eventType, (event) => {
      unsubscribe();
      handler(event);
    });
    return unsubscribe;
  }

  /**
   * Emit an event to all registered handlers
   */
  emit<T extends GameEvent>(event: T): void {
    if (this.debugMode) {
      console.log("[EventBus]", event.type, event);
    }

    // Notify specific handlers
    const specificHandlers = this.handlers.get(event.type as GameEventType);
    if (specificHandlers) {
      for (const handler of specificHandlers) {
        try {
          handler(event);
        } catch (error) {
          console.error(
            `[EventBus] Error in handler for ${event.type}:`,
            error,
          );
        }
      }
    }

    // Notify wildcard handlers
    const wildcardHandlers = this.handlers.get("*");
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        try {
          handler(event);
        } catch (error) {
          console.error("[EventBus] Error in wildcard handler:", error);
        }
      }
    }
  }

  /**
   * Remove all handlers for a specific event type
   */
  off(eventType: GameEventType): void {
    this.handlers.delete(eventType);
  }

  /**
   * Remove all handlers
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Enable/disable debug logging
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Get current handler count (for debugging)
   */
  getHandlerCount(eventType?: GameEventType): number {
    if (eventType) {
      return this.handlers.get(eventType)?.size ?? 0;
    }
    let total = 0;
    for (const handlers of this.handlers.values()) {
      total += handlers.size;
    }
    return total;
  }
}

// Singleton instance
export const eventBus = new EventBusImpl();

// Also export the class for testing
export { EventBusImpl };
