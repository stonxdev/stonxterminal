import type { ActionDefinition } from "./types";

/**
 * Factory function for creating type-safe action definitions.
 *
 * Use this to define actions that can be:
 * - Dispatched by name (for keybindings, command palette)
 * - Subscribed to (for reactive updates)
 *
 * @example
 * // Executable action (like a command)
 * const setZoom = defineAction<{ scale: number }>({
 *   id: "world.setZoom",
 *   name: "Set Zoom Level",
 *   icon: ZoomIn,
 *   payloadSchema: nu.object({ scale: nu.number() }),
 *   execute: (context, payload) => {
 *     context.game.setZoom(payload?.scale ?? 1);
 *   },
 * });
 *
 * @example
 * // Notification-only action (like an event)
 * const zLevelChanged = defineAction<{ previousZ: number; currentZ: number }>({
 *   id: "world.zLevelChanged",
 *   name: "Z-Level Changed",
 *   // No execute - this is purely a notification
 * });
 *
 * @param definition - The action definition
 * @returns A typed action definition
 */
export function defineAction<TPayload = void>(
  definition: ActionDefinition<TPayload>,
): ActionDefinition<TPayload> {
  return definition;
}
