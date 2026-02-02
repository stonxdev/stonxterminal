// =============================================================================
// TOGGLE LAYER VISIBILITY ACTION
// =============================================================================

import { ToggleLeft } from "lucide-react";
import { useLayerStore } from "../../layers/layer-store";
import { defineAction } from "../defineAction";

export interface ToggleLayerVisibilityPayload {
  layerId: string;
}

export const layerToggleVisibility = defineAction<ToggleLayerVisibilityPayload>(
  {
    id: "layer.toggleVisibility",
    name: "Toggle Layer Visibility",
    icon: ToggleLeft,
    execute: (_context, payload) => {
      if (!payload?.layerId) {
        console.warn("layer.toggleVisibility requires payload: { layerId }");
        return;
      }

      useLayerStore.getState().toggleLayer(payload.layerId);
    },
  },
);
