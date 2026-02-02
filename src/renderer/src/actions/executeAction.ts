import type { ColonyContextData } from "../context/types";
import { actionRegistry } from "./ActionRegistry";
import type { Action, DispatchAction, HandlerAction } from "./types";

/**
 * Standalone action executor that can be used outside of React components.
 * This is the core logic extracted for use in KeybindingManager.
 *
 * @param action - The action to execute
 * @param context - The Colony context (optional, required for dispatch actions)
 * @returns Promise that resolves when action completes
 */
export async function executeAction(
  action: Action,
  context?: ColonyContextData | null,
): Promise<void> {
  if (action.disabled) {
    return;
  }

  switch (action.type) {
    case "handler": {
      const handlerAction = action as HandlerAction;
      try {
        await handlerAction.onExecute();
      } catch (error) {
        console.error(`Error executing handler action "${action.id}":`, error);
      }
      break;
    }
    case "action": {
      const dispatchAction = action as DispatchAction;

      // Check if context is available for action execution
      if (!context) {
        throw new Error(
          `Cannot dispatch action "${dispatchAction.actionId}" - ColonyContext not available.`,
        );
      }

      try {
        await actionRegistry.dispatch(
          dispatchAction.actionId,
          dispatchAction.payload,
        );
      } catch (error) {
        console.error(`Error dispatching action "${action.id}":`, error);
      }
      break;
    }
    default: {
      // TypeScript exhaustiveness check
      const _exhaustiveCheck: never = action;
      console.error(`Unknown action type:`, _exhaustiveCheck);
      break;
    }
  }
}
