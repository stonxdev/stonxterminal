// =============================================================================
// DEFAULT GAME COLORS
// =============================================================================
// All in-game colors collected from their original hardcoded locations.
// Every value is a "#RRGGBB" hex string — the canonical format.
// All three themes import this as their base and can override specific sections.

import { defaultPaletteColors } from "./default-palette-colors";
import type { GameColors } from "./theme";

export const defaultGameColors: GameColors = {
  // ---------------------------------------------------------------------------
  // World renderer (from World.tsx)
  // ---------------------------------------------------------------------------
  world: {
    background: "#1a1a2e",
    gridLine: "#333333",
    worldBoundary: "#ffff00",
    infoText: "#ffffff",
    itemFallbackDot: "#ffd700",
  },

  // ---------------------------------------------------------------------------
  // Selection & hover (from World.tsx)
  // ---------------------------------------------------------------------------
  selection: {
    highlight: "#00ffff",
    hoverFill: "#ffffff",
    pathLine: "#00ffff",
  },

  // ---------------------------------------------------------------------------
  // Characters (from GameScreen.tsx)
  // ---------------------------------------------------------------------------
  characters: {
    colonistPalette: ["#4a90d9", "#d94a4a", "#4ad94a"],
    colonistFallback: "#888888",
    minimapDot: "#ff4444",
  },

  // ---------------------------------------------------------------------------
  // Job indicators (from CharacterRenderer.ts)
  // ---------------------------------------------------------------------------
  jobs: {
    chop: "#8b4513",
    mine: "#808080",
    move: "#4a90d9",
    defaultJob: "#ffa500",
    indicatorBorder: "#000000",
  },

  // ---------------------------------------------------------------------------
  // Progress bar (from JobProgressRenderer.ts)
  // ---------------------------------------------------------------------------
  progressBar: {
    background: "#222222",
    fill: "#44cc44",
    border: "#000000",
  },

  // ---------------------------------------------------------------------------
  // Structures (from World.tsx STRUCTURE_COLORS)
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
  // Terrain (from MiniMapWidget.tsx TERRAIN_COLORS, RGBA → hex)
  // ---------------------------------------------------------------------------
  terrain: {
    soil: "#8b7755",
    sand: "#d2be8c",
    clay: "#b4825a",
    gravel: "#a0a09b",
    rock: "#808080",
    granite: "#646469",
    limestone: "#b4b4aa",
    marble: "#dcdce1",
    obsidian: "#1e1e23",
    water_shallow: "#4696c8",
    water_deep: "#143c96",
    lava: "#e63c14",
    void: "#000000",
  },

  // ---------------------------------------------------------------------------
  // Minimap (from MiniMapWidget.tsx)
  // ---------------------------------------------------------------------------
  minimap: {
    background: "#1a1a2e",
    viewportRect: "#ffffff",
  },

  // ---------------------------------------------------------------------------
  // Heatmap color scales (from color-scales.ts)
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
  palette: defaultPaletteColors,
};
