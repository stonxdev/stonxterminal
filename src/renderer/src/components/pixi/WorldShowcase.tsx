import { SimpleViewport } from "@renderer/lib/viewport-simple";
import type {
  StructureType,
  TerrainType,
  World,
  ZLevel,
} from "@renderer/world/types";
import { Application, Container, Graphics, Text } from "pixi.js";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "pixi.js/unsafe-eval";
import { useGameStore } from "@renderer/game-state";
import { usePixiInteraction } from "@renderer/interaction";
import type { Position2D } from "@renderer/world/types";

// =============================================================================
// CONFIGURATION
// =============================================================================

export const CELL_SIZE = 32; // Pixels per cell - exported for interaction system

// =============================================================================
// COLOR MAPPINGS
// =============================================================================

/** Colors for terrain types */
const TERRAIN_COLORS: Record<TerrainType, number> = {
  soil: 0x8b6914,
  sand: 0xc2b280,
  clay: 0xa0522d,
  gravel: 0x808080,
  rock: 0x696969,
  granite: 0x4a4a4a,
  limestone: 0xd3d3d3,
  marble: 0xf5f5f5,
  obsidian: 0x1a1a1a,
  water_shallow: 0x4a90d9,
  water_deep: 0x1e3a5f,
  lava: 0xff4500,
  void: 0x000000,
};

/** Colors for structure types */
const STRUCTURE_COLORS: Record<StructureType, number> = {
  none: 0x000000,
  wall_stone: 0x505050,
  wall_wood: 0x8b4513,
  wall_metal: 0xb8b8b8,
  wall_brick: 0xb22222,
  door_wood: 0xcd853f,
  door_metal: 0xa0a0a0,
  door_auto: 0x90ee90,
  bed: 0x8b0000,
  chair: 0xdaa520,
  table: 0xd2691e,
  workbench: 0x808000,
  chest: 0x654321,
  shelf: 0xbc8f8f,
  stockpile_zone: 0x00000000,
  tree_oak: 0x228b22,
  tree_pine: 0x006400,
  bush: 0x32cd32,
  boulder: 0x5a5a5a,
};

// =============================================================================
// COMPONENT
// =============================================================================

interface WorldShowcaseProps {
  /** World to display */
  world: World;
  /** Current z-level to display */
  zLevel: number;
}

