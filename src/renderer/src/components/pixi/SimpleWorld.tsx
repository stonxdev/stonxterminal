import { Viewport } from "@renderer/lib/viewport/Viewport";
import { Application, Container, Graphics, Text } from "pixi.js";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "pixi.js/unsafe-eval";

interface TileData {
  x: number;
  y: number;
  color: number;
  type: "grass" | "dirt" | "stone" | "water" | "sand";
}

const SimpleWorld: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Handle container resizing
  useEffect(() => {
    if (!pixiContainer.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(pixiContainer.current);

    // Set initial size from actual container
    const rect = pixiContainer.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Setup PIXI and viewport
  useEffect(() => {
    if (
      !pixiContainer.current ||
      containerSize.width === 0 ||
      containerSize.height === 0
    )
      return;

    let isEffectActive = true;

    const setupPixi = async () => {
      const app = new Application();

      await app.init({
        width: containerSize.width,
        height: containerSize.height,
        backgroundColor: 0x1a1a2e,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (!isEffectActive) {
        app.destroy(true, {
          children: true,
          texture: true,
        });
        return;
      }

      // Clear container and add canvas
      if (pixiContainer.current) {
        pixiContainer.current.innerHTML = "";
        pixiContainer.current.appendChild(app.canvas);
      }

      // Ensure canvas fills container
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.canvas.style.display = "block";

      appRef.current = app;

      // Define tile properties - larger tiles and grid for better interaction
      const TILE_SIZE = 64;
      const GRID_SIZE = 10; // Larger grid for more world space
      const WORLD_WIDTH = TILE_SIZE * GRID_SIZE;
      const WORLD_HEIGHT = TILE_SIZE * GRID_SIZE;

      // Create viewport
      const viewport = new Viewport({
        screenWidth: containerSize.width,
        screenHeight: containerSize.height,
        worldWidth: WORLD_WIDTH,
        worldHeight: WORLD_HEIGHT,
        events: app.renderer.events,
        passiveWheel: false, // Allow preventDefault on wheel events
      });

      app.stage.addChild(viewport);
      viewportRef.current = viewport;

      // Configure viewport controls - only drag and wheel
      viewport
        .drag({
          mouseButtons: "left",
        })
        .wheel({
          percent: 0.1,
        });

      // Add simple zoom constraints
      const MIN_SCALE = 0.25;
      const MAX_SCALE = 3;

      viewport.on("zoomed", () => {
        if (viewport.scale.x < MIN_SCALE) {
          viewport.scale.set(MIN_SCALE);
        } else if (viewport.scale.x > MAX_SCALE) {
          viewport.scale.set(MAX_SCALE);
        }
      });

      // Create more varied tile data for 10x10 grid
      const tiles: TileData[] = [];
      const tileTypes: Array<{ type: TileData["type"]; color: number }> = [
        { type: "grass", color: 0x3a7d44 },
        { type: "dirt", color: 0x8b6f47 },
        { type: "stone", color: 0x696969 },
        { type: "water", color: 0x2980b9 },
        { type: "sand", color: 0xf4d03f },
      ];

      // Generate tiles with some pattern
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          // Create some interesting patterns
          let tileType: { type: TileData["type"]; color: number };
          if (x === 4 || x === 5) {
            // River in the middle
            tileType = tileTypes[3]; // water
          } else if ((x === 3 || x === 6) && Math.random() > 0.3) {
            // Sand near water
            tileType = tileTypes[4]; // sand
          } else if (Math.random() > 0.7) {
            // Random stones
            tileType = tileTypes[2]; // stone
          } else if (Math.random() > 0.4) {
            // Mix of grass and dirt
            tileType = tileTypes[0]; // grass
          } else {
            tileType = tileTypes[1]; // dirt
          }

          tiles.push({
            x,
            y,
            color: tileType.color,
            type: tileType.type,
          });
        }
      }

      // Create world container
      const worldContainer = new Container();
      viewport.addChild(worldContainer);

      // Draw tiles
      tiles.forEach((tile) => {
        const tileGraphics = new Graphics();

        // Draw tile background
        tileGraphics.rect(
          tile.x * TILE_SIZE,
          tile.y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
        );
        tileGraphics.fill(tile.color);

        // Draw tile border
        tileGraphics.rect(
          tile.x * TILE_SIZE,
          tile.y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
        );
        tileGraphics.stroke({ width: 0.5, color: 0x000000, alpha: 0.3 });

        // Add texture details based on tile type
        if (tile.type === "grass") {
          // Add grass blades
          for (let i = 0; i < 4; i++) {
            const grassX =
              tile.x * TILE_SIZE + 8 + Math.random() * (TILE_SIZE - 16);
            const grassY =
              tile.y * TILE_SIZE + 8 + Math.random() * (TILE_SIZE - 16);
            tileGraphics.circle(grassX, grassY, 1.5);
            tileGraphics.fill(0x2d6b33);
          }
        } else if (tile.type === "stone") {
          // Add stone cracks
          for (let i = 0; i < 2; i++) {
            const stoneX =
              tile.x * TILE_SIZE + 10 + Math.random() * (TILE_SIZE - 20);
            const stoneY =
              tile.y * TILE_SIZE + 10 + Math.random() * (TILE_SIZE - 20);
            tileGraphics.rect(stoneX, stoneY, 6, 6);
            tileGraphics.fill(0x525252);
          }
        } else if (tile.type === "water") {
          // Add water ripples
          const centerX = tile.x * TILE_SIZE + TILE_SIZE / 2;
          const centerY = tile.y * TILE_SIZE + TILE_SIZE / 2;
          tileGraphics.circle(centerX, centerY, 8);
          tileGraphics.stroke({ width: 0.5, color: 0x1f618d, alpha: 0.5 });
        } else if (tile.type === "sand") {
          // Add sand dots
          for (let i = 0; i < 6; i++) {
            const sandX = tile.x * TILE_SIZE + Math.random() * TILE_SIZE;
            const sandY = tile.y * TILE_SIZE + Math.random() * TILE_SIZE;
            tileGraphics.circle(sandX, sandY, 0.5);
            tileGraphics.fill(0xe8c547);
          }
        }

        worldContainer.addChild(tileGraphics);
      });

      // Draw coordinate labels at corners for debugging
      const addDebugText = (text: string, x: number, y: number) => {
        const label = new Text({
          text,
          style: {
            fontSize: 10,
            fill: 0xffffff,
          },
        });
        label.x = x;
        label.y = y;
        worldContainer.addChild(label);
      };

      addDebugText("(0,0)", 2, 2);
      addDebugText(`(${GRID_SIZE - 1},0)`, WORLD_WIDTH - 30, 2);
      addDebugText(`(0,${GRID_SIZE - 1})`, 2, WORLD_HEIGHT - 12);
      addDebugText(
        `(${GRID_SIZE - 1},${GRID_SIZE - 1})`,
        WORLD_WIDTH - 30,
        WORLD_HEIGHT - 12,
      );

      // Center and fit the viewport
      viewport.fit();
      viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    };

    setupPixi();

    return () => {
      isEffectActive = false;
      if (viewportRef.current) {
        viewportRef.current.destroy();
        viewportRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,
          texture: true,
        });
        appRef.current = null;
      }
    };
  }, [containerSize]);

  // Handle resize of existing viewport
  useEffect(() => {
    if (
      viewportRef.current &&
      containerSize.width > 0 &&
      containerSize.height > 0
    ) {
      viewportRef.current.resize(containerSize.width, containerSize.height);
    }
  }, [containerSize]);

  return (
    <div
      ref={pixiContainer}
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

export default SimpleWorld;
