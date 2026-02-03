import { commandRegistry } from "@renderer/commands";
import { SimpleViewport, viewportStore } from "@renderer/lib/viewport-simple";
import type {
  StructureType,
  TerrainType,
  World as WorldData,
  ZLevel,
} from "@renderer/world/types";
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  type Texture,
} from "pixi.js";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "pixi.js/unsafe-eval";
import { useGameStore } from "@renderer/game-state";
import { usePixiInteraction } from "@renderer/interaction";
import { useLayerStore } from "@renderer/layers";
import type { Position2D } from "@renderer/world/types";
import { CharacterRenderer, HeatMapRenderer, PathRenderer } from "./renderers";

// =============================================================================
// CONFIGURATION
// =============================================================================

export const CELL_SIZE = 32; // Pixels per cell - exported for interaction system

// =============================================================================
// TERRAIN SPRITES
// =============================================================================

/** Sprite paths for terrain types */
const TERRAIN_SPRITE_PATHS: Record<TerrainType, string> = {
  soil: "/sprites/terrain/soil/soil.png",
  sand: "/sprites/terrain/sand/sand.png",
  clay: "/sprites/terrain/clay/clay.png",
  gravel: "/sprites/terrain/gravel/gravel.png",
  rock: "/sprites/terrain/rock/rock.png",
  granite: "/sprites/terrain/granite/granite.png",
  limestone: "/sprites/terrain/limestone/limestone.png",
  marble: "/sprites/terrain/marble/marble.png",
  obsidian: "/sprites/terrain/obsidian/obsidian.png",
  water_shallow: "/sprites/terrain/water_shallow/water_shallow.png",
  water_deep: "/sprites/terrain/water_deep/water_deep.png",
  lava: "/sprites/terrain/lava/lava.png",
  void: "/sprites/terrain/void/void.png",
};

/** Cached terrain textures */
const terrainTextures: Map<TerrainType, Texture> = new Map();

/** Preload all terrain textures */
async function preloadTerrainTextures(): Promise<void> {
  if (terrainTextures.size > 0) return; // Already loaded

  const terrainTypes = Object.keys(TERRAIN_SPRITE_PATHS) as TerrainType[];

  for (const terrainType of terrainTypes) {
    try {
      const texture = await Assets.load<Texture>(
        TERRAIN_SPRITE_PATHS[terrainType],
      );
      texture.source.scaleMode = "nearest"; // Pixel-perfect scaling
      terrainTextures.set(terrainType, texture);
    } catch (error) {
      console.error(
        `[World] Failed to load terrain texture for ${terrainType}:`,
        error,
      );
    }
  }

  console.info(
    `[World] Loaded ${terrainTextures.size}/${terrainTypes.length} terrain textures`,
  );
}

// =============================================================================
// STRUCTURE SPRITES
// =============================================================================

/** Structure types that have sprite textures */
type SpriteStructureType = "tree_oak" | "tree_pine" | "bush" | "boulder";

/** Sprite paths for structure types that use sprites */
const STRUCTURE_SPRITE_PATHS: Record<SpriteStructureType, string> = {
  tree_oak: "/sprites/structures/tree_oak/tree_oak.png",
  tree_pine: "/sprites/structures/tree_pine/tree_pine.png",
  bush: "/sprites/structures/bush/bush.png",
  boulder: "/sprites/structures/boulder/boulder.png",
};

/** Cached structure textures */
const structureTextures: Map<SpriteStructureType, Texture> = new Map();

/** Check if a structure type has a sprite */
function hasStructureSprite(type: StructureType): type is SpriteStructureType {
  return type in STRUCTURE_SPRITE_PATHS;
}

/** Preload all structure textures */
async function preloadStructureTextures(): Promise<void> {
  if (structureTextures.size > 0) return; // Already loaded

  const structureTypes = Object.keys(
    STRUCTURE_SPRITE_PATHS,
  ) as SpriteStructureType[];

  for (const structureType of structureTypes) {
    try {
      const texture = await Assets.load<Texture>(
        STRUCTURE_SPRITE_PATHS[structureType],
      );
      texture.source.scaleMode = "nearest"; // Pixel-perfect scaling
      structureTextures.set(structureType, texture);
    } catch (error) {
      console.error(
        `[World] Failed to load structure texture for ${structureType}:`,
        error,
      );
    }
  }

  console.info(
    `[World] Loaded ${structureTextures.size}/${structureTypes.length} structure textures`,
  );
}

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

interface WorldProps {
  /** World to display */
  world: WorldData;
  /** Current z-level to display */
  zLevel: number;
}

