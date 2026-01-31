import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WidgetId, WidgetLayoutConfig, WidgetSlotId } from "./types";
import { widgetRegistry } from "./widget-registry";

// =============================================================================
// TYPES
// =============================================================================

interface WidgetLayoutState {
  /** Current slot assignments */
  layout: WidgetLayoutConfig;
  /** Whether the store has been initialized */
  isInitialized: boolean;
}

interface WidgetLayoutActions {
  /** Initialize layout from registry defaults */
  initializeFromDefaults: () => void;
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
// INITIAL STATE
// =============================================================================

const INITIAL_LAYOUT: WidgetLayoutConfig = {
  slots: {
    "left-top": [],
    "left-bottom": [],
    "center-bottom": [],
    "right-top": [],
    "right-bottom": [],
  },
};

// =============================================================================
// STORE
// =============================================================================

export const useWidgetLayoutStore = create<WidgetLayoutStore>()(
  persist(
    (set, get) => ({
      layout: INITIAL_LAYOUT,
      isInitialized: false,

      initializeFromDefaults: () => {
        const { isInitialized, layout } = get();

        // If already initialized and has persisted data, don't overwrite
        if (isInitialized) return;

        // Check if we have persisted data (any slot has widgets)
        const hasPersistedData = Object.values(layout.slots).some(
          (widgets) => widgets.length > 0,
        );

        if (hasPersistedData) {
          // Just mark as initialized, keep persisted layout
          set({ isInitialized: true });
          return;
        }

        // Build default layout from widget definitions
        const allWidgets = widgetRegistry.getAll();
        const newLayout: WidgetLayoutConfig = {
          slots: {
            "left-top": [],
            "left-bottom": [],
            "center-bottom": [],
            "right-top": [],
            "right-bottom": [],
          },
        };

        // Assign widgets to their default slots
        for (const widget of allWidgets) {
          newLayout.slots[widget.defaultSlot].push(widget.id);
        }

        set({ layout: newLayout, isInitialized: true });
      },

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
        set({ layout: INITIAL_LAYOUT, isInitialized: false });
        get().initializeFromDefaults();
      },
    }),
    {
      name: "widget-layout-storage",
      // Only persist the layout, not the isInitialized flag
      partialize: (state) => ({ layout: state.layout }),
    },
  ),
);

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
