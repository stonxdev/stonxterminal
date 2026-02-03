// =============================================================================
// VERSION STATUS BAR
// =============================================================================

import type { StatusBarItemDefinition, StatusBarItemProps } from "../types";

/**
 * Status bar item displaying the application version
 */
function VersionStatusBarComponent(_props: StatusBarItemProps) {
  return <span className="font-mono opacity-70">v{__APP_VERSION__}</span>;
}

// =============================================================================
// DEFINITION EXPORT
// =============================================================================

export const versionStatusBar: StatusBarItemDefinition = {
  id: "version",
  component: VersionStatusBarComponent,
  alignment: "left",
  priority: 100,
};
