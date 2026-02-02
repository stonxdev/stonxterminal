// =============================================================================
// ACTION REGISTRY IMPLEMENTATION
// =============================================================================

import { SchemaFormModal } from "../components/form";
import type {
  ActionDefinition,
  ActionHandler,
  ActionRegistry,
  AnyActionHandler,
  ColonyContextData,
} from "./types";

/**
 * Unified action registry that combines command execution and event subscription.
 *
 * This replaces both CommandRegistry and EventBus with a single system where:
 * - Actions can be dispatched by string ID (for keybindings)
 * - Actions can have subscribers (for reactive updates)
 * - Actions can optionally have an executor (makes them "command-like")
 */
class ActionRegistryImpl implements ActionRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private actions = new Map<string, ActionDefinition<any>>();
  private handlers = new Map<string, Set<ActionHandler>>();
  private anyHandlers = new Set<AnyActionHandler>();
  private context: ColonyContextData | null = null;
  private debugMode = false;

  /**
   * Set the context for action execution.
   */
  setContext(context: ColonyContextData) {
    this.context = context;
  }

  /**
   * Register an action definition.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(action: ActionDefinition<any>) {
    this.actions.set(action.id, action);
  }

  /**
   * Dispatch an action by ID.
   *
   * Flow:
   * 1. If action has payloadSchema and no payload provided, show form modal
   * 2. If action has payloadSchema and payload provided, validate it
   * 3. If action has execute function, call it
   * 4. Notify all subscribers
   */
  async dispatch(actionId: string, payload?: unknown): Promise<void> {
    const action = this.actions.get(actionId);

    // For notification-only dispatches (no registered action), just notify subscribers
    if (!action) {
      if (this.debugMode) {
        console.log(
          `[ActionRegistry] Dispatching unregistered action: ${actionId}`,
          payload,
        );
      }
      this.notifySubscribers(actionId, payload);
      return;
    }

    // If action has payloadSchema and no payload provided, show form modal
    if (action.payloadSchema && payload === undefined && action.execute) {
      if (!this.context) {
        throw new Error(
          "Action context not set. Make sure to initialize the action system.",
        );
      }

      const context = this.context;
      context.modal.closeAllModals();
      context.modal.openModal({
        content: (
          <SchemaFormModal
            schema={action.payloadSchema}
            title={action.name}
            onSubmit={(data) => {
              context.modal.closeModal();
              this.dispatch(actionId, data);
            }}
            onCancel={() => context.modal.closeModal()}
          />
        ),
        alignment: "top",
        size: "lg",
        showBackdrop: true,
      });
      return;
    }

    // Validate payload if schema exists
    if (action.payloadSchema && payload !== undefined) {
      const result = action.payloadSchema.toZod().safeParse(payload);
      if (!result.success) {
        console.error(
          `Invalid payload for action "${actionId}":`,
          result.error,
        );
        return;
      }
      payload = result.data;
    }

    // Execute if action has an executor
    if (action.execute) {
      if (!this.context) {
        throw new Error(
          "Action context not set. Make sure to initialize the action system.",
        );
      }

      try {
        await action.execute(this.context, payload);
      } catch (error) {
        console.error(`Error executing action "${actionId}":`, error);
        return; // Don't notify subscribers if execution failed
      }
    }

    // Debug logging
    if (this.debugMode) {
      console.log(`[ActionRegistry] ${actionId}`, payload);
    }

    // Notify subscribers
    this.notifySubscribers(actionId, payload);
  }

  /**
   * Notify all subscribers of an action dispatch.
   */
  private notifySubscribers(actionId: string, payload: unknown): void {
    // Notify specific handlers
    const specificHandlers = this.handlers.get(actionId);
    if (specificHandlers) {
      for (const handler of specificHandlers) {
        try {
          handler(payload);
        } catch (error) {
          console.error(
            `[ActionRegistry] Error in handler for ${actionId}:`,
            error,
          );
        }
      }
    }

    // Notify wildcard handlers
    for (const handler of this.anyHandlers) {
      try {
        handler(actionId, payload);
      } catch (error) {
        console.error("[ActionRegistry] Error in wildcard handler:", error);
      }
    }
  }

  /**
   * Subscribe to an action.
   */
  on<TPayload = unknown>(
    actionId: string,
    handler: ActionHandler<TPayload>,
  ): () => void {
    let handlers = this.handlers.get(actionId);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(actionId, handlers);
    }

    handlers.add(handler as ActionHandler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as ActionHandler);
      if (handlers.size === 0) {
        this.handlers.delete(actionId);
      }
    };
  }

  /**
   * Subscribe to all actions.
   */
  onAny(handler: AnyActionHandler): () => void {
    this.anyHandlers.add(handler);

    return () => {
      this.anyHandlers.delete(handler);
    };
  }

  /**
   * Get an action definition by ID.
   */
  getAction(actionId: string): ActionDefinition | undefined {
    return this.actions.get(actionId);
  }

  /**
   * Get all registered actions.
   */
  getAllActions(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  /**
   * Get only executable actions (those with an `execute` function).
   */
  getExecutableActions(): ActionDefinition[] {
    return Array.from(this.actions.values()).filter(
      (action) => action.execute !== undefined,
    );
  }

  /**
   * Clear all registered actions and handlers.
   */
  clear() {
    this.actions.clear();
    this.handlers.clear();
    this.anyHandlers.clear();
  }

  /**
   * Enable/disable debug logging.
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Get current handler count (for debugging).
   */
  getHandlerCount(actionId?: string): number {
    if (actionId) {
      return this.handlers.get(actionId)?.size ?? 0;
    }
    let total = this.anyHandlers.size;
    for (const handlers of this.handlers.values()) {
      total += handlers.size;
    }
    return total;
  }
}

// Singleton instance
export const actionRegistry = new ActionRegistryImpl();

// Also export the class for testing
export { ActionRegistryImpl };