const WorldShowcase: React.FC<WorldShowcaseProps> = ({ world, zLevel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<SimpleViewport | null>(null);
  const isInitializedRef = useRef(false);

  // Overlay graphics for selection and hover
  const selectionGraphicsRef = useRef<Graphics | null>(null);
  const hoverGraphicsRef = useRef<Graphics | null>(null);

  // Interaction container for click handling
  const [interactionContainer, setInteractionContainer] =
    useState<Container | null>(null);

  // Wire up interaction system
  usePixiInteraction({
    container: interactionContainer,
    world,
    zLevel,
    cellSize: CELL_SIZE,
  });

  const level = world.levels.get(zLevel);
  const worldPixelSize = (level?.width ?? 64) * CELL_SIZE;

  // Subscribe to selection and hover state changes
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      // Update selection overlay
      if (selectionGraphicsRef.current) {
        updateSelectionOverlay(
          selectionGraphicsRef.current,
          state.selection.type === "tile" ? state.selection.position : null,
          state.selection.type === "tile" ? state.selection.zLevel : null,
          zLevel,
        );
      }

      // Update hover overlay
      if (hoverGraphicsRef.current) {
        updateHoverOverlay(hoverGraphicsRef.current, state.hoverPosition);
      }
    });

    return unsubscribe;
  }, [zLevel]);

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    let isActive = true;

    const setup = async () => {
      const container = containerRef.current;
      if (!container || !level) return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const app = new Application();

      await app.init({
        width: rect.width,
        height: rect.height,
        backgroundColor: 0x1a1a2e,
        antialias: false, // Pixel-perfect for tiles
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: container,
      });

      if (!isActive) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      container.appendChild(app.canvas);
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.canvas.style.display = "block";

      appRef.current = app;
      isInitializedRef.current = true;

      // Create viewport
      const viewport = new SimpleViewport({
        screenWidth: rect.width,
        screenHeight: rect.height,
        minScale: 0.1,
        maxScale: 4,
        zoomSpeed: 0.1,
      });

      app.stage.addChild(viewport);
      viewportRef.current = viewport;
      viewport.attachWheelZoom(app.canvas);

      // Render the world
      renderWorld(viewport, level);

      // Create hover overlay (drawn first, below selection)
      const hoverGraphics = new Graphics();
      viewport.addChild(hoverGraphics);
      hoverGraphicsRef.current = hoverGraphics;

      // Create selection overlay (drawn on top of hover)
      const selectionGraphics = new Graphics();
      viewport.addChild(selectionGraphics);
      selectionGraphicsRef.current = selectionGraphics;

      // Create interaction layer (transparent, covers world area)
      const interactionLayer = new Container();
      interactionLayer.eventMode = "static";
      interactionLayer.hitArea = {
        contains: (x: number, y: number) => {
          return (
            x >= 0 &&
            x < level.width * CELL_SIZE &&
            y >= 0 &&
            y < level.height * CELL_SIZE
          );
        },
      };
      viewport.addChild(interactionLayer);
      setInteractionContainer(interactionLayer);

      // Center on the world
      viewport.panTo(worldPixelSize / 2, worldPixelSize / 2);

      // Handle resizes
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0 && viewportRef.current) {
            viewportRef.current.resize(width, height);
          }
        }
      });
      resizeObserver.observe(container);

      (
        app as Application & { _resizeObserver?: ResizeObserver }
      )._resizeObserver = resizeObserver;
    };

    setup();

    return () => {
      isActive = false;
      setInteractionContainer(null);
      selectionGraphicsRef.current = null;
      hoverGraphicsRef.current = null;
      if (appRef.current) {
        const app = appRef.current as Application & {
          _resizeObserver?: ResizeObserver;
        };
        app._resizeObserver?.disconnect();
      }
      if (viewportRef.current) {
        viewportRef.current.destroy();
        viewportRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [level, worldPixelSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "grab",
      }}
    />
  );
};

/** Render the world tiles to the viewport */
function renderWorld(viewport: SimpleViewport, level: ZLevel): void {
  const graphics = new Graphics();

  // Render tiles
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const tile = level.tiles[y * level.width + x];
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;

      // Draw terrain
      const terrainColor = TERRAIN_COLORS[tile.terrain.type];
      graphics.rect(px, py, CELL_SIZE, CELL_SIZE);
      graphics.fill(terrainColor);

      // Draw structure overlay if present
      if (tile.structure && tile.structure.type !== "none") {
        const structureColor = STRUCTURE_COLORS[tile.structure.type];

        // Different rendering for different structure types
        if (
          tile.structure.type === "tree_oak" ||
          tile.structure.type === "tree_pine"
        ) {
          // Draw tree as a circle
          graphics.circle(
            px + CELL_SIZE / 2,
            py + CELL_SIZE / 2,
            CELL_SIZE * 0.35,
          );
          graphics.fill(structureColor);
        } else if (tile.structure.type === "boulder") {
          // Draw boulder as a smaller rectangle
          const padding = CELL_SIZE * 0.15;
          graphics.rect(
            px + padding,
            py + padding,
            CELL_SIZE - padding * 2,
            CELL_SIZE - padding * 2,
          );
          graphics.fill(structureColor);
        } else if (tile.structure.type === "bush") {
          // Draw bush as a small circle
          graphics.circle(
            px + CELL_SIZE / 2,
            py + CELL_SIZE / 2,
            CELL_SIZE * 0.25,
          );
          graphics.fill(structureColor);
        } else {
          // Draw other structures as full tiles
          graphics.rect(px, py, CELL_SIZE, CELL_SIZE);
          graphics.fill(structureColor);
        }
      }

      // Draw item indicator if items present
      if (tile.items.length > 0) {
        graphics.circle(px + CELL_SIZE - 6, py + 6, 4);
        graphics.fill(0xffd700); // Gold dot for items
      }
    }
  }

  // Draw grid lines (subtle)
  graphics.setStrokeStyle({ width: 0.5, color: 0x333333, alpha: 0.3 });
  for (let x = 0; x <= level.width; x++) {
    graphics.moveTo(x * CELL_SIZE, 0);
    graphics.lineTo(x * CELL_SIZE, level.height * CELL_SIZE);
    graphics.stroke();
  }
  for (let y = 0; y <= level.height; y++) {
    graphics.moveTo(0, y * CELL_SIZE);
    graphics.lineTo(level.width * CELL_SIZE, y * CELL_SIZE);
    graphics.stroke();
  }

  // Draw world boundary
  graphics.rect(0, 0, level.width * CELL_SIZE, level.height * CELL_SIZE);
  graphics.stroke({ width: 2, color: 0xffff00 });

  viewport.addChild(graphics);

  // Add info label
  const label = new Text({
    text: `Z-Level: ${level.z} | ${level.width}x${level.height} | Biome: ${level.biome}`,
    style: {
      fontSize: 14,
      fill: 0xffffff,
      fontFamily: "monospace",
    },
  });
  label.x = 10;
  label.y = 10;
  viewport.addChild(label);
}