const World: React.FC<WorldProps> = ({ world, zLevel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<SimpleViewport | null>(null);
  const isInitializedRef = useRef(false);

  // Overlay graphics for selection and hover
  const selectionGraphicsRef = useRef<Graphics | null>(null);
  const hoverGraphicsRef = useRef<Graphics | null>(null);

  // Feature layer graphics refs for visibility toggling (O(1) performance)
  const treesContainerRef = useRef<Container | null>(null);
  const structuresGraphicsRef = useRef<Graphics | null>(null);
  const itemsGraphicsRef = useRef<Graphics | null>(null);

  // Character, path, and heat map renderers
  const characterRendererRef = useRef<CharacterRenderer | null>(null);
  const pathRendererRef = useRef<PathRenderer | null>(null);
  const heatMapRendererRef = useRef<HeatMapRenderer | null>(null);

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

  // Subscribe to selection, hover, character, and layer state changes
  useEffect(() => {
    const unsubscribeGame = useGameStore.subscribe((state) => {
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

      // Get layer visibility for character rendering
      const layerVisibility = useLayerStore.getState().visibility;
      const shouldRenderCharacters = layerVisibility.get("characters") ?? true;

      // Get selected character ID (if any)
      const selectedCharacterId =
        state.selection.type === "entity" &&
        state.selection.entityType === "colonist"
          ? state.selection.entityId
          : null;

      // Update character renderer (respecting layer visibility)
      if (characterRendererRef.current) {
        if (shouldRenderCharacters) {
          characterRendererRef.current.update(
            state.simulation.characters,
            selectedCharacterId,
            zLevel,
          );
        } else {
          // Hide all characters by passing empty map
          characterRendererRef.current.update(new Map(), null, zLevel);
        }
      }

      // Update path renderer
      if (pathRendererRef.current) {
        const selectedCharacter =
          selectedCharacterId && shouldRenderCharacters
            ? state.simulation.characters.get(selectedCharacterId)
            : null;
        pathRendererRef.current.update(selectedCharacter ?? null);
      }
    });

    // Subscribe to layer visibility changes
    const unsubscribeLayers = useLayerStore.subscribe((state) => {
      // Update heat map renderer
      if (heatMapRendererRef.current && level) {
        heatMapRendererRef.current.update(level, state.visibility);
      }

      // Toggle feature layer visibility (O(1) - just setting .visible property)
      if (treesContainerRef.current) {
        treesContainerRef.current.visible =
          state.visibility.get("trees") ?? true;
      }
      if (structuresGraphicsRef.current) {
        structuresGraphicsRef.current.visible =
          state.visibility.get("structures") ?? true;
      }
      if (itemsGraphicsRef.current) {
        itemsGraphicsRef.current.visible =
          state.visibility.get("items") ?? true;
      }

      // Update character visibility
      const shouldRenderCharacters = state.visibility.get("characters") ?? true;
      const gameState = useGameStore.getState();
      const selectedCharacterId =
        gameState.selection.type === "entity" &&
        gameState.selection.entityType === "colonist"
          ? gameState.selection.entityId
          : null;

      if (characterRendererRef.current) {
        if (shouldRenderCharacters) {
          characterRendererRef.current.update(
            gameState.simulation.characters,
            selectedCharacterId,
            zLevel,
          );
        } else {
          characterRendererRef.current.update(new Map(), null, zLevel);
        }
      }

      // Update path renderer visibility
      if (pathRendererRef.current) {
        const selectedCharacter =
          selectedCharacterId && shouldRenderCharacters
            ? gameState.simulation.characters.get(selectedCharacterId)
            : null;
        pathRendererRef.current.update(selectedCharacter ?? null);
      }
    });

    return () => {
      unsubscribeGame();
      unsubscribeLayers();
    };
  }, [zLevel, level]);

  // World pixel size for centering
  const worldPixelWidth = (level?.width ?? 64) * CELL_SIZE;
  const worldPixelHeight = (level?.height ?? 64) * CELL_SIZE;

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
      app.canvas.style.display = "block";

      // Prevent default context menu on right-click
      app.canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      appRef.current = app;
      isInitializedRef.current = true;

      // Create viewport (wheel zooms, drag pans - like Dwarf Fortress/RimWorld)
      const viewport = new SimpleViewport({
        screenWidth: rect.width,
        screenHeight: rect.height,
        minScale: 0.1,
        maxScale: 4,
        zoomSpeed: 0.1,
      });

      app.stage.addChild(viewport);
      viewportRef.current = viewport;

      // Register viewport with store for command access
      viewportStore.setViewport(viewport);

      // Attach wheel zoom and touch pinch handlers
      viewport.attachWheelZoom(app.canvas);

      // Get initial layer visibility
      const initialLayerVisibility = useLayerStore.getState().visibility;

      // Preload textures before rendering
      await preloadTerrainTextures();
      await preloadStructureTextures();

      // Render the world (terrain and features as separate layers)
      console.info("[World] Rendering world tiles...");
      const { treesContainer, structuresGraphics, itemsGraphics } = renderWorld(
        viewport,
        level,
      );

      // Store refs for visibility toggling
      treesContainerRef.current = treesContainer;
      structuresGraphicsRef.current = structuresGraphics;
      itemsGraphicsRef.current = itemsGraphics;

      // Set initial visibility based on layer state
      treesContainer.visible = initialLayerVisibility.get("trees") ?? true;
      structuresGraphics.visible =
        initialLayerVisibility.get("structures") ?? true;
      itemsGraphics.visible = initialLayerVisibility.get("items") ?? true;

      console.info(
        "[World] World rendered, viewport children:",
        viewport.children.length,
      );

      // Create heat map overlay container (between world and hover)
      const heatMapContainer = new Container();
      viewport.addChild(heatMapContainer);
      const heatMapRenderer = new HeatMapRenderer(heatMapContainer, CELL_SIZE);
      heatMapRendererRef.current = heatMapRenderer;

      // Initial heat map render
      heatMapRenderer.update(level, initialLayerVisibility);

      // Create hover overlay (drawn first, below selection)
      const hoverGraphics = new Graphics();
      viewport.addChild(hoverGraphics);
      hoverGraphicsRef.current = hoverGraphics;

      // Create selection overlay (drawn on top of hover)
      const selectionGraphics = new Graphics();
      viewport.addChild(selectionGraphics);
      selectionGraphicsRef.current = selectionGraphics;

      // Preload character assets and create renderer
      await CharacterRenderer.preloadAssets();
      const characterContainer = new Container();
      viewport.addChild(characterContainer);
      const characterRenderer = new CharacterRenderer(
        characterContainer,
        CELL_SIZE,
      );
      characterRendererRef.current = characterRenderer;

      // Create path renderer (drawn above characters)
      const pathContainer = new Container();
      viewport.addChild(pathContainer);
      const pathRenderer = new PathRenderer(pathContainer, CELL_SIZE);
      pathRendererRef.current = pathRenderer;

      // Initial render of characters (subscription only fires on changes)
      const initialState = useGameStore.getState();
      console.info("[World] Initial render - characters in store:", {
        count: initialState.simulation.characters.size,
        zLevel,
        characters: Array.from(initialState.simulation.characters.values()).map(
          (c) => ({ name: c.name, pos: c.position }),
        ),
      });
      const selectedCharacterId =
        initialState.selection.type === "entity" &&
        initialState.selection.entityType === "colonist"
          ? initialState.selection.entityId
          : null;
      characterRenderer.update(
        initialState.simulation.characters,
        selectedCharacterId,
        zLevel,
      );

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
      viewport.panTo(worldPixelWidth / 2, worldPixelHeight / 2);

      // Handle resize when container size changes (e.g., dock panel resize)
      // Queue resize to happen on Pixi's ticker to sync with render loop (prevents flickering)
      let pendingResize = false;

      const handleResize = () => {
        if (!pendingResize) return;
        pendingResize = false;

        const currentApp = appRef.current;
        if (!currentApp || !container) return;

        const { width, height } = container.getBoundingClientRect();
        if (width > 0 && height > 0) {
          // Resize renderer in sync with render loop
          currentApp.renderer.resize(width, height);
          // Update viewport's internal screen dimensions
          if (viewportRef.current) {
            viewportRef.current.resize(width, height);
          }
        }
      };

      // Add resize handler to Pixi's ticker
      app.ticker.add(handleResize);

      const resizeObserver = new ResizeObserver(() => {
        // Just flag that resize is needed - actual resize happens on next tick
        pendingResize = true;
      });
      resizeObserver.observe(container);

      (
        app as Application & {
          _resizeObserver?: ResizeObserver;
          _resizeHandler?: () => void;
        }
      )._resizeObserver = resizeObserver;
      (
        app as Application & {
          _resizeObserver?: ResizeObserver;
          _resizeHandler?: () => void;
        }
      )._resizeHandler = handleResize;

      // Dispatch world.ready command to notify that viewport is fully initialized
      commandRegistry.dispatch("world.ready", { timestamp: Date.now() });
    };

    setup();

    return () => {
      isActive = false;
      setInteractionContainer(null);
      selectionGraphicsRef.current = null;
      hoverGraphicsRef.current = null;
      // Destroy renderers
      if (characterRendererRef.current) {
        characterRendererRef.current.destroy();
        characterRendererRef.current = null;
      }
      if (pathRendererRef.current) {
        pathRendererRef.current.destroy();
        pathRendererRef.current = null;
      }
      if (heatMapRendererRef.current) {
        heatMapRendererRef.current.destroy();
        heatMapRendererRef.current = null;
      }
      if (appRef.current) {
        const app = appRef.current as Application & {
          _resizeObserver?: ResizeObserver;
          _resizeHandler?: () => void;
        };
        app._resizeObserver?.disconnect();
        if (app._resizeHandler) {
          app.ticker.remove(app._resizeHandler);
        }
      }
      if (viewportRef.current) {
        viewportStore.setViewport(null);
        viewportRef.current.destroy();
        viewportRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [level, worldPixelWidth, worldPixelHeight, zLevel]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "grab",
        touchAction: "none", // Handle all touch gestures manually
      }}
    />
  );
};

