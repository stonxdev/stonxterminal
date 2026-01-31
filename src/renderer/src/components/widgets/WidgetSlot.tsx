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
}

/**
 * WidgetSlot renders all widgets assigned to a specific slot as tabs.
 *
 * - Uses secondary variant tabs (transparent background, bottom border indicators)
 * - Always shows tabs even when there's only 1 widget
 * - Returns null when slot has zero widgets (Dock will hide the slot)
 */
export function WidgetSlot({ slotId, className }: WidgetSlotProps) {
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

      result.push({
        id: widgetId,
        label: definition.label,
        icon: definition.icon,
        closable: definition.closable ?? false,
        content: <Component widgetId={widgetId} slotId={slotId} />,
      });
    }

    return result;
  }, [widgetIds, slotId]);

  // Return null for empty slots - Dock will hide the slot
  if (tabs.length === 0) {
    return null;
  }

  return <Tabs tabs={tabs} variant="secondary" className={className} />;
}
