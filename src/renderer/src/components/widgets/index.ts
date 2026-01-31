// Core exports

// Widget definitions (for direct import if needed)
export * from "./definitions";
export { registerBuiltInWidgets } from "./register-widgets";
// Types
export type {
  WidgetComponentProps,
  WidgetDefinition,
  WidgetId,
  WidgetLayoutConfig,
  WidgetSlotId,
} from "./types";
export { WidgetSlot } from "./WidgetSlot";
export {
  useIsSlotEmpty,
  useWidgetLayoutStore,
  useWidgetsForSlot,
} from "./widget-layout-store";
export { widgetRegistry } from "./widget-registry";
