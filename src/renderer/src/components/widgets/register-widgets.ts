import { charactersWidget, tileInspectorWidget } from "./definitions";
import type { WidgetLayoutConfig } from "./types";
import { widgetRegistry } from "./widget-registry";

/**
 * Default layout configuration determining which widgets appear in which slots.
 */
export const DEFAULT_WIDGET_LAYOUT: WidgetLayoutConfig = {
  slots: {
    "left-top": [],
    "left-bottom": [],
    "center-bottom": [],
    "right-top": ["tile-inspector"],
    "right-bottom": ["characters"],
  },
};

/**
 * Register all built-in widgets.
 * Call this during app initialization.
 */
export function registerBuiltInWidgets(): void {
  widgetRegistry.register(charactersWidget);
  widgetRegistry.register(tileInspectorWidget);

  // Register future widgets here:
  // widgetRegistry.register(entityListWidget);
  // widgetRegistry.register(consoleWidget);
}
