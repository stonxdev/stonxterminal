// =============================================================================
// STATUS BAR COMPONENT
// =============================================================================

import { statusBarRegistry } from "./status-bar-registry";

/**
 * Status bar container that renders all registered status bar items.
 * Items are grouped by alignment (left/right) and sorted by priority.
 */
export function StatusBar() {
  const leftItems = statusBarRegistry.getByAlignment("left");
  const rightItems = statusBarRegistry.getByAlignment("right");

  // Don't render if no items are registered
  if (leftItems.length === 0 && rightItems.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between w-full h-6 px-2 text-xs text-muted-foreground bg-background">
      {/* Left-aligned items */}
      <div className="flex items-center gap-3">
        {leftItems.map((item) => (
          <item.component key={item.id} itemId={item.id} />
        ))}
      </div>

      {/* Right-aligned items */}
      <div className="flex items-center gap-3">
        {rightItems.map((item) => (
          <item.component key={item.id} itemId={item.id} />
        ))}
      </div>
    </div>
  );
}
