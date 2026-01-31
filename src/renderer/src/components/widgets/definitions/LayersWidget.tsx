import { Layers } from "lucide-react";
import { useCallback, useMemo } from "react";
import type { LayerRow } from "../../../layers";
import { layerRegistry, useLayerStore } from "../../../layers";
import { type Column, DataGrid, SelectColumn } from "../../data-grid";
import type { WidgetComponentProps, WidgetDefinition } from "../types";

// =============================================================================
// COLUMN DEFINITIONS
// =============================================================================

const columns: Column<LayerRow>[] = [
  SelectColumn,
  {
    key: "name",
    name: "Layer",
    width: 120,
  },
  {
    key: "category",
    name: "Category",
    width: 90,
    renderCell: ({ row }) => (
      <span className="capitalize text-xs opacity-60">{row.category}</span>
    ),
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

function LayersWidget(_props: WidgetComponentProps) {
  const visibility = useLayerStore((state) => state.visibility);
  const setLayerVisible = useLayerStore((state) => state.setLayerVisible);

  // Transform layer definitions to row format
  const rows: LayerRow[] = useMemo(() => {
    return layerRegistry.getAll().map((layer) => ({
      id: layer.id,
      name: layer.name,
      category: layer.category,
      type: layer.type,
      enabled: visibility.get(layer.id) ?? layer.defaultEnabled,
    }));
  }, [visibility]);

  // Selected rows (enabled layers)
  const selectedRows = useMemo(() => {
    const selected = new Set<string>();
    for (const [id, visible] of visibility) {
      if (visible) selected.add(id);
    }
    return selected;
  }, [visibility]);

  // Handle selection change
  const handleSelectedRowsChange = useCallback(
    (newSelected: Set<string>) => {
      // Determine what changed
      for (const row of rows) {
        const wasSelected = selectedRows.has(row.id);
        const isSelected = newSelected.has(row.id);
        if (wasSelected !== isSelected) {
          setLayerVisible(row.id, isSelected);
        }
      }
    },
    [rows, selectedRows, setLayerVisible],
  );

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={(row) => row.id}
      selectedRows={selectedRows}
      onSelectedRowsChange={handleSelectedRowsChange}
      rowHeight={28}
      headerRowHeight={32}
    />
  );
}

// =============================================================================
// WIDGET DEFINITION
// =============================================================================

export const layersWidget: WidgetDefinition = {
  id: "layers",
  label: "Layers",
  icon: Layers,
  component: LayersWidget,
  closable: false,
};
