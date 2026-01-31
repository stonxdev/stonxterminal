import { create } from "zustand";
import { DEFAULT_WIDGET_LAYOUT } from "./register-widgets";
import type { WidgetId, WidgetLayoutConfig, WidgetSlotId } from "./types";

// =============================================================================
// TYPES
// =============================================================================

interface WidgetLayoutState {
  /** Current slot assignments */
  layout: WidgetLayoutConfig;
}

interface WidgetLayoutActions {
  /** Add a widget to a slot */
  addWidgetToSlot: (widgetId: WidgetId, slotId: WidgetSlotId) => void;
  /** Remove a widget from its current slot */
  removeWidgetFromSlot: (widgetId: WidgetId) => void;
  /** Move a widget to a different slot */
  moveWidgetToSlot: (widgetId: WidgetId, newSlotId: WidgetSlotId) => void;
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
  layout: DEFAULT_WIDGET_LAYOUT,

  addWidgetToSlot: (widgetId, slotId) => {
    set((state) => {
      // Remove from any existing slot first
      const newSlots = { ...state.layout.slots };
      for (const slot of Object.keys(newSlots) as WidgetSlotId[]) {
        newSlots[slot] = newSlots[slot].filter((id) => id !== widgetId);
      }
      // Add to new slot
      newSlots[slotId] = [...newSlots[slotId], widgetId];
      return { layout: { slots: newSlots } };
    });
  },

  removeWidgetFromSlot: (widgetId) => {
    set((state) => {
      const newSlots = { ...state.layout.slots };
      for (const slot of Object.keys(newSlots) as WidgetSlotId[]) {
        newSlots[slot] = newSlots[slot].filter((id) => id !== widgetId);
      }
      return { layout: { slots: newSlots } };
    });
  },

  moveWidgetToSlot: (widgetId, newSlotId) => {
    get().addWidgetToSlot(widgetId, newSlotId);
  },

  reorderWidgetsInSlot: (slotId, widgetIds) => {
    set((state) => ({
      layout: {
        slots: {
          ...state.layout.slots,
          [slotId]: widgetIds,
        },
      },
    }));
  },

  resetToDefaults: () => {
    set({ layout: DEFAULT_WIDGET_LAYOUT });
  },
}));

// =============================================================================
// SELECTOR HOOKS
// =============================================================================

/**
 * Get widget IDs for a specific slot.
 */
export const useWidgetsForSlot = (slotId: WidgetSlotId): WidgetId[] => {
  return useWidgetLayoutStore((state) => state.layout.slots[slotId]);
};

/**
 * Check if a slot is empty.
 */
export const useIsSlotEmpty = (slotId: WidgetSlotId): boolean => {
  return useWidgetLayoutStore(
    (state) => state.layout.slots[slotId].length === 0,
  );
};
