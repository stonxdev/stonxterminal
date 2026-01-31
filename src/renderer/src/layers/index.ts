// Types

// Color scales
export {
  getColorFromScale,
  lerpColor,
  MOISTURE_SCALE,
  MOVEMENT_COST_SCALE,
  normalizeValue,
  TEMPERATURE_SCALE,
} from "./color-scales";
// Layer definitions
export {
  charactersLayer,
  itemsLayer,
  moistureLayer,
  movementCostLayer,
  registerBuiltInLayers,
  structuresLayer,
  temperatureLayer,
  treesLayer,
} from "./layer-definitions";

// Registry
export { layerRegistry } from "./layer-registry";

// Store
export {
  useEnabledLayers,
  useLayerStore,
  useLayerVisibility,
  useLayerVisibilityMap,
} from "./layer-store";
export type {
  ColorScale,
  ColorScaleType,
  ColorStop,
  FeatureLayerDefinition,
  HeatMapLayerDefinition,
  LayerCategory,
  LayerDefinition,
  LayerRow,
  LayerType,
  LayerVisibilityMap,
} from "./types";
