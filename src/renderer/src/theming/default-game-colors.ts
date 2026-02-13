// =============================================================================
// DEFAULT GAME COLORS
// =============================================================================
// All in-game colors collected from their original hardcoded locations.
// Every value is a "#RRGGBB" hex string — the canonical format.
// All three themes import this as their base and can override specific sections.

import type { TerrainType } from "../world/types";
import type { GameColors, PaletteColors } from "./theme";

export const defaultGameColors: GameColors = {
  // ---------------------------------------------------------------------------
  // World renderer
  // ---------------------------------------------------------------------------
  world: {
    background: "#1a1a2e",
    gridLine: "#333333",
    worldBoundary: "#ffff00",
    infoText: "#ffffff",
    itemFallbackDot: "#ffd700",
  },

  // ---------------------------------------------------------------------------
  // Selection & hover
  // ---------------------------------------------------------------------------
  selection: {
    highlight: "#00ffff",
    hoverFill: "#ffffff",
    pathLine: "#00ffff",
  },

  // ---------------------------------------------------------------------------
  // Characters
  // ---------------------------------------------------------------------------
  characters: {
    colonistPalette: ["#4a90d9", "#d94a4a", "#4ad94a"],
    colonistFallback: "#888888",
    minimapDot: "#ff4444",
  },

  // ---------------------------------------------------------------------------
  // Job indicators
  // ---------------------------------------------------------------------------
  jobs: {
    chop: "#8b4513",
    mine: "#808080",
    move: "#4a90d9",
    defaultJob: "#ffa500",
    indicatorBorder: "#000000",
  },

  // ---------------------------------------------------------------------------
  // Progress bar
  // ---------------------------------------------------------------------------
  progressBar: {
    background: "#222222",
    fill: "#44cc44",
    border: "#000000",
  },

  // ---------------------------------------------------------------------------
  // Structures
  // ---------------------------------------------------------------------------
  structures: {
    none: "#000000",
    wall_stone: "#505050",
    wall_wood: "#8b4513",
    wall_metal: "#b8b8b8",
    wall_brick: "#b22222",
    door_wood: "#cd853f",
    door_metal: "#a0a0a0",
    door_auto: "#90ee90",
    bed: "#8b0000",
    chair: "#daa520",
    table: "#d2691e",
    workbench: "#808000",
    chest: "#654321",
    shelf: "#bc8f8f",
    stockpile_zone: "#000000",
    tree_oak: "#228b22",
    tree_pine: "#006400",
    bush: "#32cd32",
    boulder: "#5a5a5a",
  },

  // ---------------------------------------------------------------------------
  // Minimap
  // ---------------------------------------------------------------------------
  minimap: {
    background: "#1a1a2e",
    viewportRect: "#ffffff",
  },

  // ---------------------------------------------------------------------------
  // Heatmap color scales
  // ---------------------------------------------------------------------------
  heatmaps: {
    temperature: {
      type: "diverging",
      midpoint: 0.5,
      stops: [
        { value: 0.0, color: "#0000ff" },
        { value: 0.25, color: "#00ffff" },
        { value: 0.5, color: "#ffff00" },
        { value: 0.75, color: "#ff8800" },
        { value: 1.0, color: "#ff0000" },
      ],
    },
    moisture: {
      type: "gradient",
      stops: [
        { value: 0.0, color: "#8b4513" },
        { value: 0.25, color: "#daa520" },
        { value: 0.5, color: "#9acd32" },
        { value: 0.75, color: "#228b22" },
        { value: 1.0, color: "#1e90ff" },
      ],
    },
    movementCost: {
      type: "gradient",
      stops: [
        { value: 0.0, color: "#00ff00" },
        { value: 0.25, color: "#ffff00" },
        { value: 0.5, color: "#ff8800" },
        { value: 0.75, color: "#ff0000" },
        { value: 1.0, color: "#000000" },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Sprite palette (from palette.txt)
  // ---------------------------------------------------------------------------
  palette: {
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
  },
};

// =============================================================================
// DERIVED PALETTE HELPERS
// =============================================================================

/** Map from palette name to the base hex baked into sprite PNGs */
export const paletteNameToBaseHex: Record<keyof PaletteColors, string> =
  Object.fromEntries(
    Object.entries(defaultGameColors.palette).map(([name, hex]) => [
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
