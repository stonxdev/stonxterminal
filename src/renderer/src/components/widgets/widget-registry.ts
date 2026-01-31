import type { WidgetDefinition, WidgetId, WidgetSlotId } from "./types";

/**
 * Registry for managing widget definitions.
 * Widgets must be registered before they can be assigned to slots.
 */
class WidgetRegistryImpl {
  private widgets = new Map<WidgetId, WidgetDefinition>();

  /**
   * Register a widget definition.
   */
  register(definition: WidgetDefinition): void {
    if (this.widgets.has(definition.id)) {
      console.warn(
        `Widget "${definition.id}" is already registered, overwriting.`,
      );
    }
    this.widgets.set(definition.id, definition);
  }

  /**
   * Get a widget definition by ID.
   */
  get(id: WidgetId): WidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  /**
   * Check if a widget exists.
   */
  has(id: WidgetId): boolean {
    return this.widgets.has(id);
  }

  /**
   * Get all registered widgets.
   */
  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Get widgets for a specific default slot.
   */
  getByDefaultSlot(slotId: WidgetSlotId): WidgetDefinition[] {
    return this.getAll().filter((w) => w.defaultSlot === slotId);
  }

  /**
   * Clear all registrations (useful for testing).
   */
  clear(): void {
    this.widgets.clear();
  }
}

// Singleton instance
export const widgetRegistry = new WidgetRegistryImpl();
