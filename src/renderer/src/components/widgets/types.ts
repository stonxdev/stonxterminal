import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Available dock slots for widgets (dash-case).
 */
export type WidgetSlotId =
  | "left-top"
  | "left-bottom"
  | "center"
  | "center-bottom"
  | "right-top"
  | "right-bottom";

/**
 * Widget size determines placement constraints.
 * - "normal": Can be placed in any slot, can open in modal
 * - "wide": Only main slots (center, center-bottom), cannot open in modal
 */
export type WidgetSize = "normal" | "wide";

/** Main slots where wide widgets can be placed */
export const MAIN_SLOTS: WidgetSlotId[] = ["center", "center-bottom"];

/** Sidebar slots (wide widgets cannot go here) */
export const SIDEBAR_SLOTS: WidgetSlotId[] = [
  "left-top",
  "left-bottom",
  "right-top",
  "right-bottom",
];

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
 * Placement constraints for a widget.
 */
export interface WidgetPlacement {
  /** If true, this widget is pinned and cannot be removed or moved from its default slot */
  pinned?: boolean;
  /** If set, this widget can ONLY be placed in these slots (whitelist) */
  allowedSlots?: WidgetSlotId[];
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
  /** Whether this widget can be closed (removed from slot). Ignored if placement.pinned is true. */
  closable?: boolean;
  /** Placement constraints for this widget */
  placement?: WidgetPlacement;
  /** Default slot for pinned widgets */
  defaultSlot?: WidgetSlotId;
  /**
   * Widget size. Defaults to "normal".
   * - "normal": Can be placed in any slot, can open in modal
   * - "wide": Only main slots (center, center-bottom), cannot open in modal
   */
  size?: WidgetSize;
}

/**
 * Configuration for all slot assignments.
 */
export interface WidgetLayoutConfig {
  /** Map of slot ID to array of widget IDs (ordered) */
  slots: Record<WidgetSlotId, WidgetId[]>;
}
