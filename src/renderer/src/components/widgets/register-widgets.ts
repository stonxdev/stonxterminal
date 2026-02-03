import {
  charactersWidget,
  layersWidget,
  performanceWidget,
  settingsWidget,
  tileInspectorWidget,
  worldWidget,
} from "./definitions";
import type { WidgetLayoutConfig } from "./types";
import { widgetRegistry } from "./widget-registry";

/**
 * Default layout configuration determining which widgets appear in which slots.
 */
export const DEFAULT_WIDGET_LAYOUT: WidgetLayoutConfig = {
  slots: {
    "left-top": [],
    "left-bottom": [],
    center: ["world", "settings"],
    "center-bottom": [],
    "right-top": ["tile-inspector"],
    "right-bottom": ["layers", "characters", "performance"],
  },
};

/**
 * Register all built-in widgets.
 * Call this during app initialization.
 */
export function registerBuiltInWidgets(): void {
  widgetRegistry.register(worldWidget);
  widgetRegistry.register(charactersWidget);
  widgetRegistry.register(layersWidget);
  widgetRegistry.register(performanceWidget);
  widgetRegistry.register(settingsWidget);
  widgetRegistry.register(tileInspectorWidget);
}
