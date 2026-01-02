import { SimpleViewport } from "@renderer/lib/viewport-simple";
import { Application, Graphics, Text } from "pixi.js";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "pixi.js/unsafe-eval";

/**
 * SimpleWorld - A grid showcase to test the SimpleViewport
 *
 * Features demonstrated:
 * - Pan: Click and drag to move around
 * - Zoom: Scroll wheel to zoom in/out (zooms toward cursor)
 *
 * The grid helps visualize that panning and zooming are working correctly.
 */

const GRID_SIZE = 20; // Number of cells in each direction
const CELL_SIZE = 64; // Pixels per cell
const WORLD_SIZE = GRID_SIZE * CELL_SIZE; // Total world size

const SimpleWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<SimpleViewport | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Track container size with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Set initial size
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setContainerSize({ width: rect.width, height: rect.height });
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Setup Pixi and viewport
  useEffect(() => {
    if (
      !containerRef.current ||
      containerSize.width === 0 ||
      containerSize.height === 0
    ) {
      return;
    }

    let isActive = true;

    const setup = async () => {
      const app = new Application();

      await app.init({
        width: containerSize.width,
        height: containerSize.height,
        backgroundColor: 0x1a1a2e,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (!isActive) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      // Add canvas to DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(app.canvas);
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";
        app.canvas.style.display = "block";
      }

      appRef.current = app;

      // Create the SimpleViewport
      const viewport = new SimpleViewport({
        screenWidth: containerSize.width,
        screenHeight: containerSize.height,
        minScale: 0.25,
        maxScale: 4,
        zoomSpeed: 0.1,
      });

      app.stage.addChild(viewport);
      viewportRef.current = viewport;

      // Attach wheel zoom to the canvas
      viewport.attachWheelZoom(app.canvas);

      // Draw the grid
      drawGrid(viewport);

      // Center the viewport on the middle of the world
      viewport.panTo(WORLD_SIZE / 2, WORLD_SIZE / 2);
    };

    setup();

    return () => {
      isActive = false;
      if (viewportRef.current) {
        viewportRef.current.destroy();
        viewportRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [containerSize]);

  // Handle resize
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

/**
 * Draw a grid with cell coordinates for debugging/testing
 */
function drawGrid(viewport: SimpleViewport): void {
  const graphics = new Graphics();

  // Draw cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      // Alternate colors for checkerboard pattern
      const isEven = (row + col) % 2 === 0;
      const color = isEven ? 0x2a2a4a : 0x3a3a5a;

      // Draw cell background
      graphics.rect(x, y, CELL_SIZE, CELL_SIZE);
      graphics.fill(color);

      // Draw cell border
      graphics.rect(x, y, CELL_SIZE, CELL_SIZE);
      graphics.stroke({ width: 1, color: 0x4a4a6a });
    }
  }

  // Draw origin marker (red cross at 0,0)
  graphics.moveTo(-20, 0);
  graphics.lineTo(20, 0);
  graphics.moveTo(0, -20);
  graphics.lineTo(0, 20);
  graphics.stroke({ width: 2, color: 0xff0000 });

  // Draw world boundary
  graphics.rect(0, 0, WORLD_SIZE, WORLD_SIZE);
  graphics.stroke({ width: 3, color: 0xffff00 });

  viewport.addChild(graphics);

  // Add coordinate labels at corners and center
  addLabel(viewport, "(0, 0)", 5, 5);
  addLabel(viewport, `(${WORLD_SIZE}, 0)`, WORLD_SIZE - 60, 5);
  addLabel(viewport, `(0, ${WORLD_SIZE})`, 5, WORLD_SIZE - 20);
  addLabel(
    viewport,
    `(${WORLD_SIZE}, ${WORLD_SIZE})`,
    WORLD_SIZE - 80,
    WORLD_SIZE - 20,
  );
  addLabel(
    viewport,
    "CENTER",
    WORLD_SIZE / 2 - 30,
    WORLD_SIZE / 2 - 8,
    0x00ff00,
  );

  // Add instructions
  addLabel(
    viewport,
    "Drag to pan | Scroll to zoom",
    WORLD_SIZE / 2 - 100,
    30,
    0xaaaaaa,
  );
}

function addLabel(
  viewport: SimpleViewport,
  text: string,
  x: number,
  y: number,
  color = 0xffffff,
): void {
  const label = new Text({
    text,
    style: {
      fontSize: 14,
      fill: color,
      fontFamily: "monospace",
    },
  });
  label.x = x;
  label.y = y;
  viewport.addChild(label);
}

export default SimpleWorld;
