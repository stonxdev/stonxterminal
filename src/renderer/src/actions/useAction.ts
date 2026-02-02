// =============================================================================
// ACTION REACT HOOKS
// =============================================================================

import { useCallback, useEffect, useRef } from "react";
import { actionRegistry } from "./ActionRegistry";
import type { ActionHandler, AnyActionHandler } from "./types";

/**
 * Subscribe to a specific action.
 * Handler will be called whenever the action is dispatched.
 *
 * @example
 * useAction("world.zLevelChanged", ({ previousZ, currentZ }) => {
 *   console.log(`Z-level changed from ${previousZ} to ${currentZ}`);
 * });
 *
 * @param actionId - The action ID to subscribe to
 * @param handler - Callback function called when action is dispatched
 */
export function useAction<TPayload = unknown>(
  actionId: string,
  handler: ActionHandler<TPayload>,
): void {
  // Use ref to avoid re-subscribing when handler changes
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const unsubscribe = actionRegistry.on<TPayload>(actionId, (payload) => {
      handlerRef.current(payload);
    });

    return unsubscribe;
  }, [actionId]);
}

/**
 * Subscribe to all actions.
 * Handler will be called for every action dispatch.
 *
 * Useful for debugging, logging, or implementing action history.
 *
 * @example
 * useActionAny((actionId, payload) => {
 *   console.log(`Action dispatched: ${actionId}`, payload);
 * });
 *
 * @param handler - Callback function called for every action
 */
export function useActionAny(handler: AnyActionHandler): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const unsubscribe = actionRegistry.onAny((actionId, payload) => {
      handlerRef.current(actionId, payload);
    });

    return unsubscribe;
  }, []);
}

/**
 * Subscribe to an action only once.
 * Handler will be called on the first dispatch, then automatically unsubscribed.
 *
 * @param actionId - The action ID to subscribe to
 * @param handler - Callback function called once when action is dispatched
 */
export function useActionOnce<TPayload = unknown>(
  actionId: string,
  handler: ActionHandler<TPayload>,
): void {
  const handlerRef = useRef(handler);
  const calledRef = useRef(false);
  handlerRef.current = handler;

  useEffect(() => {
    if (calledRef.current) return;

    const unsubscribe = actionRegistry.on<TPayload>(actionId, (payload) => {
      if (!calledRef.current) {
        calledRef.current = true;
        handlerRef.current(payload);
        unsubscribe();
      }
    });

    return unsubscribe;
  }, [actionId]);
}

/**
 * Get a stable dispatch function for dispatching actions.
 *
 * @example
 * const dispatch = useDispatch();
 *
 * const handleClick = () => {
 *   dispatch("world.setZoom", { scale: 2 });
 * };
 *
 * @returns A stable dispatch function
 */
export function useDispatch(): (
  actionId: string,
  payload?: unknown,
) => Promise<void> {
  return useCallback((actionId: string, payload?: unknown) => {
    return actionRegistry.dispatch(actionId, payload);
  }, []);
}

/**
 * Get a stable dispatch function bound to a specific action ID.
 *
 * @example
 * const setZoom = useDispatchAction<{ scale: number }>("world.setZoom");
 *
 * const handleClick = () => {
 *   setZoom({ scale: 2 });
 * };
 *
 * @param actionId - The action ID to bind
 * @returns A stable dispatch function for that specific action
 */
export function useDispatchAction<TPayload = void>(
  actionId: string,
): (payload?: TPayload) => Promise<void> {
  return useCallback(
    (payload?: TPayload) => {
      return actionRegistry.dispatch(actionId, payload);
    },
    [actionId],
  );
}
