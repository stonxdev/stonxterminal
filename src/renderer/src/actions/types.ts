import type React from "react";
import type { ColonyContextData } from "../context/types";
import type { IconComponent } from "../menu/types";
import type { ObjectSchema } from "../schemas";

// =============================================================================
// UI ACTION TYPES (for buttons, menus, etc.)
// =============================================================================

/**
 * Base action interface with common properties shared by all action types.
 */
export interface BaseAction {
  id: string;
  label?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

/**
 * Handler-based action that executes a function directly.
 * Best for simple actions and Storybook examples.
 */
export interface HandlerAction extends BaseAction {
  type: "handler";
  onExecute: () => void | Promise<void>;
}

/**
 * Action-based UI action that dispatches through the action registry.
 * Best for application-wide actions that need to be consistent and type-safe.
 */
export interface DispatchAction extends BaseAction {
  type: "action";
  actionId: string;
  payload?: Record<string, unknown>;
}

/**
 * Union type for all supported UI action types.
 */
export type Action = HandlerAction | DispatchAction;

// =============================================================================
// SYSTEM ACTION TYPES (unified command/event system)
// =============================================================================

export type { ColonyContextData };

/**
 * Type-safe action definition for Colony.
 *
 * Actions unify the concepts of "commands" (executable user actions) and
 * "events" (notifications about state changes) into a single system.
 *
 * - Actions with `execute` are "commands" - they can be triggered by keybindings,
 *   the command palette, or programmatically.
 * - Actions without `execute` are "notifications" - they're dispatched by the
 *   system to notify subscribers about state changes.
 * - All actions can have subscribers via `actionRegistry.on()`.
 */
export interface ActionDefinition<TPayload = void> {
  /** Unique identifier, e.g., "world.setZoom" or "selection.changed" */
  id: string;

  /** Human-readable name for display in command palette, etc. */
  name: string;

  /** Optional description for tooltips and documentation */
  description?: string;

  /**
   * Icon component (not instantiated) for this action.
   * Used in command palettes, menus, and anywhere the action is displayed.
   */
  icon?: IconComponent;

  /**
   * Schema for action payload.
   * If provided and action is dispatched without payload, a form modal will be shown.
   * Also used for validation when payload is provided.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payloadSchema?: ObjectSchema<any>;

  /**
   * Optional execution function. If provided, this action is "executable" and
   * can be invoked via keybindings, command palette, etc.
   *
   * If not provided, this action is a pure notification - it can only be
   * dispatched to notify subscribers.
   *
   * @param context - The colony context data
   * @param payload - Optional payload passed to the action
   */
  execute?: (
    context: ColonyContextData,
    payload?: TPayload,
  ) => void | Promise<void>;
}

/**
 * Handler function for action subscriptions.
 */
export type ActionHandler<TPayload = unknown> = (payload: TPayload) => void;

/**
 * Generic handler that can receive any action payload.
 */
export type AnyActionHandler = (actionId: string, payload: unknown) => void;

/**
 * Action ID type for clarity.
 */
export type ActionId = string;

/**
 * Keybinding interface for action-based keybindings.
 */
export interface Keybinding {
  key: string | string[];
  action: string;
  payload?: Record<string, unknown>;
}

/**
 * Action registry interface.
 */
export interface ActionRegistry {
  /**
   * Register an action definition.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (action: ActionDefinition<any>) => void;

  /**
   * Set the context for action execution.
   */
  setContext: (context: ColonyContextData) => void;

  /**
   * Dispatch an action by ID.
   * - If the action has an `execute` function, it will be called first.
   * - All subscribers will be notified after execution (or immediately for notifications).
   *
   * @param actionId - The action ID to dispatch
   * @param payload - Optional payload for the action
   */
  dispatch: (actionId: string, payload?: unknown) => Promise<void>;

  /**
   * Subscribe to an action.
   * Handler will be called whenever the action is dispatched.
   *
   * @returns Unsubscribe function
   */
  on: <TPayload = unknown>(
    actionId: string,
    handler: ActionHandler<TPayload>,
  ) => () => void;

  /**
   * Subscribe to all actions.
   * Handler will be called for every action dispatch.
   *
   * @returns Unsubscribe function
   */
  onAny: (handler: AnyActionHandler) => () => void;

  /**
   * Get an action definition by ID.
   */
  getAction: (actionId: string) => ActionDefinition | undefined;

  /**
   * Get all registered actions.
   */
  getAllActions: () => ActionDefinition[];

  /**
   * Get only executable actions (those with an `execute` function).
   * Useful for command palette.
   */
  getExecutableActions: () => ActionDefinition[];

  /**
   * Clear all registered actions.
   */
  clear: () => void;
}
