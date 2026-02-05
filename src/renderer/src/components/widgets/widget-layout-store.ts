import { useConfigStore, type WidgetLayoutConfigValue } from "@renderer/config";
import { create } from "zustand";
import type { WidgetId, WidgetLayoutConfig, WidgetSlotId } from "./types";
import { MAIN_SLOTS } from "./types";
import { widgetRegistry } from "./widget-registry";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a widget can be added to a specific slot.
 * Returns false if the widget has size/allowedSlots constraints that don't include the target slot.
 */
export function canAddWidgetToSlot(
  widgetId: WidgetId,
  slotId: WidgetSlotId,
): boolean {
  const definition = widgetRegistry.get(widgetId);
  if (!definition) return false;

  // Wide widgets can only go in main slots
  if (definition.size === "wide" && !MAIN_SLOTS.includes(slotId)) {
    return false;
  }

  // Check allowedSlots constraint
  if (definition.placement?.allowedSlots) {
    return definition.placement.allowedSlots.includes(slotId);
  }

  return true;
}

/**
 * Check if a widget can be removed from its slot.
 * Returns false if the widget is pinned.
 */
export function canRemoveWidget(widgetId: WidgetId): boolean {
  const definition = widgetRegistry.get(widgetId);
  if (!definition) return true;

  return !definition.placement?.pinned;
}

/**
 * Check if a widget can be moved to a different slot.
 * Returns false if the widget is pinned or if the target slot is not allowed.
 */
export function canMoveWidgetToSlot(
  widgetId: WidgetId,
  newSlotId: WidgetSlotId,
): boolean {
  return canRemoveWidget(widgetId) && canAddWidgetToSlot(widgetId, newSlotId);
}

// =============================================================================
// CONFIG INTEGRATION
// =============================================================================

/**
 * Ensure pinned widgets are always present in their default slots.
 * If a pinned widget is missing from the layout, it gets added back to its default slot.
 */
function ensurePinnedWidgets(
  slots: WidgetLayoutConfigValue,
): WidgetLayoutConfigValue {
  const allWidgets = widgetRegistry.getAll();
  let modified = false;
  const result = { ...slots };

  for (const widget of allWidgets) {
    if (widget.placement?.pinned && widget.defaultSlot) {
      const slotWidgets = result[widget.defaultSlot] ?? [];
      if (!slotWidgets.includes(widget.id)) {
        result[widget.defaultSlot] = [widget.id, ...slotWidgets];
        modified = true;
      }
    }
  }

  return modified ? result : slots;
}

/**
 * Get the initial layout from config store.
 */
function getInitialLayout(): WidgetLayoutConfig {
  const slots = useConfigStore.getState().computed[
    "layout.widgets"
  ] as WidgetLayoutConfigValue;
  return { slots: ensurePinnedWidgets(slots) };
}

/**
 * Persist layout to config store.
 */
function persistLayout(slots: WidgetLayoutConfigValue): void {
  useConfigStore.getState().set("layout.widgets", slots);
}

// =============================================================================
// TYPES
// =============================================================================

interface WidgetLayoutState {
  /** Current slot assignments */
  layout: WidgetLayoutConfig;
}

interface WidgetLayoutActions {
  /** Add a widget to a slot. Returns false if placement constraints prevent it. */
  addWidgetToSlot: (widgetId: WidgetId, slotId: WidgetSlotId) => boolean;
  /** Remove a widget from its current slot. Returns false if widget is pinned. */
  removeWidgetFromSlot: (widgetId: WidgetId) => boolean;
  /** Move a widget to a different slot. Returns false if constraints prevent it. */
  moveWidgetToSlot: (widgetId: WidgetId, newSlotId: WidgetSlotId) => boolean;
  /** Reorder widgets within a slot */
  reorderWidgetsInSlot: (slotId: WidgetSlotId, widgetIds: WidgetId[]) => void;
  /** Reset to default layout */
  resetToDefaults: () => void;
}

type WidgetLayoutStore = WidgetLayoutState & WidgetLayoutActions;

// =============================================================================
// STORE
// =============================================================================

