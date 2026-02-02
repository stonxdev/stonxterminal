import { Layers } from "lucide-react";
import { useCallback, useMemo } from "react";
import { layerRegistry, useLayerStore } from "../../../layers";
import { layerSchema } from "../../../schemas";
import { EntityListWidget } from "../EntityListWidget";
import type { WidgetComponentProps, WidgetDefinition } from "../types";

function LayersWidget(_props: WidgetComponentProps) {
  const visibility = useLayerStore((state) => state.visibility);
  const setLayerVisible = useLayerStore((state) => state.setLayerVisible);

  // Transform layer definitions to row format
  const data = useMemo(() => {
    return layerRegistry.getAll().map((layer) => ({
      id: layer.id,
      name: layer.name,
      category: layer.category,
      visible: visibility.get(layer.id) ?? layer.defaultEnabled,
    }));
  }, [visibility]);

  // Selected rows = visible layers (checkbox checked = layer visible)
  const visibleLayerIds = useMemo(() => {
    const ids = new Set<string>();
    for (const layer of layerRegistry.getAll()) {
      const isVisible = visibility.get(layer.id) ?? layer.defaultEnabled;
      if (isVisible) {
        ids.add(layer.id);
      }
    }
    return ids;
  }, [visibility]);

  // Handle checkbox changes → update layer visibility
  const handleSelectionChange = useCallback(
    (newSelected: Set<string>) => {
      for (const layer of layerRegistry.getAll()) {
        const shouldBeVisible = newSelected.has(layer.id);
        const currentlyVisible =
          visibility.get(layer.id) ?? layer.defaultEnabled;
        if (shouldBeVisible !== currentlyVisible) {
          setLayerVisible(layer.id, shouldBeVisible);
        }
      }
    },
    [visibility, setLayerVisible],
  );

  return (
    <EntityListWidget
      config={{
        schema: layerSchema,
        entityType: "layer",
        getRowKey: (row) => row.id as string,
        visibleColumns: ["name", "category"],
        searchFields: ["name", "category"],
        searchPlaceholder: "Search layers...",
        showCheckboxSelection: true,
        selectedRows: visibleLayerIds,
        onSelectedRowsChange: handleSelectionChange,
        multiSelect: false,
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
