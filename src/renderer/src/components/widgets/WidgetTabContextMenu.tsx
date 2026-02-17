import { commandRegistry } from "@renderer/commands";
import { ArrowRightFromLine, Maximize2, X } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../dropdown-menu";
import { SLOT_LABELS } from "./slot-labels";
import type { WidgetId, WidgetSlotId } from "./types";
import { MAIN_SLOTS, SIDEBAR_SLOTS } from "./types";
import {
  canMoveWidgetToSlot,
  canRemoveWidget,
  useWidgetLayoutStore,
} from "./widget-layout-store";
import { widgetRegistry } from "./widget-registry";

interface WidgetTabContextMenuProps {
  widgetId: WidgetId;
  currentSlotId: WidgetSlotId;
}

export function WidgetTabContextMenu({
  widgetId,
  currentSlotId,
}: WidgetTabContextMenuProps) {
  const moveWidgetToSlot = useWidgetLayoutStore((s) => s.moveWidgetToSlot);
  const removeWidgetFromSlot = useWidgetLayoutStore(
    (s) => s.removeWidgetFromSlot,
  );
  const definition = widgetRegistry.get(widgetId);

  if (!definition) return null;

  const isPinned = definition.placement?.pinned ?? false;
  const isWide = definition.size === "wide";
  const canRemove = canRemoveWidget(widgetId);

  const allSlots: WidgetSlotId[] = [...SIDEBAR_SLOTS, ...MAIN_SLOTS];
  const moveTargets = allSlots
    .filter((s) => s !== currentSlotId)
    .map((slotId) => ({
      slotId,
      label: SLOT_LABELS[slotId],
      enabled: canMoveWidgetToSlot(widgetId, slotId),
    }));

  const hasAnyMoveTarget = moveTargets.some((t) => t.enabled);

  return (
    <>
      {!isPinned && hasAnyMoveTarget && (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowRightFromLine className="h-4 w-4" />
            Move to Panel
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {moveTargets.map(({ slotId, label, enabled }) => (
              <DropdownMenuItem
                key={slotId}
                disabled={!enabled}
                onClick={() => moveWidgetToSlot(widgetId, slotId)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )}

      {!isWide && (
        <DropdownMenuItem
          onClick={() =>
            commandRegistry.dispatch("widget.openInModal", { widgetId })
          }
        >
          <Maximize2 className="h-4 w-4" />
          Open in Modal
        </DropdownMenuItem>
      )}

      {canRemove && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => removeWidgetFromSlot(widgetId)}
          >
            <X className="h-4 w-4" />
            Remove from Panel
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
