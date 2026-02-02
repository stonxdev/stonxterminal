// =============================================================================
// CONTROL BAR REGISTRATION
// =============================================================================

import { controlBarRegistry } from "./control-bar-registry";
import { timeControlBar, zoomControlBar } from "./definitions";
import type { ControlBarLayoutConfig } from "./types";

/**
 * Default layout configuration determining which control bars appear in which slots.
 */
export const DEFAULT_CONTROL_BAR_LAYOUT: ControlBarLayoutConfig = {
  slots: {
    "left-top": [],
    "left-bottom": [],
    "right-top": ["time-control", "zoom-control"],
    "right-bottom": [],
  },
};

/**
 * Register all built-in control bars.
 * Call this during app initialization.
 */
export function registerBuiltInControlBars(): void {
  controlBarRegistry.register(timeControlBar);
  controlBarRegistry.register(zoomControlBar);
  controlBarRegistry.setLayout(DEFAULT_CONTROL_BAR_LAYOUT);
}
