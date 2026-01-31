import { tileInspectorWidget } from "./definitions";
import { widgetRegistry } from "./widget-registry";

/**
 * Register all built-in widgets.
 * Call this during app initialization.
 */
export function registerBuiltInWidgets(): void {
  widgetRegistry.register(tileInspectorWidget);

  // Register future widgets here:
  // widgetRegistry.register(entityListWidget);
  // widgetRegistry.register(consoleWidget);
}
