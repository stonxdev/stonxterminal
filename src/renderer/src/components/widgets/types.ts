import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Available dock slots for widgets (dash-case).
 * Note: center-top is reserved for main content, NOT for widgets.
 */
export type WidgetSlotId =
  | "left-top"
  | "left-bottom"
  | "center-bottom"
  | "right-top"
  | "right-bottom";

/**
 * Widget identifier using dash-case convention.
 * Examples: "tile-inspector", "entity-list", "console"
 */
export type WidgetId = string;

/**
 * Props passed to every widget component.
 */
export interface WidgetComponentProps {
  /** The widget's ID */
  widgetId: WidgetId;
  /** The slot this widget is currently in */
  slotId: WidgetSlotId;
}

/**
 * Widget definition registered in the widget registry.
 */
export interface WidgetDefinition {
  /** Unique identifier in dash-case (e.g., "tile-inspector") */
  id: WidgetId;
  /** Display name shown in tab */
  label: string;
  /** Optional Lucide icon for the tab */
  icon?: LucideIcon;
  /** The React component to render */
  component: ComponentType<WidgetComponentProps>;
  /** Default slot assignment (can be overridden by user) */
  defaultSlot: WidgetSlotId;
  /** Whether this widget can be closed (removed from slot) */
  closable?: boolean;
}

/**
 * Configuration for all slot assignments.
 */
export interface WidgetLayoutConfig {
  /** Map of slot ID to array of widget IDs (ordered) */
  slots: Record<WidgetSlotId, WidgetId[]>;
}