export const useWidgetLayoutStore = create<WidgetLayoutStore>()((set, get) => ({
  layout: getInitialLayout(),

  addWidgetToSlot: (widgetId, slotId) => {
    // Check if widget can be added to this slot
    if (!canAddWidgetToSlot(widgetId, slotId)) {
      console.warn(
        `Widget "${widgetId}" cannot be added to slot "${slotId}" due to placement constraints`,
      );
      return false;
    }

    // Check if widget is pinned (pinned widgets can't be moved from their default slot)
    const definition = widgetRegistry.get(widgetId);
    if (definition?.placement?.pinned) {
      // Pinned widgets can only be added to their default slot
      if (definition.defaultSlot && definition.defaultSlot !== slotId) {
        console.warn(
          `Pinned widget "${widgetId}" can only be in slot "${definition.defaultSlot}"`,
        );
        return false;
      }
    }

    set((state) => {
      // Remove from any existing slot first (only if not pinned)
      const newSlots = { ...state.layout.slots };
      if (!definition?.placement?.pinned) {
        for (const slot of Object.keys(newSlots) as WidgetSlotId[]) {
          newSlots[slot] = (newSlots[slot] ?? []).filter(
            (id) => id !== widgetId,
          );
        }
      }
      // Add to new slot if not already there
      const currentSlot = newSlots[slotId] ?? [];
      if (!currentSlot.includes(widgetId)) {
        newSlots[slotId] = [...currentSlot, widgetId];
      }
      persistLayout(newSlots);
      return { layout: { slots: newSlots } };
    });
    return true;
  },

  removeWidgetFromSlot: (widgetId) => {
    // Check if widget can be removed
    if (!canRemoveWidget(widgetId)) {
      console.warn(
        `Widget "${widgetId}" cannot be removed because it is pinned`,
      );
      return false;
    }

    set((state) => {
      const newSlots = { ...state.layout.slots };
      for (const slot of Object.keys(newSlots) as WidgetSlotId[]) {
        newSlots[slot] = (newSlots[slot] ?? []).filter((id) => id !== widgetId);
      }
      persistLayout(newSlots);
      return { layout: { slots: newSlots } };
    });
    return true;
  },

  moveWidgetToSlot: (widgetId, newSlotId) => {
    // Check if widget can be moved
    if (!canMoveWidgetToSlot(widgetId, newSlotId)) {
      console.warn(
        `Widget "${widgetId}" cannot be moved to slot "${newSlotId}" due to placement constraints`,
      );
      return false;
    }

    return get().addWidgetToSlot(widgetId, newSlotId);
  },

  reorderWidgetsInSlot: (slotId, widgetIds) => {
    set((state) => {
      const newSlots = {
        ...state.layout.slots,
        [slotId]: widgetIds,
      };
      persistLayout(newSlots);
      return { layout: { slots: newSlots } };
    });
  },

  resetToDefaults: () => {
    // Remove the override to revert to defaults
    useConfigStore.getState().remove("layout.widgets");
    const defaultSlots = useConfigStore.getState().computed[
      "layout.widgets"
    ] as WidgetLayoutConfigValue;
    set({ layout: { slots: defaultSlots } });
  },
}));

// =============================================================================
// SELECTOR HOOKS
// =============================================================================

/**
 * Get widget IDs for a specific slot.
 */
export const useWidgetsForSlot = (slotId: WidgetSlotId): WidgetId[] => {
  return useWidgetLayoutStore((state) => state.layout.slots[slotId] ?? []);
};

/**
 * Check if a slot is empty.
 */
export const useIsSlotEmpty = (slotId: WidgetSlotId): boolean => {
  return useWidgetLayoutStore(
    (state) => (state.layout.slots[slotId]?.length ?? 0) === 0,
  );
};

// =============================================================================
// CONFIG SYNC
// =============================================================================

/**
 * Subscribe to config changes to sync external updates (e.g., from SettingsWidget).
 * This runs once when the module is loaded.
 */
let lastConfigLayout: WidgetLayoutConfigValue | null = null;
useConfigStore.subscribe((state) => {
  const configLayout = state.computed[
    "layout.widgets"
  ] as WidgetLayoutConfigValue;
  // Only update if config actually changed (avoid infinite loops)
  if (configLayout && configLayout !== lastConfigLayout) {
    const layoutWithPinned = ensurePinnedWidgets(configLayout);
    const currentLayout = useWidgetLayoutStore.getState().layout.slots;
    // Deep compare to avoid unnecessary updates
    if (JSON.stringify(layoutWithPinned) !== JSON.stringify(currentLayout)) {
      lastConfigLayout = configLayout;
      useWidgetLayoutStore.setState({ layout: { slots: layoutWithPinned } });
    }
  }
});
