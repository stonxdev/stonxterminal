import { Logs } from "@renderer/components/layout/widgets/Logs/Logs";
import { WorldMap } from "@renderer/components/layout/widgets/WorldMap/WorldMap";
import React from "react";

export type WidgetDefinition = {
  label: string;
  reactComponent: React.FC;
};

export type WidgetId = "world-map" | "logs";

export const widgetMap: Record<WidgetId, WidgetDefinition> = {
  "world-map": {
    label: "World Map",
    reactComponent: WorldMap,
  },
  logs: {
    label: "Logs",
    reactComponent: Logs,
  },
};
