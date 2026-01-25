// =============================================================================
// REACT HOOKS FOR EVENT BUS
// =============================================================================

import { useCallback, useEffect, useRef } from "react";
import { eventBus } from "./EventBus";
import type {
  AnyEventHandler,
  EventHandler,
  GameEvent,
  GameEventByType,
  GameEventType,
} from "./types";

/**
 * Subscribe to a specific event type with automatic cleanup
 *
 * @param eventType - The event type to subscribe to
 * @param handler - The callback function to invoke when the event fires
 * @param deps - Optional dependency array for the handler (like useCallback deps)
 *
 * @example
 * ```tsx
 * useEvent('selection:tile', (event) => {
 *   console.log('Selected tile at:', event.position);
 *   setSelectedTile(event.tile);
 * });
 * ```
 */
export function useEvent<T extends GameEventType>(
  eventType: T,
  handler: EventHandler<GameEventByType<T>>,
  deps: React.DependencyList = [],
): void {
  // Store the handler in a ref to avoid recreating subscription
  const handlerRef = useRef(handler);

  // Update the ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, ...deps]);

  // Subscribe on mount, unsubscribe on unmount
  useEffect(() => {
    const wrappedHandler = (event: GameEventByType<T>) => {
      handlerRef.current(event);
    };

    return eventBus.on(eventType, wrappedHandler);
  }, [eventType]);
}

/**
 * Subscribe to all events with automatic cleanup
 *
 * @example
 * ```tsx
 * useEventAny((event) => {
 *   console.log('Event fired:', event.type, event);
 * });
 * ```
 */
export function useEventAny(
  handler: AnyEventHandler,
  deps: React.DependencyList = [],
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, ...deps]);

  useEffect(() => {
    const wrappedHandler = (event: GameEvent) => {
      handlerRef.current(event);
    };

    return eventBus.onAny(wrappedHandler);
  }, []);
}

/**
 * Get an emit function that's stable across renders
 *
 * @example
 * ```tsx
 * const emit = useEmit();
 *
 * const handleClick = () => {
 *   emit({
 *     type: 'selection:tile',
 *     position: { x, y },
 *     zLevel,
 *     tile
 *   });
 * };
 * ```
 */
export function useEmit(): <T extends GameEvent>(event: T) => void {
  return useCallback(<T extends GameEvent>(event: T) => {
    eventBus.emit(event);
  }, []);
}

/**
 * Subscribe to an event once, then automatically unsubscribe
 *
 * @example
 * ```tsx
 * useEventOnce('world:tile-updated', (event) => {
 *   console.log('First tile update received:', event);
 * });
 * ```
 */
export function useEventOnce<T extends GameEventType>(
  eventType: T,
  handler: EventHandler<GameEventByType<T>>,
): void {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;

    const wrappedHandler = (event: GameEventByType<T>) => {
      if (!calledRef.current) {
        calledRef.current = true;
        handler(event);
      }
    };

    return eventBus.on(eventType, wrappedHandler);
    // Only subscribe once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType]);
}
