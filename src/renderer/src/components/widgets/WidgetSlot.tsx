import { useMemo } from "react";
import type { TabItem } from "../tabs";
import { Tabs } from "../tabs";
import type { WidgetSlotId } from "./types";
import { useWidgetsForSlot } from "./widget-layout-store";
import { widgetRegistry } from "./widget-registry";

interface WidgetSlotProps {
  /** The slot identifier */
  slotId: WidgetSlotId;
  /** Optional class name for styling */
  className?: string;
  /** Tab variant - defaults to "secondary" */
  variant?: "primary" | "secondary";
  /** Keep all tab panels mounted when switching tabs */
  keepMounted?: boolean;
}

/**
 * WidgetSlot renders all widgets assigned to a specific slot as tabs.
 *
 * - Uses secondary variant tabs by default (transparent background, bottom border indicators)
 * - Always shows tabs even when there's only 1 widget
 * - Returns null when slot has zero widgets (Dock will hide the slot)
 * - Respects widget placement constraints (pinned widgets cannot be closed)
 */
export function WidgetSlot({
  slotId,
  className,
  variant = "secondary",
  keepMounted = false,
}: WidgetSlotProps) {
  const widgetIds = useWidgetsForSlot(slotId);

  // Convert widget IDs to TabItems
  const tabs = useMemo(() => {
    const result: TabItem[] = [];

    for (const widgetId of widgetIds) {
      const definition = widgetRegistry.get(widgetId);
      if (!definition) {
        console.warn(`Widget "${widgetId}" not found in registry`);
        continue;
      }

      const Component = definition.component;

      // Pinned widgets are never closable, regardless of the closable property
      const isPinned = definition.placement?.pinned ?? false;
      const isClosable = isPinned ? false : (definition.closable ?? false);

      result.push({
        id: widgetId,
        label: definition.label,
        icon: definition.icon,
        closable: isClosable,
        content: <Component widgetId={widgetId} slotId={slotId} />,
      });
    }

    return result;
  }, [widgetIds, slotId]);

  // Return null for empty slots - Dock will hide the slot
  if (tabs.length === 0) {
    return null;
  }

  return (
    <Tabs
      tabs={tabs}
      variant={variant}
      className={className}
      keepMounted={keepMounted}
    />
  );
}
