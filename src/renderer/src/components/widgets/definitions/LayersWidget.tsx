import { Layers } from "lucide-react";
import { useMemo } from "react";
import { layerRegistry, useLayerStore } from "../../../layers";
import { layerSchema } from "../../../schemas";
import { EntityListWidget } from "../EntityListWidget";
import type { WidgetComponentProps, WidgetDefinition } from "../types";

function LayersWidget(_props: WidgetComponentProps) {
  const visibility = useLayerStore((state) => state.visibility);

  // Transform layer definitions to row format
  const data = useMemo(() => {
    return layerRegistry.getAll().map((layer) => ({
      id: layer.id,
      name: layer.name,
      category: layer.category,
      visible: visibility.get(layer.id) ?? layer.defaultEnabled,
    }));
  }, [visibility]);

  return (
    <EntityListWidget
      config={{
        schema: layerSchema,
        entityType: "layer",
        getRowKey: (row) => row.id as string,
        visibleColumns: ["name", "category"],
        searchFields: ["name", "category"],
        searchPlaceholder: "Search layers...",
        multiSelect: false, // Layers use toggle actions, not selection
      }}
      data={data}
    />
  );
}

export const layersWidget: WidgetDefinition = {
  id: "layers",
  label: "Layers",
  icon: Layers,
  component: LayersWidget,
  closable: false,
};