/** Result of rendering world - separate containers/graphics for each feature layer */
interface RenderWorldResult {
  treesContainer: Container;
  structuresGraphics: Graphics;
  itemsGraphics: Graphics;
}

/** Render the world tiles to the viewport with separate feature layers */
function renderWorld(
  viewport: SimpleViewport,
  level: ZLevel,
): RenderWorldResult {
  // Terrain container for sprites
  const terrainContainer = new Container();

  // Grid overlay graphics (drawn on top of terrain)
  const gridGraphics = new Graphics();

  // Separate containers/graphics for toggleable feature layers (O(1) visibility toggle)
  const treesContainer = new Container();
  const structuresGraphics = new Graphics();
  const itemsGraphics = new Graphics();

  // Render tiles
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const tile = level.tiles[y * level.width + x];
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;

      // Draw terrain sprite
      const terrainTexture = terrainTextures.get(tile.terrain.type);
      if (terrainTexture) {
        const sprite = new Sprite(terrainTexture);
        sprite.x = px;
        sprite.y = py;
        sprite.width = CELL_SIZE;
        sprite.height = CELL_SIZE;
        terrainContainer.addChild(sprite);
      }

      // Draw structure overlay if present
      if (tile.structure && tile.structure.type !== "none") {
        const structureColor = STRUCTURE_COLORS[tile.structure.type];
        const structureType = tile.structure.type;

        // Check if this structure type has a sprite
        if (hasStructureSprite(structureType)) {
          // Use sprite for trees and bushes
          const texture = structureTextures.get(structureType);
          if (texture) {
            const sprite = new Sprite(texture);
            sprite.x = px;
            sprite.y = py;
            sprite.width = CELL_SIZE;
            sprite.height = CELL_SIZE;
            treesContainer.addChild(sprite);
          }
        } else {
          // Draw other structures as full tiles
          structuresGraphics.rect(px, py, CELL_SIZE, CELL_SIZE);
          structuresGraphics.fill(structureColor);
        }
      }

      // Draw item indicator if items present
      if (tile.items.length > 0) {
        itemsGraphics.circle(px + CELL_SIZE - 6, py + 6, 4);
        itemsGraphics.fill(0xffd700); // Gold dot for items
      }
    }
  }

  // Draw grid lines (subtle)
  gridGraphics.setStrokeStyle({ width: 0.5, color: 0x333333, alpha: 0.3 });
  for (let x = 0; x <= level.width; x++) {
    gridGraphics.moveTo(x * CELL_SIZE, 0);
    gridGraphics.lineTo(x * CELL_SIZE, level.height * CELL_SIZE);
    gridGraphics.stroke();
  }
  for (let y = 0; y <= level.height; y++) {
    gridGraphics.moveTo(0, y * CELL_SIZE);
    gridGraphics.lineTo(level.width * CELL_SIZE, y * CELL_SIZE);
    gridGraphics.stroke();
  }

  // Draw world boundary
  gridGraphics.rect(0, 0, level.width * CELL_SIZE, level.height * CELL_SIZE);
  gridGraphics.stroke({ width: 2, color: 0xffff00 });

  // Add all layers to viewport in correct z-order
  viewport.addChild(terrainContainer);
  viewport.addChild(gridGraphics);
  viewport.addChild(treesContainer);
  viewport.addChild(structuresGraphics);
  viewport.addChild(itemsGraphics);

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

  return { treesContainer, structuresGraphics, itemsGraphics };
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

export default World;
