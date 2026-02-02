// =============================================================================
// SET LAYER VISIBILITY COMMAND
// =============================================================================

import { Eye } from "lucide-react";
import { useLayerStore } from "../../layers/layer-store";
import { createCommand } from "../createCommand";

export interface SetLayerVisibilityArgs {
  layerId: string;
  visible: boolean;
}

export const layerSetVisibility = createCommand<SetLayerVisibilityArgs>({
  id: "layer.setVisibility",
  name: "Set Layer Visibility",
  icon: Eye,
  execute: (_context, args) => {
    if (!args?.layerId || args?.visible === undefined) {
      console.warn("layer.setVisibility requires args: { layerId, visible }");
      return;
    }

    useLayerStore.getState().setLayerVisible(args.layerId, args.visible);
  },
});
