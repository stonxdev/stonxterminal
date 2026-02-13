// =============================================================================
// DEFAULT PALETTE COLORS
// =============================================================================
// Derived from src/renderer/public/sprites/palette/palette.txt
// These are the 31 opaque colors in the universal sprite palette (transparent excluded).
// Each key is a camelCase name matching the palette.txt descriptive name.
// Values are canonical "#RRGGBB" hex strings.

import type { TerrainType } from "../world/types";
import type { PaletteColors } from "./theme";

/** Default palette colors keyed by descriptive name */
export const defaultPaletteColors: PaletteColors = {
  // Basics
  black: "#000000",
  // Grays
  charcoal: "#1a1a1a",
  darkGray: "#3a3a3a",
  gray: "#5c5c5c",
  mediumGray: "#7a7a7a",
  lightGray: "#a0a0a0",
  silver: "#d0d0d0",
  // Whites
  white: "#ffffff",
  // Browns
  darkBark: "#3d2e20",
  bark: "#5c4833",
  dirt: "#7a5a10",
  tan: "#9c7a1e",
  // Greens
  deepForest: "#003300",
  forest: "#006400",
  green: "#228b22",
  lime: "#32cd32",
  // Teals
  seaGreen: "#2e8b57",
  mediumSea: "#3cb371",
  // Blues
  deepOcean: "#0a2a4a",
  ocean: "#1e5090",
  water: "#4090d0",
  sky: "#80c0f0",
  // Warm
  crimson: "#aa2200",
  lava: "#ff4500",
  orange: "#ff8c00",
  gold: "#ffcc00",
  sand: "#d4b896",
  // Skin & Special
  lightSkin: "#f5deb3",
  mediumSkin: "#c19a6b",
  darkSkin: "#8b5a2b",
  olive: "#6b8e23",
};

/** Map from palette character code to descriptive name */
export const paletteCharToName: Record<string, string> = {
  "0": "black",
  "1": "charcoal",
  "2": "darkGray",
  "3": "gray",
  "4": "mediumGray",
  "5": "lightGray",
  "6": "silver",
  W: "white",
  A: "darkBark",
  B: "bark",
  C: "dirt",
  D: "tan",
  G: "deepForest",
  H: "forest",
  I: "green",
  J: "lime",
  K: "seaGreen",
  L: "mediumSea",
  M: "deepOcean",
  N: "ocean",
  O: "water",
  P: "sky",
  R: "crimson",
  S: "lava",
  T: "orange",
  U: "gold",
  V: "sand",
  X: "lightSkin",
  Y: "mediumSkin",
  Z: "darkSkin",
  Q: "olive",
};

/** Map from descriptive name to base hex (the color baked into PNGs) */
export const paletteNameToBaseHex: Record<keyof PaletteColors, string> =
  Object.fromEntries(
    Object.entries(defaultPaletteColors).map(([name, hex]) => [
      name,
      hex.toLowerCase(),
    ]),
  ) as Record<keyof PaletteColors, string>;

/** Map from terrain type to the palette color it should use on the minimap */
export const terrainToPaletteName: Record<TerrainType, keyof PaletteColors> = {
  soil: "dirt",
  sand: "sand",
  clay: "mediumSkin",
  gravel: "lightGray",
  rock: "mediumGray",
  granite: "gray",
  limestone: "silver",
  marble: "white",
  obsidian: "charcoal",
  water_shallow: "water",
  water_deep: "ocean",
  lava: "lava",
  void: "black",
};
