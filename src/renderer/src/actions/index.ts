// =============================================================================
// ACTIONS MODULE - Unified command/event system
// =============================================================================

// Core registry
export { ActionRegistryImpl, actionRegistry } from "./ActionRegistry";

// Factory function
export { defineAction } from "./defineAction";

// Action executor
export { executeAction } from "./executeAction";

// Types
export type {
  // UI action types (for buttons, menus)
  Action,
  // System action types
  ActionDefinition,
  ActionHandler,
  ActionId,
  ActionRegistry,
  AnyActionHandler,
  BaseAction,
  ColonyContextData,
  DispatchAction,
  HandlerAction,
  Keybinding,
} from "./types";

// React hooks
export {
  useAction,
  useActionAny,
  useActionOnce,
  useDispatch,
  useDispatchAction,
} from "./useAction";
