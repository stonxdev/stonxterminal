// =============================================================================
// STATUS BAR TYPE DEFINITIONS
// =============================================================================

import type { ComponentType } from "react";

/**
 * Alignment for status bar items within the container
 */
export type StatusBarAlignment = "left" | "right";

/**
 * Props passed to status bar item components
 */
export interface StatusBarItemProps {
  /** The item's unique ID */
  itemId: string;
}

/**
 * Definition for a status bar item
 */
export interface StatusBarItemDefinition {
  /** Unique identifier for the status bar item (dash-case, e.g., "version") */
  id: string;
  /** The React component to render */
  component: ComponentType<StatusBarItemProps>;
  /** Alignment within the status bar (default: "left") */
  alignment?: StatusBarAlignment;
  /**
   * Priority for ordering (lower = renders first within alignment group)
   * Default: 100
   */
  priority?: number;
}
