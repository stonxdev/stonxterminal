// =============================================================================
// TOGGLE LAYER VISIBILITY COMMAND
// =============================================================================

import { ToggleLeft } from "lucide-react";
import { useLayerStore } from "../../layers/layer-store";
import { createCommand } from "../createCommand";

export interface ToggleLayerVisibilityArgs {
  layerId: string;
}

export const layerToggleVisibility = createCommand<ToggleLayerVisibilityArgs>({
  id: "layer.toggleVisibility",
  name: "Toggle Layer Visibility",
  icon: ToggleLeft,
  execute: (_context, args) => {
    if (!args?.layerId) {
      console.warn("layer.toggleVisibility requires args: { layerId }");
      return;
    }

    useLayerStore.getState().toggleLayer(args.layerId);
  },
});