/**
 * Update the selection overlay graphics
 */
function updateSelectionOverlay(
  graphics: Graphics,
  position: Position2D | null,
  selectionZLevel: number | null,
  currentZLevel: number,
): void {
  graphics.clear();

  // Only show selection if on the same z-level
  if (!position || selectionZLevel !== currentZLevel) {
    return;
  }

  const px = position.x * CELL_SIZE;
  const py = position.y * CELL_SIZE;
  const padding = 2;

  // Draw selection border (bright cyan)
  graphics.rect(
    px + padding,
    py + padding,
    CELL_SIZE - padding * 2,
    CELL_SIZE - padding * 2,
  );
  graphics.stroke({ width: 3, color: 0x00ffff });

  // Draw corner accents
  const cornerSize = 8;

  // Top-left corner
  graphics.moveTo(px, py + cornerSize);
  graphics.lineTo(px, py);
  graphics.lineTo(px + cornerSize, py);
  graphics.stroke({ width: 2, color: 0x00ffff });

  // Top-right corner
  graphics.moveTo(px + CELL_SIZE - cornerSize, py);
  graphics.lineTo(px + CELL_SIZE, py);
  graphics.lineTo(px + CELL_SIZE, py + cornerSize);
  graphics.stroke({ width: 2, color: 0x00ffff });

  // Bottom-left corner
  graphics.moveTo(px, py + CELL_SIZE - cornerSize);
  graphics.lineTo(px, py + CELL_SIZE);
  graphics.lineTo(px + cornerSize, py + CELL_SIZE);
  graphics.stroke({ width: 2, color: 0x00ffff });

  // Bottom-right corner
  graphics.moveTo(px + CELL_SIZE - cornerSize, py + CELL_SIZE);
  graphics.lineTo(px + CELL_SIZE, py + CELL_SIZE);
  graphics.lineTo(px + CELL_SIZE, py + CELL_SIZE - cornerSize);
  graphics.stroke({ width: 2, color: 0x00ffff });
}

/**
 * Update the hover overlay graphics
 */
function updateHoverOverlay(
  graphics: Graphics,
  position: Position2D | null,
): void {
  graphics.clear();

  if (!position) {
    return;
  }

  const px = position.x * CELL_SIZE;
  const py = position.y * CELL_SIZE;

  // Draw semi-transparent hover highlight
  graphics.rect(px, py, CELL_SIZE, CELL_SIZE);
  graphics.fill({ color: 0xffffff, alpha: 0.15 });

  // Draw subtle border
  graphics.rect(px, py, CELL_SIZE, CELL_SIZE);
  graphics.stroke({ width: 1, color: 0xffffff, alpha: 0.4 });
}

export default WorldShowcase;
